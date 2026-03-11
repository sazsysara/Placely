from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from datetime import datetime
import json
import os
import time
import requests as http_requests
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
# Only set secure cookies on production (Railway), allow HTTP on localhost
app.config['SESSION_COOKIE_SECURE'] = 'RAILWAY_PUBLIC_DOMAIN' in os.environ
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
    or getattr(config, 'SUPABASE_SERVICE_ROLE_KEY', '').strip()
)

SUPABASE_FALLBACK_KEY = (
    os.environ.get('SUPABASE_KEY', '').strip()
    or os.environ.get('SUPABASE_SECRET_KEY', '').strip()
    or os.environ.get('SUPABASE_ANON_KEY', '').strip()
    or os.environ.get('SUPABASE_PUBLISHABLE_KEY', '').strip()
    or getattr(config, 'SUPABASE_KEY', '').strip()
)

SUPABASE_DB_KEY = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_FALLBACK_KEY
SUPABASE_ENABLED = bool(SUPABASE_AVAILABLE and create_client and SUPABASE_URL and SUPABASE_DB_KEY)

supabase = None
if SUPABASE_ENABLED:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_DB_KEY)
    except Exception as exc:
        print(f"Supabase initialization failed: {exc}")
        supabase = None

# Disable HTTPS requirement for local development only
if os.environ.get('RAILWAY_ENVIRONMENT') != 'production':
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

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

# Determine base URL for OAuth redirect
BASE_URL = os.environ.get('RAILWAY_PUBLIC_DOMAIN', 'localhost:5000')
REDIRECT_URI = f"https://{BASE_URL}/callback" if 'RAILWAY_PUBLIC_DOMAIN' in os.environ else "http://localhost:5000/callback"

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
    {"name": "Priya Sharma", "dept": "CSE", "package": 18.5, "company": "Google", "position": "Software Engineer", "graduationYear": 2024, "date": "2026-01-25", "codingProblems": 150, "internships": 1, "certifications": 4, "gradePoints": 8.3},
    {"name": "Aarav Kumar", "dept": "CSE", "package": 16.8, "company": "Microsoft", "position": "SDE-2", "graduationYear": 2024, "date": "2026-01-20", "codingProblems": 120, "internships": 2, "certifications": 3, "gradePoints": 8.7},
    {"name": "Sneha Reddy", "dept": "IT", "package": 15.2, "company": "Amazon", "position": "Associate Engineer", "graduationYear": 2025, "date": "2026-01-18", "codingProblems": 80, "internships": 1, "certifications": 2, "gradePoints": 9.1},
    {"name": "Rahul Singh", "dept": "ECE", "package": 14.5, "company": "Infosys", "position": "Systems Engineer", "graduationYear": 2024, "date": "2026-01-15", "codingProblems": 200, "internships": 0, "certifications": 1, "gradePoints": 7.9},
    {"name": "Vikram Patel", "dept": "ME", "package": 12.0, "company": "TCS", "position": "Digital Engineer", "graduationYear": 2025, "date": "2026-01-10", "codingProblems": 60, "internships": 2, "certifications": 2, "gradePoints": 8.9}
]

staff_credentials = {"email": "staff@college.edu", "password": "staff123"}

STUDENT_ALLOWED_FIELDS = {
    'name', 'email', 'leetcodeUsername', 'codingProblems', 'internships',
    'certifications', 'gradePoints', 'year', 'interest', 'dept'
}


def _db_to_student(row):
    return {
        'id': row.get('id'),
        'name': row.get('name'),
        'email': row.get('email'),
        'leetcodeUsername': row.get('leetcode_username') or '',
        'codingProblems': row.get('coding_problems', 0),
        'internships': row.get('internships', 0),
        'certifications': row.get('certifications', 0),
        'gradePoints': row.get('grade_points', 0),
        'year': row.get('year', 0),
        'interest': row.get('interest') or '',
        'dept': row.get('dept') or '',
        'linkedinName': row.get('linkedin_name') or '',
        'linkedinPhotoUrl': row.get('linkedin_photo_url') or '',
        'linkedinUrl': row.get('linkedin_url') or '',
        'linkedinHeadline': row.get('linkedin_headline') or '',
    }


def _student_to_db(payload):
    mapped = {}
    field_map = {
        'name': 'name',
        'email': 'email',
        'leetcodeUsername': 'leetcode_username',
        'codingProblems': 'coding_problems',
        'internships': 'internships',
        'certifications': 'certifications',
        'gradePoints': 'grade_points',
        'year': 'year',
        'interest': 'interest',
        'dept': 'dept'
    }
    for key, value in payload.items():
        db_key = field_map.get(key)
        if db_key:
            mapped[db_key] = value
    return mapped


def get_students_data():
    if not supabase:
        return students
    try:
        response = supabase.table('students').select('*').order('id').execute()
        rows = response.data or []
        return [_db_to_student(row) for row in rows]
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
        return _db_to_student(rows[0])
    except Exception as exc:
        print(f"Supabase get_student_by_email failed: {exc}")
        return next((s for s in students if s['email'].lower() == normalized_email), None)


def update_student_data(student_id, payload):
    allowed_payload = {key: value for key, value in payload.items() if key in STUDENT_ALLOWED_FIELDS}
    if not allowed_payload:
        return None

    if not supabase:
        student = next((s for s in students if s['id'] == student_id), None)
        if not student:
            return None
        student.update(allowed_payload)
        return student

    db_payload = _student_to_db(allowed_payload)
    if not db_payload:
        return None

    try:
        response = supabase.table('students').update(db_payload).eq('id', student_id).execute()
        rows = response.data or []
        if not rows:
            return None
        return _db_to_student(rows[0])
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


def fetch_leetcode_profile(username):
    payload = {
        'query': LEETCODE_PROFILE_QUERY,
        'variables': {'username': username}
    }
    headers = {'Content-Type': 'application/json'}

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
            'username': username,
            'message': f'LeetCode request failed: {str(exc)}'
        }

    matched_user = (response_json.get('data') or {}).get('matchedUser')
    if not matched_user:
        return {
            'success': False,
            'username': username,
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
        'username': matched_user.get('username', username),
        'ranking': (matched_user.get('profile') or {}).get('ranking'),
        'solved': solved,
        'totalSubmissions': total_submissions,
        'acceptanceRates': acceptance_rates
    }

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
    
    try:
        flow = Flow.from_client_config(
            client_secrets,
            scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 
                    'https://www.googleapis.com/auth/userinfo.profile'],
            redirect_uri=url_for('callback', _external=True)
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
    """Initiate LinkedIn OAuth flow"""
    if not LINKEDIN_OAUTH_ENABLED:
        return jsonify({'success': False, 'message': 'LinkedIn OAuth not configured'}), 400
    
    try:
        import secrets
        state = secrets.token_urlsafe(32)
        session['oauth_state'] = state
        session['oauth_provider'] = 'linkedin'
        
        # LinkedIn OAuth 2.0 authorization endpoint
        auth_url = 'https://www.linkedin.com/oauth/v2/authorization'
        params = {
            'response_type': 'code',
            'client_id': LINKEDIN_CLIENT_ID,
            'redirect_uri': url_for('callback', _external=True),
            'state': state,
            'scope': 'openid profile email'
        }
        
        from urllib.parse import urlencode
        authorization_url = f"{auth_url}?{urlencode(params)}"
        
        return jsonify({'auth_url': authorization_url})
    except Exception as e:
        print(f"LinkedIn OAuth error: {str(e)}")
        return jsonify({'success': False, 'message': f'OAuth error: {str(e)}'}), 400

def get_linkedin_profile(access_token):
    """Fetch user profile data from LinkedIn API"""
    try:
        print("\n--- FETCHING LINKEDIN PROFILE ---")
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
                    if isinstance(profile_data['headline'], dict):
                        headline = profile_data['headline'].get('localized', {}).get('en_US', '')
                    else:
                        headline = profile_data['headline']
                    result['headline'] = headline if headline else ''
                    print(f"Extracted headline: {result['headline']}")
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
        update_data = {
            'linkedin_name': linkedin_data.get('name', ''),
            'linkedin_photo_url': linkedin_data.get('picture', ''),
            'linkedin_url': linkedin_data.get('profile_url', ''),  # Use actual profile URL if provided
            'linkedin_headline': linkedin_data.get('headline', '')
        }
        
        print(f"Saving LinkedIn data: {update_data}")
        response = supabase.table('students').update(update_data).eq('id', student_id).execute()
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
    
    try:
        state = session.get('state')
        flow = Flow.from_client_config(
            client_secrets,
            scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile'],
            state=state,
            redirect_uri=url_for('callback', _external=True)
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
        return jsonify({
            'logged_in': True,
            'user': session['user'],
            'is_staff': session.get('is_staff', False),
            'google_auth': session.get('google_authenticated', False)
        })
    return jsonify({'logged_in': False})

@app.route('/api/students')
def get_students():
    return jsonify(get_students_data())


@app.route('/api/leetcode/<string:username>')
def get_leetcode_profile(username):
    data = fetch_leetcode_profile(username)
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
    for index, entry in enumerate(usernames):
        if index > 0:
            time.sleep(LEETCODE_BATCH_DELAY_SECONDS)

        profile = fetch_leetcode_profile(entry['username'])
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
    data = request.json
    student = update_student_data(student_id, data)
    if student:
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
        
        # LinkedIn OAuth 2.0 authorization endpoint
        auth_url = 'https://www.linkedin.com/oauth/v2/authorization'
        params = {
            'response_type': 'code',
            'client_id': LINKEDIN_CLIENT_ID,
            'redirect_uri': url_for('linkedin_callback', _external=True),
            'state': state,
            'scope': 'openid profile email'
        }
        
        from urllib.parse import urlencode
        authorization_url = f"{auth_url}?{urlencode(params)}"
        
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
            'redirect_uri': url_for('linkedin_callback', _external=True)
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
            'profile_url': '',  # OpenID Connect doesn't provide public profile URL
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

@app.route('/api/placed-students')
def get_placed_students():
    return jsonify(placed_students)

@app.route('/api/analytics/year/<int:year>')
def get_year_analytics(year):
    students_data = get_students_data()
    year_students = [s for s in students_data if s['year'] == year]
    criteria = ['Placed', 'Interested', 'Uninterested', 'Higher Studies']
    counts = {c: sum(1 for s in year_students if s['interest'] == c) for c in criteria}
    return jsonify({'year': year, 'data': counts})


def scheduled_fetch_leetcode_stats():
    """Fetch LeetCode stats for all students and update Supabase every day at 10 PM"""
    try:
        print(f"[{datetime.now()}] Starting scheduled LeetCode stats fetch...")
        students_data = get_students_data()
        
        updated_count = 0
        for student in students_data:
            username = student.get('leetcodeUsername')
            if not username:
                continue
            
            try:
                profile = fetch_leetcode_profile(username)
                if profile.get('success') and profile.get('solved'):
                    # Update student with coding problems solved
                    update_student_data(student['id'], {
                        'codingProblems': profile['solved']['all']
                    })
                    updated_count += 1
                    print(f"  ✓ Updated {student['name']}: {profile['solved']['all']} problems")
                    # Rate limiting delay
                    time.sleep(LEETCODE_BATCH_DELAY_SECONDS)
            except Exception as e:
                print(f"  ✗ Failed to update {student.get('name', 'Unknown')}: {str(e)}")
        
        print(f"[{datetime.now()}] Scheduled LeetCode fetch completed. Updated {updated_count} students.")
    except Exception as e:
        print(f"[{datetime.now()}] Scheduled LeetCode fetch failed: {str(e)}")


def init_scheduler():
    """Initialize the background scheduler"""
    scheduler = BackgroundScheduler()
    # Schedule the job to run every day at 10 PM (22:00)
    scheduler.add_job(func=scheduled_fetch_leetcode_stats, trigger="cron", hour=22, minute=0)
    scheduler.start()
    print("✓ Scheduler initialized: LeetCode stats will be fetched daily at 10 PM")


if __name__ == '__main__':
    # Use Railway's PORT environment variable, default to 5000 for local dev
    port = int(os.environ.get('PORT', 5000))
    # Initialize scheduler for daily LeetCode stats fetch
    init_scheduler()
    # Bind to 0.0.0.0 to allow external connections (required for Railway)
    app.run(host='0.0.0.0', port=port, debug=False)
