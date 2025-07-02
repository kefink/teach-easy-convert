"""
Simple test for strand identification improvements
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from improved_strand_identifier import ImprovedStrandIdentifier

def test_comprehensive_strand_identification():
    """Comprehensive test of strand identification with various real-world examples"""
    identifier = ImprovedStrandIdentifier()
    
    # Extensive test cases covering various formats and edge cases
    test_cases = [
        # Clear, well-formatted cases
        ("STRAND: Mathematics SUB-STRAND: Numbers", "Mathematics", "Numbers"),
        ("Science: Living things and their habitats", "Science", "Living Things"),
        ("English - Reading comprehension skills", "English", "Reading"),
        ("Creative Arts: Drawing and painting techniques", "Creative Arts", "Visual Arts"),
        
        # Subject-focused cases
        ("Week 1: Understanding fractions and decimals", "Mathematics", "Numbers"),
        ("Geometry lesson: 2D and 3D shapes", "Mathematics", "Geometry"),
        ("Data handling: Creating and interpreting graphs", "Mathematics", "Data Handling"),
        
        # Science variations
        ("Living things: Animal classification", "Science", "Living Things"),
        ("Energy forms and transformations", "Science", "Energy"),
        ("Matter and materials in our environment", "Science", "Non-Living Things"),
        ("Health education: Nutrition and hygiene", "Science", "Health Education"),
        
        # Language subjects
        ("Listening and speaking skills development", "English", "Listening And Speaking"),
        ("Writing: Creative composition", "English", "Writing"),
        ("Kiswahili: Kusoma na kufahamu", "Kiswahili", "Kusoma"),
        
        # Social Studies
        ("History of Kenya: Pre-colonial period", "Social Studies", "History"),
        ("Geography: Physical features of Africa", "Social Studies", "Geography"),
        ("Citizenship education: Rights and duties", "Social Studies", "Citizenship"),
        
        # Other subjects
        ("ICT skills: Using computers safely", "ICT", "Digital Literacy"),
        ("Physical Education: Ball games", "Physical Education", "Games And Sports"),
        ("Religious Education: Christian values", "Religious Education", "Values And Morals"),
        
        # Edge cases and challenging formats
        ("THE HUMAN BODY - DIGESTIVE SYSTEM", "Science", "Living Things"),
        ("NUMBERS AND COUNTING SKILLS", "Mathematics", "Numbers"),
        ("Creative writing and storytelling", "English", "Writing"),
        ("Computer programming basics", "ICT", "Programming"),
        
        # Minimal context cases
        ("Fractions", "Mathematics", "Numbers"),
        ("Plants", "Science", "Living Things"),
        ("Maps", "Social Studies", "Geography"),
        ("Music", "Creative Arts", "Performing Arts"),
        
        # Mixed format cases
        ("Week 5 Lesson 2: Understanding angles in geometry", "Mathematics", "Geometry"),
        ("Science Topic: Weather and climate patterns", "Science", "Environment"),
        ("English Language: Oral presentations", "English", "Listening And Speaking"),
    ]
    
    print("COMPREHENSIVE STRAND IDENTIFICATION TEST")
    print("=" * 70)
    print(f"Testing {len(test_cases)} cases...")
    
    correct_strands = 0
    correct_substrands = 0
    total_tests = len(test_cases)
    
    failed_cases = []
    
    for i, (text, expected_strand, expected_substrand) in enumerate(test_cases, 1):
        strand = identifier.identify_strand(text)
        substrand = identifier.identify_substrand(text, strand)
        
        strand_correct = strand.lower() == expected_strand.lower()
        substrand_correct = substrand.lower() == expected_substrand.lower()
        
        if strand_correct:
            correct_strands += 1
        if substrand_correct:
            correct_substrands += 1
            
        if not (strand_correct and substrand_correct):
            failed_cases.append({
                'text': text,
                'expected': (expected_strand, expected_substrand),
                'got': (strand, substrand),
                'strand_ok': strand_correct,
                'substrand_ok': substrand_correct
            })
        
        # Print progress every 10 tests
        if i % 10 == 0:
            print(f"Completed {i}/{total_tests} tests...")
    
    print("\n" + "=" * 70)
    print("RESULTS SUMMARY")
    print("=" * 70)
    print(f"Strand Accuracy: {correct_strands}/{total_tests} ({correct_strands/total_tests*100:.1f}%)")
    print(f"Sub-strand Accuracy: {correct_substrands}/{total_tests} ({correct_substrands/total_tests*100:.1f}%)")
    print(f"Overall Accuracy: {(correct_strands + correct_substrands)}/{total_tests*2} ({(correct_strands + correct_substrands)/(total_tests*2)*100:.1f}%)")
    
    if failed_cases:
        print(f"\nFAILED CASES ({len(failed_cases)}):")
        print("-" * 70)
        for case in failed_cases:
            print(f"Text: {case['text']}")
            print(f"Expected: {case['expected'][0]} -> {case['expected'][1]}")
            print(f"Got:      {case['got'][0]} -> {case['got'][1]}")
            status = []
            if not case['strand_ok']:
                status.append("strand")
            if not case['substrand_ok']:
                status.append("substrand")
            print(f"Failed:   {', '.join(status)}")
            print()
    
    return correct_strands, correct_substrands, total_tests

def analyze_subject_coverage():
    """Analyze how well different subjects are covered"""
    identifier = ImprovedStrandIdentifier()
    
    print("\n" + "=" * 70)
    print("SUBJECT COVERAGE ANALYSIS")
    print("=" * 70)
    
    subjects = {
        'Mathematics': ['numbers', 'geometry', 'measurement', 'fractions', 'algebra'],
        'Science': ['living things', 'energy', 'matter', 'health', 'environment'],
        'English': ['reading', 'writing', 'listening', 'speaking', 'grammar'],
        'Social Studies': ['history', 'geography', 'citizenship', 'economics'],
        'Creative Arts': ['drawing', 'music', 'dance', 'drama', 'crafts'],
        'ICT': ['computers', 'programming', 'internet', 'digital skills'],
    }
    
    for subject, keywords in subjects.items():
        print(f"\n{subject}:")
        for keyword in keywords:
            strand = identifier.identify_strand(keyword)
            substrand = identifier.identify_substrand(keyword, strand)
            print(f"  '{keyword}' -> {strand} : {substrand}")

if __name__ == "__main__":
    test_comprehensive_strand_identification()
    analyze_subject_coverage()
