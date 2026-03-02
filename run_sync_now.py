import os
import sys
os.environ['FLASK_APP'] = 'app'
os.environ['FLASK_ENV'] = 'development'

from app import app, scheduled_fetch_leetcode_stats
with app.app_context():
    force = '--force' in sys.argv
    print("\n[SYNC STARTING]...\n")
    summary = scheduled_fetch_leetcode_stats(force=force)
    print(f"[SYNC SUMMARY] {summary}")
    print("\n[SYNC COMPLETE]\n")
