"""
Test script to evaluate and improve strand identification logic
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from enhanced_parser import EnhancedSchemeParser
import re

def test_strand_identification():
    """Test strand identification on various sample texts"""
    parser = EnhancedSchemeParser()
    
    # Test cases with expected strands
    test_cases = [
        # Mathematics examples
        {
            'text': 'Week 1 Lesson 1 Numbers: Place value By the end of the lesson, learners should be able to identify place value of digits',
            'expected_strand': 'Numbers',
            'expected_substrand': 'Place Value'
        },
        {
            'text': 'STRAND: GEOMETRY SUB-STRAND: 2D shapes Learning outcomes: identify shapes',
            'expected_strand': 'Geometry', 
            'expected_substrand': '2D Shapes'
        },
        {
            'text': 'Measurement concepts - length and mass. Students will measure objects using standard units',
            'expected_strand': 'Measurement',
            'expected_substrand': 'Length And Mass'
        },
        
        # Science examples
        {
            'text': 'Living things and their habitats. By the end, learners will classify animals',
            'expected_strand': 'Living Things',
            'expected_substrand': 'Habitats'
        },
        {
            'text': 'ENERGY: Heat and temperature. Students explore thermal energy',
            'expected_strand': 'Energy',
            'expected_substrand': 'Heat And Temperature'
        },
        {
            'text': 'Matter and materials - properties of solids, liquids and gases',
            'expected_strand': 'Non-Living Things',
            'expected_substrand': 'Properties Of Matter'
        },
        
        # Language examples
        {
            'text': 'LISTENING AND SPEAKING: Oral presentations. Learners will give talks',
            'expected_strand': 'Listening And Speaking',
            'expected_substrand': 'Oral Presentations'
        },
        {
            'text': 'Reading comprehension skills - understanding main ideas',
            'expected_strand': 'Reading',
            'expected_substrand': 'Comprehension Skills'
        },
        {
            'text': 'Writing: Creative writing and composition',
            'expected_strand': 'Writing',
            'expected_substrand': 'Creative Writing'
        },
        
        # Social Studies examples
        {
            'text': 'History of Kenya - pre-colonial period',
            'expected_strand': 'History',
            'expected_substrand': 'Pre-Colonial Period'
        },
        {
            'text': 'Geography: Physical features of East Africa',
            'expected_strand': 'Geography',
            'expected_substrand': 'Physical Features'
        },
        {
            'text': 'Citizenship education - rights and responsibilities',
            'expected_strand': 'Citizenship',
            'expected_substrand': 'Rights And Responsibilities'
        },
        
        # Edge cases
        {
            'text': 'Week 5: Understanding fractions and decimals in daily life',
            'expected_strand': 'Numbers',
            'expected_substrand': 'Fractions And Decimals'
        },
        {
            'text': 'THE HUMAN BODY SYSTEMS - DIGESTIVE SYSTEM',
            'expected_strand': 'Living Things',
            'expected_substrand': 'Human Body Systems'
        },
        {
            'text': 'Creative Arts: Drawing and painting techniques',
            'expected_strand': 'Creative Arts',
            'expected_substrand': 'Drawing And Painting'
        },
        {
            'text': 'ICT skills - Using word processing software',
            'expected_strand': 'ICT',
            'expected_substrand': 'Word Processing'
        },
    ]
    
    print("=" * 80)
    print("STRAND IDENTIFICATION TEST RESULTS")
    print("=" * 80)
    
    correct_strands = 0
    correct_substrands = 0
    total_tests = len(test_cases)
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\nTest {i}:")
        print(f"Input: {test_case['text']}")
        print(f"Expected Strand: {test_case['expected_strand']}")
        print(f"Expected Sub-strand: {test_case['expected_substrand']}")
        
        # Test strand identification
        identified_strand = parser.identify_strand_from_content(test_case['text'])
        identified_substrand = parser.identify_substrand_from_content(test_case['text'], identified_strand)
        
        print(f"Identified Strand: {identified_strand}")
        print(f"Identified Sub-strand: {identified_substrand}")
        
        # Check accuracy
        strand_correct = identified_strand.lower() == test_case['expected_strand'].lower()
        substrand_correct = identified_substrand.lower() == test_case['expected_substrand'].lower()
        
        if strand_correct:
            correct_strands += 1
            print("✓ Strand: CORRECT")
        else:
            print("✗ Strand: INCORRECT")
        
        if substrand_correct:
            correct_substrands += 1
            print("✓ Sub-strand: CORRECT")
        else:
            print("✗ Sub-strand: INCORRECT")
    
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Strand Accuracy: {correct_strands}/{total_tests} ({correct_strands/total_tests*100:.1f}%)")
    print(f"Sub-strand Accuracy: {correct_substrands}/{total_tests} ({correct_substrands/total_tests*100:.1f}%)")
    print(f"Overall Accuracy: {(correct_strands + correct_substrands)}/{total_tests*2} ({(correct_strands + correct_substrands)/(total_tests*2)*100:.1f}%)")
    
    return correct_strands, correct_substrands, total_tests

def analyze_strand_patterns():
    """Analyze patterns in strand identification"""
    parser = EnhancedSchemeParser()
    
    print("\n" + "=" * 80)
    print("STRAND PATTERN ANALYSIS")
    print("=" * 80)
    
    # Test various content formats
    formats = [
        "STRAND: Mathematics SUB-STRAND: Numbers",
        "Mathematics - Numbers and counting",
        "Subject: Math Topic: Place value",
        "Week 1: Understanding numbers",
        "NUMBERS: Place value concepts",
        "Learning about geometric shapes",
        "Energy forms and transformations",
        "Creative writing skills development",
    ]
    
    for fmt in formats:
        print(f"\nFormat: {fmt}")
        strand = parser.identify_strand_from_content(fmt)
        substrand = parser.identify_substrand_from_content(fmt, strand)
        print(f"  Strand: {strand}")
        print(f"  Sub-strand: {substrand}")

if __name__ == "__main__":
    print("Testing enhanced strand identification...")
    test_strand_identification()
    analyze_strand_patterns()
