#!/usr/bin/env python3
# Aided with basic GitHub coding tools

"""
# Filename    : get_gists.py
# Date      : 30 Apr 2025
# Author    : Balaji Venkataraman (xbalaji@pge.com)
# Description   : Script to fetch and display GitHub gists for a specified user
#
# Usage     : ./get_gists.py -u <github_username> [options]
#
# Options:
#   -u, --user    GitHub username (required)
#   -k, --kind    Kind of gists to fetch: public, secret, or all (default: public)
#   -t, --token   GitHub personal access token (can also use GH_TOKEN env var)
#   -o, --output  Output format: csv, json, or html (optional)
#   -f, --file    Output file path (optional, defaults to stdout)
#   -r, --raw     Include raw URLs in output (for html output, raw URLs are included by default)
#   --no-raw      Exclude raw URLs from output (for html output only)
#   
# Example:
#   ./get_gists.py -u xbalaji                      # Show public gists
#   ./get_gists.py -u xbalaji -o json -r           # Output as JSON with raw URLs
#   ./get_gists.py -u xbalaji -o html --no-raw     # Export as HTML without raw URLs
#   ./get_gists.py -u xbalaji -k all -t <token>    # Show all gists with auth token
#   ./get_gists.py -u xbalaji -o csv -f gists.csv  # Export to CSV file
#
"""

import requests
import sys
import textwrap
import argparse
import os
import json
import csv
from tabulate import tabulate
from datetime import datetime

class GistFetcher:
  def __init__(self, token=None):
    self._base_url = "https://api.github.com"
    self._token = token
  
  def get_user_gists(self, github_user, gist_kind='public'):
    """
    Fetches gists for the specified GitHub user.
    
    Args:
      github_user (str): GitHub username
      gist_kind (str): Type of gists to fetch - 'public', 'secret', or 'all'
      
    Returns:
      list: List of gist files with metadata
    """
    headers = {}
    if self._token:
      headers["Authorization"] = f"token {self._token}"
      
    # For public gists without authentication
    if gist_kind == 'public' and not self._token:
      url = f"{self._base_url}/users/{github_user}/gists?per_page=150"
    # For authenticated requests (needed for secret or all gists)
    elif self._token:
      if gist_kind == 'public':
        url = f"{self._base_url}/users/{github_user}/gists?per_page=150"
      else:
        # For all gists including secret ones with authentication
        url = f"{self._base_url}/gists?per_page=150"
    else:
      # No token provided but trying to access secret/all gists
      print("WARNING: Fetching secret or all gists requires GitHub authentication.")
      print("Please provide a GitHub token using --token or GH_TOKEN environment variable.")
      print("Falling back to public gists only.")
      url = f"{self._base_url}/users/{github_user}/gists?per_page=150"
      
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
      print(f"Error fetching gists: {response.status_code}")
      if response.status_code == 401:
        print("Authentication failed. Please check your GitHub token.")
      return []
      
    gists = response.json()
    
    # Filter gists if we're using authentication and requested only secret gists
    if self._token and gist_kind == 'secret':
      gists = [gist for gist in gists if not gist.get('public', True)]
    
    # Flatten the gists data structure to extract individual files
    files = []
    for gist in gists:
      # Skip public gists if we only want secret ones
      if gist_kind == 'secret' and gist.get('public', True):
        continue
        
      gist_id = gist['id']
      owner = gist['owner']['login']
      gist_url = gist['html_url']
      is_public = gist.get('public', True)
      
      for filename, file_data in gist['files'].items():
        files.append({
          'filename': filename,
          'raw_url': file_data.get('raw_url', ''),
          'owner': owner,
          'id': gist_id,
          'gist_url': gist_url,
          'public': is_public
        })
        
    return sorted(files, key=lambda x: x['filename'].lower())

def parse_arguments():
  """
  Parse command line arguments.
  
  Returns:
    argparse.Namespace: Parsed command line arguments
  """
  parser = argparse.ArgumentParser(
    description="Fetch and display GitHub gists for a user",
    formatter_class=argparse.ArgumentDefaultsHelpFormatter
  )
  
  parser.add_argument('-u', '--user', 
            dest='user',
            type=str, 
            required=True,
            help='GitHub username')
            
  parser.add_argument('-k', '--kind', 
            dest='gist_kind',
            type=str, 
            choices=['all', 'secret', 'public'],
            default='public',
            help='Kind of gists to fetch')
            
  parser.add_argument('-t', '--token',
            dest='token',
            type=str,
            help='GitHub personal access token (can also be set via GH_TOKEN environment variable)')
            
  parser.add_argument('-o', '--output',
            dest='output_format',
            type=str,
            choices=['csv', 'json', 'html'],
            help='Output format (if not specified, display on screen)')
            
  parser.add_argument('-f', '--file',
            dest='output_file',
            type=str,
            help='Output file path (if not specified, output to stdout)')
  
  raw_group = parser.add_mutually_exclusive_group()
  raw_group.add_argument('-r', '--raw',
            dest='include_raw',
            action='store_true',
            help='Include raw URLs in output')
            
  raw_group.add_argument('--no-raw',
            dest='exclude_raw',
            action='store_true',
            help='Exclude raw URLs from output (for html output only)')
            
  return parser.parse_args()

def output_to_csv(files, output_file=None, include_raw=False):
  """
  Output gist data in CSV format.
  
  Args:
    files (list): List of gist files with metadata
    output_file (str, optional): Path to output file
    include_raw (bool): Whether to include raw URLs
  """
  headers = ["S.No", "Filename", "URL"]
  if include_raw:
    headers.append("Raw URL")
    
  rows = []
  
  for i, file in enumerate(files, 1):
    row = [
      str(i).zfill(2),
      file['filename'],
      file['gist_url']
    ]
    if include_raw:
      row.append(file['raw_url'])
    rows.append(row)
  
  if output_file:
    with open(output_file, 'w', newline='') as csvfile:
      writer = csv.writer(csvfile)
      writer.writerow(headers)
      writer.writerows(rows)
    print(f"CSV data written to {output_file}")
  else:
    writer = csv.writer(sys.stdout)
    writer.writerow(headers)
    writer.writerows(rows)

def output_to_json(files, output_file=None, include_raw=False):
  """
  Output gist data in JSON format.
  
  Args:
    files (list): List of gist files with metadata
    output_file (str, optional): Path to output file
    include_raw (bool): Whether to include raw URLs
  """
  output_data = []
  
  for i, file in enumerate(files, 1):
    data = {
      'sno': str(i).zfill(2),
      'filename': file['filename'],
      'url': file['gist_url']
    }
    if include_raw:
      data['raw_url'] = file['raw_url']
      
    output_data.append(data)
  
  json_data = json.dumps(output_data, indent=2)
  
  if output_file:
    with open(output_file, 'w') as jsonfile:
      jsonfile.write(json_data)
    print(f"JSON data written to {output_file}")
  else:
    print(json_data)

def output_to_html(files, output_file=None, include_raw=True):
  """
  Output gist data in HTML format.
  
  Args:
    files (list): List of gist files with metadata
    output_file (str, optional): Path to output file
    include_raw (bool, optional): Whether to include raw URLs, defaults to True for HTML
  """
  html_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Gists for {username}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
        }}
        h1 {{
            color: #24292e;
        }}
        table {{
            border-collapse: collapse;
            width: 100%;
            margin-top: 20px;
        }}
        th, td {{
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
        th {{
            background-color: #f1f1f1;
            font-weight: bold;
        }}
        tr:hover {{
            background-color: #f9f9f9;
        }}
        a {{
            color: #0366d6;
            text-decoration: none;
        }}
        a:hover {{
            text-decoration: underline;
        }}
        .footer {{
            margin-top: 20px;
            color: #6a737d;
            font-size: 0.9em;
        }}
    </style>
</head>
<body>
    <h1>GitHub Gists for {username}</h1>
    <p>Generated on: {date}</p>
    
    <table>
        <thead>
            <tr>
                <th>S.No</th>
                <th>Filename</th>
                <th>View</th>
                <th>Edit</th>{raw_header}
            </tr>
        </thead>
        <tbody>
{table_rows}
        </tbody>
    </table>
    
    <div class="footer">
        <p>Total gists: {total_gists}</p>
        <p>Generated by get_gists.py</p>
    </div>
</body>
</html>
"""
  
  table_rows = ""
  raw_header = "\n                <th>Raw</th>" if include_raw else ""
  
  for i, file in enumerate(files, 1):
    edit_url = f"https://gist.github.com/{file['owner']}/{file['id']}/edit"
    raw_cell = f"\n                <td><a href=\"{file['raw_url']}\" target=\"_blank\">Raw</a></td>" if include_raw else ""
    
    table_rows += f"""            <tr>
                <td>{str(i).zfill(2)}</td>
                <td>{file['filename']}</td>
                <td><a href="{file['gist_url']}" target="_blank">View</a></td>
                <td><a href="{edit_url}" target="_blank">Edit</a></td>{raw_cell}
            </tr>\n"""
  
  username = files[0]['owner'] if files else "Unknown"
  date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
  
  html_content = html_template.format(
    username=username,
    date=date,
    table_rows=table_rows,
    total_gists=len(files),
    raw_header=raw_header
  )
  
  if output_file:
    with open(output_file, 'w', encoding='utf-8') as htmlfile:
      htmlfile.write(html_content)
    print(f"HTML data written to {output_file}")
  else:
    print(html_content)

def output_to_display(files, include_raw=False):
  """
  Output gist data to the terminal display.
  
  Args:
    files (list): List of gist files with metadata
    include_raw (bool): Whether to include raw URLs
  """
  table_data = []
  for i, file in enumerate(files, 1):
    row = [
      str(i).zfill(2),
      file['filename'],
      file['gist_url']
    ]
    if include_raw:
      row.append(file['raw_url'])
    table_data.append(row)
  
  headers = ["S.No", "Filename", "URL"]
  if include_raw:
    headers.append("Raw URL")
    
  print(tabulate(table_data, headers=headers, tablefmt="grid"))
  print(f"\nTotal gists: {len(files)}")

def main():
  """
  Main function to fetch and display GitHub gists.
  """
  args = parse_arguments()
  
  github_user = args.user
  gist_kind = args.gist_kind
  
  # Get token from command line or environment variable
  token = args.token or os.environ.get('GH_TOKEN')
  
  if gist_kind in ('secret', 'all') and not token:
    print("WARNING: No GitHub token provided. Secret gists won't be accessible.")
  
  print(f"Fetching {gist_kind} gists for GitHub user: {github_user}")
  
  fetcher = GistFetcher(token)
  files = fetcher.get_user_gists(github_user, gist_kind)
  
  if not files:
    print("No gists found or error occurred.")
    return
  
  # Determine whether to include raw URLs
  # For HTML: include by default unless --no-raw is specified
  # For others: don't include by default unless --raw is specified
  include_raw = args.include_raw
  if args.output_format == 'html':
    include_raw = not args.exclude_raw
  
  # Handle different output formats
  if args.output_format == 'csv':
    output_to_csv(files, args.output_file, include_raw)
  elif args.output_format == 'json':
    output_to_json(files, args.output_file, include_raw)
  elif args.output_format == 'html':
    output_to_html(files, args.output_file, include_raw)
  else:
    output_to_display(files, include_raw)

if __name__ == "__main__":
  main()
