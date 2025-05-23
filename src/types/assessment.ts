
export interface AssessmentResult {
  score: number;
  cefrLevel: string;
  feedback: string;
  detailedAnalysis: {
    vocabulary: {
      score: number;
      feedback: string;
    };
    grammar: {
      score: number;
      feedback: string;
    };
    coherence: {
      score: number;
      feedback: string;
    };
    complexity: {
      score: number;
      feedback: string;
    };
  };
}

export interface WritingSubmissionResult {
  id: string;
  userId: string;
  dayId: string;
  assignmentId: string;
  content: string;
  htmlContent: string;
  submittedAt: string;
  score: number;
  cefrLevel: string;
  feedback: string;
  wordCount: number;
  timeSpent: number;
}
