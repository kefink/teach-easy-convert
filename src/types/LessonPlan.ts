
export interface LessonPlan {
  id: number;
  // Header Information
  school?: string;
  level: string;
  learningArea: string;
  date?: string;
  time?: string;
  roll?: string;
  
  // Lesson Identification
  week: number;
  lessonNumber: number;
  title: string;
  
  // Content Structure
  strand: string;
  subStrand: string;
  specificLearningOutcomes: string[];
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
  extendedActivities?: string[];
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
