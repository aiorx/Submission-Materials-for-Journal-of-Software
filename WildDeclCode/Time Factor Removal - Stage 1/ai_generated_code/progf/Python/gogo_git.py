"""gogo-git.py

Author: Copilot (GitHub Copilot, OpenAI, and contributors)
Attribution: Generated with the help of GitHub Copilot and OpenAI's GPT models. Thanks to the authors of GitPython and the open-source community.

An object-oriented, importable Python module for managing git repositories, executing git commands with logging, 
and now also managing checks for gh CLI and Copilot CLI.
"""
import os
import subprocess
import shutil
import logging
from typing import List, Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

class GoGoGitError(Exception):
    pass

class GoGoGit:
    def __init__(self, repo_path):
        if not self.is_git_installed():
            raise GoGoGitError("git is not installed or not found in PATH.")
        self.repo_path = repo_path
        if not os.path.exists(self.repo_path):
            os.makedirs(self.repo_path, exist_ok=True)
        if not self.is_git_repo():
            logging.info("{} is not a git repository.".format(self.repo_path))
        else:
            logging.info("Initialized GoGoGit for repository at {}".format(self.repo_path))

    @staticmethod
    def is_git_installed() :
        try:
            subprocess.check_output(["git", "--version"])
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False

    @staticmethod
    def is_gh_installed() :
        return shutil.which("gh") is not None

    @staticmethod
    def is_gh_copilot_installed() :
        try:
            output = subprocess.check_output(["gh", "extension", "list"], text=True)
            return "copilot" in output
        except Exception:
            return False

    @staticmethod
    def is_gh_authenticated() :
        try:
            result = subprocess.run(
                ["gh", "auth", "status"],
                capture_output=True,
                text=True,
                check=True,
            )
            return "Logged in to github.com" in result.stdout
        except subprocess.CalledProcessError:
            return False

    def _run_git(self, args, check = True, capture_output = False) :
        logging.info("Running git command: git {}".format(' '.join(args)))
        return subprocess.run(
            ["git"] + args,
            cwd=self.repo_path,
            check=check,
            capture_output=capture_output,
            text=True
        )

    def is_git_repo(self) :
        try:
            self._run_git(["rev-parse", "--is-inside-work-tree"], capture_output=True)
            return True
        except subprocess.CalledProcessError:
            return False

    def is_clean(self) :
        """Check if the repository is clean (no uncommitted changes)."""
        result = self._run_git(["status", "--porcelain"], capture_output=True)
        return result.stdout.strip() == ""

    def ensure_cloned(self, org, repo_name, base_dir) :
        """Ensure that DIR/org/repo_name exists as a git repo, cloning if necessary."""
        repo_path = os.path.join(base_dir, org, repo_name)
        if not os.path.exists(repo_path):
            os.makedirs(os.path.dirname(repo_path), exist_ok=True)
            logging.info("Cloning repository {}/{} into {}".format(org, repo_name, repo_path))
            subprocess.check_call(
                ["git", "clone", "git@github.com:{}/{}.git".format(org, repo_name), repo_path]
            )
        elif not os.path.exists(os.path.join(repo_path, ".git")):
            raise GoGoGitError("{} exists but is not a git repository.".format(repo_path))
        return repo_path

    def switch_or_create_branch(self, branch, push = False):
        """Switch to a branch, or create it (and optionally push to origin) if it doesn't exist."""
        try:
            self._run_git(["checkout", branch])
        except subprocess.CalledProcessError:
            logging.info("Branch {} does not exist. Creating it.".format(branch))
            self._run_git(["checkout", "-b", branch])
            if push:
                self._run_git(["push", "--set-upstream", "origin", branch])

    def add_commit_push(self, files, message, push = False):
        """Add files, commit with message, and optionally push to origin."""
        self._run_git(["add"] + files)
        self._run_git(["commit", "-m", message])
        if push:
            self._run_git(["push"])

    def branch_exists(self, branch) :
        try:
            self._run_git(["show-ref", "--verify", "refs/heads/{}".format(branch)], capture_output=True)
            return True
        except subprocess.CalledProcessError:
            return False

    def assert_gh_ready(self):
        if not GoGoGit.is_gh_installed():
            raise GoGoGitError("GitHub CLI (gh) is not installed.")
        if not GoGoGit.is_gh_copilot_installed():
            raise GoGoGitError("GitHub Copilot CLI extension is not installed.")
        if not GoGoGit.is_gh_authenticated():
            raise GoGoGitError(
                "No valid GitHub CLI access token detected.\n"
                "To use GitHub Copilot in the CLI, you must authenticate the GitHub CLI using a personal access token (PAT).\n"
                "Follow these steps:\n"
                "1. Visit https://github.com/settings/tokens?type=beta\n"
                "2. Generate a new fine-grained personal access token with these scopes: 'repo', 'read:org', and 'copilot'.\n"
                "3. Save the token into a file, e.g. 'token.txt'.\n"
                "4. Authenticate with the GitHub CLI by running:\n"
                "    gh auth login --with-token < token.txt\n"
                "5. After authenticating, re-run this script.\n"
                "For more info, see: https://cli.github.com/manual/gh_auth_login\n"
            )

    def apply_patch(self, patch_file):
        """Apply a patch file to the repository using git apply."""
        logging.info("Applying patch file: {}".format(patch_file))
        return self._run_git(['apply', patch_file])
