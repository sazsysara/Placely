#!/usr/bin/env python
import sys
from app import get_students_data, scheduled_fetch_leetcode_stats, fetch_leetcode_profile

students = get_students_data()
print(f"\nTotal students: {len(students)}\n")
for student in students:
    username = student.get('leetcodeUsername')
    print(f"  {student['name']:30} | leetcodeUsername: {username or 'EMPTY'}")

print("\n" + "="*60)
print("Running sync now...")
print("="*60 + "\n")
force = '--force' in sys.argv
scheduled_fetch_leetcode_stats(force=force)
