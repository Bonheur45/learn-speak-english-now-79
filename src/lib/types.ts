// User related types
export type UserRole = 'student' | 'tutor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cohort_id?: string;
}

export interface Cohort {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  current_trimester: number;
  status: 'active' | 'upcoming' | 'completed';
}

export interface Trimester {
  id: string;
  cohort_id: string;
  name: string;
  number: number;
  start_date: string;
  end_date: string;
  days: Day[];
}

export interface Day {
  id: string;
  trimester_id: string;
  title: string;
  description: string;
  date: string;
  story_text: string;
  day_number: number;
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
  accent?: 'American' | 'British';
  file_size?: string;
  upload_date: string;
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
export const MOCK_COHORTS: Cohort[] = [
  {
    id: '1',
    name: 'Spring 2025',
    start_date: '2025-01-15',
    end_date: '2025-12-15',
    current_trimester: 1,
    status: 'active'
  },
  {
    id: '2',
    name: 'Summer 2025',
    start_date: '2025-05-01',
    end_date: '2026-04-01',
    current_trimester: 1,
    status: 'upcoming'
  },
  {
    id: '3',
    name: 'Fall 2025',
    start_date: '2025-09-01',
    end_date: '2026-08-01',
    current_trimester: 1,
    status: 'upcoming'
  },
  {
    id: '4',
    name: 'Winter 2025',
    start_date: '2025-12-01',
    end_date: '2026-11-01',
    current_trimester: 1,
    status: 'upcoming'
  },
  {
    id: '5',
    name: 'Spring 2026',
    start_date: '2026-01-15',
    end_date: '2026-12-15',
    current_trimester: 1,
    status: 'upcoming'
  },
  {
    id: '6',
    name: 'Summer 2026',
    start_date: '2026-05-01',
    end_date: '2027-04-01',
    current_trimester: 1,
    status: 'upcoming'
  },
  {
    id: '7',
    name: 'Fall 2026',
    start_date: '2026-09-01',
    end_date: '2027-08-01',
    current_trimester: 1,
    status: 'upcoming'
  },
  {
    id: '8',
    name: 'Winter 2026',
    start_date: '2026-12-01',
    end_date: '2027-11-01',
    current_trimester: 1,
    status: 'upcoming'
  },
  {
    id: '9',
    name: 'Spring 2024',
    start_date: '2024-01-15',
    end_date: '2024-12-15',
    current_trimester: 3,
    status: 'completed'
  },
  {
    id: '10',
    name: 'Fall 2024',
    start_date: '2024-09-01',
    end_date: '2025-08-01',
    current_trimester: 2,
    status: 'active'
  }
];

export const MOCK_TRIMESTERS: Trimester[] = [
  {
    id: '1',
    cohort_id: '1',
    name: 'Trimester 1: Fundamentals',
    number: 1,
    start_date: '2025-01-15',
    end_date: '2025-04-15',
    days: [
      {
        id: '1',
        trimester_id: '1',
        title: 'Introduction to English',
        description: 'Get started with basic English concepts',
        date: '2025-01-15',
        story_text: 'Once upon a time, there was a student eager to learn English...',
        day_number: 1
      },
      {
        id: '2',
        trimester_id: '1',
        title: 'Common Greetings',
        description: 'Learn everyday English greetings',
        date: '2025-01-18',
        story_text: 'Sarah walked into her new office on her first day...',
        day_number: 2
      },
      {
        id: '3',
        trimester_id: '1',
        title: 'Basic Conversation',
        description: 'Practice basic English conversations',
        date: '2025-01-22',
        story_text: 'John and Mary met at a cafe to practice their English...',
        day_number: 3
      }
    ]
  },
  {
    id: '2',
    cohort_id: '1',
    name: 'Trimester 2: Intermediate Skills',
    number: 2,
    start_date: '2025-04-16',
    end_date: '2025-08-15',
    days: [
      {
        id: '4',
        trimester_id: '2',
        title: 'Past Tense',
        description: 'Understanding and using past tense verbs',
        date: '2025-04-20',
        story_text: 'Last weekend, Alex visited his grandmother in the countryside...',
        day_number: 1
      },
      {
        id: '5',
        trimester_id: '2',
        title: 'Future Tense',
        description: 'Expressing future events and plans',
        date: '2025-04-25',
        story_text: 'Next summer, the Johnson family will travel to Europe...',
        day_number: 2
      }
    ]
  },
  {
    id: '3',
    cohort_id: '1',
    name: 'Trimester 3: Advanced Topics',
    number: 3,
    start_date: '2025-08-16',
    end_date: '2025-12-15',
    days: [
      {
        id: '6',
        trimester_id: '3',
        title: 'Conditional Sentences',
        description: 'Expressing hypothetical situations',
        date: '2025-08-20',
        story_text: 'If I had known about the traffic, I would have left earlier...',
        day_number: 1
      },
      {
        id: '7',
        trimester_id: '3',
        title: 'Academic Writing',
        description: 'Writing formal essays and reports',
        date: '2025-08-25',
        story_text: 'The research paper discussed the effects of climate change...',
        day_number: 2
      }
    ]
  }
];

// Keep the MOCK_DAYS for backward compatibility
export const MOCK_DAYS: Day[] = [
  ...MOCK_TRIMESTERS[0].days,
  ...MOCK_TRIMESTERS[1].days.slice(0, 1)
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
