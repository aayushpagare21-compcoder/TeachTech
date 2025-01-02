import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import {
  EvaluationCriteria,
  EvaluationResponse,
  Languages,
  Subjects,
} from "teachtech/lib/types/evaluationTypes";

// GeminiAI model
const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  maxOutputTokens: 2048,
  apiKey: process.env.GEMINI_API_KEY,
  topP: 1,
});

//Propmpt template
const promptTemplate = `You are a {language} {subject} teacher who understands Italian and English well tasked with evaluating a student's answer.
Your evaluation should be based on the provided question, answer, and the evaluation criteria below. 
The total score is {totalScore} points. The evaluation criteria and question can be in Italian and English.

Evaluation Details:
question: {question}
answer: {answer} 
evaluation criteria: {evaluation_criteria}

Instructions:
- If the answer is not relavent to the question, simply do not evalute further assign zero marks to them.
- Assign a score for each criterion out of its weighted percentage of the total score.
- Justify the score by providing a brief explanation of how the answer meets or fails to meet the criterion.
- Final Score Calculation:
- Sum the scores from all criteria to calculate the final score out of {totalScore}.

Please generate your response in {language}.
{formatInstructions}
`;

// Define the output schema using Zod
const evaluationSchema = z.object({
  criteria_scores: z
    .array(
      z.object({
        criterion: z.string().describe("Name of the evaluation criterion"),
        score: z.number().describe("Actual score awarded for this criterion"),
        max_score: z
          .number()
          .describe("Maximum possible score for this criterion"),
        justification: z
          .string()
          .describe("Detailed explanation of why this score was awarded"),
      }),
    )
    .describe("Array of evaluation scores for each criterion"),
  total_score: z.number().describe("Final score out of the total score"),
});

export async function evaluateAnswer({
  answer,
  language,
  question,
  subject,
  evaluationJSON,
  totalScore,
}: {
  answer: string;
  evaluationJSON: EvaluationCriteria;
  question: string;
  subject: Subjects;
  language: Languages;
  totalScore: number;
}): Promise<EvaluationResponse> {
  const prompt = PromptTemplate.fromTemplate(promptTemplate);
  const outputParser = StructuredOutputParser.fromZodSchema(evaluationSchema);

  // Create a detailed prompt template with format instructions
  const formatInstructions = outputParser.getFormatInstructions();

  const chain = prompt.pipe(model).pipe(outputParser);

  try {
    // Execute the chain
    const result = await chain.invoke({
      answer,
      language,
      evaluation_criteria: evaluationJSON,
      question,
      subject,
      totalScore,
      formatInstructions,
    });
    return result;
  } catch (error) {
    console.error("Error during evaluation:", error);
    throw error;
  }
}
