#!/usr/bin/env python3

# Drafted using common development resources

import os
import sys
import subprocess
import argparse
from collections import defaultdict
from datetime import datetime, timezone
import zoneinfo

def format_datetime_str(mtime, format='%a %b %d %I:%M:%S %p %z %Y'):
    # Using "localtime" to use the system's local timezone
    tz = zoneinfo.ZoneInfo("localtime")
    dt = datetime.fromtimestamp(mtime, tz)
    return dt.strftime(format)

def get_untracked_files():
    result = subprocess.run(['git', 'ls-files', '--others', '--exclude-standard'],
                            stdout=subprocess.PIPE, text=True)
    return result.stdout.splitlines()

def get_modification_time(file_path):
    return os.lstat(file_path).st_mtime

def add_and_commit(files, datetime_str, mtime, dry_run):
    for file in files:
        cmd_add = ['git', 'add', file]
        if dry_run:
            print(' '.join(cmd_add))
        else:
            subprocess.run(cmd_add, check=True)
    
    # Convert mtime to seconds since the Unix epoch and timezone offset
    mtime_seconds = int(mtime)
    timezone_offset = format_datetime_str(mtime, format='%z')
    git_date_str = f"{mtime_seconds} {timezone_offset}"
    
    cmd_commit = ['git', 'commit', '--date', git_date_str, '-m', f'Added files from {datetime_str}']
    if dry_run:
        print(' '.join(cmd_commit))
    else:
        subprocess.run(cmd_commit, check=True)

def main(dry_run):
    untracked_files = get_untracked_files()
    files_by_mtime = defaultdict(list)

    for file in untracked_files:
        mtime = get_modification_time(file)
        files_by_mtime[mtime].append(file)

    for mtime, files in sorted(files_by_mtime.items()):
        datetime_str = format_datetime_str(mtime, format='%Y-%m-%d (%a, %b %d) %H:%M:%S %z')
        add_and_commit(files, datetime_str, mtime, dry_run)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Add and commit untracked files grouped by modification time.')
    parser.add_argument('--dry-run', action='store_true',
                        help='Print commands without executing them.')
    args = parser.parse_args()
    main(args.dry_run)
