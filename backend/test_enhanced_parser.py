"""
Test the enhanced parser with improved strand identification
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from enhanced_parser import EnhancedSchemeParser

def test_enhanced_parser():
    """Test the enhanced parser with various sample texts"""
    parser = EnhancedSchemeParser()
    
    # Test cases - mix of good and challenging content
    test_texts = [
        """
        WEEK 1 LESSON 1
        STRAND: Mathematics
        SUB-STRAND: Numbers
        By the end of the lesson, learners should be able to:
        a) Count objects up to 100
        b) Identify place value of digits
        How can we use numbers in daily life?
        """,
        
        """
        Week 2: Understanding fractions and decimals
        Students will learn about:
        - Basic fractions (1/2, 1/3, 1/4)
        - Converting fractions to decimals
        Learning resources: fraction charts, manipulatives
        """,
        
        """
        Science - Living things and their environment
        Topic: Animal habitats and adaptation
        By the end: Students identify different habitats
        Key question: How do animals adapt to their environment?
        """,
        
        """
        ENGLISH LANGUAGE
        Reading comprehension skills
        Week 3 Lesson 2
        Objective: Improve reading fluency and understanding
        Activities: Silent reading, group discussions
        """,
        
        """
        Creative Arts: Visual Arts
        Drawing and painting techniques
        Materials needed: pencils, paints, brushes
        Assessment: Portfolio of artwork
        """,
    ]
    
    print("Testing Enhanced Parser with Improved Strand Identification")
    print("=" * 60)
    
    for i, text in enumerate(test_texts, 1):
        print(f"\n--- Test Case {i} ---")
        print(f"Input text: {text.strip()[:100]}...")
        
        try:
            # Test strand identification
            strand = parser.identify_strand_from_content(text)
            substrand = parser.identify_substrand_from_content(text, strand)
            
            print(f"Identified Strand: {strand}")
            print(f"Identified Sub-strand: {substrand}")
            
            # Test full lesson extraction if it looks like structured content
            lesson = {}
            parser.extract_lesson_components(text, lesson)
            
            print(f"Learning Outcomes: {lesson.get('specific_learning_outcomes', [])}")
            print(f"Key Inquiry: {lesson.get('key_inquiry_question', 'None')}")
            
        except Exception as e:
            print(f"Error: {e}")

def test_with_real_sow():
    """Test with a real SOW file"""
    parser = EnhancedSchemeParser()
    
    # Test with STM2025.pdf if available
    sow_path = "c:/Users/MKT/desktop/consi/teach-easy-convert/STM2025.pdf"
    
    if os.path.exists(sow_path):
        print("\n" + "=" * 60)
        print("Testing with Real SOW File: STM2025.pdf")
        print("=" * 60)
        
        try:
            with open(sow_path, 'rb') as f:
                content = f.read()
            
            text = parser.extract_text_from_pdf(content)
            print(f"Extracted {len(text)} characters from PDF")
            
            # Parse the SOW
            result = parser.parse_scheme_of_work(content)
            print(f"\nParsing Results:")
            print(f"Success: {result['success']}")
            print(f"Lessons found: {len(result.get('lessons', []))}")
            
            if result.get('lessons'):
                # Show first few lessons
                for i, lesson in enumerate(result['lessons'][:3], 1):
                    print(f"\nLesson {i}:")
                    print(f"  Week: {lesson.get('week')}")
                    print(f"  Strand: {lesson.get('strand')}")
                    print(f"  Sub-strand: {lesson.get('sub_strand')}")
                    print(f"  Title: {lesson.get('title', 'N/A')}")
            
        except Exception as e:
            print(f"Error testing with real SOW: {e}")
    else:
        print("\nSTM2025.pdf not found - skipping real file test")

if __name__ == "__main__":
    test_enhanced_parser()
    test_with_real_sow()
