export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface GrammarError {
  description: string;
  level: CefrLevel;
  severity: number;
}

export interface StructureScores {
  a1: number;
  a2: number;
  b1: number;
  b2: number;
  c1: number;
  c2: number;
}

export interface AssessmentResult {
  score: number;
  cefrLevel: CefrLevel;
  details: {
    vocabulary: number;
    complexity: number;
    coherence: number;
    grammar: number;
    taskAchievement: number;
    errors: GrammarError[];
    structureScores: StructureScores;
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
  cefrLevel: CefrLevel;
  details: AssessmentResult['details'];
  wordCount: number;
  timeSpent: number;
}
