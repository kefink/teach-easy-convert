from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import date
from typing import List, Optional
import urllib.parse
import PyPDF2
import io
import re
from docx import Document
import fitz  # PyMuPDF for better PDF parsing
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Database Configuration
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")

if not db_password or not db_host:
    raise ValueError("DB_PASSWORD and DB_HOST environment variables are not set")

# URL encode the password to handle special characters
password = urllib.parse.quote_plus(db_password)
DATABASE_URL = f"mysql+pymysql://root:{password}@{db_host}/lesson_plans_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLAlchemy Model
class DBLessonPlan(Base):
    __tablename__ = "lesson_plans"

    id = Column(Integer, primary_key=True, index=True)
    school = Column(String(255), index=True)
    level = Column(String(255))
    learning_area = Column(String(255))
    plan_date = Column(Date)
    roll = Column(String(255))
    term = Column(Integer)
    week = Column(Integer)
    lesson_number = Column(Integer)
    title = Column(String(255))
    strand = Column(String(255))
    sub_strand = Column(String(255))
    specific_learning_outcomes = Column(Text)
    core_competencies = Column(Text)
    key_inquiry_question = Column(Text)
    learning_resources = Column(Text)
    introduction_duration = Column(String(255))
    introduction_activities = Column(Text)
    development_duration = Column(String(255))
    development_steps = Column(Text)
    conclusion_duration = Column(String(255))
    conclusion_activities = Column(Text)
    extended_activities = Column(Text)
    assessment = Column(Text)
    teacher_self_evaluation = Column(Text)
    reflection = Column(Text)

# Create database tables
Base.metadata.create_all(bind=engine)

# Pydantic Schemas
class Introduction(BaseModel):
    duration: str
    activities: List[str]

class LessonDevelopmentStep(BaseModel):
    stepNumber: int
    activity: str
    duration: str

class LessonDevelopment(BaseModel):
    duration: str
    steps: List[LessonDevelopmentStep]

class LessonPlanBase(BaseModel):
    school: str
    level: str
    learningArea: str
    date: date
    roll: str
    term: int
    week: int
    lessonNumber: int
    title: str
    strand: str
    subStrand: str
    specificLearningOutcomes: List[str]
    coreCompetencies: List[str]
    keyInquiryQuestion: str
    learningResources: List[str]
    introduction: Introduction
    lessonDevelopment: LessonDevelopment
    conclusion: Introduction
    extendedActivities: List[str]
    assessment: str
    teacherSelfEvaluation: Optional[str] = None
    reflection: Optional[str] = None

class LessonPlanCreate(LessonPlanBase):
    pass

class LessonPlan(LessonPlanBase):
    id: int

    class Config:
        from_attributes = True

class ParsedSchemeResponse(BaseModel):
    success: bool
    message: str
    weeks_found: List[int]
    lesson_plans: List[dict]

class TextInput(BaseModel):
    text_content: str

# FastAPI App
app = FastAPI(title="Lesson Plan Generator API", version="1.0.0")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF using PyMuPDF (better for complex layouts)"""
    try:
        doc = fitz.open(stream=file_content, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text("text")
        doc.close()
        return text
    except Exception as e:
        # Fallback to PyPDF2
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text
        except Exception as e2:
            raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e2)}")

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc = Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text from DOCX: {str(e)}")

def parse_scheme_of_work(text: str) -> dict:
    try:
        # Enhanced patterns for week detection
        week_patterns = [
            r'WEEK\s*(\d+)', r'WK\s*(\d+)', r'W(\d+)', r'(\d+)\s*WEEK',
            r'^\s*(\d+)\s*[.\-:]', r'Week\s+(\d+)', r'week\s+(\d+)',
            r'TERM\s+\d+\s+WEEK\s+(\d+)', r'T\d+W(\d+)'
        ]
        
        # More comprehensive keyword mapping with variations
        keyword_map = {
            'lesson': ['lesson', 'lessons', 'lesson title', 'topic', 'lesson topic'],
            'strand': ['strand', 'theme', 'topic area', 'main topic', 'subject area', 'content area'],
            'sub_strand': ['sub-strand', 'sub strand', 'substrand', 'subtopic', 'sub-theme', 
                          'sub-topic', 'sub topic', 'specific topic', 'focus area'],
            'title': ['title', 'lesson title', 'topic title', 'subject', 'lesson name'],
            'specific_learning_outcomes': ['learning outcomes', 'specific learning', 'slo', 'objectives', 
                                         'learning objectives', 'expected outcomes', 'outcomes', 'goals'],
            'core_competencies': ['core competencies', 'competencies', 'core skills', 'skills', 
                                'key competencies', 'competency areas'],
            'key_inquiry_question': ['key inquiry', 'inquiry question', 'kiq', 'guiding question', 
                                   'essential question', 'inquiry questions'],
            'learning_resources': ['resources', 'materials', 'learning materials', 'references', 
                                 'teaching materials', 'learning resources', 'teaching aids'],
            'assessment': ['assessment', 'evaluation', 'assessment methods', 'assessment techniques', 
                         'evaluation methods', 'assessment strategies'],
            'reflection': ['reflection', 'self-reflection', 'teacher reflection', 'reflections'],
            'activities': ['activity', 'activities', 'introduction', 'development', 'conclusion', 
                         'learning experiences', 'procedure', 'teaching activities', 'learning activities']
        }

        lines = text.split('\n')
        weeks_found = []
        lesson_plans = []
        current_lesson_data = {}
        current_week = None
        current_section = None
        
        # Debug information
        print(f"DEBUG: Processing {len(lines)} lines of text")
        
        def save_current_lesson():
            if current_lesson_data and current_lesson_data.get('week'):
                # Handle title parsing for strand/sub_strand extraction
                title = current_lesson_data.get('title', '')
                if title and not current_lesson_data.get('strand'):
                    if ':' in title:
                        parts = title.split(':', 1)
                        current_lesson_data['strand'] = parts[0].strip()
                        current_lesson_data['sub_strand'] = parts[1].strip()
                    elif '-' in title:
                        parts = title.split('-', 1)
                        current_lesson_data['strand'] = parts[0].strip()
                        current_lesson_data['sub_strand'] = parts[1].strip()
                    else:
                        current_lesson_data['strand'] = title
                
                # Ensure we have at least some content
                if (current_lesson_data.get('strand') or 
                    current_lesson_data.get('title') or 
                    current_lesson_data.get('specific_learning_outcomes') or
                    current_lesson_data.get('activities')):
                    
                    # Set defaults for missing fields
                    if not current_lesson_data.get('sub_strand'):
                        current_lesson_data['sub_strand'] = 'N/A'
                    if not current_lesson_data.get('title'):
                        current_lesson_data['title'] = f"Week {current_lesson_data['week']} Lesson"
                    
                    lesson_plans.append(current_lesson_data.copy())
                    print(f"DEBUG: Saved lesson for week {current_lesson_data['week']}")

        # First pass: look for week patterns and collect all content
        week_content = {}
        current_week_lines = []
        
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue
            
            # Check for week pattern
            found_week = False
            for pattern in week_patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    # Save previous week's content
                    if current_week and current_week_lines:
                        week_content[current_week] = current_week_lines.copy()
                    
                    week_num = int(match.group(1))
                    if week_num not in weeks_found:
                        weeks_found.append(week_num)
                    current_week = week_num
                    current_week_lines = [line]
                    found_week = True
                    print(f"DEBUG: Found week {week_num}")
                    break
            
            if not found_week and current_week:
                current_week_lines.append(line)
        
        # Save the last week's content
        if current_week and current_week_lines:
            week_content[current_week] = current_week_lines.copy()

        # Second pass: parse each week's content
        for week_num in sorted(weeks_found):
            if week_num not in week_content:
                continue
                
            current_lesson_data = {
                'week': week_num,
                'lessonNumber': 1,
                'title': '', 'strand': '', 'sub_strand': '',
                'specific_learning_outcomes': [], 'core_competencies': [],
                'key_inquiry_question': '', 'learning_resources': [],
                'activities': [], 'assessment': '', 'reflection': ''
            }
            
            current_section = None
            week_lines = week_content[week_num]
            
            print(f"DEBUG: Processing week {week_num} with {len(week_lines)} lines")
            
            for line in week_lines:
                line = line.strip()
                if not line:
                    continue
                
                line_lower = line.lower()
                found_section = False
                
                # Check for section headers
                for section, keywords in keyword_map.items():
                    for keyword in keywords:
                        keyword_lower = keyword.lower()
                        
                        # Check various patterns
                        patterns_to_check = [
                            f'{keyword_lower}:',
                            f'{keyword_lower} :',
                            f'{keyword_lower}-',
                            f'{keyword_lower} -',
                        ]
                        
                        for pattern in patterns_to_check:
                            if pattern in line_lower:
                                current_section = section
                                # Extract content after the keyword
                                content = ""
                                if ':' in line:
                                    content = line.split(':', 1)[-1].strip()
                                elif '-' in line:
                                    content = line.split('-', 1)[-1].strip()
                                
                                if content:
                                    if isinstance(current_lesson_data[current_section], list):
                                        current_lesson_data[current_section].append(content)
                                    else:
                                        current_lesson_data[current_section] = content
                                
                                found_section = True
                                print(f"DEBUG: Found section '{section}' with content: '{content[:50]}...'")
                                break
                        
                        # Also check if line starts with keyword
                        if not found_section and line_lower.startswith(keyword_lower + ' '):
                            current_section = section
                            content = line[len(keyword):].strip()
                            if content:
                                if isinstance(current_lesson_data[current_section], list):
                                    current_lesson_data[current_section].append(content)
                                else:
                                    current_lesson_data[current_section] = content
                            found_section = True
                            print(f"DEBUG: Found section '{section}' starting with keyword")
                            break
                    
                    if found_section:
                        break
                
                # If no section found but we have a current section, add to it
                if not found_section and current_section and line:
                    # Skip if it looks like a new week number
                    skip_line = False
                    for pattern in week_patterns:
                        if re.search(pattern, line, re.IGNORECASE):
                            skip_line = True
                            break
                    
                    if not skip_line:
                        if isinstance(current_lesson_data[current_section], list):
                            current_lesson_data[current_section].append(line)
                        else:
                            current_lesson_data[current_section] += f" {line}"
                        print(f"DEBUG: Added to section '{current_section}': '{line[:30]}...'")
                
                # If no section is set yet, try to infer from content
                if not current_section and not found_section:
                    # If it's not a week header and contains meaningful content
                    if not any(re.search(pattern, line, re.IGNORECASE) for pattern in week_patterns):
                        if len(line) > 10:  # Reasonable content length
                            # Default to title if nothing else is set
                            if not current_lesson_data['title']:
                                current_lesson_data['title'] = line
                                print(f"DEBUG: Set title from content: '{line}'")
                            else:
                                # Add to activities as fallback
                                current_lesson_data['activities'].append(line)
                                print(f"DEBUG: Added to activities: '{line[:30]}...'")
            
            # Save this week's lesson
            save_current_lesson()

        print(f"DEBUG: Found {len(weeks_found)} weeks, created {len(lesson_plans)} lesson plans")

        if not weeks_found:
            return {'error': "No week numbers found. Please ensure your document contains week indicators like 'Week 1', 'Week 2', etc."}
        
        if not lesson_plans:
            # Provide more detailed error information
            debug_info = f"Weeks found: {weeks_found}. "
            if week_content:
                sample_content = list(week_content.values())[0][:3]  # First few lines of first week
                debug_info += f"Sample content: {sample_content}"
            
            return {'error': f"Found week numbers but could not parse lesson content. {debug_info}"}

        return {
            'weeks_found': sorted(weeks_found),
            'lesson_plans': lesson_plans,
            'total_weeks': len(weeks_found),
            'confidence': 1.0 if len(lesson_plans) > 0 else 0.5
        }
        
    except Exception as e:
        print(f"DEBUG: Exception occurred: {str(e)}")
        import traceback
        traceback.print_exc()
        return {'error': f'An unexpected error occurred during parsing: {str(e)}'}

@app.get("/")
def read_root():
    return {"message": "Lesson Plan Generator API is running!"}

@app.post("/parse-scheme/", response_model=ParsedSchemeResponse)
async def parse_scheme_file(file: UploadFile = File(...)):
    """Parse uploaded scheme of work file to extract lesson plan data"""
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")

        allowed_types = ['.pdf', '.docx', '.doc', '.txt']
        file_extension = file.filename.lower().split('.')[-1]

        if f'.{file_extension}' not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed types: {', '.join(allowed_types)}"
            )

        file_content = await file.read()
        if file_extension == 'pdf':
            text = extract_text_from_pdf(file_content)
        elif file_extension in ['docx', 'doc']:
            text = extract_text_from_docx(file_content)
        elif file_extension == 'txt':
            text = file_content.decode('utf-8')
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")

        parsed_data = parse_scheme_of_work(text)

        if 'error' in parsed_data:
            raise HTTPException(status_code=400, detail=parsed_data['error'])

        return ParsedSchemeResponse(
            success=True,
            message=f"Successfully parsed {parsed_data['total_weeks']} weeks of lesson plans",
            weeks_found=parsed_data['weeks_found'],
            lesson_plans=parsed_data['lesson_plans']
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.post("/parse-text/", response_model=ParsedSchemeResponse)
async def parse_text_input(text_input: TextInput):
    """Parse text content to extract lesson plan data"""
    try:
        parsed_data = parse_scheme_of_work(text_input.text_content)
        if 'error' in parsed_data:
            raise HTTPException(status_code=400, detail=parsed_data['error'])
            
        return ParsedSchemeResponse(
            success=True,
            message=f"Successfully parsed {parsed_data['total_weeks']} weeks of lesson plans",
            weeks_found=parsed_data['weeks_found'],
            lesson_plans=parsed_data['lesson_plans']
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse text: {str(e)}")

@app.post("/debug-parse-scheme/")
async def debug_parse_scheme_file(file: UploadFile = File(...)):
    """Debug version of parse scheme file to see what's happening"""
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")

        allowed_types = ['.pdf', '.docx', '.doc', '.txt']
        file_extension = file.filename.lower().split('.')[-1]

        if f'.{file_extension}' not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed types: {', '.join(allowed_types)}"
            )

        file_content = await file.read()
        
        # Extract text based on file type
        if file_extension == 'pdf':
            text = extract_text_from_pdf(file_content)
        elif file_extension in ['docx', 'doc']:
            text = extract_text_from_docx(file_content)
        elif file_extension == 'txt':
            text = file_content.decode('utf-8')
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")

        # Return debug information
        lines = text.split('\n')
        non_empty_lines = [line.strip() for line in lines if line.strip()]
        
        # Check for week patterns
        week_patterns = [
            r'WEEK\s*(\d+)', r'WK\s*(\d+)', r'W(\d+)', r'(\d+)\s*WEEK',
            r'^\s*(\d+)\s*[.\-:]', r'Week\s+(\d+)', r'week\s+(\d+)',
        ]
        
        weeks_found = []
        week_lines = []
        
        for i, line in enumerate(non_empty_lines[:50]):  # First 50 lines for debug
            for pattern in week_patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    week_num = int(match.group(1))
                    weeks_found.append(week_num)
                    week_lines.append(f"Line {i+1}: {line}")
                    break
        
        # Look for potential keywords
        keyword_counts = {}
        keywords_to_check = ['strand', 'sub-strand', 'title', 'objective', 'outcome', 'resource', 'activity', 'assessment']
        
        for keyword in keywords_to_check:
            count = sum(1 for line in non_empty_lines if keyword.lower() in line.lower())
            keyword_counts[keyword] = count
        
        return {
            "filename": file.filename,
            "total_characters": len(text),
            "total_lines": len(lines),
            "non_empty_lines": len(non_empty_lines),
            "first_20_lines": non_empty_lines[:20],
            "weeks_found": list(set(weeks_found)),
            "week_lines": week_lines,
            "keyword_counts": keyword_counts,
            "sample_text": text[:1000] + "..." if len(text) > 1000 else text
        }
        
    except Exception as e:
        return {"error": str(e), "traceback": str(e.__traceback__)}

@app.post("/debug-parse-text/")
async def debug_parse_text_input(text_input: TextInput):
    """Debug version of parse text input"""
    try:
        text = text_input.text_content
        lines = text.split('\n')
        non_empty_lines = [line.strip() for line in lines if line.strip()]
        
        # Check for week patterns
        week_patterns = [
            r'WEEK\s*(\d+)', r'WK\s*(\d+)', r'W(\d+)', r'(\d+)\s*WEEK',
            r'^\s*(\d+)\s*[.\-:]', r'Week\s+(\d+)', r'week\s+(\d+)',
        ]
        
        weeks_found = []
        week_lines = []
        
        for i, line in enumerate(non_empty_lines):
            for pattern in week_patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    week_num = int(match.group(1))
                    weeks_found.append(week_num)
                    week_lines.append(f"Line {i+1}: {line}")
                    break
        
        # Look for potential keywords
        keyword_counts = {}
        keywords_to_check = ['strand', 'sub-strand', 'title', 'objective', 'outcome', 'resource', 'activity', 'assessment']
        
        for keyword in keywords_to_check:
            count = sum(1 for line in non_empty_lines if keyword.lower() in line.lower())
            keyword_counts[keyword] = count
        
        return {
            "total_characters": len(text),
            "total_lines": len(lines),
            "non_empty_lines": len(non_empty_lines),
            "first_20_lines": non_empty_lines[:20],
            "weeks_found": list(set(weeks_found)),
            "week_lines": week_lines,
            "keyword_counts": keyword_counts,
            "sample_text": text[:1000] + "..." if len(text) > 1000 else text
        }
        
    except Exception as e:
        return {"error": str(e)}

@app.post("/lesson-plans/", response_model=LessonPlan)
def create_lesson_plan(lesson_plan: LessonPlanCreate, db: Session = Depends(get_db)):
    db_lesson_plan = DBLessonPlan(
        school=lesson_plan.school,
        level=lesson_plan.level,
        learning_area=lesson_plan.learningArea,
        plan_date=lesson_plan.date,
        roll=lesson_plan.roll,
        term=lesson_plan.term,
        week=lesson_plan.week,
        lesson_number=lesson_plan.lessonNumber,
        title=lesson_plan.title,
        strand=lesson_plan.strand,
        sub_strand=lesson_plan.subStrand,
        specific_learning_outcomes="\n".join(lesson_plan.specificLearningOutcomes),
        core_competencies="\n".join(lesson_plan.coreCompetencies),
        key_inquiry_question=lesson_plan.keyInquiryQuestion,
        learning_resources="\n".join(lesson_plan.learningResources),
        introduction_duration=lesson_plan.introduction.duration,
        introduction_activities="\n".join(lesson_plan.introduction.activities),
        development_duration=lesson_plan.lessonDevelopment.duration,
        development_steps="\n".join([f"{step.stepNumber}. {step.activity} ({step.duration})" for step in lesson_plan.lessonDevelopment.steps]),
        conclusion_duration=lesson_plan.conclusion.duration,
        conclusion_activities="\n".join(lesson_plan.conclusion.activities),
        extended_activities="\n".join(lesson_plan.extendedActivities),
        assessment=lesson_plan.assessment,
        teacher_self_evaluation=lesson_plan.teacherSelfEvaluation,
        reflection=lesson_plan.reflection,
    )
    db.add(db_lesson_plan)
    db.commit()
    db.refresh(db_lesson_plan)
    return db_lesson_plan

@app.get("/lesson-plans/", response_model=List[LessonPlan])
def read_lesson_plans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    lesson_plans = db.query(DBLessonPlan).offset(skip).limit(limit).all()
    result = []
    for lp in lesson_plans:
        development_steps = []
        if lp.development_steps:
            for step_str in lp.development_steps.split("\n"):
                if step_str.strip():
                    try:
                        parts = step_str.split('. ', 1)
                        if len(parts) == 2:
                            step_num = int(parts[0])
                            activity_duration = parts[1]
                            if '(' in activity_duration and activity_duration.endswith(')'):
                                activity = activity_duration.rsplit('(', 1)[0].strip()
                                duration = activity_duration.rsplit('(', 1)[1][:-1]
                            else:
                                activity = activity_duration
                                duration = ""
                            development_steps.append(LessonDevelopmentStep(
                                stepNumber=step_num,
                                activity=activity,
                                duration=duration
                            ))
                    except (ValueError, IndexError):
                        continue

        lesson_plan_dict = {
            "id": lp.id,
            "school": lp.school,
            "level": lp.level,
            "learningArea": lp.learning_area,
            "date": lp.plan_date,
            "roll": lp.roll,
            "term": lp.term,
            "week": lp.week,
            "lessonNumber": lp.lesson_number,
            "title": lp.title,
            "strand": lp.strand,
            "subStrand": lp.sub_strand,
            "specificLearningOutcomes": lp.specific_learning_outcomes.split("\n") if lp.specific_learning_outcomes else [],
            "coreCompetencies": lp.core_competencies.split("\n") if lp.core_competencies else [],
            "keyInquiryQuestion": lp.key_inquiry_question,
            "learningResources": lp.learning_resources.split("\n") if lp.learning_resources else [],
            "introduction": {
                "duration": lp.introduction_duration,
                "activities": lp.introduction_activities.split("\n") if lp.introduction_activities else []
            },
            "lessonDevelopment": {
                "duration": lp.development_duration,
                "steps": development_steps
            },
            "conclusion": {
                "duration": lp.conclusion_duration,
                "activities": lp.conclusion_activities.split("\n") if lp.conclusion_activities else []
            },
            "extendedActivities": lp.extended_activities.split("\n") if lp.extended_activities else [],
            "assessment": lp.assessment,
            "teacherSelfEvaluation": lp.teacher_self_evaluation,
            "reflection": lp.reflection
        }
        result.append(LessonPlan(**lesson_plan_dict))

    return result

@app.get("/lesson-plans/{lesson_plan_id}", response_model=LessonPlan)
def read_lesson_plan(lesson_plan_id: int, db: Session = Depends(get_db)):
    lp = db.query(DBLessonPlan).filter(DBLessonPlan.id == lesson_plan_id).first()
    if lp is None:
        raise HTTPException(status_code=404, detail="Lesson plan not found")

    development_steps = []
    if lp.development_steps:
        for step_str in lp.development_steps.split("\n"):
            if step_str.strip():
                try:
                    parts = step_str.split('. ', 1)
                    if len(parts) == 2:
                        step_num = int(parts[0])
                        activity_duration = parts[1]
                        if '(' in activity_duration and activity_duration.endswith(')'):
                            activity = activity_duration.rsplit('(', 1)[0].strip()
                            duration = activity_duration.rsplit('(', 1)[1][:-1]
                        else:
                            activity = activity_duration
                            duration = ""
                        development_steps.append(LessonDevelopmentStep(
                            stepNumber=step_num,
                            activity=activity,
                            duration=duration
                        ))
                except (ValueError, IndexError):
                    continue

    lesson_plan_dict = {
        "id": lp.id,
        "school": lp.school,
        "level": lp.level,
        "learningArea": lp.learning_area,
        "date": lp.plan_date,
        "roll": lp.roll,
        "term": lp.term,
        "week": lp.week,
        "lessonNumber": lp.lesson_number,
        "title": lp.title,
        "strand": lp.strand,
        "subStrand": lp.sub_strand,
        "specificLearningOutcomes": lp.specific_learning_outcomes.split("\n") if lp.specific_learning_outcomes else [],
        "coreCompetencies": lp.core_competencies.split("\n") if lp.core_competencies else [],
        "keyInquiryQuestion": lp.key_inquiry_question,
        "learningResources": lp.learning_resources.split("\n") if lp.learning_resources else [],
        "introduction": {
            "duration": lp.introduction_duration,
            "activities": lp.introduction_activities.split("\n") if lp.introduction_activities else []
        },
        "lessonDevelopment": {
            "duration": lp.development_duration,
            "steps": development_steps
        },
        "conclusion": {
            "duration": lp.conclusion_duration,
            "activities": lp.conclusion_activities.split("\n") if lp.conclusion_activities else []
        },
        "extendedActivities": lp.extended_activities.split("\n") if lp.extended_activities else [],
        "assessment": lp.assessment,
        "teacherSelfEvaluation": lp.teacher_self_evaluation,
        "reflection": lp.reflection
    }

    return LessonPlan(**lesson_plan_dict)

@app.delete("/lesson-plans/{lesson_plan_id}")
def delete_lesson_plan(lesson_plan_id: int, db: Session = Depends(get_db)):
    lesson_plan = db.query(DBLessonPlan).filter(DBLessonPlan.id == lesson_plan_id).first()
    if lesson_plan is None:
        raise HTTPException(status_code=404, detail="Lesson plan not found")

    db.delete(lesson_plan)
    db.commit()
    return {"message": "Lesson plan deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)