#!/usr/bin/env python3

import sys
import os
sys.path.append('.')

from enhanced_parser import EnhancedSchemeParser

def test_stm2025():
    parser = EnhancedSchemeParser()
    filename = '../STM2025.pdf'
    
    if os.path.exists(filename):
        print(f'Testing enhanced parser with: STM2025.pdf')
        print('=' * 50)
        
        with open(filename, 'rb') as f:
            file_content = f.read()
        
        print(f'File size: {len(file_content)} bytes')
        
        # Test the parser
        result = parser.parse_scheme(file_content, 'STM2025.pdf')
        
        print(f'Success: {result["success"]}')
        print(f'Message: {result["message"]}')
        print(f'Lessons found: {len(result["lesson_plans"])}')
        print(f'Weeks found: {result["weeks_found"]}')
        
        if result['lesson_plans']:
            print('\n=== FIRST 3 LESSONS SAMPLE ===')
            for i, lesson in enumerate(result['lesson_plans'][:3]):
                print(f'\nLesson {i+1}:')
                print(f'  Week: {lesson["week"]}')
                print(f'  Lesson Number: {lesson["lessonNumber"]}')
                print(f'  Title: {lesson["title"]}')
                print(f'  Strand: {lesson["strand"]}')
                print(f'  Sub-strand: {lesson["sub_strand"]}')
                print(f'  Learning Outcomes: {len(lesson["specific_learning_outcomes"])} items')
                if lesson["specific_learning_outcomes"]:
                    print(f'    First outcome: {lesson["specific_learning_outcomes"][0][:100]}...')
                print(f'  Key Inquiry: {lesson["key_inquiry_question"][:100]}...' if lesson["key_inquiry_question"] else '  Key Inquiry: None')
                print(f'  Resources: {len(lesson["learning_resources"])} items')
                print(f'  Assessment: {lesson["assessment"][:100]}...' if lesson["assessment"] else '  Assessment: None')
        else:
            print('\nNo lessons found. Let me check the raw text extraction...')
            try:
                text = parser.extract_text_from_pdf(file_content)
                print(f'\nExtracted text length: {len(text)} characters')
                print('\nFirst 1000 characters of extracted text:')
                print('-' * 40)
                print(text[:1000])
                print('-' * 40)
                
                # Check for week patterns manually
                lines = text.split('\n')
                print(f'\nTotal lines: {len(lines)}')
                print('\nFirst 20 lines:')
                for i, line in enumerate(lines[:20]):
                    if line.strip():
                        print(f'{i+1:2d}: {line.strip()}')
                        
            except Exception as e:
                print(f'Error extracting text: {e}')
    else:
        print(f'File not found: {filename}')

if __name__ == "__main__":
    test_stm2025()
