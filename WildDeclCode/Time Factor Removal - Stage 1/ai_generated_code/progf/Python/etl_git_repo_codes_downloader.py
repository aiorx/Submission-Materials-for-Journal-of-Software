# file: etl_git_repo_codes_downloader.py
#
# Main part Assisted with routine coding tools-4o, here's the prompt history:
# https://chatgpt.com/share/6fa58122-ed44-4afd-ad63-48acb4ed3e38
#
# Usage:
# python ./bin/etl/git_repo_codes_downloader/etl_git_repo_codes_downloader.py ./bin/etl/git_repo_codes_downloader/etl_git_repo_codes_downloader.json


import pdb
import sys
import os
import json
import git
from tqdm import tqdm
from pathlib import Path
from typing import Dict, List


DEFAULT_EXTENSIONS = [".py", ".java", ".cpp", ".js", ".c", ".sh", ".go"]


# Function to clone a git repo to the specified workspace
def clone_repo(
    repo_url, 
    workspace
) :
    repo_name = repo_url.split('/')[-1].replace('.git', '')
    repo_path = os.path.join(workspace, repo_name)
    if not os.path.exists(repo_path):
        git.Repo.clone_from(repo_url, repo_path)
    return repo_path


# Function to get all program files from a repo directory
def get_program_files(
    repo_path, 
    extensions
) :
    program_files = []
    for root, _, files in os.walk(repo_path):
        for file in files:
            # Add file extensions as needed
            if file.endswith(extensions):  
                full_path = os.path.join(root, file)
                relative_path = os.path.relpath(full_path, repo_path)
                program_files.append((full_path, relative_path))
    return program_files


# Function to process a file and save its content as a JSON line
def process_file(
    file_path, 
    relative_path, 
    repo_url, 
    output_file
) :
    with open(file_path, 'r', encoding='utf-8') as f:
        code_content = f.read()
    json_line = {
        "code": code_content,
        "path": relative_path,
        "repo": repo_url
    }
    output_file.write(json.dumps(json_line) + "\n")
    return


# Main function to process all repos and save file content in JSONL
def main() :
    config = json.loads(open(sys.argv[1], "r").read()) 
    git_repos = config['git_repos']
    output_path = config['output_path']
    workspace = config['workspace']
    target_extensions = config["target_extensions"]

    # Ensure the workspace directory exists
    os.makedirs(workspace, exist_ok=True)

    if len(target_extensions) == 0:
        target_extensions = DEFAULT_EXTENSIONS

    with open(output_path, 'w', encoding='utf-8') as output_file:
        for repo_url in git_repos:
            print("Processing repo: {}".format(repo_url))
            repo_path = clone_repo(repo_url, workspace)
            program_files = get_program_files(
                repo_path, 
                tuple(target_extensions)
            )
            for full_path, relative_path in tqdm(program_files):
                process_file(
                    full_path, 
                    relative_path, 
                    repo_url, 
                    output_file
                )
            print("Finished processing repo: {}".format(repo_url))


if __name__ == "__main__":
    main()

