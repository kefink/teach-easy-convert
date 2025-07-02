#!/usr/bin/env python3

import re

def debug_week_patterns():
    test_lines = [
        "1",
        "Week 1",
        "1 1 NUMBERS",
        "2 1 NUMBERS",
        "Week Lesson Strand",
        "WEEK 1"
    ]
    
    week_patterns = [
        r'(?:week|wk|w)\s*[:\-]?\s*(\d+)',
        r'^(\d+)\s*$',  # Just a number on its own line
        r'(\d+)\s+(?:week|wk)',
        r'^(\d+)\s+\d+',  # Pattern like "1 1" (week lesson)
    ]
    
    print("Testing week detection patterns:")
    for line in test_lines:
        print(f"\nTesting line: '{line}'")
        line_lower = line.lower().strip()
        
        for i, pattern in enumerate(week_patterns):
            match = re.search(pattern, line_lower)
            if match:
                print(f"  Pattern {i+1} matched: {match.group(1)}")
            else:
                print(f"  Pattern {i+1}: No match")

if __name__ == "__main__":
    debug_week_patterns()
