
export interface CBCLearningAreas {
  [key: string]: string[];
}

export const CBC_LEARNING_AREAS: CBCLearningAreas = {
  // Pre-Primary (PP1 and PP2) - Ages 4-5
  'PP1': [
    'Language Activities',
    'Mathematics Activities', 
    'Creative Activities',
    'Environmental Activities',
    'Religious Activities',
    'Pastoral Programme of Instruction (PPI)'
  ],
  'PP2': [
    'Language Activities',
    'Mathematics Activities', 
    'Creative Activities',
    'Environmental Activities',
    'Religious Activities',
    'Pastoral Programme of Instruction (PPI)'
  ],
  
  // Lower Primary (Grades 1, 2, and 3) - Ages 6-8
  'Grade 1': [
    'Indigenous Language',
    'Kiswahili',
    'Mathematics',
    'English',
    'Religious Education',
    'Environmental Activities',
    'Creative Activities'
  ],
  'Grade 2': [
    'Indigenous Language',
    'Kiswahili',
    'Mathematics',
    'English',
    'Religious Education',
    'Environmental Activities',
    'Creative Activities'
  ],
  'Grade 3': [
    'Indigenous Language',
    'Kiswahili',
    'Mathematics',
    'English',
    'Religious Education',
    'Environmental Activities',
    'Creative Activities'
  ],
  
  // Upper Primary (Grades 4, 5, and 6) - Ages 9-11
  'Grade 4': [
    'English',
    'Mathematics',
    'Kiswahili',
    'Religious Education',
    'Agriculture and Nutrition',
    'Social Studies',
    'Creative Arts',
    'Science and Technology'
  ],
  'Grade 5': [
    'English',
    'Mathematics',
    'Kiswahili',
    'Religious Education',
    'Agriculture and Nutrition',
    'Social Studies',
    'Creative Arts',
    'Science and Technology'
  ],
  'Grade 6': [
    'English',
    'Mathematics',
    'Kiswahili',
    'Religious Education',
    'Agriculture and Nutrition',
    'Social Studies',
    'Creative Arts',
    'Science and Technology'
  ],
  
  // Junior Secondary (Grades 7, 8, and 9) - Ages 12-14
  'Grade 7': [
    'English',
    'Kiswahili',
    'Mathematics',
    'Integrated Science',
    'Pre-Technical Studies',
    'Agriculture',
    'Social Studies',
    'Creative Arts',
    'Religious Education'
  ],
  'Grade 8': [
    'English',
    'Kiswahili',
    'Mathematics',
    'Integrated Science',
    'Pre-Technical Studies',
    'Agriculture',
    'Social Studies',
    'Creative Arts',
    'Religious Education'
  ],
  'Grade 9': [
    'English',
    'Kiswahili',
    'Mathematics',
    'Integrated Science',
    'Pre-Technical Studies',
    'Agriculture',
    'Social Studies',
    'Creative Arts',
    'Religious Education'
  ],
  
  // Senior Secondary (Grades 10, 11, and 12) - Ages 15-17
  // Compulsory subjects for all pathways
  'Grade 10': [
    // Compulsory
    'English',
    'Kiswahili/Kenya Sign Language',
    'ICT Skills',
    'Physical Education',
    'Community Service Learning',
    
    // STEM Pathway
    'Mathematics',
    'Advanced Mathematics',
    'Biology',
    'Chemistry',
    'Physics',
    'General Science',
    'Computer Studies',
    'Agriculture',
    'Home Science',
    'Drawing and Design',
    'Aviation Technology',
    'Building and Construction',
    'Electrical Technology',
    'Metal Technology',
    'Power Mechanics',
    'Wood Technology',
    'Media Technology',
    'Marine and Fisheries Technology',
    
    // Social Sciences Pathway
    'Advanced English',
    'Literature in English',
    'Indigenous Languages',
    'Kiswahili Kipevu',
    'Fasihi ya Kiswahili',
    'Sign Language',
    'Arabic',
    'French',
    'German',
    'Mandarin Chinese',
    'History and Citizenship',
    'Geography',
    'Business Studies',
    'Christian Religious Education',
    'Islamic Religious Education',
    'Hindu Religious Education',
    
    // Arts and Sports Sciences Pathway
    'Sports and Recreation',
    'Music and Dance',
    'Theatre and Film',
    'Fine Arts'
  ],
  'Grade 11': [
    // Same as Grade 10 - pathway continues
    'English',
    'Kiswahili/Kenya Sign Language',
    'ICT Skills',
    'Physical Education',
    'Community Service Learning',
    'Mathematics',
    'Advanced Mathematics',
    'Biology',
    'Chemistry',
    'Physics',
    'General Science',
    'Computer Studies',
    'Agriculture',
    'Home Science',
    'Drawing and Design',
    'Aviation Technology',
    'Building and Construction',
    'Electrical Technology',
    'Metal Technology',
    'Power Mechanics',
    'Wood Technology',
    'Media Technology',
    'Marine and Fisheries Technology',
    'Advanced English',
    'Literature in English',
    'Indigenous Languages',
    'Kiswahili Kipevu',
    'Fasihi ya Kiswahili',
    'Sign Language',
    'Arabic',
    'French',
    'German',
    'Mandarin Chinese',
    'History and Citizenship',
    'Geography',
    'Business Studies',
    'Christian Religious Education',
    'Islamic Religious Education',
    'Hindu Religious Education',
    'Sports and Recreation',
    'Music and Dance',
    'Theatre and Film',
    'Fine Arts'
  ],
  'Grade 12': [
    // Same as Grade 10 & 11 - pathway continues
    'English',
    'Kiswahili/Kenya Sign Language',
    'ICT Skills',
    'Physical Education',
    'Community Service Learning',
    'Mathematics',
    'Advanced Mathematics',
    'Biology',
    'Chemistry',
    'Physics',
    'General Science',
    'Computer Studies',
    'Agriculture',
    'Home Science',
    'Drawing and Design',
    'Aviation Technology',
    'Building and Construction',
    'Electrical Technology',
    'Metal Technology',
    'Power Mechanics',
    'Wood Technology',
    'Media Technology',
    'Marine and Fisheries Technology',
    'Advanced English',
    'Literature in English',
    'Indigenous Languages',
    'Kiswahili Kipevu',
    'Fasihi ya Kiswahili',
    'Sign Language',
    'Arabic',
    'French',
    'German',
    'Mandarin Chinese',
    'History and Citizenship',
    'Geography',
    'Business Studies',
    'Christian Religious Education',
    'Islamic Religious Education',
    'Hindu Religious Education',
    'Sports and Recreation',
    'Music and Dance',
    'Theatre and Film',
    'Fine Arts'
  ]
};

export const ALL_GRADE_LEVELS = Object.keys(CBC_LEARNING_AREAS);

export const SENIOR_SECONDARY_PATHWAYS = {
  'STEM': [
    'Mathematics',
    'Advanced Mathematics',
    'Biology',
    'Chemistry',
    'Physics',
    'General Science',
    'Computer Studies',
    'Agriculture',
    'Home Science',
    'Drawing and Design',
    'Aviation Technology',
    'Building and Construction',
    'Electrical Technology',
    'Metal Technology',
    'Power Mechanics',
    'Wood Technology',
    'Media Technology',
    'Marine and Fisheries Technology'
  ],
  'Social Sciences': [
    'Advanced English',
    'Literature in English',
    'Indigenous Languages',
    'Kiswahili Kipevu',
    'Fasihi ya Kiswahili',
    'Sign Language',
    'Arabic',
    'French',
    'German',
    'Mandarin Chinese',
    'History and Citizenship',
    'Geography',
    'Business Studies',
    'Christian Religious Education',
    'Islamic Religious Education',
    'Hindu Religious Education'
  ],
  'Arts and Sports Sciences': [
    'Sports and Recreation',
    'Music and Dance',
    'Theatre and Film',
    'Fine Arts'
  ]
};

export const COMPULSORY_SENIOR_SUBJECTS = [
  'English',
  'Kiswahili/Kenya Sign Language',
  'ICT Skills',
  'Physical Education',
  'Community Service Learning'
];
