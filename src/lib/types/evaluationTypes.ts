export enum Subjects {
  HISTORY = "HISTORY",
  ESSAY = "ESSAY",
  PHILOSOPHY = "PHILOSOPHY",
}
export enum Languages {
  ENGLISH = "ENGLISH",
  ITALIAN = "ITALIAN",
}

export interface Criteria {
  name: string;
  description: string;
  weight: string;
  id: number;
}

export interface ImageData {
  url: string;
  name: string;
}

export const MAX_EVALUATION_CRITERIA_ALLOWED = 5;

export const subjectOptions = [
  { label: "History", value: Subjects.HISTORY },
  { label: "Philosophy", value: Subjects.PHILOSOPHY },
  { label: "Essay", value: Subjects.ESSAY },
];

export const languageOptions = [
  { label: "Italian", value: Languages.ITALIAN },
  { label: "English", value: Languages.ENGLISH },
];

export interface EvaluationCriteria {
  name: string;
  description: string;
  weightage: number;
}

export interface FormValues {
  question: string;
  evaluationCriteria: EvaluationCriteria[];
  totalScore: number;
  subject: Subjects | "";
  language: Languages | "";
  images: File[];
}
