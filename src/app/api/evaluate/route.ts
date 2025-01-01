import { NextRequest, NextResponse } from "next/server";
import {
  EvaluationCriteria,
  Languages,
  Subjects,
} from "teachtech/lib/types/evaluationTypes";
import { evaluateAnswer } from "teachtech/services/evaluateAnswer";
import { S3Service } from "teachtech/services/s3.service";
import { TextractService } from "teachtech/services/textract.service";

const s3Service = S3Service.getInstance(process.env.AWS_S3_BUCKET_NAME!);
const textExtract = TextractService.getInstance(
  process.env.AWS_S3_BUCKET_NAME!
);

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  try {
    // Step 1: We need to upload the file to the S3 bucket.
    const uploadPromises = Array.from(formData.entries())
      .filter(([key, value]) => key.endsWith("-image") && value instanceof File)
      .map(async ([, value]) => {
        const file = value as File;
        const fileBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(fileBuffer);
        const s3Key = `solutions/${Date.now()}-${file.name}`;
        await s3Service.uploadFile(s3Key, buffer, file.type);
        return s3Key;
      });
    const uploadedFiles = await Promise.all(uploadPromises);

    console.log("files uploaded successfully")

    //Step 2: Send the uploaded files to textract ocr service.
    const extractedTexts = await Promise.all(
      uploadedFiles.map(async (s3Key) => {
        const extractedText = await textExtract.extractTextFromS3PDF(s3Key);
        return extractedText;
      })
    );
    //Step 3: Prepare the final answer.
    const answer = extractedTexts.join(",");
    console.log("Text extracted successfully")

    //Step 4: Evaluate the answer
    const question = formData.get("question") as string;
    const language = formData.get("language") as Languages;
    const subject = formData.get("subject") as Subjects;
    const evaluationJSON = JSON.parse(
      formData.get("evaluationCriteria") as string
    ) as EvaluationCriteria;
    const totalScore = parseFloat(formData.get("totalScore") as string);

    const finalResponse = await evaluateAnswer({
      answer,
      question,
      language,
      subject,
      evaluationJSON,
      totalScore,
    });
    console.log("Answer evaluated successfully")

    return NextResponse.json({ result: finalResponse });
  } catch (error) {
    console.error("Error evaluating the answer", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
