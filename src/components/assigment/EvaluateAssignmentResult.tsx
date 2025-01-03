import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "teachtech/components/ui/card";
import { Progress } from "teachtech/components/ui/progress";
import { AssesmentData } from "teachtech/lib/types/evaluateAssignment.types";
import { Button } from "../ui/button";

const AssessmentResults = ({ data }: { data: AssesmentData[] }) => {
  const totalAssignmentScore = data.reduce((acc, q) => acc + q.total_score, 0);
  const totalMaxScore = data.reduce((acc, q) => acc + q.max_score, 0);
  return (
    <div className="space-y-6 p-4 mt-2 max-w-4xl mx-auto">
      {/* Overall Score Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
        <CardHeader>
          <CardTitle>{`Punteggio Totale dell'Assegnazione`}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">
              {totalAssignmentScore.toFixed(1)} / {totalMaxScore.toFixed(1)}
            </div>
            <Progress
              value={(totalAssignmentScore / totalMaxScore) * 100}
              className="w-64"
            />
          </div>
        </CardContent>
      </Card>

      {/* Individual Questions */}
      {data.map((question, qIndex) => (
        <Card key={qIndex} className="border-t-4 border-blue-500">
          <CardHeader>
            <CardTitle className="text-lg">Domanda {qIndex + 1}</CardTitle>
            <p className="mt-2 text-gray-700">{question.question}</p>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-4">
              <div className="text-xl font-semibold">
                Punteggio: {question.total_score.toFixed(1)} /
                {question.max_score}
              </div>
              <Progress
                value={(question.total_score / question.max_score) * 100}
                className="w-48"
              />
            </div>

            <div className="space-y-4">
              {question.criteria_scores.map((criterion, cIndex) => (
                <div key={cIndex} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{criterion.criterion}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {criterion.score.toFixed(1)} /{" "}
                        {criterion.max_score.toFixed(1)}
                      </span>
                      <Progress
                        value={(criterion.score / criterion.max_score) * 100}
                        className="w-24"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {criterion.justification}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-green-500 italic text-center md:text-left">
          {" "}
          Please export your results to PDF using the chrome utility or copy
          them before clicking the back button.
        </div>
        <Button
          className="w-[200px] py-5"
          onClick={() => window.location.reload()}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default AssessmentResults;
