"""
Enhanced Scheme of Work Parser with robust handling for various formats
"""
import re
import fitz  # PyMuPDF
from typing import Dict, List, Tuple, Optional
import logging

class EnhancedSchemeParser:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # Enhanced column patterns - more flexible matching
        self.column_patterns = {
            'week': [
                r'week\s*(\d+)', r'wk\s*(\d+)', r'w(\d+)', r'week:?\s*(\d+)',
                r'^\s*(\d+)\s*$', r'week\s+(\d+)', r'(\d+)\s*week'
            ],
            'lesson': [
                r'lesson\s*(\d+)', r'lsn\s*(\d+)', r'l(\d+)', r'lesson:?\s*(\d+)',
                r'period\s*(\d+)', r'lesson\s+(\d+)', r'(\d+)\s*lesson'
            ],
            'strand': [
                r'strand[s]?[:\-]?\s*(.+)', r'theme[s]?[:\-]?\s*(.+)', 
                r'topic[s]?[:\-]?\s*(.+)', r'main\s+topic[s]?[:\-]?\s*(.+)',
                r'subject\s+area[s]?[:\-]?\s*(.+)', r'content\s+area[s]?[:\-]?\s*(.+)'
            ],
            'sub_strand': [
                r'sub[\-\s]*strand[s]?[:\-]?\s*(.+)', r'sub[\-\s]*topic[s]?[:\-]?\s*(.+)',
                r'sub[\-\s]*theme[s]?[:\-]?\s*(.+)', r'substrand[s]?[:\-]?\s*(.+)',
                r'specific\s+topic[s]?[:\-]?\s*(.+)', r'focus\s+area[s]?[:\-]?\s*(.+)'
            ],
            'learning_outcomes': [
                r'specific\s+learning\s+outcome[s]?[:\-]?\s*(.+)',
                r'learning\s+outcome[s]?[:\-]?\s*(.+)', 
                r'objective[s]?[:\-]?\s*(.+)', r'slo[:\-]?\s*(.+)',
                r'expected\s+outcome[s]?[:\-]?\s*(.+)', r'goal[s]?[:\-]?\s*(.+)',
                r'by\s+the\s+end\s+of\s+the\s+lesson[,\s]*(.+)'
            ],
            'learning_experiences': [
                r'learning\s+experience[s]?[:\-]?\s*(.+)',
                r'learning[\s/]+teaching\s+experience[s]?[:\-]?\s*(.+)',
                r'activit(?:y|ies)[:\-]?\s*(.+)', r'procedure[s]?[:\-]?\s*(.+)',
                r'teaching\s+activit(?:y|ies)[:\-]?\s*(.+)',
                r'learning\s+activit(?:y|ies)[:\-]?\s*(.+)'
            ],
            'key_inquiry_questions': [
                r'key\s+inquiry\s+question[s]?[:\-]?\s*(.+)',
                r'inquiry\s+question[s]?[:\-]?\s*(.+)', 
                r'kiq[:\-]?\s*(.+)', r'guiding\s+question[s]?[:\-]?\s*(.+)',
                r'essential\s+question[s]?[:\-]?\s*(.+)'
            ],
            'learning_resources': [
                r'learning\s+resource[s]?[:\-]?\s*(.+)',
                r'resource[s]?[:\-]?\s*(.+)', r'material[s]?[:\-]?\s*(.+)',
                r'learning\s+material[s]?[:\-]?\s*(.+)',
                r'teaching\s+material[s]?[:\-]?\s*(.+)',
                r'teaching\s+aid[s]?[:\-]?\s*(.+)', r'reference[s]?[:\-]?\s*(.+)'
            ],
            'assessment': [
                r'assessment[:\-]?\s*(.+)', r'evaluation[:\-]?\s*(.+)',
                r'assessment\s+method[s]?[:\-]?\s*(.+)',
                r'assessment\s+technique[s]?[:\-]?\s*(.+)',
                r'evaluation\s+method[s]?[:\-]?\s*(.+)'
            ],
            'reflection': [
                r'reflection[s]?[:\-]?\s*(.+)', r'self[\-\s]*reflection[s]?[:\-]?\s*(.+)',
                r'teacher\s+reflection[s]?[:\-]?\s*(.+)', r'remark[s]?[:\-]?\s*(.+)'
            ]
        }
        
        # Enhanced CBC-specific strand patterns
        self.cbc_strand_patterns = {
            # Mathematics strands
            'numbers': r'(?:numbers?|number\s+concepts?|numeration|counting|place\s+value)',
            'geometry': r'(?:geometry|shapes?|spatial|3d|2d|geometric|space)',
            'measurement': r'(?:measurement|measuring|length|mass|time|capacity|volume)',
            'data': r'(?:data|statistics|graphs?|charts?|probability)',
            'algebra': r'(?:algebra|patterns?|equations?|expressions?)',
            'money': r'(?:money|currency|coins?|notes?|buying|selling)',
            
            # Science strands
            'living_things': r'(?:living\s+things?|life|biology|plants?|animals?|human\s+body|organisms?)',
            'non_living': r'(?:non[\-\s]*living|matter|materials?|substances?|physics)',
            'energy': r'(?:energy|force|motion|electricity|magnetism|heat|light|sound)',
            'environment': r'(?:environment|ecology|conservation|pollution|weather|climate)',
            'health': r'(?:health|hygiene|nutrition|disease|safety|first\s+aid)',
            
            # Language strands
            'listening': r'(?:listening|listening\s+skills?|comprehension)',
            'speaking': r'(?:speaking|oral|conversation|presentation)',
            'reading': r'(?:reading|literacy|comprehension|phonics)',
            'writing': r'(?:writing|composition|spelling|grammar|handwriting)',
            
            # Social Studies strands
            'history': r'(?:history|historical|past|heritage|culture)',
            'geography': r'(?:geography|maps?|location|physical\s+features?)',
            'citizenship': r'(?:citizenship|civic|government|rights|responsibilities)',
            'economics': r'(?:economics?|trade|resources?|production)',
            
            # Creative Arts strands
            'visual_arts': r'(?:visual\s+arts?|drawing|painting|crafts?|art)',
            'performing_arts': r'(?:performing\s+arts?|music|dance|drama|theatre)',
            'digital_arts': r'(?:digital\s+arts?|computer\s+arts?|multimedia)',
            
            # ICT strands
            'computing': r'(?:computing|computer|ict|technology|digital)',
            'programming': r'(?:programming|coding|algorithms?|software)',
            'internet': r'(?:internet|web|online|networking)',
            
            # Physical Education strands
            'motor_skills': r'(?:motor\s+skills?|movement|coordination|balance)',
            'games': r'(?:games?|sports?|athletics|competition)',
            'fitness': r'(?:fitness|exercise|physical\s+activity)',
            
            # Religious Education strands
            'beliefs': r'(?:beliefs?|faith|doctrine|teachings?)',
            'practices': r'(?:practices?|worship|prayer|rituals?)',
            'values': r'(?:values?|morals?|ethics?|character)',
        }
        
        # Common separators and indicators
        self.separators = ['|', '\t', '  ', '   ', '    ']
        self.bullet_points = ['•', '○', '▪', '-', '*', '→', '◦']
        
    def extract_text_from_pdf(self, file_content: bytes) -> str:
        """Enhanced PDF text extraction with layout preservation"""
        try:
            doc = fitz.open(stream=file_content, filetype="pdf")
            full_text = ""
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                
                # Try to preserve table structure
                text_dict = page.get_text("dict")
                blocks = text_dict.get("blocks", [])
                
                page_text = ""
                for block in blocks:
                    if "lines" in block:
                        for line in block["lines"]:
                            line_text = ""
                            for span in line["spans"]:
                                line_text += span.get("text", "")
                            if line_text.strip():
                                page_text += line_text + "\n"
                
                # Fallback to simple text extraction if dict method fails
                if not page_text.strip():
                    page_text = page.get_text("text")
                
                full_text += f"--- PAGE {page_num + 1} ---\n" + page_text + "\n"
                
            doc.close()
            return full_text
            
        except Exception as e:
            self.logger.error(f"PDF extraction error: {e}")
            raise Exception(f"Failed to extract text from PDF: {str(e)}")
    
    def detect_table_structure(self, text: str) -> Dict[str, List[str]]:
        """Detect if content is in table format and extract column headers"""
        lines = text.split('\n')
        
        # Look for header patterns - more flexible approach
        potential_headers = []
        
        # Look for lines that contain multiple key column indicators
        header_indicators = [
            'week', 'lesson', 'strand', 'sub-strand', 'learning', 'outcome', 
            'experience', 'inquiry', 'question', 'resource', 'assessment', 'method'
        ]
        
        for i, line in enumerate(lines[:30]):  # Check first 30 lines for headers
            line = line.strip().lower()
            if not line:
                continue
            
            # Count how many header indicators are in this line
            indicator_count = sum(1 for indicator in header_indicators if indicator in line)
            
            if indicator_count >= 4:  # If line contains multiple indicators, likely a header
                # Try different splitting strategies
                original_line = lines[i].strip()
                
                # Strategy 1: Split by multiple spaces
                if '  ' in original_line:
                    columns = [col.strip() for col in original_line.split('  ') if col.strip()]
                    if len(columns) >= 4:
                        potential_headers.append((i, columns, '  '))
                
                # Strategy 2: Look for tab characters
                if '\t' in original_line:
                    columns = [col.strip() for col in original_line.split('\t') if col.strip()]
                    if len(columns) >= 4:
                        potential_headers.append((i, columns, '\t'))
                
                # Strategy 3: Split by single spaces if we have many words
                words = original_line.split()
                if len(words) >= 6:  # Many words might indicate column headers
                    potential_headers.append((i, words, ' '))
        
        return potential_headers
    
    def parse_table_format(self, text: str) -> List[Dict]:
        """Parse table-formatted scheme of work"""
        table_info = self.detect_table_structure(text)
        lessons = []
        
        if not table_info:
            return self.parse_free_format(text)
        
        # Use the first detected table structure
        header_line_idx, headers, separator = table_info[0]
        
        # Map headers to our standard fields
        header_mapping = self.map_headers_to_fields(headers)
        
        lines = text.split('\n')
        
        # Process data rows after header
        for i in range(header_line_idx + 1, len(lines)):
            line = lines[i].strip()
            if not line:
                continue
                
            # Check if this is a data row
            if line.count(separator) >= len(headers) - 2:  # Allow some flexibility
                columns = [col.strip() for col in line.split(separator)]
                
                if len(columns) >= len(headers) // 2:  # At least half the expected columns
                    lesson = self.extract_lesson_from_row(columns, header_mapping)
                    if lesson:
                        lessons.append(lesson)
        
        return lessons
    
    def map_headers_to_fields(self, headers: List[str]) -> Dict[int, str]:
        """Map table headers to our standard field names"""
        mapping = {}
        
        for idx, header in enumerate(headers):
            header_lower = header.lower().strip()
            
            # Map each header to closest field
            for field, patterns in self.column_patterns.items():
                for pattern in patterns:
                    if re.search(pattern, header_lower):
                        mapping[idx] = field
                        break
                if idx in mapping:
                    break
        
        return mapping
    
    def extract_lesson_from_row(self, columns: List[str], header_mapping: Dict[int, str]) -> Optional[Dict]:
        """Extract lesson data from a table row"""
        lesson = {}
        
        # Initialize with defaults
        default_lesson = {
            'week': None, 'lessonNumber': 1, 'title': '', 'strand': '', 'sub_strand': '',
            'specific_learning_outcomes': [], 'core_competencies': [],
            'key_inquiry_question': '', 'learning_resources': [],
            'activities': [], 'assessment': '', 'reflection': ''
        }
        
        lesson.update(default_lesson)
        
        # Extract data from mapped columns
        for col_idx, field_name in header_mapping.items():
            if col_idx < len(columns):
                content = columns[col_idx].strip()
                if content:
                    if field_name in ['week', 'lessonNumber']:
                        # Extract numbers
                        match = re.search(r'(\d+)', content)
                        if match:
                            lesson[field_name] = int(match.group(1))
                    elif field_name in ['specific_learning_outcomes', 'learning_resources', 'activities', 'core_competencies']:
                        # List fields
                        lesson[field_name] = self.split_list_content(content)
                    else:
                        # String fields
                        lesson[field_name] = content
        
        # Set title if not present
        if not lesson['title'] and lesson['strand']:
            lesson['title'] = f"{lesson['strand']}: {lesson['sub_strand']}"
        
        # Only return if we have minimum viable data
        if lesson['week'] and (lesson['strand'] or lesson['title'] or lesson['specific_learning_outcomes']):
            return lesson
        
        return None
    
    def split_list_content(self, content: str) -> List[str]:
        """Split content into list items"""
        if not content:
            return []
        
        # Try different splitting strategies
        items = []
        
        # Split by bullet points
        for bullet in self.bullet_points:
            if bullet in content:
                items = [item.strip() for item in content.split(bullet) if item.strip()]
                break
        
        # Split by common separators if no bullets found
        if not items:
            for sep in [';', '\n', '|']:
                if sep in content:
                    items = [item.strip() for item in content.split(sep) if item.strip()]
                    break
        
        # If still no items, return as single item
        if not items:
            items = [content]
        
        return items
    
    def parse_free_format(self, text: str) -> List[Dict]:
        """Parse free-format text when table structure is not clear"""
        lessons = []
        lines = text.split('\n')
        
        # Look for week/lesson patterns in the text
        current_lesson = None
        current_field = None
        
        # Enhanced week detection patterns
        week_patterns = [
            r'(?:week|wk|w)\s*[:\-]?\s*(\d+)',
            r'^(\d+)\s*$',  # Just a number on its own line
            r'(\d+)\s+(?:week|wk)',
            r'^(\d+)\s+\d+',  # Pattern like "1 1" (week lesson)
        ]
        
        # Track content blocks for each lesson
        lesson_blocks = []
        current_block = []
        
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue
            
            # Check if this line indicates a new week/lesson
            found_week = False
            for pattern in week_patterns:
                match = re.search(pattern, line.lower())
                if match:
                    # Save previous block if exists
                    if current_block:
                        lesson_blocks.append(current_block.copy())
                        current_block = []
                    
                    week_num = int(match.group(1))
                    current_block = [('week', week_num), ('raw_content', [line])]
                    found_week = True
                    break
            
            if not found_week and current_block:
                # Add to current block
                current_block.append(('content', line))
        
        # Save the last block
        if current_block:
            lesson_blocks.append(current_block)
        
        # Process each lesson block
        for block in lesson_blocks:
            lesson = self.extract_lesson_from_block(block)
            if lesson:
                lessons.append(lesson)
        
        return lessons
    
    def extract_lesson_from_block(self, block: List) -> Optional[Dict]:
        """Extract lesson data from a content block"""
        lesson = {
            'week': None, 'lessonNumber': 1, 'title': '', 'strand': '', 'sub_strand': '',
            'specific_learning_outcomes': [], 'core_competencies': [],
            'key_inquiry_question': '', 'learning_resources': [],
            'activities': [], 'assessment': '', 'reflection': ''
        }
        
        # Extract week number
        for item_type, content in block:
            if item_type == 'week':
                lesson['week'] = content
                break
        
        # Process content lines
        content_lines = []
        for item_type, content in block:
            if item_type == 'content':
                content_lines.append(content)
        
        # Join all content and try to extract information
        full_content = ' '.join(content_lines)
        
        # Use patterns to extract different sections
        self.extract_lesson_components(full_content, lesson)
        
        # Only return if we have minimum viable data
        if lesson['week'] and (lesson['strand'] or lesson['title'] or lesson['specific_learning_outcomes']):
            return lesson
        
        return None
    
    def identify_strand_from_content(self, content: str) -> str:
        """Enhanced strand identification using improved CBC-specific logic"""
        # Import here to avoid circular imports
        try:
            from improved_strand_identifier import ImprovedStrandIdentifier
            identifier = ImprovedStrandIdentifier()
            return identifier.identify_strand(content)
        except ImportError:
            # Fallback to original logic if import fails
            return self._fallback_strand_identification(content)
    
    def _fallback_strand_identification(self, content: str) -> str:
        """Fallback strand identification method"""
        content_lower = content.lower()
        
        # First, try to find explicit strand mentions
        explicit_patterns = [
            r'strand[s]?[:\-]?\s*([A-Za-z\s]+?)(?:\s+sub|$|\.|,|;)',
            r'theme[s]?[:\-]?\s*([A-Za-z\s]+?)(?:\s+sub|$|\.|,|;)',
            r'topic[s]?[:\-]?\s*([A-Za-z\s]+?)(?:\s+sub|$|\.|,|;)',
        ]
        
        for pattern in explicit_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                strand = match.group(1).strip()
                if len(strand) > 2 and len(strand) < 50:  # Reasonable length
                    return self.normalize_strand_name(strand)
        
        # If no explicit strand found, use CBC pattern matching
        best_match = None
        best_score = 0
        
        for strand_name, pattern in self.cbc_strand_patterns.items():
            matches = re.findall(pattern, content_lower, re.IGNORECASE)
            if matches:
                # Score based on number of matches and position
                score = len(matches)
                # Boost score if found early in content (likely more important)
                early_match = re.search(pattern, content_lower[:200], re.IGNORECASE)
                if early_match:
                    score += 2
                
                if score > best_score:
                    best_score = score
                    best_match = strand_name
        
        if best_match:
            return self.normalize_strand_name(best_match.replace('_', ' ').title())
        
        # Fallback: try to extract capitalized words that might be strands
        capitalized_words = re.findall(r'\b[A-Z][A-Z\s]+\b', content)
        for word in capitalized_words:
            word = word.strip()
            if 3 <= len(word) <= 30 and word not in ['THE', 'AND', 'FOR', 'WITH']:
                return self.normalize_strand_name(word.title())
        
        return "General"
    
    def identify_substrand_from_content(self, content: str, strand: str) -> str:
        """Enhanced sub-strand identification using improved logic"""
        # Import here to avoid circular imports
        try:
            from improved_strand_identifier import ImprovedStrandIdentifier
            identifier = ImprovedStrandIdentifier()
            return identifier.identify_substrand(content, strand)
        except ImportError:
            # Fallback to original logic if import fails
            return self._fallback_substrand_identification(content, strand)
    
    def _fallback_substrand_identification(self, content: str, strand: str) -> str:
        """Fallback sub-strand identification method"""
        content_lower = content.lower()
        
        # Look for explicit sub-strand patterns
        substrand_patterns = [
            r'sub[\-\s]*strand[s]?[:\-]?\s*([A-Za-z\s]+?)(?:\s+by\s+the\s+end|$|\.|,|;)',
            r'sub[\-\s]*topic[s]?[:\-]?\s*([A-Za-z\s]+?)(?:\s+by\s+the\s+end|$|\.|,|;)',
            r'specific\s+topic[s]?[:\-]?\s*([A-Za-z\s]+?)(?:\s+by\s+the\s+end|$|\.|,|;)',
        ]
        
        for pattern in substrand_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                substrand = match.group(1).strip()
                if len(substrand) > 2 and len(substrand) < 100:
                    return self.normalize_strand_name(substrand)
        
        # If strand is identified, look for related specific topics
        if strand != "General":
            # Extract content that comes after the strand mention
            strand_pattern = re.escape(strand.lower())
            match = re.search(f'{strand_pattern}[:\-]?\s*([A-Za-z\s,]+?)(?:\s+by\s+the\s+end|$)', content_lower)
            if match:
                potential_substrand = match.group(1).strip()
                # Clean up common prefixes/suffixes
                potential_substrand = re.sub(r'^(and|or|the|a|an)\s+', '', potential_substrand)
                potential_substrand = re.sub(r'\s+(and|or|the|a|an)$', '', potential_substrand)
                if len(potential_substrand) > 2:
                    return self.normalize_strand_name(potential_substrand.title())
        
        # Look for descriptive phrases that might be sub-strands
        descriptive_patterns = [
            r'([A-Za-z\s]+?)\s+concepts?',
            r'([A-Za-z\s]+?)\s+skills?',
            r'([A-Za-z\s]+?)\s+activities?',
            r'([A-Za-z\s]+?)\s+methods?',
            r'([A-Za-z\s]+?)\s+techniques?',
        ]
        
        for pattern in descriptive_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                substrand = match.group(1).strip()
                if 3 <= len(substrand) <= 50:
                    return self.normalize_strand_name(substrand.title())
        
        return "General Topic"
    
    def normalize_strand_name(self, strand: str) -> str:
        """Normalize strand names to standard CBC format"""
        strand = strand.strip()
        
        # Common normalizations
        normalizations = {
            'maths': 'Mathematics',
            'math': 'Mathematics',
            'numbers': 'Numbers',
            'geometry': 'Geometry',
            'measurement': 'Measurement',
            'data': 'Data Handling',
            'science': 'Science',
            'living things': 'Living Things',
            'non living': 'Non-Living Things',
            'energy': 'Energy',
            'environment': 'Environment',
            'health': 'Health Education',
            'english': 'English',
            'kiswahili': 'Kiswahili',
            'listening': 'Listening and Speaking',
            'speaking': 'Listening and Speaking',
            'reading': 'Reading',
            'writing': 'Writing',
            'social studies': 'Social Studies',
            'history': 'History',
            'geography': 'Geography',
            'citizenship': 'Citizenship',
            'creative arts': 'Creative Arts',
            'visual arts': 'Visual Arts',
            'performing arts': 'Performing Arts',
            'pe': 'Physical Education',
            'physical education': 'Physical Education',
            'ict': 'ICT',
            'computing': 'ICT',
            'computer': 'ICT',
            're': 'Religious Education',
            'religious education': 'Religious Education',
        }
        
        strand_lower = strand.lower()
        if strand_lower in normalizations:
            return normalizations[strand_lower]
        
        # Capitalize properly
        return ' '.join(word.capitalize() for word in strand.split())
    
    def extract_lesson_components(self, content: str, lesson: Dict):
        """Enhanced lesson component extraction with better strand identification"""
        content_lower = content.lower()
        
        # Initialize lesson with default values
        if 'strand' not in lesson:
            lesson['strand'] = ''
        if 'sub_strand' not in lesson:
            lesson['sub_strand'] = ''
        if 'specific_learning_outcomes' not in lesson:
            lesson['specific_learning_outcomes'] = []
        if 'key_inquiry_question' not in lesson:
            lesson['key_inquiry_question'] = ''
        if 'title' not in lesson:
            lesson['title'] = ''
        
        # Use enhanced strand identification
        lesson['strand'] = self.identify_strand_from_content(content)
        lesson['sub_strand'] = self.identify_substrand_from_content(content, lesson['strand'])
        
        # Set title if not present
        if not lesson['title']:
            if lesson['strand'] and lesson['sub_strand']:
                lesson['title'] = f"{lesson['strand']}: {lesson['sub_strand']}"
            elif lesson['strand']:
                lesson['title'] = lesson['strand']
        
        # Extract learning outcomes (look for "by the end" pattern)
        outcome_patterns = [
            r'by\s+the\s+end[^:]*?:\s*([^?]+?)(?:\s+how\s+|$)',
            r'learner[s]?\s+should\s+be\s+able\s+to[:\s]*([^?]+?)(?:\s+how\s+|$)',
            r'objective[s]?[:\s]*([^?]+?)(?:\s+how\s+|$)',
            r'learning\s+outcome[s]?[:\s]*([^?]+?)(?:\s+how\s+|$)',
        ]
        
        for pattern in outcome_patterns:
            match = re.search(pattern, content_lower)
            if match:
                outcomes_text = match.group(1)
                # Split by common separators
                outcomes = []
                for sep in ['a)', 'b)', 'c)', 'd)', 'e)', '•', '-', '\n']:
                    if sep in outcomes_text:
                        parts = outcomes_text.split(sep)
                        outcomes.extend([part.strip() for part in parts if part.strip()])
                        break
                if not outcomes:
                    outcomes = [outcomes_text.strip()]
                lesson['specific_learning_outcomes'] = [o for o in outcomes if len(o) > 5]
                break
        
        # Extract key inquiry question
        inquiry_patterns = [
            r'how\s+can\s+[^?]*?\?',
            r'what\s+[^?]*?\?',
            r'why\s+[^?]*?\?',
            r'when\s+[^?]*?\?',
            r'where\s+[^?]*?\?',
            r'inquiry\s+question[s]?[:\s]*([^.]+[?.])',
        ]
        
        for pattern in inquiry_patterns:
            match = re.search(pattern, content_lower)
            if match:
                if pattern.endswith('[?.]'):
                    lesson['key_inquiry_question'] = match.group(1).strip().capitalize()
                else:
                    lesson['key_inquiry_question'] = match.group(0).strip().capitalize()
                break
        
        # Extract resources with better pattern matching
        resource_indicators = [
            'textbook', 'chart', 'cards', 'materials', 'flashcards', 'marbles', 'stones', 
            'pictures', 'models', 'specimens', 'calculator', 'ruler', 'compass', 'protractor',
            'computer', 'internet', 'video', 'audio', 'map', 'globe', 'microscope'
        ]
        
        found_resources = []
        for indicator in resource_indicators:
            if indicator in content_lower:
                # Try to extract the phrase containing the indicator
                pattern = r'([^.]*?' + re.escape(indicator) + r'[^.]*?)(?:\s|$|\.)'
                match = re.search(pattern, content_lower)
                if match:
                    resource_phrase = match.group(1).strip()
                    if len(resource_phrase) < 100:  # Reasonable length
                        found_resources.append(resource_phrase.title())
        
        if found_resources:
            lesson['learning_resources'] = list(set(found_resources))  # Remove duplicates
        
        # Enhanced assessment detection
        assessment_indicators = [
            'observation', 'written', 'oral', 'questions', 'exercise', 'test', 'quiz',
            'presentation', 'project', 'assignment', 'homework', 'practical', 'demonstration'
        ]
        
        found_assessments = []
        for indicator in assessment_indicators:
            if indicator in content_lower:
                found_assessments.append(indicator.title())
        
        if found_assessments:
            lesson['assessment'] = ', '.join(set(found_assessments))
        
        # Create title if not present
        if not lesson['title'] or lesson['title'] == f"Week {lesson['week']} Lesson":
            if lesson['strand'] and lesson['sub_strand']:
                lesson['title'] = f"{lesson['strand']}: {lesson['sub_strand']}"
            elif lesson['strand']:
                lesson['title'] = lesson['strand']
    
    def enhance_lesson_data(self, lesson: Dict) -> Dict:
        """Add default values and enhancements to lesson data"""
        
        # Ensure all required fields exist
        required_fields = {
            'week': 1, 'lessonNumber': 1, 'title': 'Untitled Lesson',
            'strand': 'General', 'sub_strand': 'General Topic',
            'specific_learning_outcomes': ['By the end of the lesson, learners will be able to understand the topic.'],
            'core_competencies': ['Critical thinking and problem solving'],
            'key_inquiry_question': 'How can we apply this knowledge?',
            'learning_resources': ['Textbooks', 'Learning materials'],
            'activities': ['Introduction', 'Main activity', 'Conclusion'],
            'assessment': 'Observation and oral questions',
            'reflection': 'Were the learning outcomes achieved?'
        }
        
        for field, default_value in required_fields.items():
            if field not in lesson or not lesson[field]:
                lesson[field] = default_value
        
        return lesson
    
    def parse_scheme_of_work(self, file_content: bytes, filename: str = "scheme.pdf") -> Dict:
        """Alias for parse_scheme method for compatibility"""
        return self.parse_scheme(file_content, filename)
    
    def parse_scheme(self, file_content: bytes, filename: str) -> Dict:
        """Main parsing method"""
        try:
            # Extract text
            if filename.lower().endswith('.pdf'):
                text = self.extract_text_from_pdf(file_content)
            else:
                # Handle other formats (implementation needed)
                text = file_content.decode('utf-8', errors='ignore')
            
            # Parse lessons
            lessons = self.parse_table_format(text)
            
            # Enhance lesson data
            enhanced_lessons = [self.enhance_lesson_data(lesson) for lesson in lessons]
            
            # Sort by week
            enhanced_lessons.sort(key=lambda x: x.get('week', 0))
            
            return {
                'success': True,
                'message': f'Successfully parsed {len(enhanced_lessons)} lessons from scheme of work',
                'lesson_plans': enhanced_lessons,
                'weeks_found': list(set(lesson.get('week', 1) for lesson in enhanced_lessons))
            }
            
        except Exception as e:
            self.logger.error(f"Parsing error: {e}")
            return {
                'success': False,
                'message': f'Error parsing scheme: {str(e)}',
                'lesson_plans': [],
                'weeks_found': []
            }
