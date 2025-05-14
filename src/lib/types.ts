
// User related types
export type UserRole = 'student' | 'tutor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Day {
  id: string;
  title: string;
  description: string;
  date: string;
  story_text: string;
}

export interface GlossaryItem {
  id: string;
  day_id: string;
  term: string;
  definition: string;
}

export interface AudioNarration {
  id: string;
  day_id: string;
  accent: 'American' | 'British';
  file_url: string;
}

export interface Topic {
  id: string;
  day_id: string;
  title: string;
  content: string;
}

export interface Assessment {
  id: string;
  day_id: string;
  type: 'vocabulary' | 'topic';
  title: string;
}

export interface Question {
  id: string;
  assessment_id: string;
  text: string;
  choices: string[];
  correct_answer: string;
}

export interface StudentAnswer {
  id: string;
  user_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
}

export interface UploadedMaterial {
  id: string;
  tutor_id: string;
  day_id: string;
  topic_id: string;
  type: 'video' | 'audio' | 'doc' | 'form';
  embed_url: string;
  title: string;
}

export interface Progress {
  id: string;
  user_id: string;
  day_id: string;
  completed_activities: string[];
  score_summary: {
    vocabulary: number;
    topic: number;
  };
}

// Mock data for demonstration
export const MOCK_DAYS: Day[] = [
  {
    id: '1',
    title: 'Introduction to English',
    description: 'Get started with basic English concepts',
    date: '2023-05-10',
    story_text: 'Once upon a time, there was a student eager to learn English...'
  },
  {
    id: '2',
    title: 'Common Greetings',
    description: 'Learn everyday English greetings',
    date: '2023-05-11',
    story_text: 'Sarah walked into her new office on her first day...'
  },
  {
    id: '3',
    title: 'Basic Conversation',
    description: 'Practice basic English conversations',
    date: '2023-05-12',
    story_text: 'John and Mary met at a cafe to practice their English...'
  }
];

export const MOCK_PROGRESS: Progress[] = [
  {
    id: '1',
    user_id: '1',
    day_id: '1',
    completed_activities: ['reading', 'listening', 'vocabulary'],
    score_summary: {
      vocabulary: 85,
      topic: 90
    }
  },
  {
    id: '2',
    user_id: '1',
    day_id: '2',
    completed_activities: ['reading', 'listening'],
    score_summary: {
      vocabulary: 75,
      topic: 0
    }
  }
];
