import { NextRequest, NextResponse } from "next/server";
import { S3Service } from "teachtech/services/s3.service";
import { TextractService } from "teachtech/services/textract.service";
import { evaluateAnswerV2 } from "teachtech/services/evaluateAnswerV2";
import { AssesmentData } from "teachtech/lib/types/evaluateAssignment.types";

const s3Service = S3Service.getInstance(process.env.AWS_S3_BUCKET_NAME!);
const textExtract = TextractService.getInstance(
  process.env.AWS_S3_BUCKET_NAME!,
);

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  try {
    const questionfile = formData.get("questionFile") as File;
    const answerfile = formData.get("answerFile") as File;
    const criteriafile = formData.get("criteriaFile") as File;

    const questionFileKey = `questions/${Date.now()}-${questionfile.name}`;
    const answerFileKey = `answers/${Date.now()}-${answerfile.name}`;
    const criteriaFileKey = `criteria/${Date.now()}-${criteriafile.name}`;

    await Promise.all([
      s3Service.uploadFile(
        questionFileKey,
        Buffer.from(await questionfile.arrayBuffer()),
        questionfile.type,
      ),
      s3Service.uploadFile(
        answerFileKey,
        Buffer.from(await answerfile.arrayBuffer()),
        answerfile.type,
      ),
      s3Service.uploadFile(
        criteriaFileKey,
        Buffer.from(await criteriafile.arrayBuffer()),
        criteriafile.type,
      ),
    ]);

    const [questionData, answerData, criteriaData] = await Promise.all([
      textExtract.extractTextFromS3PDF(questionFileKey),
      textExtract.extractTextFromS3PDF(answerFileKey),
      textExtract.extractTextFromS3PDF(criteriaFileKey),
    ]);

    console.log("questionData,", questionData);
    console.log("answerData,", answerData);
    console.log("criteriaData,", criteriaData);

    const questions = parseQuestionsWithMarks(questionData);
    const answers = parseAnswers(answerData);
    const evaluationCriteria = parseCriteria(criteriaData);

    // Match answers to questions based on questionNumber and answerNumber
    const responses: AssesmentData[] = await Promise.all(
      questions.map((question) => {
        // Find the matching answer using the identifier key
        const matchingAnswer = answers.find(
          (answer) => answer.identifier === question.identifier,
        );

        // Find the matching criteria using the identifier key
        const matchingCriteria = evaluationCriteria.find(
          (criteria) => criteria.identifier === question.identifier,
        );

        // Get the answer text, defaulting to an empty string if not found
        const answerText = matchingAnswer?.answerText || "";
        // Get the criteria, defaulting to an empty array if not found
        const criteria = matchingCriteria?.criteria || [];

        // Call the evaluation function with the found data
        return evaluateAnswerV2({
          answer: answerText,
          question: question.question,
          evaluationJSON: criteria,
          totalScore: question.totalMarks,
        });
      }),
    );

    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error evaluating the answer", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
function parseQuestionsWithMarks(input: string) {
  const questionRegex =
    /Question\s*(\d+\([a-zA-Z]\))\s*:\s*(.*?)\s*(?=Question\s*\d+\([a-zA-Z]\)|$)/gis;
  const marksRegex =
    /(?:Total Marks|Marks|Punteggio Totale|Punti Totali|Valutazione)\s*[:\.\-\s]*\s*(\d+)/i;

  const questions: {
    identifier: string;
    question: string;
    totalMarks: number;
  }[] = [];

  let match: RegExpExecArray | null;

  while ((match = questionRegex.exec(input)) !== null) {
    const identifier = match[1].trim(); // Capture the question identifier (like 1(a), 1(b), etc.)
    const questionText = match[2].trim(); // Capture the question text
    const marksMatch = marksRegex.exec(questionText);

    const totalMarks = marksMatch ? parseInt(marksMatch[1], 10) : 0; // Get marks for the question

    questions.push({
      identifier,
      question: questionText
        .replace(marksMatch ? marksMatch[0] : "", "")
        .trim(), // Remove marks info from question text
      totalMarks,
    });
  }

  return questions;
}
type ParsedAnswer = {
  identifier: string;
  answerText: string;
};
const parseAnswers = (input: string): ParsedAnswer[] => {
  const lines = input.trim().split("\n");
  const questions: ParsedAnswer[] = [];

  let currentIdentifier = "";
  let currentText = "";

  lines.forEach((line) => {
    // Check if the line starts with "Answer" and is a new question
    const match = line.match(/^Answer (\S+):/);
    if (match) {
      // If there's a previous question, push it to the array
      if (currentIdentifier) {
        questions.push({
          identifier: currentIdentifier,
          answerText: currentText.trim(),
        });
      }

      // Update the current identifier and reset the text
      currentIdentifier = match[1];
      currentText = line.slice(match[0].length).trim();
    } else {
      // If the line doesn't match the pattern, it's a continuation of the previous answer
      currentText += ` ${line.trim()}`;
    }
  });

  // Push the last question to the array
  if (currentIdentifier) {
    questions.push({
      identifier: currentIdentifier,
      answerText: currentText.trim(),
    });
  }
  return questions;
};

function parseCriteria(data: string) {
  const questions: {
    identifier: string;
    criteria: { criteria: string; marks: number }[];
  }[] = [];

  // Updated pattern to allow for optional space between number and parenthesis
  const questionPattern = /Evaluation Criteria (\d+\s*\([a-zA-Z]\)):/g;
  // Match criteria and marks, handling multiline and different spacing
  const criteriaPattern = /Criteria:\s*(.+?)[\r\n]+marks:\s*([\d.]+)/g;

  let questionMatch;
  let lastIndex = 0;

  // Find all evaluation criteria sections
  while ((questionMatch = questionPattern.exec(data)) !== null) {
    const questionIdentifier = questionMatch[1].replace(/\s+/g, ""); // Remove spaces from identifier
    const startPos = questionMatch.index + questionMatch[0].length;

    // Find the next evaluation criteria section or end of string
    const nextMatch = data.indexOf("Evaluation Criteria", startPos);
    const endPos = nextMatch === -1 ? data.length : nextMatch;

    // Extract the section for this question's criteria
    const sectionText = data.slice(startPos, endPos);
    const criteriaList: { criteria: string; marks: number }[] = [];

    // Reset lastIndex for criteriaPattern
    criteriaPattern.lastIndex = 0;

    // Find all criteria within this section
    let criteriaMatch;
    while ((criteriaMatch = criteriaPattern.exec(sectionText)) !== null) {
      const criteriaText = criteriaMatch[1].trim();
      const marks = parseFloat(criteriaMatch[2]);

      criteriaList.push({
        criteria: criteriaText,
        marks: marks,
      });
    }

    // Only add the question if we found criteria for it
    if (criteriaList.length > 0) {
      questions.push({
        identifier: questionIdentifier,
        criteria: criteriaList,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lastIndex = endPos;
  }

  // Log the final parsed result
  console.log("Final parsed questions with criteria:");
  console.log(JSON.stringify(questions, null, 2));

  return questions;
}
