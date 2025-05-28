
export type CurriculumLevel = 'A1-A2' | 'B1-B2' | 'C1-C2';

export interface CurriculumTemplate {
  id: string;
  level: CurriculumLevel;
  name: string;
  description: string;
  total_trimesters: number;
  created_at: string;
  updated_at: string;
}

export interface CurriculumTrimester {
  id: string;
  curriculum_id: string;
  name: string;
  number: number;
  description: string;
  total_days: number;
  days: CurriculumDay[];
}

export interface CurriculumDay {
  id: string;
  trimester_id: string;
  title: string;
  description: string;
  day_number: number;
  story_text: string;
  topic_notes: string;
  british_audio_url: string;
  american_audio_url: string;
  glossary_terms: GlossaryTerm[];
  created_at: string;
  updated_at: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
}

// Mock curriculum data
export const MOCK_CURRICULA: CurriculumTemplate[] = [
  {
    id: 'curr_a1_a2',
    level: 'A1-A2',
    name: 'Beginner to Elementary English',
    description: 'Foundation course covering basic vocabulary, simple grammar structures, and everyday expressions.',
    total_trimesters: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-05-01T00:00:00Z'
  },
  {
    id: 'curr_b1_b2',
    level: 'B1-B2',
    name: 'Intermediate to Upper Intermediate English',
    description: 'Intermediate course expanding vocabulary and developing fluency for work, travel, and social situations.',
    total_trimesters: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-05-01T00:00:00Z'
  },
  {
    id: 'curr_c1_c2',
    level: 'C1-C2',
    name: 'Advanced to Proficiency English',
    description: 'Advanced course refining communication skills and developing near-native fluency for academic and professional contexts.',
    total_trimesters: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-05-01T00:00:00Z'
  }
];

export const MOCK_CURRICULUM_TRIMESTERS: CurriculumTrimester[] = [
  {
    id: 'trim_a1_1',
    curriculum_id: 'curr_a1_a2',
    name: 'Trimester 1: Foundation Building',
    number: 1,
    description: 'Introduction to basic English concepts, greetings, and everyday vocabulary.',
    total_days: 24,
    days: Array.from({ length: 24 }, (_, i) => ({
      id: `day_a1_1_${i + 1}`,
      trimester_id: 'trim_a1_1',
      title: `Day ${i + 1}: ${getCurriculumDayTitle(i + 1, 'A1-A2')}`,
      description: getCurriculumDayDescription(i + 1, 'A1-A2'),
      day_number: i + 1,
      story_text: `<p>Story content for A1-A2 Day ${i + 1}. This story introduces basic vocabulary and simple sentence structures appropriate for beginners.</p>`,
      topic_notes: `<p>Today we will learn about ${getCurriculumTopicNotes(i + 1, 'A1-A2')}. This is fundamental for beginning English learners.</p>`,
      british_audio_url: '',
      american_audio_url: '',
      glossary_terms: [
        { id: `term_${i + 1}_1`, term: 'Hello', definition: 'A greeting used when meeting someone' },
        { id: `term_${i + 1}_2`, term: 'Thank you', definition: 'An expression of gratitude' }
      ],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-05-01T00:00:00Z'
    }))
  },
  {
    id: 'trim_a1_2',
    curriculum_id: 'curr_a1_a2',
    name: 'Trimester 2: Building Confidence',
    number: 2,
    description: 'Expanding vocabulary and introducing past tense concepts.',
    total_days: 24,
    days: Array.from({ length: 24 }, (_, i) => ({
      id: `day_a1_2_${i + 1}`,
      trimester_id: 'trim_a1_2',
      title: `Day ${i + 25}: ${getCurriculumDayTitle(i + 25, 'A1-A2')}`,
      description: getCurriculumDayDescription(i + 25, 'A1-A2'),
      day_number: i + 25,
      story_text: `<p>Story content for A1-A2 Day ${i + 25}. This story builds on previous lessons with slightly more complex vocabulary.</p>`,
      topic_notes: `<p>Today we will learn about ${getCurriculumTopicNotes(i + 25, 'A1-A2')}. This builds on our previous lessons.</p>`,
      british_audio_url: '',
      american_audio_url: '',
      glossary_terms: [
        { id: `term_${i + 25}_1`, term: 'Yesterday', definition: 'The day before today' },
        { id: `term_${i + 25}_2`, term: 'Family', definition: 'People related to you' }
      ],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-05-01T00:00:00Z'
    }))
  }
];

function getCurriculumDayTitle(dayNumber: number, level: CurriculumLevel): string {
  const a1Titles = [
    'Hello and Goodbye', 'My Name Is...', 'Numbers 1-10', 'Colors and Shapes',
    'Family Members', 'Daily Activities', 'Food I Like', 'At the Store',
    'Where Is It?', 'Today\'s Weather', 'My Hobbies', 'What I Did Yesterday',
    'Going Places', 'My Body', 'Jobs People Do', 'Using Technology',
    'Tomorrow\'s Plans', 'Different Countries', 'Fun Activities', 'Our Planet',
    'Grammar Review', 'Work Words', 'Writing Practice', 'Final Review'
  ];
  
  const b1Titles = [
    'Advanced Introductions', 'Complex Conversations', 'Expressing Opinions', 'Comparing Things',
    'Relationship Dynamics', 'Professional Routines', 'Cuisine and Culture', 'Consumer Behavior',
    'Navigation Skills', 'Climate Discussions', 'Passion Projects', 'Historical Narratives',
    'Travel Experiences', 'Health and Wellness', 'Career Aspirations', 'Digital Communication',
    'Future Possibilities', 'Cultural Exchange', 'Entertainment Industry', 'Environmental Action',
    'Advanced Grammar', 'Business Communication', 'Academic Writing', 'Comprehensive Assessment'
  ];
  
  const c1Titles = [
    'Sophisticated Discourse', 'Nuanced Communication', 'Critical Analysis', 'Philosophical Concepts',
    'Complex Relationships', 'Professional Excellence', 'Culinary Arts', 'Economic Principles',
    'Strategic Navigation', 'Environmental Science', 'Creative Pursuits', 'Historical Analysis',
    'Global Perspectives', 'Medical Discourse', 'Leadership Development', 'Innovation Technology',
    'Strategic Planning', 'Intercultural Competence', 'Media Analysis', 'Sustainability Science',
    'Linguistic Mastery', 'Executive Communication', 'Research Methodology', 'Proficiency Demonstration'
  ];
  
  const titles = level === 'A1-A2' ? a1Titles : level === 'B1-B2' ? b1Titles : c1Titles;
  return titles[(dayNumber - 1) % 24] || `Lesson ${dayNumber}`;
}

function getCurriculumDayDescription(dayNumber: number, level: CurriculumLevel): string {
  const baseDescriptions = {
    'A1-A2': 'Basic concepts and simple vocabulary for beginners',
    'B1-B2': 'Intermediate skills and expanded communication abilities',
    'C1-C2': 'Advanced concepts and sophisticated language use'
  };
  return `${baseDescriptions[level]} - Day ${dayNumber}`;
}

function getCurriculumTopicNotes(dayNumber: number, level: CurriculumLevel): string {
  const topics = {
    'A1-A2': ['present tense verbs', 'basic articles', 'simple questions', 'plural nouns'],
    'B1-B2': ['past continuous tense', 'conditional sentences', 'relative clauses', 'passive voice'],
    'C1-C2': ['subjunctive mood', 'complex conditionals', 'advanced discourse markers', 'stylistic variations']
  };
  
  const levelTopics = topics[level];
  return levelTopics[(dayNumber - 1) % levelTopics.length];
}
