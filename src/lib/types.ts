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

// Updated Cohort interface to reference curriculum templates
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
  curriculum_template_id: string; // Reference to curriculum template
  current_day_position?: number; // Track progress in curriculum
  cohort_customizations?: CohortCustomization[]; // Cohort-specific modifications
}

// New interface for cohort-specific customizations
export interface CohortCustomization {
  id: string;
  cohort_id: string;
  day_id: string;
  field: 'title' | 'description' | 'story_text' | 'topic_notes' | 'british_audio_url' | 'american_audio_url';
  custom_value: string;
  created_at: string;
}

// Updated Trimester interface to work with curriculum templates
export interface Trimester {
  id: string;
  cohort_id: string;
  curriculum_trimester_id: string; // Reference to curriculum template trimester
  name: string;
  number: number;
  start_date: string;
  end_date: string;
  completed_days: string[]; // Track which days are completed
}

// Updated Day interface for cohort-specific instances
export interface Day {
  id: string;
  trimester_id: string;
  curriculum_day_id: string; // Reference to curriculum template day
  title: string;
  description: string;
  date: string;
  story_text: string;
  day_number: number;
  materials: DayMaterial[];
  is_completed?: boolean;
  completion_date?: string;
}

// Progress tracking for individual students
export interface StudentProgress {
  id: string;
  user_id: string;
  cohort_id: string;
  curriculum_day_id: string;
  completed_activities: string[];
  score_summary: {
    vocabulary: number;
    topic: number;
    listening?: number;
    writing?: number;
  };
  completed_at?: string;
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
  | 'writing_challenge' 
  | 'writing_assessment';

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
  cefrLevel?: string;
  vocabularyScore?: number;
  grammarScore?: number;
  coherenceScore?: number;
  complexityScore?: number;
  taskAchievementScore?: number;
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

// Updated mock data to use curriculum template references
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
    capacity: 30,
    curriculum_template_id: 'curr_a1_a2',
    current_day_position: 3
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
    capacity: 30,
    curriculum_template_id: 'curr_a1_a2',
    current_day_position: 0
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
    capacity: 30,
    curriculum_template_id: 'curr_a1_a2',
    current_day_position: 0
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
    capacity: 30,
    curriculum_template_id: 'curr_b1_b2',
    current_day_position: 0
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
    capacity: 30,
    curriculum_template_id: 'curr_b1_b2',
    current_day_position: 0
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
    capacity: 30,
    curriculum_template_id: 'curr_c1_c2',
    current_day_position: 0
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
    capacity: 30,
    curriculum_template_id: 'curr_c1_c2',
    current_day_position: 0
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
    capacity: 30,
    curriculum_template_id: 'curr_c1_c2',
    current_day_position: 0
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
    capacity: 30,
    curriculum_template_id: 'curr_b1_b2',
    current_day_position: 72
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
    capacity: 30,
    curriculum_template_id: 'curr_a1_a2',
    current_day_position: 28
  }
];

// Updated MOCK_TRIMESTERS to reference curriculum templates
export const MOCK_TRIMESTERS: Trimester[] = [
  {
    id: '1',
    cohort_id: '1',
    curriculum_trimester_id: 'curr_trim_1_a1_a2',
    name: 'Trimester 1: Fundamentals',
    number: 1,
    start_date: '2025-01-15',
    end_date: '2025-04-15',
    completed_days: ['1', '2']
  },
  {
    id: '2',
    cohort_id: '1',
    curriculum_trimester_id: 'curr_trim_2_a1_a2',
    name: 'Trimester 2: Intermediate Skills',
    number: 2,
    start_date: '2025-04-16',
    end_date: '2025-08-15',
    completed_days: []
  },
  {
    id: '3',
    cohort_id: '1',
    curriculum_trimester_id: 'curr_trim_3_a1_a2',
    name: 'Trimester 3: Advanced Topics',
    number: 3,
    start_date: '2025-08-16',
    end_date: '2025-12-15',
    completed_days: []
  },
  {
    id: '4',
    cohort_id: '2',
    curriculum_trimester_id: 'curr_trim_1_a1_a2',
    name: 'Trimester 1: Fundamentals',
    number: 1,
    start_date: '2025-05-01',
    end_date: '2025-08-01',
    completed_days: []
  },
  {
    id: '5',
    cohort_id: '2',
    curriculum_trimester_id: 'curr_trim_2_a1_a2',
    name: 'Trimester 2: Intermediate Skills',
    number: 2,
    start_date: '2025-08-02',
    end_date: '2025-12-01',
    completed_days: []
  },
  {
    id: '6',
    cohort_id: '2',
    curriculum_trimester_id: 'curr_trim_3_a1_a2',
    name: 'Trimester 3: Advanced Topics',
    number: 3,
    start_date: '2025-12-02',
    end_date: '2026-04-01',
    completed_days: []
  }
];

// Helper function to get curriculum content for a cohort day
export const getCurriculumDayContent = (cohortId: string, curriculumDayId: string) => {
  // In a real app, this would fetch from curriculum templates
  // For now, we'll use mock data from curriculum types
  return {
    id: curriculumDayId,
    title: 'Introduction to English',
    description: 'Get started with basic English concepts',
    story_text: '<p>Once upon a time, there was a student eager to learn English...</p>',
    topic_notes: '<p>This lesson covers basic English fundamentals...</p>',
    british_audio_url: '',
    american_audio_url: '',
    day_number: 1
  };
};

// Helper function to apply cohort customizations
export const applyCohortCustomizations = (curriculumContent: any, cohortId: string) => {
  // In a real app, this would apply any cohort-specific customizations
  // For now, return the curriculum content as-is
  return curriculumContent;
};

// Keep existing MOCK_DAYS and MOCK_PROGRESS for backward compatibility
export const MOCK_DAYS: Day[] = [
  {
    id: '1',
    trimester_id: '1',
    curriculum_day_id: 'curr_day_1_a1_a2',
    title: 'Introduction to English',
    description: 'Get started with basic English concepts',
    date: '2025-01-15',
    story_text: 'Once upon a time, there was a student eager to learn English...',
    day_number: 1,
    materials: [],
    is_completed: true,
    completion_date: '2025-01-15'
  },
  {
    id: '2',
    trimester_id: '1',
    curriculum_day_id: 'curr_day_2_a1_a2',
    title: 'Common Greetings',
    description: 'Learn everyday English greetings',
    date: '2025-01-18',
    story_text: 'Sarah walked into her new office on her first day...',
    day_number: 2,
    materials: [],
    is_completed: true,
    completion_date: '2025-01-18'
  }
];

export const MOCK_PROGRESS: StudentProgress[] = [
  {
    id: '1',
    user_id: '1',
    cohort_id: '1',
    curriculum_day_id: 'curr_day_1_a1_a2',
    completed_activities: ['reading', 'listening', 'vocabulary', 'writing'],
    score_summary: {
      vocabulary: 85,
      topic: 90,
      writing: 78
    },
    completed_at: '2025-01-15T18:00:00Z'
  },
  {
    id: '2',
    user_id: '1',
    cohort_id: '1', 
    curriculum_day_id: 'curr_day_2_a1_a2',
    completed_activities: ['reading', 'listening'],
    score_summary: {
      vocabulary: 75,
      topic: 0
    }
  }
];

// Sample writing submissions
export const MOCK_WRITING_SUBMISSIONS: WritingSubmission[] = [
  {
    id: '1',
    user_id: '1',
    day_id: '1',
    content: 'My daily routine starts with breakfast at 7am...',
    submitted_at: '2025-05-20T10:30:00Z',
    reviewed: true,
    score: 78,
    cefrLevel: 'B1',
    vocabularyScore: 80,
    grammarScore: 75,
    coherenceScore: 82,
    complexityScore: 70,
    taskAchievementScore: 85,
    feedback: 'Good use of vocabulary with some minor grammar errors.'
  },
  {
    id: '2',
    user_id: '2',
    day_id: '2',
    content: 'Technology has greatly improved our learning experience...',
    submitted_at: '2025-05-21T14:45:00Z',
    reviewed: true,
    score: 85,
    cefrLevel: 'B2',
    vocabularyScore: 88,
    grammarScore: 82,
    coherenceScore: 85,
    complexityScore: 80,
    taskAchievementScore: 90,
    feedback: 'Well-structured essay with good vocabulary range.'
  }
];
