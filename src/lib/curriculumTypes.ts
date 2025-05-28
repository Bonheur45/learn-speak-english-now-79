
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

// Generate complete curriculum data
export const MOCK_CURRICULUM_TRIMESTERS: CurriculumTrimester[] = [
  // A1-A2 Curriculum (3 trimesters, 24 days each)
  ...Array.from({ length: 3 }, (_, trimesterIndex) => ({
    id: `trim_a1_${trimesterIndex + 1}`,
    curriculum_id: 'curr_a1_a2',
    name: `Trimester ${trimesterIndex + 1}: ${getTrimesterName(trimesterIndex + 1, 'A1-A2')}`,
    number: trimesterIndex + 1,
    description: getTrimesterDescription(trimesterIndex + 1, 'A1-A2'),
    total_days: 24,
    days: Array.from({ length: 24 }, (_, dayIndex) => {
      const globalDayNumber = trimesterIndex * 24 + dayIndex + 1;
      return {
        id: `day_a1_${trimesterIndex + 1}_${dayIndex + 1}`,
        trimester_id: `trim_a1_${trimesterIndex + 1}`,
        title: `Day ${dayIndex + 1}: ${getCurriculumDayTitle(globalDayNumber, 'A1-A2')}`,
        description: getCurriculumDayDescription(globalDayNumber, 'A1-A2'),
        day_number: dayIndex + 1,
        story_text: getStoryText(globalDayNumber, 'A1-A2'),
        topic_notes: getTopicNotes(globalDayNumber, 'A1-A2'),
        british_audio_url: '',
        american_audio_url: '',
        glossary_terms: getGlossaryTerms(globalDayNumber, 'A1-A2'),
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-05-01T00:00:00Z'
      };
    })
  })),

  // B1-B2 Curriculum (3 trimesters, 24 days each)
  ...Array.from({ length: 3 }, (_, trimesterIndex) => ({
    id: `trim_b1_${trimesterIndex + 1}`,
    curriculum_id: 'curr_b1_b2',
    name: `Trimester ${trimesterIndex + 1}: ${getTrimesterName(trimesterIndex + 1, 'B1-B2')}`,
    number: trimesterIndex + 1,
    description: getTrimesterDescription(trimesterIndex + 1, 'B1-B2'),
    total_days: 24,
    days: Array.from({ length: 24 }, (_, dayIndex) => {
      const globalDayNumber = trimesterIndex * 24 + dayIndex + 1;
      return {
        id: `day_b1_${trimesterIndex + 1}_${dayIndex + 1}`,
        trimester_id: `trim_b1_${trimesterIndex + 1}`,
        title: `Day ${dayIndex + 1}: ${getCurriculumDayTitle(globalDayNumber, 'B1-B2')}`,
        description: getCurriculumDayDescription(globalDayNumber, 'B1-B2'),
        day_number: dayIndex + 1,
        story_text: getStoryText(globalDayNumber, 'B1-B2'),
        topic_notes: getTopicNotes(globalDayNumber, 'B1-B2'),
        british_audio_url: '',
        american_audio_url: '',
        glossary_terms: getGlossaryTerms(globalDayNumber, 'B1-B2'),
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-05-01T00:00:00Z'
      };
    })
  })),

  // C1-C2 Curriculum (3 trimesters, 24 days each)
  ...Array.from({ length: 3 }, (_, trimesterIndex) => ({
    id: `trim_c1_${trimesterIndex + 1}`,
    curriculum_id: 'curr_c1_c2',
    name: `Trimester ${trimesterIndex + 1}: ${getTrimesterName(trimesterIndex + 1, 'C1-C2')}`,
    number: trimesterIndex + 1,
    description: getTrimesterDescription(trimesterIndex + 1, 'C1-C2'),
    total_days: 24,
    days: Array.from({ length: 24 }, (_, dayIndex) => {
      const globalDayNumber = trimesterIndex * 24 + dayIndex + 1;
      return {
        id: `day_c1_${trimesterIndex + 1}_${dayIndex + 1}`,
        trimester_id: `trim_c1_${trimesterIndex + 1}`,
        title: `Day ${dayIndex + 1}: ${getCurriculumDayTitle(globalDayNumber, 'C1-C2')}`,
        description: getCurriculumDayDescription(globalDayNumber, 'C1-C2'),
        day_number: dayIndex + 1,
        story_text: getStoryText(globalDayNumber, 'C1-C2'),
        topic_notes: getTopicNotes(globalDayNumber, 'C1-C2'),
        british_audio_url: '',
        american_audio_url: '',
        glossary_terms: getGlossaryTerms(globalDayNumber, 'C1-C2'),
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-05-01T00:00:00Z'
      };
    })
  }))
];

function getTrimesterName(trimesterNumber: number, level: CurriculumLevel): string {
  const trimesterNames = {
    'A1-A2': ['Foundation Building', 'Basic Communication', 'Elementary Mastery'],
    'B1-B2': ['Intermediate Skills', 'Fluency Development', 'Advanced Communication'],
    'C1-C2': ['Advanced Proficiency', 'Sophisticated Expression', 'Near-Native Mastery']
  };
  return trimesterNames[level][trimesterNumber - 1] || `Trimester ${trimesterNumber}`;
}

function getTrimesterDescription(trimesterNumber: number, level: CurriculumLevel): string {
  const descriptions = {
    'A1-A2': [
      'Introduction to basic English concepts, greetings, and everyday vocabulary.',
      'Building confidence with simple conversations and basic grammar structures.',
      'Consolidating elementary skills and preparing for intermediate level.'
    ],
    'B1-B2': [
      'Developing intermediate communication skills and expanding vocabulary range.',
      'Building fluency through complex conversations and varied topics.',
      'Mastering upper-intermediate skills for professional and academic contexts.'
    ],
    'C1-C2': [
      'Refining advanced language skills and sophisticated expression.',
      'Developing nuanced communication for complex topics and situations.',
      'Achieving near-native proficiency in all language skills.'
    ]
  };
  return descriptions[level][trimesterNumber - 1] || `Trimester ${trimesterNumber} content.`;
}

function getCurriculumDayTitle(dayNumber: number, level: CurriculumLevel): string {
  const a1Titles = [
    'Hello and Goodbye', 'My Name Is...', 'Numbers 1-10', 'Colors and Shapes',
    'Family Members', 'Daily Activities', 'Food I Like', 'At the Store',
    'Where Is It?', 'Today\'s Weather', 'My Hobbies', 'What I Did Yesterday',
    'Going Places', 'My Body', 'Jobs People Do', 'Using Technology',
    'Tomorrow\'s Plans', 'Different Countries', 'Fun Activities', 'Our Planet',
    'Grammar Review', 'Work Words', 'Writing Practice', 'Final Review',
    // Trimester 2
    'Past Adventures', 'Future Dreams', 'Comparing Things', 'Making Friends',
    'At the Doctor', 'Shopping Mall', 'Transportation', 'Cooking Together',
    'Sports and Games', 'Music and Dance', 'Art and Creativity', 'School Life',
    'Home Sweet Home', 'Seasons Change', 'Animals Wild', 'City vs Country',
    'Birthday Party', 'Vacation Time', 'Learning Skills', 'Helping Others',
    'Weekend Plans', 'Daily Routine', 'Special Days', 'Progress Check',
    // Trimester 3
    'Advanced Conversations', 'Complex Stories', 'Opinion Sharing', 'Problem Solving',
    'Cultural Exchange', 'News and Media', 'Science Facts', 'History Lessons',
    'Environmental Care', 'Technology Today', 'Career Planning', 'Social Issues',
    'Global Awareness', 'Creative Writing', 'Critical Thinking', 'Leadership',
    'Team Projects', 'Public Speaking', 'Research Skills', 'Innovation',
    'Community Service', 'Life Goals', 'Achievement Celebration', 'Course Completion'
  ];
  
  const b1Titles = [
    'Advanced Introductions', 'Complex Conversations', 'Expressing Opinions', 'Comparing Cultures',
    'Relationship Dynamics', 'Professional Routines', 'Cuisine and Culture', 'Consumer Behavior',
    'Navigation Skills', 'Climate Discussions', 'Passion Projects', 'Historical Narratives',
    'Travel Experiences', 'Health and Wellness', 'Career Aspirations', 'Digital Communication',
    'Future Possibilities', 'Cultural Exchange', 'Entertainment Industry', 'Environmental Action',
    'Advanced Grammar', 'Business Communication', 'Academic Writing', 'Assessment Review',
    // Trimester 2
    'Workplace Dynamics', 'Project Management', 'Negotiation Skills', 'Presentation Techniques',
    'Market Analysis', 'Innovation Processes', 'Quality Assurance', 'Customer Relations',
    'Financial Planning', 'Strategic Thinking', 'Team Leadership', 'Conflict Resolution',
    'Performance Evaluation', 'Change Management', 'Risk Assessment', 'Decision Making',
    'Resource Allocation', 'Stakeholder Engagement', 'Process Improvement', 'Results Analysis',
    'Goal Setting', 'Time Management', 'Communication Strategies', 'Progress Evaluation',
    // Trimester 3
    'Advanced Research', 'Critical Analysis', 'Theoretical Frameworks', 'Methodology Design',
    'Data Interpretation', 'Academic Discourse', 'Peer Review', 'Conference Presentation',
    'Publication Writing', 'Literature Review', 'Hypothesis Testing', 'Statistical Analysis',
    'Ethical Considerations', 'Cross-Cultural Studies', 'Interdisciplinary Approach', 'Case Studies',
    'Field Research', 'Survey Design', 'Interview Techniques', 'Focus Groups',
    'Report Writing', 'Thesis Development', 'Defense Preparation', 'Final Assessment'
  ];
  
  const c1Titles = [
    'Sophisticated Discourse', 'Nuanced Communication', 'Critical Analysis', 'Philosophical Concepts',
    'Complex Relationships', 'Professional Excellence', 'Culinary Arts', 'Economic Principles',
    'Strategic Navigation', 'Environmental Science', 'Creative Pursuits', 'Historical Analysis',
    'Global Perspectives', 'Medical Discourse', 'Leadership Development', 'Innovation Technology',
    'Strategic Planning', 'Intercultural Competence', 'Media Analysis', 'Sustainability Science',
    'Linguistic Mastery', 'Executive Communication', 'Research Methodology', 'Proficiency Assessment',
    // Trimester 2
    'Diplomatic Relations', 'International Law', 'Global Economics', 'Political Science',
    'Social Psychology', 'Organizational Behavior', 'Strategic Management', 'Policy Development',
    'Comparative Studies', 'Cultural Anthropology', 'Linguistic Theory', 'Cognitive Science',
    'Educational Philosophy', 'Technology Ethics', 'Scientific Discourse', 'Mathematical Concepts',
    'Artistic Expression', 'Literary Criticism', 'Musical Theory', 'Design Principles',
    'Architectural Concepts', 'Urban Planning', 'Environmental Policy', 'Sustainability Frameworks',
    // Trimester 3
    'Doctoral Discourse', 'Academic Excellence', 'Scholarly Writing', 'Peer Collaboration',
    'Research Innovation', 'Knowledge Creation', 'Theoretical Development', 'Empirical Analysis',
    'Publication Standards', 'Conference Leadership', 'Grant Writing', 'Academic Networks',
    'Interdisciplinary Research', 'Cross-Cultural Analysis', 'Global Partnerships', 'Impact Assessment',
    'Knowledge Transfer', 'Community Engagement', 'Policy Influence', 'Social Change',
    'Legacy Building', 'Mentorship Excellence', 'Lifelong Learning', 'Mastery Achievement'
  ];
  
  const titles = level === 'A1-A2' ? a1Titles : level === 'B1-B2' ? b1Titles : c1Titles;
  return titles[(dayNumber - 1) % titles.length] || `Lesson ${dayNumber}`;
}

function getCurriculumDayDescription(dayNumber: number, level: CurriculumLevel): string {
  const baseDescriptions = {
    'A1-A2': 'Basic concepts and simple vocabulary for beginners',
    'B1-B2': 'Intermediate skills and expanded communication abilities',
    'C1-C2': 'Advanced concepts and sophisticated language use'
  };
  return `${baseDescriptions[level]} - Day ${dayNumber}`;
}

function getStoryText(dayNumber: number, level: CurriculumLevel): string {
  const storyTemplates = {
    'A1-A2': [
      '<p>Sarah walks to school every morning. She says "Good morning" to her neighbors. Today is a sunny day and she feels happy. She likes to learn new English words in class.</p>',
      '<p>Tom is at the supermarket with his mother. They buy apples, bread, and milk. Tom counts the items: one, two, three. He learns the names of different foods.</p>',
      '<p>Maria has a big family. Her father is tall, her mother is kind, and her little brother is funny. They live in a small house with a red door.</p>'
    ],
    'B1-B2': [
      '<p>The conference room was filled with professionals from different countries. Despite their diverse backgrounds, they found common ground through their shared project goals. The team leader facilitated a discussion about sustainable business practices.</p>',
      '<p>After years of working in traditional industries, James decided to pursue his passion for renewable energy. He enrolled in a specialized program that would challenge his existing knowledge and expand his horizons.</p>',
      '<p>The cultural festival showcased various traditions from around the world. Visitors could experience authentic cuisine, traditional music, and folk dances while learning about different customs and beliefs.</p>'
    ],
    'C1-C2': [
      '<p>The symposium on artificial intelligence brought together leading researchers to discuss the ethical implications of machine learning algorithms. The discourse revealed nuanced perspectives on the intersection of technology and human values, challenging conventional paradigms.</p>',
      '<p>Contemporary literary criticism has evolved to encompass interdisciplinary approaches, incorporating insights from psychology, sociology, and digital humanities. This methodological diversity enriches textual analysis and broadens interpretative possibilities.</p>',
      '<p>The diplomatic negotiations required sophisticated understanding of cultural subtleties and geopolitical complexities. Each participant navigated linguistic nuances while maintaining their respective national interests and seeking mutually beneficial outcomes.</p>'
    ]
  };
  
  const templates = storyTemplates[level];
  return templates[(dayNumber - 1) % templates.length];
}

function getTopicNotes(dayNumber: number, level: CurriculumLevel): string {
  const topicTemplates = {
    'A1-A2': [
      '<p><strong>Grammar Focus:</strong> Present tense verbs and basic sentence structure</p><p><strong>Vocabulary:</strong> Everyday greetings and common expressions</p><p><strong>Key Points:</strong> Use "am/is/are" correctly, practice pronunciation of basic sounds</p>',
      '<p><strong>Grammar Focus:</strong> Plural nouns and simple questions</p><p><strong>Vocabulary:</strong> Numbers, colors, and basic adjectives</p><p><strong>Key Points:</strong> Question formation with "What" and "How many"</p>',
      '<p><strong>Grammar Focus:</strong> Possessive adjectives and family vocabulary</p><p><strong>Vocabulary:</strong> Family members and descriptive words</p><p><strong>Key Points:</strong> Using "my, your, his, her" correctly</p>'
    ],
    'B1-B2': [
      '<p><strong>Grammar Focus:</strong> Past continuous and past perfect tenses</p><p><strong>Vocabulary:</strong> Professional and academic terminology</p><p><strong>Key Points:</strong> Expressing completed actions and ongoing situations in the past</p>',
      '<p><strong>Grammar Focus:</strong> Conditional sentences and subjunctive mood</p><p><strong>Vocabulary:</strong> Abstract concepts and complex ideas</p><p><strong>Key Points:</strong> Using first, second, and third conditionals appropriately</p>',
      '<p><strong>Grammar Focus:</strong> Passive voice and reported speech</p><p><strong>Vocabulary:</strong> Formal and informal registers</p><p><strong>Key Points:</strong> Transforming direct speech to indirect speech</p>'
    ],
    'C1-C2': [
      '<p><strong>Grammar Focus:</strong> Advanced discourse markers and cohesive devices</p><p><strong>Vocabulary:</strong> Sophisticated academic and professional lexicon</p><p><strong>Key Points:</strong> Creating coherent arguments with complex linguistic structures</p>',
      '<p><strong>Grammar Focus:</strong> Nuanced modal verbs and advanced conditionals</p><p><strong>Vocabulary:</strong> Specialized terminology and idiomatic expressions</p><p><strong>Key Points:</strong> Expressing subtle degrees of certainty and possibility</p>',
      '<p><strong>Grammar Focus:</strong> Stylistic variations and register appropriateness</p><p><strong>Vocabulary:</strong> Field-specific jargon and cross-cultural communication</p><p><strong>Key Points:</strong> Adapting language to different contexts and audiences</p>'
    ]
  };
  
  const templates = topicTemplates[level];
  return templates[(dayNumber - 1) % templates.length];
}

function getGlossaryTerms(dayNumber: number, level: CurriculumLevel): GlossaryTerm[] {
  const glossaryTemplates = {
    'A1-A2': [
      [
        { id: `${dayNumber}_1`, term: 'Hello', definition: 'A greeting used when meeting someone' },
        { id: `${dayNumber}_2`, term: 'Morning', definition: 'The early part of the day' },
        { id: `${dayNumber}_3`, term: 'School', definition: 'A place where children learn' }
      ],
      [
        { id: `${dayNumber}_1`, term: 'Count', definition: 'To say numbers in order' },
        { id: `${dayNumber}_2`, term: 'Apple', definition: 'A round, red or green fruit' },
        { id: `${dayNumber}_3`, term: 'Supermarket', definition: 'A large store selling food and household items' }
      ],
      [
        { id: `${dayNumber}_1`, term: 'Family', definition: 'People who are related to you' },
        { id: `${dayNumber}_2`, term: 'Father', definition: 'Your male parent' },
        { id: `${dayNumber}_3`, term: 'House', definition: 'A building where people live' }
      ]
    ],
    'B1-B2': [
      [
        { id: `${dayNumber}_1`, term: 'Conference', definition: 'A formal meeting for discussion' },
        { id: `${dayNumber}_2`, term: 'Sustainable', definition: 'Able to continue over time without harming the environment' },
        { id: `${dayNumber}_3`, term: 'Facilitate', definition: 'To make a process easier or help bring about' }
      ],
      [
        { id: `${dayNumber}_1`, term: 'Pursue', definition: 'To follow or chase after something' },
        { id: `${dayNumber}_2`, term: 'Renewable', definition: 'Able to be renewed or replaced naturally' },
        { id: `${dayNumber}_3`, term: 'Specialized', definition: 'Requiring or involving detailed knowledge' }
      ],
      [
        { id: `${dayNumber}_1`, term: 'Showcase', definition: 'To display or present prominently' },
        { id: `${dayNumber}_2`, term: 'Authentic', definition: 'Genuine or real, not copied' },
        { id: `${dayNumber}_3`, term: 'Customs', definition: 'Traditional practices of a culture' }
      ]
    ],
    'C1-C2': [
      [
        { id: `${dayNumber}_1`, term: 'Symposium', definition: 'An academic conference or meeting' },
        { id: `${dayNumber}_2`, term: 'Paradigm', definition: 'A typical example or pattern of something' },
        { id: `${dayNumber}_3`, term: 'Nuanced', definition: 'Characterized by subtle differences' }
      ],
      [
        { id: `${dayNumber}_1`, term: 'Interdisciplinary', definition: 'Relating to more than one branch of knowledge' },
        { id: `${dayNumber}_2`, term: 'Methodological', definition: 'Relating to the system of methods used' },
        { id: `${dayNumber}_3`, term: 'Interpretative', definition: 'Relating to explanation or understanding' }
      ],
      [
        { id: `${dayNumber}_1`, term: 'Diplomatic', definition: 'Relating to international relations' },
        { id: `${dayNumber}_2`, term: 'Geopolitical', definition: 'Relating to politics influenced by geography' },
        { id: `${dayNumber}_3`, term: 'Subtleties', definition: 'Fine distinctions or nuances' }
      ]
    ]
  };
  
  const templates = glossaryTemplates[level];
  return templates[(dayNumber - 1) % templates.length];
}
