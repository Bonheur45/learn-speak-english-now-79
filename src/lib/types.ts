
// User related types
export type UserRole = 'student' | 'tutor' | 'admin';

export type ProficiencyLevel = 'A1-A2' | 'B1-B2' | 'C1-C2';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cohort_id?: string;
  proficiency_level?: ProficiencyLevel;
}

export interface Cohort {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  current_trimester: number;
  status: 'active' | 'upcoming' | 'completed';
  proficiency_level: ProficiencyLevel;
  enrolled_students: number;
  capacity: number;
  tutor_id?: string;
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
  materials: DayMaterial[];
}

export interface DayMaterial {
  id: string;
  type: MaterialType;
  title: string;
  content?: string;
  url?: string;
  accent?: 'American' | 'British';
  completed?: boolean;
}

export type MaterialType = 
  | 'story' 
  | 'audio_american' 
  | 'audio_british' 
  | 'glossary' 
  | 'topic_video' 
  | 'topic_notes' 
  | 'vocabulary_test' 
  | 'topic_test' 
  | 'movie_episode' 
  | 'listening_challenge' 
  | 'listening_transcript' 
  | 'listening_test' 
  | 'writing_challenge';

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
  type: 'vocabulary' | 'topic' | 'listening' | 'writing';
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

export interface WritingSubmission {
  id: string;
  user_id: string;
  day_id: string;
  content: string;
  submitted_at: string;
  reviewed: boolean;
  score?: number;
  feedback?: string;
  reviewed_at?: string;
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
    listening?: number;
    writing?: number;
  };
}

export interface LiveClass {
  id: string;
  cohort_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  link: string;
  tutor_id: string;
}

// Mock data for demonstration
export const PROFICIENCY_DESCRIPTIONS = {
  'A1-A2': {
    name: 'Beginner to Elementary',
    description: 'For students who are just starting to learn English. You will learn basic vocabulary, simple grammar structures, and everyday expressions to help you communicate in simple situations.',
    skills: [
      'Introduce yourself and others',
      'Ask and answer simple questions',
      'Read and understand short, simple texts',
      'Write basic sentences and fill out forms',
      'Understand slow, clear speech on familiar topics'
    ]
  },
  'B1-B2': {
    name: 'Intermediate to Upper Intermediate',
    description: 'For students who can communicate in familiar situations. You will expand your vocabulary, learn more complex grammar, and develop fluency for work, travel, and social situations.',
    skills: [
      'Participate actively in conversations on various topics',
      'Express opinions and give reasons',
      'Understand main ideas in complex texts',
      'Write clear, detailed text on a variety of subjects',
      'Follow extended speech and complex arguments'
    ]
  },
  'C1-C2': {
    name: 'Advanced to Proficiency',
    description: 'For students who already have a high level of English. You will refine your communication skills, master nuanced expressions, and develop near-native fluency for academic and professional contexts.',
    skills: [
      'Express ideas fluently and spontaneously without obvious searching',
      'Use language flexibly and effectively for social, academic and professional purposes',
      'Understand demanding, longer texts and recognize implicit meaning',
      'Produce clear, well-structured, detailed texts on complex subjects',
      'Follow complex interactions between third parties in group discussion'
    ]
  }
};

// Mock data for demonstration
export const MOCK_COHORTS: Cohort[] = [
  {
    id: '1',
    name: 'Spring 2025 A1-A2',
    start_date: '2025-01-15',
    end_date: '2025-12-15',
    current_trimester: 1,
    status: 'active',
    proficiency_level: 'A1-A2',
    enrolled_students: 26,
    capacity: 30
  },
  {
    id: '2',
    name: 'Summer 2025 A1-A2',
    start_date: '2025-05-01',
    end_date: '2026-04-01',
    current_trimester: 1,
    status: 'upcoming',
    proficiency_level: 'A1-A2',
    enrolled_students: 14,
    capacity: 30
  },
  {
    id: '3',
    name: 'Fall 2025 A1-A2',
    start_date: '2025-09-01',
    end_date: '2026-08-01',
    current_trimester: 1,
    status: 'upcoming',
    proficiency_level: 'A1-A2',
    enrolled_students: 5,
    capacity: 30
  },
  {
    id: '4',
    name: 'Winter 2025 B1-B2',
    start_date: '2025-12-01',
    end_date: '2026-11-01',
    current_trimester: 1,
    status: 'upcoming',
    proficiency_level: 'B1-B2',
    enrolled_students: 22,
    capacity: 30
  },
  {
    id: '5',
    name: 'Spring 2026 B1-B2',
    start_date: '2026-01-15',
    end_date: '2026-12-15',
    current_trimester: 1,
    status: 'upcoming',
    proficiency_level: 'B1-B2',
    enrolled_students: 10,
    capacity: 30
  },
  {
    id: '6',
    name: 'Summer 2026 C1-C2',
    start_date: '2026-05-01',
    end_date: '2027-04-01',
    current_trimester: 1,
    status: 'upcoming',
    proficiency_level: 'C1-C2',
    enrolled_students: 15,
    capacity: 30
  },
  {
    id: '7',
    name: 'Fall 2026 C1-C2',
    start_date: '2026-09-01',
    end_date: '2027-08-01',
    current_trimester: 1,
    status: 'upcoming',
    proficiency_level: 'C1-C2',
    enrolled_students: 8,
    capacity: 30
  },
  {
    id: '8',
    name: 'Winter 2026 C1-C2',
    start_date: '2026-12-01',
    end_date: '2027-11-01',
    current_trimester: 1,
    status: 'upcoming',
    proficiency_level: 'C1-C2',
    enrolled_students: 2,
    capacity: 30
  },
  {
    id: '9',
    name: 'Spring 2024 B1-B2',
    start_date: '2024-01-15',
    end_date: '2024-12-15',
    current_trimester: 3,
    status: 'completed',
    proficiency_level: 'B1-B2',
    enrolled_students: 30,
    capacity: 30
  },
  {
    id: '10',
    name: 'Fall 2024 A1-A2',
    start_date: '2024-09-01',
    end_date: '2025-08-01',
    current_trimester: 2,
    status: 'active',
    proficiency_level: 'A1-A2',
    enrolled_students: 28,
    capacity: 30
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
        day_number: 1,
        materials: []
      },
      {
        id: '2',
        trimester_id: '1',
        title: 'Common Greetings',
        description: 'Learn everyday English greetings',
        date: '2025-01-18',
        story_text: 'Sarah walked into her new office on her first day...',
        day_number: 2,
        materials: []
      },
      {
        id: '3',
        trimester_id: '1',
        title: 'Basic Conversation',
        description: 'Practice basic English conversations',
        date: '2025-01-22',
        story_text: 'John and Mary met at a cafe to practice their English...',
        day_number: 3,
        materials: []
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
        day_number: 1,
        materials: []
      },
      {
        id: '5',
        trimester_id: '2',
        title: 'Future Tense',
        description: 'Expressing future events and plans',
        date: '2025-04-25',
        story_text: 'Next summer, the Johnson family will travel to Europe...',
        day_number: 2,
        materials: []
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
        day_number: 1,
        materials: []
      },
      {
        id: '7',
        trimester_id: '3',
        title: 'Academic Writing',
        description: 'Writing formal essays and reports',
        date: '2025-08-25',
        story_text: 'The research paper discussed the effects of climate change...',
        day_number: 2,
        materials: []
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
