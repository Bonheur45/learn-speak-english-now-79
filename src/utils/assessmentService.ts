
import { AssessmentResult } from "@/types/assessment";

export const assessText = (text: string): AssessmentResult => {
  // Mock assessment logic - in real implementation, this would call an AI service
  const words = text.trim().split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
  
  // Calculate scores based on text complexity
  const vocabularyScore = Math.min(100, Math.max(40, 60 + (words > 100 ? 20 : 0) + (text.includes('sophisticated') ? 10 : 0)));
  const grammarScore = Math.min(100, Math.max(50, 70 + (avgWordsPerSentence > 12 ? 15 : 0)));
  const coherenceScore = Math.min(100, Math.max(45, 65 + (sentences > 5 ? 20 : 0)));
  const complexityScore = Math.min(100, Math.max(40, 55 + (words > 150 ? 25 : 0)));
  
  const overallScore = Math.round((vocabularyScore + grammarScore + coherenceScore + complexityScore) / 4);
  
  // Determine CEFR level based on score
  let cefrLevel = 'A1';
  if (overallScore >= 90) cefrLevel = 'C2';
  else if (overallScore >= 80) cefrLevel = 'C1';
  else if (overallScore >= 70) cefrLevel = 'B2';
  else if (overallScore >= 60) cefrLevel = 'B1';
  else if (overallScore >= 50) cefrLevel = 'A2';
  
  return {
    score: overallScore,
    cefrLevel,
    feedback: `Your writing demonstrates ${cefrLevel} level proficiency. ${overallScore >= 80 ? 'Excellent work!' : overallScore >= 70 ? 'Good job!' : 'Keep practicing!'}`,
    detailedAnalysis: {
      vocabulary: {
        score: vocabularyScore,
        feedback: vocabularyScore >= 80 ? 'Excellent vocabulary usage' : vocabularyScore >= 60 ? 'Good vocabulary range' : 'Try to use more varied vocabulary'
      },
      grammar: {
        score: grammarScore,
        feedback: grammarScore >= 80 ? 'Strong grammar control' : grammarScore >= 60 ? 'Generally accurate grammar' : 'Focus on grammar accuracy'
      },
      coherence: {
        score: coherenceScore,
        feedback: coherenceScore >= 80 ? 'Well-organized and coherent' : coherenceScore >= 60 ? 'Mostly coherent structure' : 'Work on organizing your ideas'
      },
      complexity: {
        score: complexityScore,
        feedback: complexityScore >= 80 ? 'Sophisticated language use' : complexityScore >= 60 ? 'Good sentence variety' : 'Try using more complex structures'
      }
    }
  };
};
