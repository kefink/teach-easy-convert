
import { SchemeOfWork } from '@/types/LessonPlan';

export interface ParsedSchemeData {
  title: string;
  teacherName?: string;
  school?: string;
  grade?: string;
  term?: string;
  year?: string;
  learningArea?: string;
  weeks: SchemeOfWork[];
}

export interface ParsingResult {
  success: boolean;
  data: ParsedSchemeData | null;
  errors: string[];
  warnings: string[];
}

export class SchemeParser {
  private static readonly GRADE_PATTERNS = [
    /grade\s*(\d+)/i,
    /class\s*(\d+)/i,
    /standard\s*(\d+)/i,
    /form\s*(\d+)/i,
    /pp[12]/i
  ];

  private static readonly TERM_PATTERNS = [
    /term\s*([123])/i,
    /semester\s*([12])/i
  ];

  private static readonly YEAR_PATTERNS = [
    /(\d{4})/,
    /20[0-9]{2}/
  ];

  private static readonly WEEK_PATTERNS = [
    /week\s*(\d+)/i,
    /wk\s*(\d+)/i,
    /^(\d+)$/
  ];

  private static readonly LESSON_PATTERNS = [
    /lesson\s*(\d+)/i,
    /period\s*(\d+)/i,
    /^(\d+)$/
  ];

  private static readonly LEARNING_OUTCOME_PATTERNS = [
    /by\s+the\s+end\s+of.*?learner.*?should\s+be\s+able\s+to/i,
    /learning\s+outcome[s]?\s*:?/i,
    /specific\s+learning\s+outcome[s]?\s*:?/i,
    /learner[s]?\s+should\s+be\s+able\s+to/i
  ];

  private static readonly ASSESSMENT_PATTERNS = [
    /assessment\s*:?/i,
    /evaluation\s*:?/i,
    /oral\s+questions?/i,
    /written\s+exercise/i,
    /observation/i,
    /practical\s+work/i,
    /group\s+work/i,
    /individual\s+work/i
  ];

  private static readonly RESOURCE_PATTERNS = [
    /learning\s+resources?\s*:?/i,
    /resources?\s*:?/i,
    /materials?\s*:?/i,
    /textbook[s]?\s*:?/i,
    /reference[s]?\s*:?/i
  ];

  static parse(content: string): ParsingResult {
    const result: ParsingResult = {
      success: false,
      data: null,
      errors: [],
      warnings: []
    };

    try {
      // Clean and normalize content
      const normalizedContent = this.normalizeContent(content);
      
      // Extract header information
      const headerInfo = this.extractHeaderInfo(normalizedContent);
      
      // Parse table structure or text structure
      const weeks = this.parseWeeksData(normalizedContent);
      
      if (weeks.length === 0) {
        result.errors.push('No valid week data found in the scheme');
        return result;
      }

      result.data = {
        ...headerInfo,
        weeks: weeks
      };
      
      result.success = true;
      
      // Add warnings for missing information
      if (!headerInfo.grade) {
        result.warnings.push('Grade level not detected - please verify manually');
      }
      if (!headerInfo.term) {
        result.warnings.push('Term not detected - please verify manually');
      }
      if (!headerInfo.learningArea) {
        result.warnings.push('Learning area not clearly identified - please verify manually');
      }

    } catch (error) {
      result.errors.push(`Parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  private static normalizeContent(content: string): string {
    return content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static extractHeaderInfo(content: string): Omit<ParsedSchemeData, 'weeks'> {
    const lines = content.split('\n').slice(0, 10); // Check first 10 lines for header info
    const headerText = lines.join(' ').toLowerCase();

    const info: Omit<ParsedSchemeData, 'weeks'> = {
      title: '',
      teacherName: undefined,
      school: undefined,
      grade: undefined,
      term: undefined,
      year: undefined,
      learningArea: undefined
    };

    // Extract title (usually the first meaningful line)
    const titleLine = lines.find(line => line.trim().length > 10);
    if (titleLine) {
      info.title = titleLine.trim();
    }

    // Extract grade
    for (const pattern of this.GRADE_PATTERNS) {
      const match = headerText.match(pattern);
      if (match) {
        info.grade = match[1] ? `Grade ${match[1]}` : match[0].toUpperCase();
        break;
      }
    }

    // Extract term
    for (const pattern of this.TERM_PATTERNS) {
      const match = headerText.match(pattern);
      if (match) {
        info.term = match[1];
        break;
      }
    }

    // Extract year
    for (const pattern of this.YEAR_PATTERNS) {
      const match = headerText.match(pattern);
      if (match) {
        info.year = match[0];
        break;
      }
    }

    // Extract learning area from title
    const subjects = [
      'mathematics', 'english', 'kiswahili', 'science', 'social studies',
      'creative arts', 'agriculture', 'religious education', 'pre-technical',
      'integrated science', 'business studies', 'computer studies'
    ];
    
    for (const subject of subjects) {
      if (headerText.includes(subject)) {
        info.learningArea = subject.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        break;
      }
    }

    // Extract teacher name (look for patterns like "Teacher: Name" or "By: Name")
    const teacherMatch = headerText.match(/(?:teacher|by|prepared\s+by)\s*:?\s*([a-zA-Z\s]+)/i);
    if (teacherMatch) {
      info.teacherName = teacherMatch[1].trim();
    }

    // Extract school name (look for "school" keyword)
    const schoolMatch = headerText.match(/([a-zA-Z\s]+school[a-zA-Z\s]*)/i);
    if (schoolMatch) {
      info.school = schoolMatch[1].trim();
    }

    return info;
  }

  private static parseWeeksData(content: string): SchemeOfWork[] {
    const weeks: SchemeOfWork[] = [];
    
    // Try to parse as table structure first
    const tableWeeks = this.parseTableStructure(content);
    if (tableWeeks.length > 0) {
      return tableWeeks;
    }

    // Fall back to text parsing
    return this.parseTextStructure(content);
  }

  private static parseTableStructure(content: string): SchemeOfWork[] {
    const weeks: SchemeOfWork[] = [];
    const lines = content.split('\n');
    
    let currentWeek: Partial<SchemeOfWork> = {};
    let inDataRow = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Skip header rows
      if (line.toLowerCase().includes('week') && line.toLowerCase().includes('lesson')) {
        inDataRow = true;
        continue;
      }

      if (!inDataRow) continue;

      // Try to parse as table row (assuming tab or multiple spaces as separators)
      const cells = line.split(/\t+|\s{2,}/).filter(cell => cell.trim());
      
      if (cells.length >= 6) { // Minimum expected columns
        const week: SchemeOfWork = {
          week: this.parseWeekNumber(cells[0]) || 1,
          lesson: this.parseLessonNumber(cells[1]) || 1,
          strand: cells[2] || '',
          subStrand: cells[3] || '',
          lessonLearningOutcome: this.extractLearningOutcome(cells[4]) || '',
          learningExperiences: cells[5] || '',
          keyInquiryQuestion: cells[6] || '',
          learningResources: cells[7] || '',
          assessment: cells[8] || '',
          reflection: cells[9] || undefined
        };
        
        if (week.strand && week.subStrand) {
          weeks.push(week);
        }
      }
    }

    return weeks;
  }

  private static parseTextStructure(content: string): SchemeOfWork[] {
    const weeks: SchemeOfWork[] = [];
    const sections = content.split(/(?=week\s+\d+)/i);
    
    sections.forEach((section, index) => {
      if (section.trim().length < 20) return; // Skip very short sections
      
      const week = this.parseWeekSection(section, index + 1);
      if (week) {
        weeks.push(week);
      }
    });

    return weeks;
  }

  private static parseWeekSection(section: string, defaultWeek: number): SchemeOfWork | null {
    const lines = section.split('\n').map(line => line.trim()).filter(line => line);
    
    const week: Partial<SchemeOfWork> = {
      week: defaultWeek,
      lesson: 1
    };

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Extract week number
      const weekMatch = this.parseWeekNumber(line);
      if (weekMatch) week.week = weekMatch;
      
      // Extract lesson number
      const lessonMatch = this.parseLessonNumber(line);
      if (lessonMatch) week.lesson = lessonMatch;
      
      // Extract strand
      if (lowerLine.includes('strand') && !lowerLine.includes('sub')) {
        week.strand = line.replace(/strand\s*:?\s*/i, '').trim();
      }
      
      // Extract sub-strand
      if (lowerLine.includes('sub') && lowerLine.includes('strand')) {
        week.subStrand = line.replace(/sub\s*strand\s*:?\s*/i, '').trim();
      }
      
      // Extract learning outcome
      if (this.LEARNING_OUTCOME_PATTERNS.some(pattern => pattern.test(lowerLine))) {
        week.lessonLearningOutcome = this.extractLearningOutcome(line) || '';
      }
      
      // Extract learning experiences
      if (lowerLine.includes('learning experience') || lowerLine.includes('activities')) {
        week.learningExperiences = line.replace(/learning\s+experience[s]?\s*:?\s*/i, '').trim();
      }
      
      // Extract key inquiry question
      if (lowerLine.includes('key inquiry') || lowerLine.includes('inquiry question')) {
        week.keyInquiryQuestion = line.replace(/key\s+inquiry\s+question[s]?\s*:?\s*/i, '').trim();
      }
      
      // Extract resources
      if (this.RESOURCE_PATTERNS.some(pattern => pattern.test(lowerLine))) {
        week.learningResources = line.replace(/(?:learning\s+)?resources?\s*:?\s*/i, '').trim();
      }
      
      // Extract assessment
      if (this.ASSESSMENT_PATTERNS.some(pattern => pattern.test(lowerLine))) {
        week.assessment = line.replace(/assessment\s*:?\s*/i, '').trim();
      }
      
      // Extract reflection
      if (lowerLine.includes('reflection') || lowerLine.includes('remark')) {
        week.reflection = line.replace(/(?:reflection|remark)[s]?\s*:?\s*/i, '').trim();
      }
    }

    // Validate required fields
    if (week.strand && week.subStrand && week.lessonLearningOutcome) {
      return week as SchemeOfWork;
    }

    return null;
  }

  private static parseWeekNumber(text: string): number | null {
    for (const pattern of this.WEEK_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        const num = parseInt(match[1] || match[0]);
        if (!isNaN(num) && num > 0 && num <= 15) { // Reasonable week range
          return num;
        }
      }
    }
    return null;
  }

  private static parseLessonNumber(text: string): number | null {
    for (const pattern of this.LESSON_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        const num = parseInt(match[1] || match[0]);
        if (!isNaN(num) && num > 0 && num <= 10) { // Reasonable lesson range
          return num;
        }
      }
    }
    return null;
  }

  private static extractLearningOutcome(text: string): string | null {
    // Clean up learning outcome text
    let outcome = text
      .replace(/specific\s+learning\s+outcome[s]?\s*:?\s*/i, '')
      .replace(/learning\s+outcome[s]?\s*:?\s*/i, '')
      .replace(/by\s+the\s+end\s+of.*?learner/i, 'Learner')
      .trim();
    
    if (outcome.length > 10) {
      return outcome;
    }
    
    return null;
  }
}
