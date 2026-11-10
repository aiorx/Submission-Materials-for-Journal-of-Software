import os
import subprocess
from datetime import datetime
from enum import Enum
from typing import List


class Algorithm(Enum):
    RTRL = 1
    BPTT = 2

    def __str__(self) :
        return self.name


BPTT = Algorithm.BPTT
RTRL = Algorithm.RTRL


# NOTE: This was Penned via standard programming aids.
def ensure_static_codebase(
    excluded_dirs = ["runs", "notebooks"], strict = True
):
    """
    Checks if the current Git repository has a clean working tree and reports
    untracked files, excluding specified directories. In strict mode, raises an
    error if there are modified, staged, or untracked files outside the
    excluded directories.

    Args:
    - excluded_dirs (list of str): Directories to exclude from untracked files
      check, relative to the Git root.
    - strict (bool): If True, raises an error for issues found outside excluded
      directories.

    Returns:
    - None

    Raises:
    - RuntimeError: If strict is True and there are modifications or untracked
      files outside excluded directories.
    """
    try:
        # Find the Git repository root to ensure paths are handled correctly.
        git_root = (
            subprocess.check_output(
                ["git", "rev-parse", "--show-toplevel"], stderr=subprocess.STDOUT
            )
            .decode()
            .strip()
        )

        # Get the status of all files, excluding those in .gitignore
        status_output = (
            subprocess.check_output(
                ["git", "status", "--porcelain=v1"], stderr=subprocess.STDOUT
            )
            .decode()
            .strip()
        )

        # Split the output into lines for individual processing
        status_lines = status_output.split("\n") if status_output else []

        modified_or_staged_files = any(
            line for line in status_lines if not line.startswith("??")
        )
        untracked_files = [line[3:] for line in status_lines if line.startswith("??")]

        # Check untracked files against excluded directories
        untracked_outside_excluded = [
            file
            for file in untracked_files
            if not any(file.startswith("{}/".format(dir)) for dir in excluded_dirs)
        ]

        if modified_or_staged_files or untracked_outside_excluded:
            messages = []
            if modified_or_staged_files:
                messages.append(
                    "Warning: Your working tree is not clean. There are modified or staged files."
                )
            if untracked_outside_excluded:
                messages.append(
                    "Warning: There are untracked files not being tracked by Git outside the excluded directories:"
                )
                messages.extend([" - {}".format(file) for file in untracked_outside_excluded])

            full_message = "\n".join(messages)

            if strict:
                raise RuntimeError(full_message)
            else:
                print(full_message)

    except subprocess.CalledProcessError as e:
        error_msg = "Error checking Git status: {}".format(e.output.decode().strip())
        if strict:
            raise RuntimeError(error_msg)
        else:
            print(error_msg)
    except Exception as e:
        if strict:
            raise e
        else:
            print("Unexpected error: {}".format(e))


def set_cuda():
    try:
        # Query GPU details, including process information, in JSON format
        result = subprocess.run(
            ["nvidia-smi", "-q", "-x"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True,
            text=True,
        )
    except subprocess.CalledProcessError as e:
        raise RuntimeError("Failed to execute nvidia-smi") from e

    # Use XML parsing to find a GPU without attached processes
    try:
        import xml.etree.ElementTree as ET

        root = ET.fromstring(result.stdout)
        for gpu in root.findall("gpu"):
            processes = gpu.find("processes")
            if not processes.findall("process_info"):
                # This GPU has no processes attached, consider it free
                gpu_id = gpu.find("minor_number").text
                os.environ["CUDA_VISIBLE_DEVICES"] = gpu_id
                print("Set CUDA_VISIBLE_DEVICES to GPU {}.".format(gpu_id))
                return
    except Exception as e:
        raise RuntimeError("Error parsing nvidia-smi output") from e

    # If we reach this point, no free GPU was found
    raise RuntimeError("No available CUDA GPUs found.")


def get_algorithm(algorithm):
    if algorithm == Algorithm.BPTT:
        from snapjax.bptt import bptt

        return bptt

    if algorithm == Algorithm.RTRL:
        from snapjax.algos import rtrl

        return rtrl


def create_date_folder(should_raise = False):
    # Get the current date in YYYY-MM-DD format
    today_str = datetime.now().strftime("%Y-%m-%d")
    # Construct the folder name with the current path
    folder_path = os.path.join(os.getcwd(), today_str)

    # Check if the folder already exists
    if os.path.exists(folder_path):
        if should_raise:
            raise FileExistsError("Folder '{}' already exists.".format(today_str))
        else:
            print("Folder '{}' already exists.".format(today_str))
            return folder_path
    else:
        # Create the folder
        os.mkdir(folder_path)
        print("Folder '{}' created successfully.".format(today_str))
        return folder_path


def generate_timestamp():
    # Get the current date and time
    now = datetime.now()
    timestamp = now.strftime("%Y%m%d%H%M%S")

    return timestamp
