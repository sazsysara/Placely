#!/usr/bin/env python
import argparse
from datetime import datetime, timezone

from app import app, fetch_leetcode_profile, get_students_data, update_student_data


def is_invalid_username_message(message):
    text = str(message or '').strip().lower()
    if not text:
        return False
    invalid_markers = (
        'that user does not exist',
        'user not found',
        'does not exist'
    )
    return any(marker in text for marker in invalid_markers)


def clean_invalid_usernames(apply_changes=False):
    students = get_students_data()
    checked = 0
    invalid = []

    for student in students:
        username = str(student.get('leetcodeUsername') or '').strip()
        if not username:
            continue

        checked += 1
        profile = fetch_leetcode_profile(username)
        if profile.get('success'):
            continue

        message = profile.get('message')
        if not is_invalid_username_message(message):
            continue

        invalid.append({
            'id': student.get('id'),
            'name': student.get('name'),
            'username': username,
            'message': message,
        })

    cleared = 0
    cleared_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')
    if apply_changes:
        for row in invalid:
            updated = update_student_data(row['id'], {
                'leetcodeUsername': '',
                'leetcodeRanking': None,
                'leetcodeSolvedAll': None,
                'leetcodeSolvedEasy': None,
                'leetcodeSolvedMedium': None,
                'leetcodeSolvedHard': None,
                'leetcodeAcceptanceAll': None,
                'leetcodeAcceptanceEasy': None,
                'leetcodeAcceptanceMedium': None,
                'leetcodeAcceptanceHard': None,
                'leetcodeLastSyncedAt': cleared_at,
            })
            if updated:
                cleared += 1

    return {
        'checked': checked,
        'invalid': invalid,
        'invalid_count': len(invalid),
        'cleared': cleared,
        'apply_changes': apply_changes,
    }


def main():
    parser = argparse.ArgumentParser(description='Clear invalid LeetCode usernames from students data')
    parser.add_argument('--apply', action='store_true', help='Persist cleanup to database')
    args = parser.parse_args()

    with app.app_context():
        summary = clean_invalid_usernames(apply_changes=args.apply)
        print(f"Checked usernames: {summary['checked']}")
        print(f"Invalid usernames found: {summary['invalid_count']}")
        if summary['invalid_count']:
            print('\nInvalid entries:')
            for item in summary['invalid']:
                print(f"  - {item['name']} | {item['username']} | {item['message']}")
        if args.apply:
            print(f"\nCleared from DB: {summary['cleared']}")
        else:
            print('\nDry run only. Re-run with --apply to persist changes.')


if __name__ == '__main__':
    main()
