
export interface AssessmentResult {
  score: number;
  cefrLevel: string;
  overview: string[];
  grammarErrors: string[];
  suggestions: string[];
  confidenceLevel: number; // How confident the system is in the CEFR assignment
  sublevels: {
    vocabulary: number;
    grammar: number;
    coherence: number;
    complexity: number;
    taskAchievement?: number; // Added task achievement metric
  };
}

// Define the CEFR levels for reference
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// Complex lexical patterns that might indicate higher proficiency
export const lexicalComplexityMarkers = {
  A1: ['basic', 'simple', 'everyday', 'hello', 'like', 'want'],
  A2: ['routine', 'familiar', 'direct', 'yesterday', 'tomorrow', 'because'],
  B1: ['connected', 'descriptive', 'experiences', 'opinion', 'agree', 'disagree'],
  B2: ['detailed', 'viewpoint', 'advantage', 'disadvantage', 'certainly', 'therefore'],
  C1: ['complex', 'implication', 'academic', 'professional', 'nevertheless', 'consequently'],
  C2: ['nuanced', 'idiomatic', 'colloquial', 'sophisticated', 'albeit', 'notwithstanding']
};

// Level descriptors based on CEFR framework
export const cefrDescriptors = {
  A1: "Can understand and use familiar everyday expressions and very basic phrases. Can introduce themselves and others and can ask and answer questions about personal details.",
  A2: "Can understand sentences and frequently used expressions related to areas of most immediate relevance. Can communicate in simple and routine tasks.",
  B1: "Can understand the main points of clear standard input on familiar matters. Can produce simple connected text on topics that are familiar or of personal interest.",
  B2: "Can understand the main ideas of complex text on both concrete and abstract topics. Can interact with a degree of fluency and spontaneity with native speakers.",
  C1: "Can understand a wide range of demanding, longer texts. Can express ideas fluently and spontaneously without much obvious searching for expressions.",
  C2: "Can understand with ease virtually everything heard or read. Can express themselves spontaneously, very fluently and precisely, differentiating finer shades of meaning."
};
