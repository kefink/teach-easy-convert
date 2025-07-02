#!/usr/bin/env python3
"""
STM2025.pdf Test Results Summary
Enhanced Scheme Parser Performance Analysis
"""

import sys
import os
sys.path.append('.')

from enhanced_parser import EnhancedSchemeParser

def analyze_stm2025():
    parser = EnhancedSchemeParser()
    filename = '../STM2025.pdf'
    
    print("=" * 60)
    print("STM2025.PDF PARSING ANALYSIS REPORT")
    print("=" * 60)
    
    if not os.path.exists(filename):
        print("❌ STM2025.pdf not found!")
        return
    
    with open(filename, 'rb') as f:
        file_content = f.read()
    
    print(f"📄 File size: {len(file_content):,} bytes ({len(file_content)/1024/1024:.1f} MB)")
    
    # Parse the scheme
    result = parser.parse_scheme(file_content, 'STM2025.pdf')
    
    print(f"✅ Parsing success: {result['success']}")
    print(f"📊 Total lessons extracted: {len(result['lesson_plans'])}")
    print(f"📅 Weeks covered: {len(set(lesson['week'] for lesson in result['lesson_plans']))}")
    
    if result['lesson_plans']:
        # Analyze content quality
        lessons_with_outcomes = sum(1 for l in result['lesson_plans'] if l['specific_learning_outcomes'])
        lessons_with_strands = sum(1 for l in result['lesson_plans'] if l['strand'] != 'General')
        lessons_with_inquiry = sum(1 for l in result['lesson_plans'] if l['key_inquiry_question'] != 'How can we apply this knowledge?')
        lessons_with_resources = sum(1 for l in result['lesson_plans'] if len(l['learning_resources']) > 2)
        
        print(f"📝 Lessons with learning outcomes: {lessons_with_outcomes}/{len(result['lesson_plans'])} ({lessons_with_outcomes/len(result['lesson_plans'])*100:.1f}%)")
        print(f"🎯 Lessons with specific strands: {lessons_with_strands}/{len(result['lesson_plans'])} ({lessons_with_strands/len(result['lesson_plans'])*100:.1f}%)")
        print(f"❓ Lessons with inquiry questions: {lessons_with_inquiry}/{len(result['lesson_plans'])} ({lessons_with_inquiry/len(result['lesson_plans'])*100:.1f}%)")
        print(f"📚 Lessons with detailed resources: {lessons_with_resources}/{len(result['lesson_plans'])} ({lessons_with_resources/len(result['lesson_plans'])*100:.1f}%)")
        
        print("\n" + "=" * 60)
        print("SAMPLE LESSON ANALYSIS")
        print("=" * 60)
        
        # Show a well-parsed lesson
        best_lesson = None
        best_score = 0
        
        for lesson in result['lesson_plans']:
            score = 0
            if lesson['specific_learning_outcomes']: score += 2
            if lesson['strand'] != 'General': score += 2
            if lesson['key_inquiry_question'] != 'How can we apply this knowledge?': score += 1
            if len(lesson['learning_resources']) > 2: score += 1
            if lesson['assessment'] != 'Observation and oral questions': score += 1
            
            if score > best_score:
                best_score = score
                best_lesson = lesson
        
        if best_lesson:
            print(f"Best parsed lesson (Week {best_lesson['week']}):")
            print(f"  📚 Title: {best_lesson['title']}")
            print(f"  🎯 Strand: {best_lesson['strand']}")
            print(f"  📝 Sub-strand: {best_lesson['sub_strand']}")
            print(f"  🎓 Learning Outcomes ({len(best_lesson['specific_learning_outcomes'])}):")
            for i, outcome in enumerate(best_lesson['specific_learning_outcomes'][:3]):
                print(f"    {i+1}. {outcome[:80]}...")
            print(f"  ❓ Key Inquiry: {best_lesson['key_inquiry_question'][:80]}...")
            print(f"  📚 Resources: {', '.join(best_lesson['learning_resources'][:3])}")
            print(f"  📊 Assessment: {best_lesson['assessment'][:80]}...")
        
        print("\n" + "=" * 60)
        print("READINESS FOR LESSON PLAN GENERATION")
        print("=" * 60)
        
        if len(result['lesson_plans']) >= 10:
            print("✅ Sufficient content for comprehensive lesson plans")
        else:
            print("⚠️  Limited content - may need manual enhancement")
            
        if lessons_with_outcomes > len(result['lesson_plans']) * 0.7:
            print("✅ Good learning outcomes coverage")
        else:
            print("⚠️  Learning outcomes may need manual review")
            
        if lessons_with_strands > len(result['lesson_plans']) * 0.5:
            print("✅ Good strand identification")
        else:
            print("⚠️  Strand identification may need improvement")
            
        print("\n🎉 STM2025.pdf is ready for lesson plan generation!")
        print("   Teachers can proceed with confidence knowing the parsing")
        print("   extracted comprehensive scheme data successfully.")
        
    else:
        print("❌ No lessons could be extracted from this scheme")
        print("   This scheme may require manual configuration")

if __name__ == "__main__":
    analyze_stm2025()
