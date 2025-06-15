
export interface LessonPlan {
  id: number;
  // Header Information
  school?: string;
  level: string;
  learningArea: string;
  date?: string;
  time?: string;
  roll?: string;
  term?: string; // Added term field
  
  // Lesson Identification
  week: number;
  lessonNumber: number;
  title: string;
  
  // Content Structure
  strand: string;
  subStrand: string;
  specificLearningOutcomes: string[];
  coreCompetencies: string[]; // Added core competencies
  keyInquiryQuestion: string;
  learningResources: string[];
  
  // Organization of Learning
  introduction: {
    duration: string;
    activities: string[];
  };
  lessonDevelopment: {
    duration: string;
    steps: {
      stepNumber: number;
      activity: string;
      duration?: string;
    }[];
  };
  conclusion: {
    duration: string;
    activities: string[];
  };
  
  // Additional Sections
  extendedActivities: string[]; // Made required instead of optional
  assessment: string;
  teacherSelfEvaluation?: string;
  reflection?: string;
}

export interface SchemeOfWork {
  week: number;
  lesson: number;
  strand: string;
  subStrand: string;
  lessonLearningOutcome: string;
  learningExperiences: string;
  keyInquiryQuestion: string;
  learningResources: string;
  assessment: string;
  reflection?: string;
}

// Core Competencies mapping by learning area
export const CORE_COMPETENCIES_MAP: Record<string, string[]> = {
  'MATHEMATICS': [
    'Communication and collaboration',
    'Critical thinking and problem solving',
    'Creativity and imagination',
    'Learning to learn',
    'Self-efficacy'
  ],
  'ENGLISH': [
    'Communication and collaboration',
    'Critical thinking and problem solving',
    'Creativity and imagination',
    'Citizenship',
    'Learning to learn'
  ],
  'KISWAHILI': [
    'Communication and collaboration',
    'Critical thinking and problem solving',
    'Creativity and imagination',
    'Citizenship',
    'Learning to learn'
  ],
  'SCIENCE': [
    'Communication and collaboration',
    'Critical thinking and problem solving',
    'Creativity and imagination',
    'Learning to learn',
    'Self-efficacy'
  ],
  'SOCIAL STUDIES': [
    'Communication and collaboration',
    'Critical thinking and problem solving',
    'Citizenship',
    'Learning to learn',
    'Self-efficacy'
  ],
  'PHYSICAL EDUCATION': [
    'Communication and collaboration',
    'Self-efficacy',
    'Learning to learn',
    'Citizenship'
  ],
  'CREATIVE ARTS': [
    'Communication and collaboration',
    'Creativity and imagination',
    'Critical thinking and problem solving',
    'Self-efficacy'
  ],
  'PRE-TECHNICAL': [
    'Communication and collaboration',
    'Critical thinking and problem solving',
    'Creativity and imagination',
    'Learning to learn',
    'Self-efficacy'
  ],
  'TECHNOLOGY': [
    'Communication and collaboration',
    'Critical thinking and problem solving',
    'Creativity and imagination',
    'Learning to learn',
    'Self-efficacy'
  ],
  'CHRISTIAN RELIGIOUS EDUCATION': [
    'Communication and collaboration',
    'Citizenship',
    'Self-efficacy',
    'Learning to learn'
  ],
  'ISLAMIC RELIGIOUS EDUCATION': [
    'Communication and collaboration',
    'Citizenship',
    'Self-efficacy',
    'Learning to learn'
  ],
  'HINDU RELIGIOUS EDUCATION': [
    'Communication and collaboration',
    'Citizenship',
    'Self-efficacy',
    'Learning to learn'
  ]
};

// Helper function to get core competencies for a learning area
export const getCoreCompetencies = (learningArea: string): string[] => {
  const normalizedArea = learningArea.toUpperCase();
  return CORE_COMPETENCIES_MAP[normalizedArea] || [
    'Communication and collaboration',
    'Critical thinking and problem solving',
    'Learning to learn'
  ];
};
