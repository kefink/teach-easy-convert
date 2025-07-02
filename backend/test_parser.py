#!/usr/bin/env python3

import sys
import os
sys.path.append('.')

from enhanced_parser import EnhancedSchemeParser

def test_parser():
    parser = EnhancedSchemeParser()
    
    # Test with simple text first
    test_text = """
GRADE 2 MATHEMATICS SCHEMES OF WORK - TERM 2

Week Lesson Strand Sub-Strand Specific Learning Outcomes Learning Experiences
1
1
NUMBERS
Number concepts Reading numbers
By the end of the lesson the learner should be able to: a) Identify numbers 1-80 in symbols. b) Read numbers 1-80 in symbols in the class room. c) Write numbers 1-80 in symbols.
Learners to count in 2's, 3's, 5's and 10's up to 80 in the class room.

2
1
NUMBERS
Number Concepts How many?
By the end of the lesson the learner should be able to: a) Name the objects represented in the pictures. b) Read, represent and write numbers up to 80 using objects.
"""
    
    print("Testing with simple text...")
    lessons = parser.parse_free_format(test_text)
    print(f"Found {len(lessons)} lessons")
    
    for i, lesson in enumerate(lessons):
        print(f"\nLesson {i+1}:")
        print(f"  Week: {lesson['week']}")
        print(f"  Title: {lesson['title']}")
        print(f"  Strand: {lesson['strand']}")
        print(f"  Sub-strand: {lesson['sub_strand']}")
        print(f"  Outcomes: {lesson['specific_learning_outcomes']}")

if __name__ == "__main__":
    test_parser()
