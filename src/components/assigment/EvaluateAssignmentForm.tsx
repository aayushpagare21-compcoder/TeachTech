"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "teachtech/components/ui/card";
import { Button } from "teachtech/components/ui/button";
import { FileUploadField } from "./FileUploadField";
import { Alert, AlertDescription } from "teachtech/components/ui/alert";
import { FileText, Loader2 } from "lucide-react";
import { useAsyncFn } from "react-use";
import AssessmentResults from "./EvaluateAssignmentResult";
import { ErrorState, LoadingState } from "../evaluation/LoadingAndErrorState";

async function evaluateAssignment(
  questionFile: File,
  answerFile: File,
  criteriaFile: File,
) {
  const formData = new FormData();
  formData.append("questionFile", questionFile);
  formData.append("answerFile", answerFile);
  formData.append("criteriaFile", criteriaFile);

  const data = await fetch("/api/evaluate-assignment", {
    method: "POST",
    body: formData,
  });

  if (!data.ok) {
    throw new Error("Failed to evaluate assignment");
  }

  const res = await data.json();
  return res;
}

const FileUploadForm = () => {
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [criteriaFile, setCriteriaFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const [{ loading, error: requestError, value: results }, makeRequest] =
    useAsyncFn(
      async (questionFile: File, answerFile: File, criteriaFile: File) => {
        try {
          const result = await evaluateAssignment(
            questionFile,
            answerFile,
            criteriaFile,
          );
          return result;
        } catch (err: unknown) {
          console.log("error", err);
          throw new Error("Failed to evaluate assignment. Please try again.");
        }
      },
    );

  const handleFileChange =
    (setter: React.Dispatch<React.SetStateAction<File | null>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type === "application/pdf") {
        setter(file);
        setError("");
      } else {
        setError("Please upload only PDF files");
        e.target.value = "";
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionFile || !answerFile || !criteriaFile) {
      setError("Please upload all required files before submitting");
      return;
    }
    makeRequest(questionFile, answerFile, criteriaFile);
  };

  // Show results if available
  if (results) {
    return <AssessmentResults data={results} />;
  }

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-6 shadow-lg p-6">
        <LoadingState />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6 shadow-lg md:p-6">
      <CardHeader>
        <h1 className="text-[3rem] text-center">TeachTech</h1>
        <CardTitle className="flex items-center justify-center gap-2 leading-1">
          <FileText className="h-6 w-6" />
          TeachTech Assignment Evaluation
        </CardTitle>
        <CardDescription className="flex flex-col">
          <div className="text-center">
            {" "}
            Please upload question file, answer file, and evaluation criteria
            file in the format specified below.
          </div>
          {requestError && <ErrorState error={requestError} />}
          <hr className="mt-4 mb-2" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <FileUploadField
            id="questionFile"
            label="Question file's evaluation format."
            description="Instructions of writing the questions file"
            exampleFormat={
              <div className="flex flex-col gap-2">
                <ul className="px-4 list-inside text-sm flex flex-col gap-2 list-disc">
                  <li>The PDF file must only contain the questions.</li>
                  <li>{`The questions must start with the marker "Question" and then followed by identifier "1(a), 1(b), 1 and then followed by a colon ":".`}</li>
                  <li>{`After writing each question, add a "Total Marks" marker followed by a colon and then the total marks (Total Marks:10)`}</li>
                </ul>
                <div className="font-bold">Example:</div>
                <pre className="px-4">
                  {`Question 1(a): A quale regno si interessò soprattutto Federico II nel corso della sua vita? Quale zona comprendeva? Da chi Federico lo ereditò? Come lo amministrò?
Total Marks: 10
Question 1(b): Per quale motivo alcuni pontefici ostacolano Federico II? Quali sono i nomi? Quale strumento usano contro l'Imperatore?
Total Marks: 10
Question 1(c): Quando e come si concluderà la dinastia di Federico (Hohenstaufen) in Sicilia? Cosa avvenne a Benevento
Total Marks: 10
`}
                </pre>
              </div>
            }
            selectedFile={questionFile}
            onFileChange={handleFileChange(setQuestionFile)}
            disabled={loading}
          />
          <FileUploadField
            id="criteriaFile"
            label="Criteria file's evaluation format."
            description="Instructions of writing the evaluation criteria file"
            exampleFormat={
              <div className="flex flex-col gap-2">
                <ul className="px-4 list-inside text-sm flex flex-col gap-2 list-disc">
                  <li>
                    The PDF file must only contain the evaluation criteria.
                  </li>
                  <li>{`The questions must start with the marker "Evaluation Criteria" and then followed by identifier and then followed by a colon.`}</li>
                  <li className="font-bold">
                    Please use the same marker you have used in the question
                  </li>
                  <li>{`In the next line specify the "Criteria: Criteria Description" and then in the next line specify the marks for that particular criteria.`}</li>
                </ul>
                <div className="font-bold">Example:</div>
                <pre className="px-4">
                  {`Evaluation Criteria 1(a):
Criteria: Regno di Sicilia 
marks: 1
Criteria: Sud Italia 
marks: 1
Criteria: Costanza d'Altavilla 
marks: 2
Criteria: Costituzioni melfitane 
marks: 1.5
Criteria: distruzione dei castelli – revoca privilege 
marks: 1.5 
Criteria: funzionari 
marks: 1.5 
Criteria: apertura culturale e tolleranza religiosa 
marks: 1.5

Evaluation Criteria 1(b):
Criteria: questione geopolitica/accerchiamento Stato della Chiesa 
marks: 3
Criteria: Innocenzo III, Onorio III
marks: 1
Criteria: Gregorio IX
marks: 1.5
Criteria: Innocenzo IV
marks: 1.5
Criteria: strumento della scomunica
marks: 3
`}
                </pre>
              </div>
            }
            selectedFile={criteriaFile}
            onFileChange={handleFileChange(setCriteriaFile)}
            disabled={loading}
          />
          <FileUploadField
            id="answerFile"
            label="Instructions"
            description="Example of how to provide answers in the pdf file."
            exampleFormat={
              <div className="flex flex-col gap-2">
                <ul className="px-4 list-inside text-sm flex flex-col gap-2 list-disc">
                  <li>The PDF file must only contain the answers.</li>
                  <li>{`The answer must start with the marker "Answer" and then followed by identifier "1(a), 1(b), 1 and then followed by a colon ":".`}</li>
                  <li className="font-bold">
                    Please use the same marker you have used in the question
                  </li>
                </ul>
                <div className="font-bold">Example:</div>
                <pre className="px-4">
                  {`Answer 1(a): Federico ereditò il Regno di Sicilia da sua madre Costanza d'Altavilla. Regnò principalmente sul sud Italia. Nel suo governo si occupò di rimuovere privilegi ai nobili, distruggendo i castelli e inviando funzionari nei territori governati. 
Answer 1(b): La Chiesa andò contro Federico II perché si sentiva accerchiata a nord dal Sacro Romani Impero a sud dal Regno di Sicilia. I papi utilizzarono contro Federico lo strumento della scomunica per ben 2 volte.
Answer 1(c): Nel 1268 quando Corradino, nipote di Federico, venne sconfitto e decapitato in Abruzzo.
`}
                </pre>
              </div>
            }
            selectedFile={answerFile}
            onFileChange={handleFileChange(setAnswerFile)}
            disabled={loading}
          />

          {/* Show validation error */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Show request error */}
          {requestError && (
            <Alert variant="destructive">
              <AlertDescription>{requestError.message}</AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            <Button
              type="submit"
              className="w-[200px] text-center py-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Files"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FileUploadForm;
