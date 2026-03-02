from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from datetime import datetime, timezone
import base64
import json
import os
import re
import time
import requests as http_requests
from urllib.parse import urljoin
from apscheduler.schedulers.background import BackgroundScheduler
from typing import Any

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

import config

create_client: Any = None
try:
    from supabase import create_client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False

# Try to import Google OAuth libraries, but don't fail if they're missing
id_token: Any = None
google_requests: Any = None
Flow: Any = None
try:
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests
    from google_auth_oauthlib.flow import Flow
    GOOGLE_OAUTH_AVAILABLE = True
except ImportError:
    GOOGLE_OAUTH_AVAILABLE = False

app = Flask(__name__, static_folder='client', template_folder='templates')
app.secret_key = os.environ.get('SECRET_KEY', 'placely-secret-key-2026')

# Configure Flask for HTTPS on Railway (behind reverse proxy)
app.config['PREFERRED_URL_SCHEME'] = 'https'
# Set secure cookies for hosted deployments (Railway/Vercel), allow HTTP on localhost
_is_hosted_env = any([
    'RAILWAY_PUBLIC_DOMAIN' in os.environ,
    bool(os.environ.get('VERCEL')),
    bool(os.environ.get('VERCEL_URL')),
    bool(os.environ.get('APP_BASE_URL'))
])
app.config['SESSION_COOKIE_SECURE'] = _is_hosted_env
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Allow cookies on OAuth redirects

# Trust X-Forwarded-* headers from Railway's reverse proxy
from werkzeug.middleware.proxy_fix import ProxyFix
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

SUPABASE_URL = (
    os.environ.get('SUPABASE_URL', '').strip()
    or getattr(config, 'SUPABASE_URL', '').strip()
)

SUPABASE_SERVICE_ROLE_KEY = (
    os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '').strip()
    or os.environ.get('SUPABASE_SERVICE_KEY', '').strip()
    or os.environ.get('SUPABASE_SECRET', '').strip()
    or getattr(config, 'SUPABASE_SERVICE_ROLE_KEY', '').strip()
)

SUPABASE_FALLBACK_KEY = (
    os.environ.get('SUPABASE_KEY', '').strip()
    or os.environ.get('SUPABASE_SECRET_KEY', '').strip()
    or os.environ.get('SUPABASE_ANON_KEY', '').strip()
    or os.environ.get('SUPABASE_PUBLISHABLE_KEY', '').strip()
    or getattr(config, 'SUPABASE_KEY', '').strip()
)

def _extract_supabase_jwt_role(jwt_token):
    token = str(jwt_token or '').strip()
    parts = token.split('.')
    if len(parts) < 2:
        return ''

    payload_segment = parts[1]
    padding = '=' * (-len(payload_segment) % 4)
    try:
        decoded_payload = base64.urlsafe_b64decode(f"{payload_segment}{padding}".encode('utf-8')).decode('utf-8')
        payload = json.loads(decoded_payload)
        return str(payload.get('role') or '').strip()
    except Exception:
        return ''


SUPABASE_DB_KEY = SUPABASE_SERVICE_ROLE_KEY
if not SUPABASE_DB_KEY and SUPABASE_FALLBACK_KEY:
    fallback_role = _extract_supabase_jwt_role(SUPABASE_FALLBACK_KEY)
    if fallback_role == 'service_role':
        SUPABASE_DB_KEY = SUPABASE_FALLBACK_KEY
    else:
        print('Supabase fallback key is not service_role; database integration disabled for safety.')

SUPABASE_ENABLED = bool(SUPABASE_AVAILABLE and create_client and SUPABASE_URL and SUPABASE_DB_KEY)

supabase = None
if SUPABASE_ENABLED:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_DB_KEY)
    except Exception as exc:
        print(f"Supabase initialization failed: {exc}")
        supabase = None

# Google OAuth Setup
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID') or getattr(config, 'GOOGLE_CLIENT_ID', 'YOUR_GOOGLE_CLIENT_ID_HERE')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET') or getattr(config, 'GOOGLE_CLIENT_SECRET', 'YOUR_GOOGLE_CLIENT_SECRET_HERE')

# LinkedIn OAuth Setup
LINKEDIN_CLIENT_ID = os.environ.get('LINKEDIN_CLIENT_ID') or getattr(config, 'LINKEDIN_CLIENT_ID', 'YOUR_LINKEDIN_CLIENT_ID_HERE')
LINKEDIN_CLIENT_SECRET = os.environ.get('LINKEDIN_CLIENT_SECRET') or getattr(config, 'LINKEDIN_CLIENT_SECRET', 'YOUR_LINKEDIN_CLIENT_SECRET_HERE')

# Check if Google OAuth is properly configured
GOOGLE_OAUTH_ENABLED = (
    GOOGLE_OAUTH_AVAILABLE and
    GOOGLE_CLIENT_ID != 'YOUR_GOOGLE_CLIENT_ID_HERE' and 
    GOOGLE_CLIENT_SECRET != 'YOUR_GOOGLE_CLIENT_SECRET_HERE'
)

# Check if LinkedIn OAuth is properly configured
LINKEDIN_OAUTH_ENABLED = (
    LINKEDIN_CLIENT_ID != 'YOUR_LINKEDIN_CLIENT_ID_HERE' and 
    LINKEDIN_CLIENT_SECRET != 'YOUR_LINKEDIN_CLIENT_SECRET_HERE'
)

RAILWAY_PUBLIC_DOMAIN = os.environ.get('RAILWAY_PUBLIC_DOMAIN', '').strip()
APP_BASE_URL = os.environ.get('APP_BASE_URL', '').strip()
VERCEL_URL = os.environ.get('VERCEL_URL', '').strip()
VERCEL_PROJECT_PRODUCTION_URL = os.environ.get('VERCEL_PROJECT_PRODUCTION_URL', '').strip()
VERCEL_BRANCH_URL = os.environ.get('VERCEL_BRANCH_URL', '').strip()


def get_deployed_base_url():
    if APP_BASE_URL:
        return APP_BASE_URL if APP_BASE_URL.startswith('http') else f"https://{APP_BASE_URL}"

    if not RAILWAY_PUBLIC_DOMAIN:
        vercel_host = VERCEL_PROJECT_PRODUCTION_URL or VERCEL_URL or VERCEL_BRANCH_URL
        if not vercel_host:
            return ''
        return vercel_host if vercel_host.startswith('http') else f"https://{vercel_host}"
    return f"https://{RAILWAY_PUBLIC_DOMAIN}"


def get_google_redirect_uri():
    base_url = get_deployed_base_url()
    if not base_url:
        return ''
    return f"{base_url}/callback"


def get_linkedin_redirect_uri():
    configured_redirect_uri = (
        os.environ.get('LINKEDIN_REDIRECT_URI', '').strip()
        or getattr(config, 'LINKEDIN_REDIRECT_URI', '').strip()
    )
    if configured_redirect_uri and configured_redirect_uri != 'YOUR_LINKEDIN_REDIRECT_URI_HERE':
        if configured_redirect_uri.startswith('https://'):
            return configured_redirect_uri

    base_url = get_deployed_base_url()
    if base_url:
        return f"{base_url}/linkedin-callback"

    raise ValueError('Set LINKEDIN_REDIRECT_URI or APP_BASE_URL (or hosted domain env like RAILWAY_PUBLIC_DOMAIN / VERCEL_URL) for LinkedIn OAuth')


def build_linkedin_authorization_url(state):
    from urllib.parse import urlencode

    auth_url = 'https://www.linkedin.com/oauth/v2/authorization'
    params = {
        'response_type': 'code',
        'client_id': LINKEDIN_CLIENT_ID,
        'redirect_uri': get_linkedin_redirect_uri(),
        'state': state,
        'scope': 'openid profile email'
    }
    return f"{auth_url}?{urlencode(params)}"

# Determine deployed OAuth redirect URI
REDIRECT_URI = get_google_redirect_uri()

# Only create client_secrets if OAuth is available
if GOOGLE_OAUTH_ENABLED:
    client_secrets = {
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [REDIRECT_URI]
        }
    }
else:
    client_secrets = {}

# Data
students = []
_STUDENTS_COLUMN_AVAILABILITY = {}

recently_placed = [
    {"name": "Priya Sharma", "package": 18.5, "company": "Google", "position": "Software Engineer", "graduationYear": 2024, "date": "2026-01-25"},
    {"name": "Aarav Kumar", "package": 16.8, "company": "Microsoft", "position": "SDE-2", "graduationYear": 2024, "date": "2026-01-20"},
    {"name": "Sneha Reddy", "package": 15.2, "company": "Amazon", "position": "Associate Engineer", "graduationYear": 2025, "date": "2026-01-18"}
]

upcoming_companies = [
    {"name": "Microsoft", "visitDate": "Feb 5, 2026", "position": "Software Engineer", "salary": "20-24 LPA", "ctc": "22 LPA"},
    {"name": "ServiceNow", "visitDate": "Feb 7, 2026", "position": "Developer", "salary": "18-22 LPA", "ctc": "20 LPA"},
    {"name": "Autodesk", "visitDate": "Feb 9, 2026", "position": "Software Developer", "salary": "19-23 LPA", "ctc": "21 LPA"},
    {"name": "Amazon", "visitDate": "Feb 11, 2026", "position": "SDE I", "salary": "17-21 LPA", "ctc": "19 LPA"},
    {"name": "Commvault Cloud", "visitDate": "Feb 13, 2026", "position": "Engineer", "salary": "16-20 LPA", "ctc": "18 LPA"},
    {"name": "JustPay", "visitDate": "Feb 15, 2026", "position": "Backend Engineer", "salary": "12-16 LPA", "ctc": "14 LPA"},
    {"name": "Wells Fargo", "visitDate": "Feb 17, 2026", "position": "Technology Analyst", "salary": "15-18 LPA", "ctc": "16.5 LPA"},
    {"name": "Global Knowledge", "visitDate": "Feb 19, 2026", "position": "Associate", "salary": "8-10 LPA", "ctc": "9 LPA"},
    {"name": "ThoughtWorks", "visitDate": "Feb 21, 2026", "position": "Developer", "salary": "14-18 LPA", "ctc": "16 LPA"},
    {"name": "Akaike", "visitDate": "Feb 23, 2026", "position": "Software Engineer", "salary": "12-15 LPA", "ctc": "13.5 LPA"},
]

placed_students = [
    {"name": "Priya Sharma", "dept": "CSE", "package": 18.5, "company": "Google", "position": "Software Engineer", "graduationYear": 2024, "date": "2026-01-25", "leetcodeSolvedAll": 150, "internships": 1, "certifications": 4, "gradePoints": 8.3},
    {"name": "Aarav Kumar", "dept": "CSE", "package": 16.8, "company": "Microsoft", "position": "SDE-2", "graduationYear": 2024, "date": "2026-01-20", "leetcodeSolvedAll": 120, "internships": 2, "certifications": 3, "gradePoints": 8.7},
    {"name": "Sneha Reddy", "dept": "IT", "package": 15.2, "company": "Amazon", "position": "Associate Engineer", "graduationYear": 2025, "date": "2026-01-18", "leetcodeSolvedAll": 80, "internships": 1, "certifications": 2, "gradePoints": 9.1},
    {"name": "Rahul Singh", "dept": "ECE", "package": 14.5, "company": "Infosys", "position": "Systems Engineer", "graduationYear": 2024, "date": "2026-01-15", "leetcodeSolvedAll": 200, "internships": 0, "certifications": 1, "gradePoints": 7.9},
    {"name": "Vikram Patel", "dept": "ME", "package": 12.0, "company": "TCS", "position": "Digital Engineer", "graduationYear": 2025, "date": "2026-01-10", "leetcodeSolvedAll": 60, "internships": 2, "certifications": 2, "gradePoints": 8.9}
]

staff_credentials = {"email": "staff@college.edu", "password": "staff123"}

INTERNSHIP_CACHE_TTL_SECONDS = 900
_LIVE_INTERNSHIPS_CACHE = {
    'fetched_at': 0.0,
    'data': []
}

STUDENT_LEETCODE_TABLE = 'student_leetcode_profiles'
STUDENT_ACADEMIC_TABLE = 'student_academic_metrics'
STUDENT_PROFILE_TABLE = 'student_profile_preferences'
STUDENT_LINKED_TABLE = 'linkedin'

LEETCODE_FIELD_MAP = {
    'leetcodeUsername': 'leetcode_username',
    'leetcodeRanking': 'leetcode_ranking',
    'leetcodeSolvedAll': 'leetcode_solved_all',
    'leetcodeSolvedEasy': 'leetcode_solved_easy',
    'leetcodeSolvedMedium': 'leetcode_solved_medium',
    'leetcodeSolvedHard': 'leetcode_solved_hard',
    'leetcodeAcceptanceAll': 'leetcode_acceptance_all',
    'leetcodeAcceptanceEasy': 'leetcode_acceptance_easy',
    'leetcodeAcceptanceMedium': 'leetcode_acceptance_medium',
    'leetcodeAcceptanceHard': 'leetcode_acceptance_hard',
    'leetcodeLastSyncedAt': 'leetcode_last_synced_at',
}

ACADEMIC_FIELD_MAP = {
    'internships': 'internships',
    'certifications': 'certifications',
    'gradePoints': 'grade_points',
    'tenthPercentage': 'tenth_percentage',
    'twelfthPercentage': 'twelfth_percentage',
    'diplomaPercentage': 'diploma_percentage',
}

PROFILE_FIELD_MAP = {
    'interest': 'interest',
    'placementStatus': 'placement_status',
    'personalMail': 'personal_mail',
    'collegeMail': 'college_mail',
    'contactNo': 'contact_no',
    'address': 'address',
    'resumeLink': 'resume_link',
    'preferredRoles': 'preferred_roles',
    'preferredShift': 'preferred_shift',
    'travelPriority': 'travel_priority',
    'achievements': 'achievements',
}

LINKED_FIELD_MAP = {
    'linkedinName': 'linkedin_username',
    'linkedinUrl': 'linkedin_profile_url',
}

SIDE_TABLE_CONTEXT_DB_FIELDS = ('name', 'dept', 'year')

STUDENTS_BASE_FIELD_MAP = {
    'name': 'name',
    'email': 'email',
    'year': 'year',
    'dept': 'dept',
    'rollNo': 'roll_no',
    'registerNo': 'register_no',
    'section': 'section',
    'gender': 'gender',
    'residencyType': 'residency_type',
}

SIDE_TABLE_DEFINITIONS = [
    (STUDENT_LEETCODE_TABLE, LEETCODE_FIELD_MAP),
    (STUDENT_ACADEMIC_TABLE, ACADEMIC_FIELD_MAP),
    (STUDENT_PROFILE_TABLE, PROFILE_FIELD_MAP),
    (STUDENT_LINKED_TABLE, LINKED_FIELD_MAP),
]

STUDENT_ALLOWED_FIELDS = {
    'name', 'email', 'leetcodeUsername', 'internships',
    'certifications', 'gradePoints', 'year', 'interest', 'placementStatus', 'dept',
    'tenthPercentage', 'twelfthPercentage',
    'rollNo', 'registerNo', 'section', 'gender', 'residencyType',
    'diplomaPercentage', 'personalMail', 'collegeMail', 'contactNo',
    'address', 'resumeLink', 'preferredRoles', 'preferredShift',
    'travelPriority', 'achievements',
    'linkedinName', 'linkedinUrl',
    'leetcodeRanking', 'leetcodeSolvedAll', 'leetcodeSolvedEasy', 'leetcodeSolvedMedium',
    'leetcodeSolvedHard', 'leetcodeAcceptanceAll', 'leetcodeAcceptanceEasy',
    'leetcodeAcceptanceMedium', 'leetcodeAcceptanceHard', 'leetcodeLastSyncedAt'
}


def _db_to_student(row):
    register_no = row.get('register_no')
    return {
        'id': register_no if register_no is not None else row.get('id'),
        'name': row.get('name'),
        'email': row.get('email'),
        'leetcodeUsername': row.get('leetcode_username') or '',
        'internships': row.get('internships', 0),
        'certifications': row.get('certifications', 0),
        'gradePoints': row.get('grade_points', 0),
        'year': row.get('year', 0),
        'interest': row.get('interest') or '',
        'placementStatus': row.get('placement_status') or '',
        'dept': row.get('dept') or '',
        'rollNo': row.get('roll_no') or '',
        'registerNo': register_no or '',
        'section': row.get('section') or '',
        'gender': row.get('gender') or '',
        'residencyType': row.get('residency_type') or '',
        'tenthPercentage': row.get('tenth_percentage'),
        'twelfthPercentage': row.get('twelfth_percentage'),
        'diplomaPercentage': row.get('diploma_percentage'),
        'personalMail': row.get('personal_mail') or '',
        'collegeMail': row.get('college_mail') or '',
        'contactNo': row.get('contact_no') or '',
        'address': row.get('address') or '',
        'resumeLink': row.get('resume_link') or '',
        'preferredRoles': row.get('preferred_roles') or '',
        'preferredShift': row.get('preferred_shift') or '',
        'travelPriority': row.get('travel_priority') or '',
        'achievements': row.get('achievements') or '',
        'linkedinName': row.get('linkedin_username') or row.get('profile_name') or row.get('linkedin_name') or '',
        'linkedinPhotoUrl': row.get('linkedin_photo_url') or '',
        'linkedinUrl': row.get('linkedin_profile_url') or row.get('profile_url') or row.get('linkedin_url') or '',
        'linkedinHeadline': row.get('linkedin_bio') or '',
        'leetcodeRanking': row.get('leetcode_ranking'),
        'leetcodeSolvedAll': row.get('leetcode_solved_all', 0),
        'leetcodeSolvedEasy': row.get('leetcode_solved_easy'),
        'leetcodeSolvedMedium': row.get('leetcode_solved_medium'),
        'leetcodeSolvedHard': row.get('leetcode_solved_hard'),
        'leetcodeAcceptanceAll': row.get('leetcode_acceptance_all'),
        'leetcodeAcceptanceEasy': row.get('leetcode_acceptance_easy'),
        'leetcodeAcceptanceMedium': row.get('leetcode_acceptance_medium'),
        'leetcodeAcceptanceHard': row.get('leetcode_acceptance_hard'),
        'leetcodeLastSyncedAt': row.get('leetcode_last_synced_at'),
    }


def _student_to_db(payload, field_map=None):
    mapped = {}
    active_field_map = field_map or STUDENTS_BASE_FIELD_MAP
    for key, value in payload.items():
        db_key = active_field_map.get(key)
        if db_key:
            mapped[db_key] = value
    return mapped


def _safe_select_side_table_rows(table_name):
    if not supabase:
        return []
    try:
        response = supabase.table(table_name).select('*').execute()
        return response.data or []
    except Exception as exc:
        print(f"Supabase side table fetch failed ({table_name}): {exc}")
        return []


def _rows_by_register_no(rows):
    mapped = {}
    for row in rows or []:
        register_no = row.get('register_no')
        if register_no is not None:
            mapped[register_no] = row
    return mapped


def _merge_student_row_with_side_tables(base_row, side_table_maps):
    merged = dict(base_row or {})
    register_no = merged.get('register_no')
    if register_no is None:
        return merged

    for table_name, _field_map in SIDE_TABLE_DEFINITIONS:
        side_row = (side_table_maps.get(table_name) or {}).get(register_no)
        if side_row:
            for key, value in side_row.items():
                if value is not None:
                    merged[key] = value

    return merged


def _get_student_side_table_maps():
    maps = {}
    for table_name, _field_map in SIDE_TABLE_DEFINITIONS:
        rows = _safe_select_side_table_rows(table_name)
        maps[table_name] = _rows_by_register_no(rows)
    return maps


def get_student_by_register_no(register_no):
    if not register_no:
        return None

    if not supabase:
        return next((s for s in students if str(s.get('registerNo') or s.get('id')) == str(register_no)), None)

    try:
        response = supabase.table('students').select('*').eq('register_no', register_no).limit(1).execute()
        rows = response.data or []
        if not rows:
            return None

        base_row = rows[0]
        side_maps = _get_student_side_table_maps()
        merged_row = _merge_student_row_with_side_tables(base_row, side_maps)
        return _db_to_student(merged_row)
    except Exception as exc:
        print(f"Supabase get_student_by_register_no failed: {exc}")
        return None


def _normalize_year_number(value):
    try:
        numeric_value = int(value)
        if 1 <= numeric_value <= 4:
            return numeric_value
    except (TypeError, ValueError):
        pass

    normalized = str(value or '').strip().lower()
    mapping = {
        'first': 1,
        'first year': 1,
        'second': 2,
        'second year': 2,
        'third': 3,
        'third year': 3,
        'fourth': 4,
        'fourth year': 4,
    }
    return mapping.get(normalized, 0)


def get_students_data():
    if not supabase:
        return students
    try:
        response = supabase.table('students').select('*').order('register_no').execute()
        rows = response.data or []
        side_maps = _get_student_side_table_maps()
        merged_rows = [_merge_student_row_with_side_tables(row, side_maps) for row in rows]
        return [_db_to_student(row) for row in merged_rows]
    except Exception as exc:
        print(f"Supabase get_students_data failed: {exc}")
        return students


def get_student_by_email(email):
    normalized_email = (email or '').lower()
    if not supabase:
        return next((s for s in students if s['email'].lower() == normalized_email), None)
    try:
        response = supabase.table('students').select('*').ilike('email', normalized_email).limit(1).execute()
        rows = response.data or []
        if not rows:
            return None
        side_maps = _get_student_side_table_maps()
        merged_row = _merge_student_row_with_side_tables(rows[0], side_maps)
        return _db_to_student(merged_row)
    except Exception as exc:
        print(f"Supabase get_student_by_email failed: {exc}")
        return next((s for s in students if s['email'].lower() == normalized_email), None)


def update_student_data(student_id, payload):
    allowed_payload = {key: value for key, value in payload.items() if key in STUDENT_ALLOWED_FIELDS}

    if 'leetcodeUsername' in allowed_payload:
        normalized_username = str(allowed_payload.get('leetcodeUsername') or '').strip()
        if normalized_username.startswith('@'):
            normalized_username = normalized_username[1:].strip()
        allowed_payload['leetcodeUsername'] = normalized_username

    if not allowed_payload:
        return None

    def _student_pk(student_record):
        return student_record.get('registerNo') or student_record.get('id')

    if not supabase:
        student = next((s for s in students if _student_pk(s) == student_id), None)
        if not student:
            return None
        student.update(allowed_payload)
        return student

    base_payload = {key: value for key, value in allowed_payload.items() if key in STUDENTS_BASE_FIELD_MAP}
    leetcode_payload = {key: value for key, value in allowed_payload.items() if key in LEETCODE_FIELD_MAP}
    academic_payload = {key: value for key, value in allowed_payload.items() if key in ACADEMIC_FIELD_MAP}
    profile_payload = {key: value for key, value in allowed_payload.items() if key in PROFILE_FIELD_MAP}
    linked_payload = {key: value for key, value in allowed_payload.items() if key in LINKED_FIELD_MAP}

    if not base_payload and not leetcode_payload and not academic_payload and not profile_payload and not linked_payload:
        return None

    try:
        if base_payload:
            db_payload = _student_to_db(base_payload, STUDENTS_BASE_FIELD_MAP)
            supabase.table('students').update(db_payload).eq('register_no', student_id).execute()

        context_response = (
            supabase
            .table('students')
            .select('name,dept,year')
            .eq('register_no', student_id)
            .limit(1)
            .execute()
        )
        context_row = (context_response.data or [{}])[0]
        context_payload = {field: context_row.get(field) for field in SIDE_TABLE_CONTEXT_DB_FIELDS if field in context_row}
        context_changed = any(field in base_payload for field in ('name', 'dept', 'year'))

        def _upsert_side_table(table_name, side_payload, field_map):
            if not side_payload and not context_changed:
                return
            db_side_payload = _student_to_db(side_payload, field_map)
            db_side_payload['register_no'] = student_id
            db_side_payload.update(context_payload)
            supabase.table(table_name).upsert(db_side_payload, on_conflict='register_no').execute()

        _upsert_side_table(STUDENT_LEETCODE_TABLE, leetcode_payload, LEETCODE_FIELD_MAP)
        _upsert_side_table(STUDENT_ACADEMIC_TABLE, academic_payload, ACADEMIC_FIELD_MAP)
        _upsert_side_table(STUDENT_PROFILE_TABLE, profile_payload, PROFILE_FIELD_MAP)
        _upsert_side_table(STUDENT_LINKED_TABLE, linked_payload, LINKED_FIELD_MAP)

        return get_student_by_register_no(student_id)
    except Exception as exc:
        print(f"Supabase update_student_data failed: {exc}")
        return None

LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql/"
LEETCODE_TIMEOUT_SECONDS = 12
LEETCODE_BATCH_DELAY_SECONDS = 0.7

LEETCODE_PROFILE_QUERY = """
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      ranking
    }
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
                submissions
      }
      totalSubmissionNum {
        difficulty
        count
                submissions
      }
    }
  }
}
"""


def _difficulty_map(rows, field='count'):
    values = {}
    for row in rows or []:
        difficulty = row.get('difficulty')
        values[difficulty] = int(row.get(field, 0))
    return values


def _acceptance_rate(accepted, total):
    if not total:
        return 0.0
    return round((accepted / total) * 100, 2)


def _normalize_leetcode_username(username):
    raw = str(username or '').strip()
    if not raw:
        return ''

    lowered = raw.lower()
    for prefix in ('https://leetcode.com/', 'http://leetcode.com/', 'https://www.leetcode.com/', 'http://www.leetcode.com/'):
        if lowered.startswith(prefix):
            raw = raw[len(prefix):].strip()
            lowered = raw.lower()
            break

    if lowered.startswith('u/'):
        raw = raw[2:].strip()
    elif lowered.startswith('in/'):
        raw = raw[3:].strip()

    raw = raw.split('?', 1)[0].split('#', 1)[0].strip().strip('/')
    if raw.startswith('@'):
        raw = raw[1:].strip()

    return raw


def _normalize_posted_date(value):
    if value is None or value == '':
        return ''

    try:
        if isinstance(value, (int, float)):
            return datetime.utcfromtimestamp(float(value)).date().isoformat()

        text = str(value).strip()
        if not text:
            return ''

        normalized = text.replace('Z', '+00:00')
        return datetime.fromisoformat(normalized).date().isoformat()
    except Exception:
        return ''


def _build_internship_item(title, company, url, source, location='', posted_date=''):
    clean_title = str(title or '').strip()
    clean_company = str(company or '').strip() or 'Unknown Company'
    clean_url = str(url or '').strip()
    clean_source = str(source or '').strip() or 'Unknown Source'

    if not clean_title or not clean_url:
        return None

    return {
        'title': clean_title,
        'company': clean_company,
        'location': str(location or '').strip() or 'Not specified',
        'postedDate': str(posted_date or '').strip(),
        'source': clean_source,
        'url': clean_url,
        'eligibility': 'Second Year Onwards'
    }


def _fetch_remotive_internships(limit=12):
    internships = []
    try:
        response = http_requests.get(
            'https://remotive.com/api/remote-jobs',
            params={'search': 'intern'},
            timeout=10
        )
        response.raise_for_status()
        jobs = (response.json() or {}).get('jobs') or []

        for job in jobs:
            title = str(job.get('title') or '')
            category = str(job.get('category') or '')
            if 'intern' not in title.lower() and 'intern' not in category.lower():
                continue

            item = _build_internship_item(
                title=title,
                company=job.get('company_name'),
                url=job.get('url'),
                source='Remotive',
                location=job.get('candidate_required_location') or 'Remote',
                posted_date=_normalize_posted_date(job.get('publication_date'))
            )
            if item:
                internships.append(item)
            if len(internships) >= limit:
                break
    except Exception as exc:
        print(f"Remotive internship fetch failed: {exc}")

    return internships


def _fetch_arbeitnow_internships(limit=12):
    internships = []
    try:
        response = http_requests.get('https://www.arbeitnow.com/api/job-board-api', timeout=10)
        response.raise_for_status()
        jobs = (response.json() or {}).get('data') or []

        for job in jobs:
            title = str(job.get('title') or '')
            tags = ' '.join(job.get('tags') or [])
            if 'intern' not in title.lower() and 'intern' not in tags.lower():
                continue

            item = _build_internship_item(
                title=title,
                company=job.get('company_name'),
                url=job.get('url'),
                source='Arbeitnow',
                location=job.get('location') or ('Remote' if job.get('remote') else 'Not specified'),
                posted_date=_normalize_posted_date(job.get('created_at'))
            )
            if item:
                internships.append(item)
            if len(internships) >= limit:
                break
    except Exception as exc:
        print(f"Arbeitnow internship fetch failed: {exc}")

    return internships


def _fetch_the_job_company_internships(limit=12):
    internships = []
    candidate_urls = [
        'https://www.thejobcompany.in/jobs',
        'https://www.thejobcompany.in/'
    ]
    headers = {
        'User-Agent': 'Placely/1.0 (+internship-fetch)'
    }

    for source_url in candidate_urls:
        try:
            response = http_requests.get(source_url, headers=headers, timeout=8)
            response.raise_for_status()
            html = response.text or ''
            anchors = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.IGNORECASE | re.DOTALL)

            for href, raw_text in anchors:
                raw_title = re.sub(r'<[^>]+>', ' ', raw_text)
                title = ' '.join(raw_title.split())
                href_text = str(href or '')
                if 'intern' not in title.lower() and 'intern' not in href_text.lower():
                    continue

                full_url = urljoin(source_url, href_text)
                item = _build_internship_item(
                    title=title,
                    company='Multiple Companies',
                    url=full_url,
                    source='The Job Company',
                    location='India',
                    posted_date=''
                )
                if item:
                    internships.append(item)
                if len(internships) >= limit:
                    return internships
        except Exception as exc:
            print(f"The Job Company internship fetch failed for {source_url}: {exc}")

    return internships


def get_live_upcoming_internships(limit=12):
    now = time.time()
    cached_data = _LIVE_INTERNSHIPS_CACHE.get('data') or []
    cached_at = float(_LIVE_INTERNSHIPS_CACHE.get('fetched_at') or 0.0)
    if cached_data and (now - cached_at) < INTERNSHIP_CACHE_TTL_SECONDS:
        return cached_data[:limit]

    combined = []
    combined.extend(_fetch_the_job_company_internships(limit=limit))
    combined.extend(_fetch_remotive_internships(limit=limit))
    combined.extend(_fetch_arbeitnow_internships(limit=limit))

    deduped = []
    seen = set()
    for item in combined:
        key = (str(item.get('url') or '').strip().lower(), str(item.get('title') or '').strip().lower())
        if key in seen:
            continue
        seen.add(key)
        deduped.append(item)

    deduped.sort(key=lambda row: str(row.get('postedDate') or ''), reverse=True)
    final_data = deduped[:limit]

    _LIVE_INTERNSHIPS_CACHE['fetched_at'] = now
    _LIVE_INTERNSHIPS_CACHE['data'] = final_data
    return final_data


def fetch_leetcode_profile(username):
    normalized_username = _normalize_leetcode_username(username)
    if not normalized_username:
        return {
            'success': False,
            'username': username,
            'message': 'LeetCode username is empty'
        }

    payload = {
        'query': LEETCODE_PROFILE_QUERY,
        'variables': {'username': normalized_username}
    }
    headers = {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'
    }

    try:
        response = http_requests.post(
            LEETCODE_GRAPHQL_URL,
            json=payload,
            headers=headers,
            timeout=LEETCODE_TIMEOUT_SECONDS
        )
        response.raise_for_status()
        response_json = response.json()
    except http_requests.RequestException as exc:
        return {
            'success': False,
            'username': normalized_username,
            'message': f'LeetCode request failed: {str(exc)}'
        }

    graphql_errors = response_json.get('errors') or []
    if graphql_errors:
        first_error = graphql_errors[0] if isinstance(graphql_errors[0], dict) else {}
        return {
            'success': False,
            'username': normalized_username,
            'message': first_error.get('message') or 'LeetCode GraphQL returned an error'
        }

    matched_user = (response_json.get('data') or {}).get('matchedUser')
    if not matched_user:
        return {
            'success': False,
            'username': normalized_username,
            'message': 'LeetCode user not found or profile is private'
        }

    stats = matched_user.get('submitStats') or {}
    accepted_by_difficulty = _difficulty_map(stats.get('acSubmissionNum'), 'count')
    accepted_submission_attempts_by_difficulty = _difficulty_map(stats.get('acSubmissionNum'), 'submissions')
    total_submission_attempts_by_difficulty = _difficulty_map(stats.get('totalSubmissionNum'), 'submissions')

    solved = {
        'all': accepted_by_difficulty.get('All', 0),
        'easy': accepted_by_difficulty.get('Easy', 0),
        'medium': accepted_by_difficulty.get('Medium', 0),
        'hard': accepted_by_difficulty.get('Hard', 0)
    }

    total_submissions = {
        'all': total_submission_attempts_by_difficulty.get('All', 0),
        'easy': total_submission_attempts_by_difficulty.get('Easy', 0),
        'medium': total_submission_attempts_by_difficulty.get('Medium', 0),
        'hard': total_submission_attempts_by_difficulty.get('Hard', 0)
    }

    acceptance_rates = {
        'all': _acceptance_rate(accepted_submission_attempts_by_difficulty.get('All', 0), total_submissions['all']),
        'easy': _acceptance_rate(accepted_submission_attempts_by_difficulty.get('Easy', 0), total_submissions['easy']),
        'medium': _acceptance_rate(accepted_submission_attempts_by_difficulty.get('Medium', 0), total_submissions['medium']),
        'hard': _acceptance_rate(accepted_submission_attempts_by_difficulty.get('Hard', 0), total_submissions['hard'])
    }

    return {
        'success': True,
        'username': matched_user.get('username', normalized_username),
        'ranking': (matched_user.get('profile') or {}).get('ranking'),
        'solved': solved,
        'totalSubmissions': total_submissions,
        'acceptanceRates': acceptance_rates
    }


def _get_student_by_leetcode_username(username):
    normalized = _normalize_leetcode_username(username).lower()
    if not normalized:
        return None

    students_data = get_students_data()
    return next(
        (
            student for student in students_data
            if _normalize_leetcode_username(student.get('leetcodeUsername')).lower() == normalized
        ),
        None
    )


def _cached_leetcode_payload(student):
    username = student.get('leetcodeUsername') or ''
    solved_all = student.get('leetcodeSolvedAll')
    solved_easy = student.get('leetcodeSolvedEasy')
    solved_medium = student.get('leetcodeSolvedMedium')
    solved_hard = student.get('leetcodeSolvedHard')

    if solved_all is None and solved_easy is None and solved_medium is None and solved_hard is None:
        return {
            'success': False,
            'username': username,
            'message': 'LeetCode stats are not cached yet. Daily sync runs at 10 PM.'
        }

    return {
        'success': True,
        'username': username,
        'ranking': student.get('leetcodeRanking'),
        'solved': {
            'all': int(solved_all or 0),
            'easy': int(solved_easy or 0),
            'medium': int(solved_medium or 0),
            'hard': int(solved_hard or 0)
        },
        'acceptanceRates': {
            'all': float(student.get('leetcodeAcceptanceAll') or 0),
            'easy': float(student.get('leetcodeAcceptanceEasy') or 0),
            'medium': float(student.get('leetcodeAcceptanceMedium') or 0),
            'hard': float(student.get('leetcodeAcceptanceHard') or 0)
        },
        'lastSyncedAt': student.get('leetcodeLastSyncedAt')
    }


def _parse_iso_datetime(value):
    if not value:
        return None
    if not isinstance(value, str):
        return None

    normalized = value.strip()
    if not normalized:
        return None

    if normalized.endswith('Z'):
        normalized = f"{normalized[:-1]}+00:00"

    try:
        return datetime.fromisoformat(normalized)
    except ValueError:
        return None


def _was_leetcode_synced_today(student, now_utc):
    last_synced_raw = student.get('leetcodeLastSyncedAt')
    last_synced = _parse_iso_datetime(last_synced_raw)
    if not last_synced:
        return False

    if last_synced.tzinfo is not None:
        last_synced = last_synced.astimezone(timezone.utc).replace(tzinfo=None)

    return last_synced.date() == now_utc.date()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data: dict[str, Any] = request.get_json(silent=True) or {}
    login_type = data.get('type')
    email = data.get('email')
    password = data.get('password')
    
    if login_type == 'student':
        student = get_student_by_email(email)
        if student:
            session['user'] = student
            session['is_staff'] = False
            return jsonify({'success': True, 'user': student, 'is_staff': False})
        return jsonify({'success': False, 'message': 'Student email not found'})
    else:
        if email == staff_credentials['email'] and password == staff_credentials['password']:
            session['is_staff'] = True
            return jsonify({'success': True, 'is_staff': True})
        return jsonify({'success': False, 'message': 'Invalid staff credentials'})

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})

@app.route('/auth/google')
def google_login():
    """Initiate Google OAuth flow"""
    if not GOOGLE_OAUTH_ENABLED or not Flow:
        return jsonify({'success': False, 'message': 'Google OAuth not configured'}), 400
    if not REDIRECT_URI:
        return jsonify({'success': False, 'message': 'RAILWAY_PUBLIC_DOMAIN is required for deployed Google OAuth'}), 400
    
    try:
        flow = Flow.from_client_config(
            client_secrets,
            scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 
                    'https://www.googleapis.com/auth/userinfo.profile'],
            redirect_uri=REDIRECT_URI
        )
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true'
        )
        session['state'] = state
        return jsonify({'auth_url': authorization_url})
    except Exception as e:
        return jsonify({'success': False, 'message': f'OAuth error: {str(e)}'}), 400

@app.route('/auth/linkedin')
def linkedin_login():
    """Backward-compatible alias for the primary LinkedIn connect endpoint"""
    return connect_linkedin()

def get_linkedin_profile(access_token):
    """Fetch user profile data from LinkedIn API"""
    try:
        print("\n--- FETCHING LINKEDIN PROFILE ---")
        def _extract_localized_text(value):
            if isinstance(value, str):
                return value
            if not isinstance(value, dict):
                return ''
            localized = value.get('localized')
            if isinstance(localized, dict) and localized:
                preferred = value.get('preferredLocale') or {}
                preferred_key = f"{preferred.get('language', '')}_{preferred.get('country', '')}".strip('_')
                if preferred_key and preferred_key in localized:
                    return localized.get(preferred_key) or ''
                return next(iter(localized.values()), '') or ''
            text = value.get('text')
            return text if isinstance(text, str) else ''

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Accept': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
        }
        
        # Fetch user profile using OpenID Connect userinfo endpoint (simpler and more reliable)
        print("Fetching profile from OpenID Connect userinfo endpoint...")
        userinfo_response = http_requests.get(
            'https://api.linkedin.com/v2/userinfo',
            headers=headers,
            timeout=10
        )
        
        if userinfo_response.status_code != 200:
            print(f"ERROR fetching userinfo: {userinfo_response.status_code} - {userinfo_response.text}")
            return None
        
        userinfo = userinfo_response.json()
        print(f"Userinfo data: {userinfo}")
        
        # Extract profile data from OpenID Connect userinfo
        # Standard OpenID Connect claims: sub, name, given_name, family_name, picture, email
        result = {
            'name': userinfo.get('name', ''),
            'email': userinfo.get('email', ''),
            'picture': userinfo.get('picture', ''),
            'profile_id': userinfo.get('sub', ''),  # sub is the user ID
            'profile_url': userinfo.get('profile', ''),
            'headline': ''
        }
        
        # If name is empty, try to construct from given_name and family_name
        if not result['name']:
            given = userinfo.get('given_name', '')
            family = userinfo.get('family_name', '')
            result['name'] = f"{given} {family}".strip()
        
        # Try to fetch headline separately if available
        print("Attempting to fetch headline from profile API...")
        try:
            profile_response = http_requests.get(
                'https://api.linkedin.com/v2/me',
                headers=headers,
                timeout=10
            )
            if profile_response.status_code == 200:
                profile_data = profile_response.json()
                print(f"Profile data: {profile_data}")
                # Extract headline if available
                if 'headline' in profile_data:
                    headline = _extract_localized_text(profile_data['headline'])
                    result['headline'] = headline if headline else ''
                    print(f"Extracted headline: {result['headline']}")

                vanity_name = profile_data.get('vanityName')
                if vanity_name and not result.get('profile_url'):
                    result['profile_url'] = f"https://www.linkedin.com/in/{vanity_name}"
        except Exception as e:
            print(f"Headline fetch failed (non-critical): {e}")
        
        print(f"Final profile result: {result}")
        print("--- PROFILE FETCH COMPLETE ---\n")
        return result
    except Exception as e:
        print(f"ERROR fetching LinkedIn profile: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def save_linkedin_data(student_id, linkedin_data):
    """Save LinkedIn profile data to database"""
    if not supabase or not linkedin_data:
        print("Supabase unavailable or no LinkedIn data")
        return False

    try:
        base_row_response = (
            supabase
            .table('students')
            .select('name,dept,year')
            .eq('register_no', student_id)
            .limit(1)
            .execute()
        )
        base_row = (base_row_response.data or [{}])[0]

        profile_payload = {
            'register_no': student_id,
            'linkedin_username': linkedin_data.get('name', ''),
            'linkedin_profile_url': linkedin_data.get('profile_url', ''),
            'name': base_row.get('name'),
            'dept': base_row.get('dept'),
            'year': base_row.get('year')
        }

        supabase.table(STUDENT_LINKED_TABLE).upsert(profile_payload, on_conflict='register_no').execute()

        picture_value = linkedin_data.get('picture', '')
        if picture_value:
            try:
                supabase.table('students').update({'linkedin_photo_url': picture_value}).eq('register_no', student_id).execute()
            except Exception as exc:
                print(f"linkedin_photo_url update skipped: {exc}")

        print(f"LinkedIn data saved successfully for student {student_id}")
        return True
    except Exception as e:
        print(f"ERROR saving LinkedIn data: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

@app.route('/callback')
def callback():
    """Handle Google OAuth callback"""
    if not GOOGLE_OAUTH_ENABLED or not Flow or not id_token or not google_requests:
        return redirect('/?login=error&msg=Google OAuth not configured')
    if not REDIRECT_URI:
        return redirect('/?login=error&msg=RAILWAY_PUBLIC_DOMAIN required for deployed Google OAuth')
    
    try:
        state = session.get('state')
        flow = Flow.from_client_config(
            client_secrets,
            scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile'],
            state=state,
            redirect_uri=REDIRECT_URI
        )
        
        # Fetch token using the authorization response
        flow.fetch_token(authorization_response=request.url)
        
        # Get user info from Google
        credentials = flow.credentials
        token_value = getattr(credentials, 'id_token', None)
        if not token_value:
            return redirect('/?login=error&msg=Missing ID token from Google response')

        id_info = id_token.verify_oauth2_token(
            token_value,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
        
        email = id_info.get('email')
        name = id_info.get('name')
        picture = id_info.get('picture')
        
        # Check if student exists with this email
        student = get_student_by_email(email)
        
        if student:
            # Update student with Google profile info
            student['google_name'] = name
            student['google_picture'] = picture
            session['user'] = student
            session['is_staff'] = False
            session['google_authenticated'] = True
            return redirect('/?login=success')
        else:
            # Check if it's a college email domain
            if email.endswith('@college.edu'):
                return redirect('/?login=error&msg=Student not registered. Please contact admin.')
            else:
                return redirect('/?login=error&msg=Please use your college email.')
                
    except Exception as e:
        print(f"OAuth error: {str(e)}")
        return redirect('/?login=error&msg=Authentication failed. Please try again.')

@app.route('/api/check-session')
def check_session():
    """Check if user is logged in"""
    if 'user' in session:
        user = session['user']
        if not session.get('is_staff', False):
            refreshed_user = get_student_by_email(user.get('email')) if isinstance(user, dict) else None
            if refreshed_user:
                session['user'] = refreshed_user
                session.modified = True
                user = refreshed_user
        return jsonify({
            'logged_in': True,
            'user': user,
            'is_staff': session.get('is_staff', False),
            'google_auth': session.get('google_authenticated', False)
        })
    return jsonify({'logged_in': False})

@app.route('/api/students')
def get_students():
    return jsonify(get_students_data())


@app.route('/api/leetcode/<string:username>')
def get_leetcode_profile(username):
    student = _get_student_by_leetcode_username(username)
    if not student:
        return jsonify({
            'success': False,
            'username': username,
            'message': 'No student found with this LeetCode username'
        }), 404

    data = _cached_leetcode_payload(student)
    status_code = 200 if data.get('success') else 404
    return jsonify(data), status_code


@app.route('/api/leetcode/students')
def get_leetcode_profiles_for_students():
    students_data = get_students_data()
    usernames = []
    for student in students_data:
        username = student.get('leetcodeUsername')
        if username:
            usernames.append({
                'studentId': student['id'],
                'studentName': student['name'],
                'username': username
            })

    results = []
    for entry in usernames:
        student = _get_student_by_leetcode_username(entry['username'])
        profile = _cached_leetcode_payload(student) if student else {
            'success': False,
            'username': entry['username'],
            'message': 'No cached LeetCode stats found'
        }
        results.append({
            'studentId': entry['studentId'],
            'studentName': entry['studentName'],
            'leetcodeUsername': entry['username'],
            'profile': profile
        })

    return jsonify({
        'success': True,
        'count': len(results),
        'results': results
    })

@app.route('/api/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    is_staff = bool(session.get('is_staff'))
    session_user = session.get('user')

    if not is_staff and not session_user:
        return jsonify({'success': False, 'message': 'Not logged in'}), 401

    if not is_staff:
        session_user_id = session_user.get('id') or session_user.get('registerNo')
        if str(session_user_id) != str(student_id):
            return jsonify({'success': False, 'message': 'Forbidden'}), 403

    data = request.get_json(silent=True) or {}
    student = update_student_data(student_id, data)
    if student:
        if not is_staff:
            session['user'] = student
        return jsonify({'success': True, 'student': student})
    return jsonify({'success': False, 'message': 'Student not found'})

@app.route('/api/connect-linkedin')
def connect_linkedin():
    """Initiate LinkedIn connection for authenticated student"""
    if not LINKEDIN_OAUTH_ENABLED:
        return jsonify({'success': False, 'message': 'LinkedIn OAuth not configured'}), 400
    
    if 'user' not in session:
        return jsonify({'success': False, 'message': 'Not logged in'}), 401
    
    try:
        import secrets
        state = secrets.token_urlsafe(32)
        session['linkedin_state'] = state
        authorization_url = build_linkedin_authorization_url(state)
        
        return jsonify({'auth_url': authorization_url})
    except Exception as e:
        print(f"LinkedIn connect error: {str(e)}")
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 400

@app.route('/linkedin-callback')
def linkedin_callback():
    """Handle LinkedIn OAuth callback and save profile data"""
    print("=" * 60)
    print("LINKEDIN CALLBACK STARTED")
    print("=" * 60)
    
    if not LINKEDIN_OAUTH_ENABLED:
        print("ERROR: LinkedIn OAuth not enabled")
        return redirect('/?error=LinkedIn OAuth not configured')
    
    # Check if user is logged in
    if 'user' not in session:
        print("ERROR: User not in session")
        return redirect('/?login=error&msg=Session expired. Please log in again.')
    
    print(f"User in session: {session['user'].get('email')}")
    
    try:
        # Verify state parameter
        state = request.args.get('state')
        stored_state = session.get('linkedin_state')
        print(f"State verification: received={state}, stored={stored_state}")
        
        if not state or state != stored_state:
            print("ERROR: Invalid state parameter")
            return redirect('/?error=Invalid state parameter')
        
        # Get authorization code
        code = request.args.get('code')
        error = request.args.get('error')
        error_desc = request.args.get('error_description', '')
        print(f"Auth code received: {code[:20] if code else 'NONE'}...")
        
        if error:
            print(f"ERROR from LinkedIn: {error} - {error_desc}")
            return redirect(f'/?error=LinkedIn error: {error} {error_desc}')
        
        if not code:
            print("ERROR: No authorization code from LinkedIn")
            return redirect('/?error=No authorization code from LinkedIn')
        
        # Exchange code for access token
        token_url = 'https://www.linkedin.com/oauth/v2/accessToken'
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': LINKEDIN_CLIENT_ID,
            'client_secret': LINKEDIN_CLIENT_SECRET,
            'redirect_uri': get_linkedin_redirect_uri()
        }
        
        print(f"Exchanging code at {token_url}")
        token_response = http_requests.post(token_url, data=token_data, timeout=10)
        print(f"Token response status: {token_response.status_code}")
        
        if token_response.status_code != 200:
            print(f"ERROR: Token exchange failed: {token_response.text}")
            return redirect('/?error=Failed to get access token')
        
        token_info = token_response.json()
        access_token = token_info.get('access_token')
        print(f"Access token obtained: {access_token[:20] if access_token else 'NONE'}...")
        
        if not access_token:
            print("ERROR: No access token from LinkedIn")
            return redirect('/?error=No access token from LinkedIn')
        
        # Fetch LinkedIn profile data
        print("Fetching LinkedIn profile...")
        linkedin_profile = get_linkedin_profile(access_token)
        
        if not linkedin_profile:
            print("ERROR: Failed to fetch LinkedIn profile")
            return redirect('/?error=Failed to fetch LinkedIn profile')
        
        print(f"LinkedIn profile fetched: {linkedin_profile}")
        
        # Get current user ID from session
        user_id = session['user'].get('id')
        print(f"Saving data for user ID: {user_id}")
        
        # Save LinkedIn data to database (without profile URL since OpenID Connect doesn't provide public profile URLs)
        if save_linkedin_data(user_id, {
            'name': linkedin_profile.get('name', ''),
            'picture': linkedin_profile.get('picture', ''),
            'profile_url': linkedin_profile.get('profile_url', ''),
            'headline': linkedin_profile.get('headline', '')
        }):
            print("LinkedIn data saved successfully")
            
            # Refresh student data in session
            updated_student = get_student_by_email(session['user']['email'])
            if updated_student:
                print(f"Session refreshed with updated student data")
                print(f"Updated linkedinName: {updated_student.get('linkedinName')}")
                session['user'] = updated_student
                session.modified = True  # Ensure Flask saves the session
            else:
                print("ERROR: Could not refresh student data")
            
            print("=" * 60)
            print("LINKEDIN CALLBACK COMPLETED SUCCESSFULLY")
            print("=" * 60)
            
            # Redirect back to profile with success parameter
            return redirect('/?section=profile&linkedin=connected')
        else:
            print("ERROR: Failed to save LinkedIn data")
            return redirect('/?section=profile&error=Failed to save LinkedIn data')
        
    except Exception as e:
        print(f"ERROR in LinkedIn callback: {str(e)}")
        import traceback
        traceback.print_exc()
        return redirect(f'/?error=Authentication failed: {str(e)}')

@app.route('/api/recently-placed')
def get_recently_placed():
    return jsonify(recently_placed)

@app.route('/api/upcoming-companies')
def get_upcoming_companies():
    return jsonify(upcoming_companies)


@app.route('/api/upcoming-internships')
def get_upcoming_internships():
    internships = get_live_upcoming_internships(limit=12)
    return jsonify({
        'success': True,
        'data': internships,
        'eligibleFromYear': 2,
        'updatedAt': datetime.utcnow().replace(microsecond=0).isoformat() + 'Z'
    })

@app.route('/api/placed-students')
def get_placed_students():
    return jsonify(placed_students)

@app.route('/api/analytics/year/<int:year>')
def get_year_analytics(year):
    students_data = get_students_data()
    year_students = [s for s in students_data if _normalize_year_number(s.get('year')) == year]
    criteria = ['Placements', 'Higher Studies', 'Entrepreneurship']
    counts = {c: 0 for c in criteria}
    for student in year_students:
        normalized_interest = str(student.get('interest') or '').strip().lower()
        if normalized_interest == 'higher studies':
            counts['Higher Studies'] += 1
        elif normalized_interest == 'entrepreneurship':
            counts['Entrepreneurship'] += 1
        else:
            counts['Placements'] += 1
    return jsonify({'year': year, 'data': counts})


@app.route('/api/sync-leetcode', methods=['POST'])
def manual_sync_leetcode():
    """Manually trigger LeetCode stats sync for all students.
    Sync uses cached DB reads and updates each student at most once per day.
    """
    try:
        body = request.get_json(silent=True) or {}
        force_sync = str(request.args.get('force', body.get('force', 'false'))).strip().lower() in ('1', 'true', 'yes', 'y')

        print("[MANUAL SYNC] User triggered LeetCode sync...")
        summary = scheduled_fetch_leetcode_stats(force=force_sync)
        if summary.get('error'):
            return jsonify({'success': False, 'message': f"Sync failed: {summary['error']}", 'summary': summary}), 500

        message = (
            f"LeetCode sync completed. "
            f"Updated {summary['updated']}, skipped {summary['skipped']} (already synced today), "
            f"failed {summary['failed']}."
        )
        if force_sync:
            message = (
                f"LeetCode force sync completed. "
                f"Updated {summary['updated']}, failed {summary['failed']}."
            )
        return jsonify({'success': True, 'message': message, 'summary': summary})
    except Exception as e:
        print(f"[MANUAL SYNC ERROR] {str(e)}")
        return jsonify({'success': False, 'message': f'Sync failed: {str(e)}'}), 500


def scheduled_fetch_leetcode_stats(force=False):
    """Fetch LeetCode stats from GraphQL and update Supabase at most once per day per student."""
    try:
        now_local = datetime.now()
        now_utc = datetime.utcnow()
        mode = 'force' if force else 'daily'
        print(f"[{now_local}] Starting {mode} LeetCode stats fetch...")
        students_data = get_students_data()
        
        updated_count = 0
        skipped_count = 0
        failed_count = 0
        eligible_count = 0
        for student in students_data:
            username = student.get('leetcodeUsername')
            if not username:
                continue

            eligible_count += 1

            if not force and _was_leetcode_synced_today(student, now_utc):
                skipped_count += 1
                print(f"  [SKIP] {student.get('name', 'Unknown')} already synced today")
                continue
            
            try:
                profile = fetch_leetcode_profile(username)
                if profile.get('success') and profile.get('solved'):
                    synced_at_utc = datetime.utcnow().replace(microsecond=0).isoformat() + 'Z'
                    # Update student with cached LeetCode stats
                    update_student_data(student['id'], {
                        'leetcodeRanking': profile.get('ranking'),
                        'leetcodeSolvedAll': profile['solved'].get('all', 0),
                        'leetcodeSolvedEasy': profile['solved'].get('easy', 0),
                        'leetcodeSolvedMedium': profile['solved'].get('medium', 0),
                        'leetcodeSolvedHard': profile['solved'].get('hard', 0),
                        'leetcodeAcceptanceAll': profile.get('acceptanceRates', {}).get('all', 0),
                        'leetcodeAcceptanceEasy': profile.get('acceptanceRates', {}).get('easy', 0),
                        'leetcodeAcceptanceMedium': profile.get('acceptanceRates', {}).get('medium', 0),
                        'leetcodeAcceptanceHard': profile.get('acceptanceRates', {}).get('hard', 0),
                        'leetcodeLastSyncedAt': synced_at_utc
                    })
                    updated_count += 1
                    print(f"  [OK] Updated {student['name']}: {profile['solved']['all']} problems")
                    # Rate limiting delay
                    time.sleep(LEETCODE_BATCH_DELAY_SECONDS)
                else:
                    failed_count += 1
                    print(f"  [FAIL] Failed to fetch {student.get('name', 'Unknown')}: {profile.get('message', 'Unknown error')}")
            except Exception as e:
                failed_count += 1
                print(f"  [FAIL] Failed to update {student.get('name', 'Unknown')}: {str(e)}")
        
        summary = {
            'eligible': eligible_count,
            'updated': updated_count,
            'skipped': skipped_count,
            'failed': failed_count,
            'force': bool(force)
        }
        print(
            f"[{datetime.now()}] Scheduled LeetCode fetch completed. "
            f"Eligible {eligible_count}, updated {updated_count}, skipped {skipped_count}, failed {failed_count}."
        )
        return summary
    except Exception as e:
        print(f"[{datetime.now()}] Scheduled LeetCode fetch failed: {str(e)}")
        return {
            'eligible': 0,
            'updated': 0,
            'skipped': 0,
            'failed': 0,
            'error': str(e)
        }


def init_scheduler():
    """Initialize the background scheduler"""
    if getattr(app, '_leetcode_scheduler', None):
        return
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=scheduled_fetch_leetcode_stats,
        trigger="cron",
        hour=22,
        minute=0,
        id='leetcode_daily_sync',
        replace_existing=True
    )
    scheduler.start()
    setattr(app, '_leetcode_scheduler', scheduler)
    print("[OK] Scheduler initialized: LeetCode stats will be fetched daily at 10 PM")


if os.environ.get('DISABLE_LEETCODE_SCHEDULER', '0') != '1':
    init_scheduler()


if __name__ == '__main__':
    # Use Railway's PORT environment variable, default to 5000 for local dev
    port = int(os.environ.get('PORT', 5000))
    # Bind to 0.0.0.0 to allow external connections (required for Railway)
    app.run(host='0.0.0.0', port=port, debug=False)
