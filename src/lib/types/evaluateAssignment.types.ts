export type ParsedQuestion = {
  identifier: string;
  question: string;
  totalMarks: number;
}[];

export type CriterionScore = {
  criterion: string;
  score: number;
  max_score: number;
  justification: string;
};

export type AssesmentData = {
  criteria_scores: CriterionScore[];
  total_score: number;
  max_score: number;
  question: string;
};
