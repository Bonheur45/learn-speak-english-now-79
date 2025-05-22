
import { AssessmentResult, CefrLevel, lexicalComplexityMarkers } from "@/types/assessment";

const cefrLevels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// Improved assessment service with recalibrated scoring based on Cambridge validation data
export const assessText = (text: string): AssessmentResult => {
  const textLength = text.length;
  
  // Text length factor (recalibrated with more weight)
  let rawScore = 0;
  
  if (textLength > 500) {
    rawScore += 20;
  } else if (textLength > 300) {
    rawScore += 15;
  } else if (textLength > 200) {
    rawScore += 10;
  } else if (textLength > 100) {
    rawScore += 5;
  } else {
    // More significant penalty for very short texts
    rawScore += 0;
  }
  
  // Lexical complexity with improved calibration
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const uniqueWords = new Set(words).size;
  const lexicalDiversity = words.length > 0 ? uniqueWords / words.length : 0;
  
  // Recalibrated vocabulary score with stronger penalties for short texts
  // Compression at higher end to avoid overestimating lower-level essays
  let vocabularyScore: number;
  if (words.length < 30) {
    // Very short texts heavily penalized to avoid overestimation
    vocabularyScore = Math.min(55, Math.floor(lexicalDiversity * 80));
  } else if (words.length < 50) {
    // Short texts heavily penalized to avoid overestimation
    vocabularyScore = Math.min(65, Math.floor(lexicalDiversity * 90));
  } else if (words.length < 100) {
    vocabularyScore = Math.min(75, Math.floor(lexicalDiversity * 100));
  } else {
    // More nuanced scoring for longer texts
    vocabularyScore = Math.min(95, Math.floor(lexicalDiversity * 110));
  }
  
  // Sentence complexity with improved detection
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
  
  // Adjusted complexity formula with more realistic scoring curve
  // Higher penalties for very short sentences to better detect A1 level
  let complexityScore: number;
  if (avgWordsPerSentence < 4) {
    // Very simple sentences (A1 level detection)
    complexityScore = Math.min(40, Math.floor(avgWordsPerSentence * 9));
  } else if (avgWordsPerSentence < 6) {
    // Simple sentences (low A2 level)
    complexityScore = Math.min(50, Math.floor(40 + (avgWordsPerSentence - 4) * 5));
  } else if (avgWordsPerSentence < 8) {
    // Simple sentences (high A2 level)
    complexityScore = Math.min(60, Math.floor(50 + (avgWordsPerSentence - 6) * 5));
  } else if (avgWordsPerSentence < 12) {
    // Moderate complexity (B1 level)
    complexityScore = Math.min(75, Math.floor(60 + (avgWordsPerSentence - 8) * 3.75));
  } else if (avgWordsPerSentence < 16) {
    // Higher complexity (B2 level)
    complexityScore = Math.min(85, Math.floor(75 + (avgWordsPerSentence - 12) * 2.5));
  } else {
    // Advanced complexity (C1-C2 level)
    complexityScore = Math.min(100, Math.floor(85 + (avgWordsPerSentence - 16) * 1.5));
  }
  
  // Enhanced detection of advanced structures with more granular leveling
  const structurePatterns = {
    // A1 level markers (basic structures) - expanded for better detection
    a1: [
      /\bI am\b|\bYou are\b|\bIt is\b/i,
      /\bcan\b/i,
      /\band\b/i,
      /\bthis is\b|\bthat is\b/i,
      /\bhello\b|\bhi\b|\bbye\b/i,
    ],
    
    // A2 level markers
    a2: [
      /\bI think\b|\bI like\b/i,
      /\bwant to\b|\bneed to\b/i,
      /\bbecause\b|\bbut\b|\bso\b/i,
      /\byesterday\b|\blast\b/i, // Simple past time markers
      /\btomorrow\b|\bnext\b/i, // Simple future time markers
    ],
    
    // B1 level markers
    b1: [
      /\balthough\b|\bhowever\b|\btherefore\b/i, // Mid-level connectors
      /\bused to\b|\bwould rather\b/i, // Expressions of preference/habit
      /\bI believe\b|\bIn my opinion\b/i,
      /\bfirstly\b|\bsecondly\b|\bfinally\b/i, // Simple sequencing
      /\bmust\b|\bhave to\b|\bshould\b/i, // Modality
    ],
    
    // B2 level markers
    b2: [
      /\bin contrast\b|\bconsequently\b|\bfurthermore\b/i, // Higher-level connectors
      /\bdespite\b|\beven though\b/i, // Complex subordination
      /\bmight\b|\bcould\b|\bshould\b/i, // Modal verbs
      /\bwould have\b|\bcould have\b|\bshould have\b/i, // Perfect conditionals
      /\bin addition\b|\bon the other hand\b/i, // Academic connectors
    ],
    
    // C1 level markers
    c1: [
      /\bnevertheless\b|\bnonetheless\b|\balternatively\b/i, // Advanced connectors
      /\bin light of\b|\bwith regard to\b|\bin the event that\b/i, // Advanced phrases
      /\bhad been\b/i, // Past perfect
      /\bhaving been\b/i, // Perfect participle
      /\badmittedly\b|\bconversely\b|\bnotwithstanding\b/i,
      /\bcompelling\b|\bconclusive\b|\bcontroversial\b/i, // Academic vocabulary
    ],
    
    // C2 level markers
    c2: [
      /\balbeit\b|\blest\b|\bwhereas\b/i, // Sophisticated connectors
      /\bwould have been\b|\bmight have been\b|\bcould have been\b/i, // Perfect modal conditionals
      /\bhad it not been for\b|\bwere it not for\b/i, // Inverted conditionals
      /\bon the grounds that\b|\bin so far as\b/i,
      /\bparadoxically\b|\bincontrovertibly\b|\bunequivocally\b/i, // Advanced academic lexis
    ],
  };
  
  // More nuanced analysis with weighted scoring by CEFR level
  let structureScores = {
    a1: 0,
    a2: 0,
    b1: 0,
    b2: 0,
    c1: 0,
    c2: 0,
  };
  
  // Weight factors for each level (higher levels have more impact)
  const levelWeights = {
    a1: 1,
    a2: 2,
    b1: 3,
    b2: 4,
    c1: 5,
    c2: 6,
  };
  
  // Count pattern matches for each level
  Object.entries(structurePatterns).forEach(([level, patterns]) => {
    const levelKey = level as keyof typeof structureScores;
    patterns.forEach(pattern => {
      const matches = (text.match(pattern) || []).length;
      if (matches > 0) {
        // Cap the contribution from any single pattern
        structureScores[levelKey] += Math.min(5, matches);
      }
    });
  });
  
  // Calculate weighted coherence score
  let totalWeightedMatches = 0;
  let totalWeight = 0;
  
  Object.entries(structureScores).forEach(([level, count]) => {
    const levelKey = level as keyof typeof levelWeights;
    totalWeightedMatches += count * levelWeights[levelKey];
    totalWeight += count;
  });
  
  // Calculate normalized coherence score (0-100)
  // The presence of higher-level structures boosts the score
  const coherenceBase = totalWeight > 0 ? (totalWeightedMatches / totalWeight) * 15 : 0;
  
  // Calculate coherence score with better distribution
  const coherenceScore = Math.min(100, Math.floor(50 + coherenceBase));
  
  // Enhanced grammatical accuracy detection with better A1-A2 detection
  const grammarErrorPatterns = [
    // A1-A2 errors (heavily weighted for low-level detection)
    { pattern: /\bam go\b|\bis go\b|\bare go\b/i, level: 'A1', severity: 5, description: 'Basic verb form errors' },
    { pattern: /\bthey is\b|\bshe are\b|\bhe are\b|\bwe is\b/i, level: 'A1', severity: 5, description: 'Subject-verb agreement errors' },
    { pattern: /\bmore better\b|\bmost fastest\b/i, level: 'A2', severity: 4, description: 'Incorrect comparative forms' },
    { pattern: /\bin the yesterday\b|\bin the tomorrow\b/i, level: 'A1', severity: 4, description: 'Incorrect time expressions' },
    { pattern: /\bI no like\b|\bhe no have\b/i, level: 'A1', severity: 5, description: 'Incorrect negation' },
    
    // B1-B2 errors (medium weight)
    { pattern: /\bhave went\b|\bhas went\b/i, level: 'B1', severity: 3, description: 'Incorrect past participle forms' },
    { pattern: /\bif I would\b|\bif I will\b/i, level: 'B1', severity: 3, description: 'Incorrect conditional structures' },
    { pattern: /\bI am agree\b|\bhe is belong\b/i, level: 'B1', severity: 3, description: 'Incorrect verb patterns' },
    
    // Word order errors across levels
    { pattern: /\bknow not\b|\blike not\b/i, level: 'A2', severity: 4, description: 'Incorrect word order with negation' },
    { pattern: /\bvery much like\b|\balways am\b/i, level: 'B1', severity: 3, description: 'Incorrect adverb placement' },
  ];
  
  // Detect grammar errors with severity weighting
  const grammarErrors = grammarErrorPatterns
    .filter(({ pattern }) => pattern.test(text))
    .map(({ pattern, level, severity, description }) => ({
      description: description || `Grammar error (${level} level)`,
      level,
      severity
    }));
  
  // Calculate weighted error count for grammar score
  const totalErrorSeverity = grammarErrors.reduce((sum, error) => sum + (error.severity || 3), 0);
  
  // Recalibrated grammar score calculation with higher baseline for longer texts
  const grammarBase = words.length > 200 ? 85 : words.length > 100 ? 80 : 75;
  // More significant penalties for errors to better differentiate levels
  const grammarPenalty = Math.min(65, totalErrorSeverity * 6);
  const grammarScore = Math.max(20, grammarBase - grammarPenalty);
  
  // Task achievement/relevance analysis (enhanced)
  // This is a more sophisticated implementation for task achievement
  
  // Check for paragraph structure (indicates better organization)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const hasParagraphStructure = paragraphs.length > 1;
  
  // Check for discourse markers that indicate argumentation and structure
  const discoursePatterns = [
    /\bfirstly\b|\bsecondly\b|\bfinally\b|\bin conclusion\b/i, // Basic structure
    /\bmoreover\b|\bfurthermore\b|\bin addition\b/i, // Adding points
    /\bhowever\b|\bnevertheless\b|\bon the other hand\b/i, // Contrast
    /\btherefore\b|\bconsequently\b|\bas a result\b/i, // Cause-effect
    /\bin my opinion\b|\bI believe\b|\bit seems that\b/i, // Opinion markers
  ];
  
  const discourseMarkerCount = discoursePatterns.reduce((count, pattern) => {
    return count + (text.match(pattern) || []).length;
  }, 0);
  
  // Calculate task achievement score with more sophisticated criteria
  let taskAchievementBase = 50; // Start with a base score
  
  // Adjustments for text length (penalize very short texts)
  if (words.length < 50) {
    taskAchievementBase = Math.max(30, taskAchievementBase - 20);
  } else if (words.length < 100) {
    taskAchievementBase = Math.max(40, taskAchievementBase - 10);
  } else if (words.length > 250) {
    taskAchievementBase = Math.min(70, taskAchievementBase + 10);
  }
  
  // Adjustments for paragraph structure
  if (hasParagraphStructure) {
    taskAchievementBase += 10;
  }
  
  // Adjustments for discourse markers
  // Cap the bonus to avoid overscoring texts that just repeat markers
  const discourseBonus = Math.min(20, discourseMarkerCount * 3);
  taskAchievementBase += discourseBonus;
  
  // Final task achievement score with caps
  const taskAchievementScore = Math.min(100, Math.max(20, taskAchievementBase));
  
  // Calculate the sublevel scores
  const sublevels = {
    vocabulary: vocabularyScore,
    grammar: grammarScore,
    coherence: coherenceScore,
    complexity: complexityScore,
    taskAchievement: taskAchievementScore
  };

  // Calculate weighted average - revised weights to better match Cambridge assessment
  // Higher weight on grammar, coherence, and task achievement
  const finalScore = Math.round(
    (sublevels.vocabulary * 0.15 + 
     sublevels.grammar * 0.25 + 
     sublevels.coherence * 0.25 + 
     sublevels.complexity * 0.15 +
     sublevels.taskAchievement * 0.2)
  );
  
  // Completely recalibrated CEFR level boundaries to fix the compression issue
  // This creates a wider spread between levels and better aligns with Cambridge scores
  let cefrLevel: CefrLevel;
  let confidenceLevel = 0.85;
  
  // New thresholds with better differentiation between levels
  if (finalScore >= 90) {
    cefrLevel = 'C2';
    confidenceLevel = 0.90;
  } else if (finalScore >= 82) {
    cefrLevel = 'C1';
    confidenceLevel = 0.88;
  } else if (finalScore >= 74) {
    cefrLevel = 'B2';
    confidenceLevel = 0.85;
  } else if (finalScore >= 65) {
    cefrLevel = 'B1';
    confidenceLevel = 0.85;
  } else if (finalScore >= 55) {
    cefrLevel = 'A2';
    confidenceLevel = 0.85;
  } else {
    cefrLevel = 'A1';
    confidenceLevel = 0.90; // Higher confidence for very basic texts
  }

  // Apply stronger correction factors for text length to prevent overestimation
  if (words.length < 70) {
    // Significant downgrade for very short texts
    if (cefrLevel === 'C1' || cefrLevel === 'C2') {
      cefrLevel = words.length < 40 ? 'B1' : 'B2';
      confidenceLevel = 0.80;
    } else if (cefrLevel === 'B2') {
      cefrLevel = words.length < 50 ? 'B1' : 'B2';
      confidenceLevel = 0.80;
    } else if (cefrLevel === 'B1' && words.length < 30) {
      cefrLevel = 'A2';
      confidenceLevel = 0.85;
    }
  }
  
  // Even stronger correction for very short texts to detect A1 level
  if (words.length < 30 && (structureScores.a1 > (structureScores.a2 + structureScores.b1))) {
    cefrLevel = 'A1';
    confidenceLevel = 0.90;
  }
  
  // Apply a stronger penalty for very basic vocabulary (A1 detection)
  const basicWordCount = words.filter(w => {
    // Check if word is in the A1 lexical markers list
    return lexicalComplexityMarkers.A1.some(marker => w.includes(marker.toLowerCase()));
  }).length;
  
  // If most of the vocabulary is basic and the text is short
  if (words.length > 0 && (basicWordCount / words.length > 0.6) && words.length < 50) {
    if (cefrLevel === 'A2' || cefrLevel === 'B1') {
      cefrLevel = 'A1';
      confidenceLevel = 0.90;
    }
  }

  // Generate level-appropriate feedback
  const overviewMap: Record<CefrLevel, string[]> = {
    'A1': [
      'You can use very basic phrases and expressions',
      'You can introduce yourself and answer simple personal questions',
      'You have a limited vocabulary focused on common words'
    ],
    'A2': [
      'You can communicate in simple and routine tasks',
      'You can describe aspects of your background in simple terms',
      'You have a basic grasp of grammar structures and everyday vocabulary'
    ],
    'B1': [
      'You can deal with most situations likely to arise while traveling',
      'You can produce simple connected text on familiar topics',
      'You show reasonable accuracy in familiar contexts'
    ],
    'B2': [
      'You can interact with a degree of fluency and spontaneity',
      'You can write clear, detailed text on a wide range of subjects',
      'You demonstrate good control of grammatical structures'
    ],
    'C1': [
      'You can express ideas fluently and spontaneously',
      'You can use language flexibly and effectively for social and professional purposes',
      'You display a good command of complex language structures'
    ],
    'C2': [
      'You can express yourself spontaneously and with great fluency',
      'You can summarize information from different sources into a coherent presentation',
      'You show complete and consistent grammatical control of complex language'
    ]
  };

  const suggestionsMap: Record<CefrLevel, string[]> = {
    'A1': [
      'Practice basic everyday expressions and vocabulary',
      'Focus on simple present tense and basic question formation',
      'Work on building your vocabulary with simple, high-frequency words'
    ],
    'A2': [
      'Practice describing past experiences using simple past tense',
      'Expand your vocabulary on topics of immediate relevance',
      'Work on connecting sentences with basic conjunctions like "and", "but", and "because"'
    ],
    'B1': [
      'Practice expressing opinions and giving reasons',
      'Work on using a variety of tenses appropriately',
      'Expand your vocabulary related to work, school, and leisure'
    ],
    'B2': [
      'Practice expressing more nuanced opinions and arguments',
      'Work on more complex grammatical structures like conditionals',
      'Focus on developing clearer organization in longer texts'
    ],
    'C1': [
      'Focus on precision in expressing subtle differences in meaning',
      'Practice using idiomatic expressions naturally',
      'Work on adapting your language to different contexts and purposes'
    ],
    'C2': [
      'Refine your precision in expressing nuanced ideas',
      'Work on maintaining consistent tone and style in writing',
      'Focus on mastering specialized vocabulary in your field of interest'
    ]
  };

  // Formatted grammar errors for UI
  const formattedErrors = grammarErrors.map(error => error.description || `Grammar error (${error.level} level)`);

  return {
    score: finalScore,
    cefrLevel,
    overview: overviewMap[cefrLevel],
    grammarErrors: formattedErrors.length > 0 ? formattedErrors : [],
    suggestions: suggestionsMap[cefrLevel],
    confidenceLevel: Math.round(confidenceLevel * 100) / 100,
    sublevels: {
      vocabulary: vocabularyScore,
      grammar: grammarScore,
      coherence: coherenceScore,
      complexity: complexityScore,
      taskAchievement: taskAchievementScore
    }
  };
};
