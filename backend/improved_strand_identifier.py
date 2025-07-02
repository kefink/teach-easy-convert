"""
Improved Strand Identification System for CBC Lesson Plans
"""
import re
from typing import Dict, List, Tuple, Optional

class ImprovedStrandIdentifier:
    def __init__(self):
        # Enhanced CBC-specific strand mapping with aliases
        self.cbc_strands = {
            'mathematics': {
                'aliases': ['math', 'maths', 'mathematics', 'arithmetic'],
                'sub_strands': {
                    'numbers': ['number', 'numeration', 'counting', 'place value', 'whole numbers', 'integers', 'fractions', 'decimals', 'percentages'],
                    'geometry': ['shapes', 'geometric', '2d', '3d', 'lines', 'angles', 'polygons', 'circles', 'spatial'],
                    'measurement': ['measuring', 'length', 'mass', 'weight', 'time', 'capacity', 'volume', 'area', 'perimeter'],
                    'data handling': ['data', 'statistics', 'graphs', 'charts', 'probability', 'statistics'],
                    'algebra': ['patterns', 'equations', 'expressions', 'variables', 'functions'],
                    'money': ['currency', 'coins', 'notes', 'buying', 'selling', 'profit', 'loss']
                }
            },
            'science': {
                'aliases': ['science', 'sciences', 'natural science'],
                'sub_strands': {
                    'living things': ['life', 'biology', 'plants', 'animals', 'human body', 'organisms', 'cells', 'habitats', 'ecosystems'],
                    'non-living things': ['matter', 'materials', 'substances', 'physics', 'properties', 'states of matter'],
                    'energy': ['force', 'motion', 'electricity', 'magnetism', 'heat', 'light', 'sound', 'renewable'],
                    'environment': ['ecology', 'conservation', 'pollution', 'weather', 'climate', 'natural resources'],
                    'health education': ['health', 'hygiene', 'nutrition', 'disease', 'safety', 'first aid', 'mental health']
                }
            },
            'english': {
                'aliases': ['english', 'language arts', 'literacy'],
                'sub_strands': {
                    'listening and speaking': ['listening', 'speaking', 'oral', 'conversation', 'presentation', 'communication'],
                    'reading': ['reading', 'comprehension', 'phonics', 'fluency', 'vocabulary'],
                    'writing': ['writing', 'composition', 'spelling', 'grammar', 'handwriting', 'creative writing']
                }
            },
            'kiswahili': {
                'aliases': ['kiswahili', 'swahili', 'kusoma', 'kuandika'],
                'sub_strands': {
                    'kusikiliza na kuzungumza': ['kusikiliza', 'kuzungumza', 'mazungumzo', 'maongezi'],
                    'kusoma': ['kusoma', 'ufahamu', 'msamiati'],
                    'kuandika': ['kuandika', 'utunzi', 'sarufi', 'imla']
                }
            },
            'social studies': {
                'aliases': ['social studies', 'social science', 'history and government'],
                'sub_strands': {
                    'history': ['history', 'historical', 'past', 'heritage', 'culture', 'civilization'],
                    'geography': ['geography', 'maps', 'location', 'physical features', 'climate', 'regions'],
                    'citizenship': ['citizenship', 'civic', 'government', 'rights', 'responsibilities', 'democracy'],
                    'economics': ['economics', 'trade', 'resources', 'production', 'consumption', 'business']
                }
            },
            'creative arts': {
                'aliases': ['creative arts', 'arts', 'fine arts'],
                'sub_strands': {
                    'visual arts': ['visual arts', 'drawing', 'painting', 'crafts', 'art', 'sculpture'],
                    'performing arts': ['performing arts', 'music', 'dance', 'drama', 'theatre', 'instruments'],
                    'digital arts': ['digital arts', 'computer arts', 'multimedia', 'digital design']
                }
            },
            'ict': {
                'aliases': ['ict', 'information technology', 'computer studies', 'computing', 'technology'],
                'sub_strands': {
                    'computing': ['computing', 'computer', 'hardware', 'software', 'systems'],
                    'programming': ['programming', 'coding', 'algorithms', 'software development'],
                    'digital literacy': ['digital literacy', 'internet', 'web', 'online safety', 'digital citizenship']
                }
            },
            'physical education': {
                'aliases': ['physical education', 'pe', 'sports', 'games'],
                'sub_strands': {
                    'motor skills': ['motor skills', 'movement', 'coordination', 'balance', 'agility'],
                    'games and sports': ['games', 'sports', 'athletics', 'competition', 'team sports'],
                    'health and fitness': ['fitness', 'exercise', 'physical activity', 'wellness']
                }
            },
            'religious education': {
                'aliases': ['religious education', 're', 'religion', 'christian education'],
                'sub_strands': {
                    'beliefs and practices': ['beliefs', 'faith', 'doctrine', 'teachings', 'practices', 'worship'],
                    'values and morals': ['values', 'morals', 'ethics', 'character', 'virtues']
                }
            }
        }
        
        # Explicit strand patterns for better detection
        self.strand_patterns = [
            r'strand[s]?[:\-]?\s*([A-Za-z\s]+?)(?:\s+sub[\-\s]*strand|$|\.|\n)',
            r'subject[:\-]?\s*([A-Za-z\s]+?)(?:\s+topic|$|\.|\n)',
            r'theme[:\-]?\s*([A-Za-z\s]+?)(?:\s+sub|$|\.|\n)',
            r'^([A-Z][A-Z\s]+?)[:\-]\s*',  # ALL CAPS followed by colon
            r'learning\s+area[:\-]?\s*([A-Za-z\s]+?)(?:\s+topic|$|\.|\n)',
        ]
        
        self.substrand_patterns = [
            r'sub[\-\s]*strand[s]?[:\-]?\s*([A-Za-z\s]+?)(?:\s+by\s+the\s+end|$|\.|\n)',
            r'topic[:\-]?\s*([A-Za-z\s]+?)(?:\s+by\s+the\s+end|$|\.|\n)',
            r'sub[\-\s]*topic[s]?[:\-]?\s*([A-Za-z\s]+?)(?:\s+by\s+the\s+end|$|\.|\n)',
            r'focus[:\-]?\s*([A-Za-z\s]+?)(?:\s+by\s+the\s+end|$|\.|\n)',
        ]
    
    def identify_strand(self, content: str) -> str:
        """Enhanced strand identification using multiple strategies"""
        content = content.strip()
        content_lower = content.lower()
        
        # Strategy 1: Look for explicit strand declarations
        for pattern in self.strand_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                potential_strand = match.group(1).strip()
                normalized = self._normalize_and_map_strand(potential_strand)
                if normalized != "General":
                    return normalized
        
        # Strategy 2: Match against known CBC strands and aliases
        best_match = ""
        max_score = 0
        
        for strand_name, strand_data in self.cbc_strands.items():
            # Check main strand name
            if strand_name in content_lower:
                score = len(strand_name)
                if score > max_score:
                    max_score = score
                    best_match = strand_name
            
            # Check aliases
            for alias in strand_data['aliases']:
                if alias in content_lower:
                    score = len(alias)
                    if score > max_score:
                        max_score = score
                        best_match = strand_name
            
            # Check sub-strand keywords (higher priority for exact matches)
            for sub_strand, keywords in strand_data['sub_strands'].items():
                for keyword in keywords:
                    # Exact word match gets higher score
                    if re.search(r'\b' + re.escape(keyword) + r'\b', content_lower):
                        score = len(keyword) * 1.2
                        if score > max_score:
                            max_score = score
                            best_match = strand_name
                    # Partial match gets lower score
                    elif keyword in content_lower:
                        score = len(keyword) * 0.8
                        if score > max_score:
                            max_score = score
                            best_match = strand_name
        
        if best_match:
            return self._format_strand_name(best_match)
        
        # Strategy 3: Single word analysis for common subjects
        single_word_map = {
            'numbers': 'mathematics',
            'geometry': 'mathematics',
            'measurement': 'mathematics',
            'fractions': 'mathematics',
            'algebra': 'mathematics',
            'shapes': 'mathematics',
            'angles': 'mathematics',
            'data': 'mathematics',
            
            'science': 'science',
            'biology': 'science',
            'physics': 'science',
            'chemistry': 'science',
            'plants': 'science',
            'animals': 'science',
            'energy': 'science',
            'matter': 'science',
            'health': 'science',
            'environment': 'science',
            
            'english': 'english',
            'language': 'english',
            'reading': 'english',
            'writing': 'english',
            'grammar': 'english',
            'vocabulary': 'english',
            
            'history': 'social studies',
            'geography': 'social studies',
            'maps': 'social studies',
            'citizenship': 'social studies',
            'government': 'social studies',
            
            'art': 'creative arts',
            'music': 'creative arts',
            'dance': 'creative arts',
            'drama': 'creative arts',
            'drawing': 'creative arts',
            'painting': 'creative arts',
            
            'computer': 'ict',
            'technology': 'ict',
            'programming': 'ict',
            'coding': 'ict',
            
            'sports': 'physical education',
            'games': 'physical education',
            'exercise': 'physical education',
        }
        
        # Check for single word matches
        words = content_lower.split()
        for word in words:
            word = word.strip('.,!?:;')
            if word in single_word_map:
                return self._format_strand_name(single_word_map[word])
        
        # Strategy 4: Look for capitalized subject-like words
        cap_words = re.findall(r'\b[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*\b', content)
        for word_group in cap_words:
            if 3 <= len(word_group) <= 30:
                normalized = self._normalize_and_map_strand(word_group)
                if normalized != "General":
                    return normalized
        
        return "General"
    
    def identify_substrand(self, content: str, strand: str) -> str:
        """Enhanced sub-strand identification"""
        content_lower = content.lower()
        strand_lower = strand.lower()
        
        # Strategy 1: Look for explicit sub-strand patterns
        for pattern in self.substrand_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                substrand = match.group(1).strip()
                if 2 < len(substrand) < 100:
                    return self._format_strand_name(substrand)
        
        # Strategy 2: Use strand-specific sub-strand mapping
        if strand_lower in self.cbc_strands:
            strand_data = self.cbc_strands[strand_lower]
            best_substrand = ""
            max_score = 0
            
            for sub_strand_name, keywords in strand_data['sub_strands'].items():
                for keyword in keywords:
                    # Exact word boundary match gets highest score
                    if re.search(r'\b' + re.escape(keyword) + r'\b', content_lower):
                        score = len(keyword) * 1.5
                        if score > max_score:
                            max_score = score
                            best_substrand = sub_strand_name
                    # Partial match gets lower score
                    elif keyword in content_lower:
                        score = len(keyword)
                        if score > max_score:
                            max_score = score
                            best_substrand = sub_strand_name
            
            if best_substrand:
                return self._format_strand_name(best_substrand)
        
        # Strategy 3: Extract content after colons or specific patterns
        colon_patterns = [
            r':\s*([A-Za-z\s]+?)(?:\s+by\s+the\s+end|learning|objective|week|\d|$)',
            r'-\s*([A-Za-z\s]+?)(?:\s+by\s+the\s+end|learning|objective|week|\d|$)',
            r'topic[s]?[:\-]?\s*([A-Za-z\s]+?)(?:\s+by\s+the\s+end|learning|objective|week|\d|$)',
        ]
        
        for pattern in colon_patterns:
            match = re.search(pattern, content_lower)
            if match:
                potential = match.group(1).strip()
                # Clean up
                potential = re.sub(r'^(and|or|the|a|an|in|of|for|with)\s+', '', potential)
                potential = re.sub(r'\s+(and|or|the|a|an|in|of|for|with)$', '', potential)
                if 2 < len(potential) < 50:
                    return self._format_strand_name(potential)
        
        # Strategy 4: Look for descriptive content after strand mention
        if strand_lower != "general":
            strand_pattern = re.escape(strand_lower)
            patterns = [
                f'{strand_pattern}[:\-]?\s*([A-Za-z\s,]+?)(?:\s+by\s+the\s+end|learning|objective|$)',
                f'([A-Za-z\s]+?)\s+(?:concepts?|skills?|activities?|methods?)',
            ]
            
            for pattern in patterns:
                match = re.search(pattern, content_lower)
                if match:
                    potential = match.group(1).strip()
                    # Clean up
                    potential = re.sub(r'^(and|or|the|a|an|in|of|for|with)\s+', '', potential)
                    potential = re.sub(r'\s+(and|or|the|a|an|in|of|for|with)$', '', potential)
                    if 2 < len(potential) < 50:
                        return self._format_strand_name(potential)
        
        # Strategy 5: Single word substrand mapping
        single_word_substrands = {
            # Mathematics
            'numbers': 'Numbers',
            'counting': 'Numbers', 
            'fractions': 'Numbers',
            'decimals': 'Numbers',
            'geometry': 'Geometry',
            'shapes': 'Geometry',
            'angles': 'Geometry',
            'measurement': 'Measurement',
            'length': 'Measurement',
            'mass': 'Measurement',
            'time': 'Measurement',
            'data': 'Data Handling',
            'graphs': 'Data Handling',
            'statistics': 'Data Handling',
            
            # Science
            'animals': 'Living Things',
            'plants': 'Living Things',
            'habitats': 'Living Things',
            'classification': 'Living Things',
            'energy': 'Energy',
            'forces': 'Energy',
            'electricity': 'Energy',
            'magnetism': 'Energy',
            'matter': 'Non-Living Things',
            'materials': 'Non-Living Things',
            'health': 'Health Education',
            'nutrition': 'Health Education',
            'hygiene': 'Health Education',
            'environment': 'Environment',
            'weather': 'Environment',
            'climate': 'Environment',
            
            # English
            'reading': 'Reading',
            'comprehension': 'Reading',
            'writing': 'Writing',
            'composition': 'Writing',
            'grammar': 'Writing',
            'listening': 'Listening And Speaking',
            'speaking': 'Listening And Speaking',
            'oral': 'Listening And Speaking',
            
            # Social Studies
            'history': 'History',
            'geography': 'Geography',
            'maps': 'Geography',
            'citizenship': 'Citizenship',
            'government': 'Citizenship',
            'economics': 'Economics',
            'trade': 'Economics',
            
            # Creative Arts
            'drawing': 'Visual Arts',
            'painting': 'Visual Arts',
            'art': 'Visual Arts',
            'music': 'Performing Arts',
            'dance': 'Performing Arts',
            'drama': 'Performing Arts',
            
            # ICT
            'programming': 'Programming',
            'coding': 'Programming',
            'computers': 'Computing',
            'internet': 'Digital Literacy',
            
            # Physical Education
            'games': 'Games And Sports',
            'sports': 'Games And Sports',
            'fitness': 'Health And Fitness',
            'exercise': 'Health And Fitness',
        }
        
        # Check content for single-word substrands
        words = content_lower.split()
        for word in words:
            word = word.strip('.,!?:;')
            if word in single_word_substrands:
                return single_word_substrands[word]
        
        return "General Topic"
    
    def _normalize_and_map_strand(self, strand_text: str) -> str:
        """Normalize and map strand text to CBC standards"""
        strand_lower = strand_text.lower().strip()
        
        # Direct mapping
        for strand_name, strand_data in self.cbc_strands.items():
            if strand_lower == strand_name:
                return self._format_strand_name(strand_name)
            
            for alias in strand_data['aliases']:
                if strand_lower == alias:
                    return self._format_strand_name(strand_name)
        
        # Partial matching for compound terms
        for strand_name, strand_data in self.cbc_strands.items():
            if strand_name in strand_lower or any(alias in strand_lower for alias in strand_data['aliases']):
                return self._format_strand_name(strand_name)
        
        return "General"
    
    def _format_strand_name(self, name: str) -> str:
        """Format strand name to proper case"""
        # Special formatting cases
        special_cases = {
            'ict': 'ICT',
            'pe': 'Physical Education',
            're': 'Religious Education',
            'english': 'English',
            'kiswahili': 'Kiswahili'
        }
        
        name_lower = name.lower()
        if name_lower in special_cases:
            return special_cases[name_lower]
        
        # Title case with proper handling
        return ' '.join(word.capitalize() for word in name.split())


def test_improved_identifier():
    """Test the improved strand identifier"""
    identifier = ImprovedStrandIdentifier()
    
    test_cases = [
        ("STRAND: Mathematics SUB-STRAND: Numbers", "Mathematics", "Numbers"),
        ("Science: Living things and their environment", "Science", "Living Things"),
        ("English - Reading comprehension skills", "English", "Reading"),
        ("Creative Arts: Drawing and painting", "Creative Arts", "Visual Arts"),
        ("Week 1: Understanding fractions", "Mathematics", "Numbers"),
        ("ICT skills - computer programming", "ICT", "Programming"),
        ("Physical Education: Games and sports", "Physical Education", "Games And Sports"),
        ("Social Studies - History of Kenya", "Social Studies", "History"),
    ]
    
    print("Testing Improved Strand Identifier")
    print("=" * 50)
    
    correct = 0
    total = len(test_cases)
    
    for i, (text, expected_strand, expected_substrand) in enumerate(test_cases, 1):
        strand = identifier.identify_strand(text)
        substrand = identifier.identify_substrand(text, strand)
        
        print(f"\nTest {i}: {text}")
        print(f"Expected: {expected_strand} -> {expected_substrand}")
        print(f"Got: {strand} -> {substrand}")
        
        if strand == expected_strand:
            print("✓ Strand correct")
            correct += 1
        else:
            print("✗ Strand incorrect")
    
    print(f"\nAccuracy: {correct}/{total} ({correct/total*100:.1f}%)")

if __name__ == "__main__":
    test_improved_identifier()
