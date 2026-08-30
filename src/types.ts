export interface CandidateInfo {
  participantId?: string;
  participantName?: string;
  testCenterName?: string;
  testDate?: string;
  testTime?: string;
  subject?: string;
  [key: string]: string | undefined;
}

export interface QuestionOption {
  index: number;
  char: string; // 'A' | 'B' | 'C' | 'D' | 'E'
  text: string;
  isCorrect: boolean;
  html?: string;
  optionId?: string;
}

export interface QuestionItem {
  qNumber: number;
  qId: string;
  sectionIndex: number;
  sectionName: string;
  questionText: string;
  questionHtml?: string;
  options: QuestionOption[];
  chosenOption: string | null; // e.g. 'A', 'B', 'C', 'D' or null
  rightOption: string | null;  // e.g. 'A', 'B', 'C', 'D'
  isAttempted: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  status: string; // e.g. 'Answered', 'Marked For Review', 'Not Answered'
  marksObtained: number;
}

export interface SectionAnalysis {
  sectionIndex: number;
  name: string;
  questionsCount: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  marksObtained: number;
  maxMarks: number;
  accuracy: number; // percentage 0-100
  attemptRate: number; // percentage 0-100
  questions: QuestionItem[];
}

export interface MarkingScheme {
  id: string;
  name: string;
  positiveMarks: number;
  negativeMarks: number; // e.g. 0 or 0.25 or 0.33
  description: string;
}

export interface AssessmentResult {
  candidateInfo: CandidateInfo;
  sourceUrl?: string;
  examTitle: string;
  totalQuestions: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnattempted: number;
  totalMarksObtained: number;
  totalMaxMarks: number;
  percentage: number;
  overallAccuracy: number;
  paper1Score?: {
    marks: number;
    maxMarks: number;
    correct: number;
    wrong: number;
    unattempted: number;
  };
  paper2Score?: {
    marks: number;
    maxMarks: number;
    correct: number;
    wrong: number;
    unattempted: number;
  };
  sections: SectionAnalysis[];
  questions: QuestionItem[];
}

export type FilterStatus = 'ALL' | 'CORRECT' | 'INCORRECT' | 'UNATTEMPTED' | 'REVIEW';
