import React from "react";
import { CheckCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "teachtech/components/ui/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "teachtech/components/ui/card";
import { Progress } from "teachtech/components/ui/progress";
import { EvaluationResponse } from "teachtech/lib/types/evaluationTypes";
import { sumBy } from "lodash";
import { Button } from "../ui/button";

const EvaluationResults: React.FC<{
  value?: EvaluationResponse;
}> = ({ value }) => {
  if (!value) return null;

  const totalPossibleScore = sumBy(
    value.criteria_scores,
    (c: {
      criterion: string;
      score: number;
      max_score: number;
      justification: string;
    }) => c.max_score
  );
  const scorePercentage = (value.total_score / totalPossibleScore) * 100;
  return (
    <div className="space-y-6 mt-8">
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Evaluation Complete</AlertTitle>
        <AlertDescription className="text-green-700">
          Total Score: {value.total_score} out of {totalPossibleScore} (
          {scorePercentage.toFixed(1)}%)
        </AlertDescription>
      </Alert>

      <Progress value={scorePercentage} className="h-2 w-full" />

      <div className="grid gap-4 md:grid-cols-2">
        {value.criteria_scores.map((criteria, index) => (
          <Card
            key={index}
            className="border-l-4"
            style={{
              borderLeftColor: getCriteriaColor(
                criteria.score / criteria.max_score
              ),
            }}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{criteria.criterion}</span>
                <span className="text-lg">
                  {criteria.score}/{criteria.max_score}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{criteria.justification}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        className="p-6"
        onClick={() => {
          window.location.reload();
        }}
      >
        {" "}
        Back{" "}
      </Button>
    </div>
  );
};

// Helper function to get color based on score percentage
function getCriteriaColor(percentage: number): string {
  if (percentage >= 0.8) return "#22c55e"; // green
  if (percentage >= 0.6) return "#eab308"; // yellow
  if (percentage >= 0.4) return "#f97316"; // orange
  return "#ef4444"; // red
}

export default EvaluationResults;
