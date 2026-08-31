#!/usr/bin/python3

# AI Disclaimer:
# This script was written Assisted using common GitHub development aids.

import os
import re
import requests

# ANSI escape codes for colors
RED = '\033[91m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
RESET = '\033[0m'

def extract_video_id(filename):
    # Extracts the YouTube video ID from the filename using a regular expression
    match = re.search(r'\[([a-zA-Z0-9_-]{11})\]', filename)
    if match:
        return match.group(1)
    return None

def download_thumbnail(video_id, save_path):
    # List of possible thumbnail resolutions, from highest to lowest
    resolutions = ['maxresdefault.jpg', 'hqdefault.jpg', 'mqdefault.jpg', 'sddefault.jpg', 'default.jpg']
    for resolution in resolutions:
        # Construct the URL for the thumbnail
        url = f'https://img.youtube.com/vi/{video_id}/{resolution}'
        try:
            # Send a GET request to the URL
            response = requests.get(url)
            if response.status_code == 200:
                # If the response is successful, save the thumbnail to the specified path
                with open(save_path, 'wb') as file:
                    file.write(response.content)
                print(f'{GREEN}Thumbnail downloaded for video ID: {video_id} at resolution: {resolution}{RESET}')
                return
            else:
                # If the response is not successful, print an error message with the status code
                print(f'{RED}Failed to download thumbnail for video ID: {video_id} at resolution: {resolution}, HTTP status code: {response.status_code}{RESET}')
        except requests.exceptions.RequestException as e:
            # If there is a network-related error, print an exception message
            print(f'{RED}Exception occurred while downloading thumbnail for video ID: {video_id} at resolution: {resolution}, Exception: {e}{RESET}')
    # If all attempts fail, print a message indicating that all attempts failed
    print(f'{RED}All attempts failed for video ID: {video_id}{RESET}')

def main():
    # Set of video file extensions to look for
    video_extensions = {'.mp4', '.mkv', '.webm', '.avi', '.mov'}
    # Get the current working directory
    current_directory = os.getcwd()
    # Iterate over all files in the current directory
    for filename in os.listdir(current_directory):
        # Check if the file has a video extension
        if os.path.splitext(filename)[1].lower() in video_extensions:
            # Extract the video ID from the filename
            video_id = extract_video_id(filename)
            if video_id:
                # Construct the path to save the thumbnail with '-poster' appended to the original filename
                base_name = os.path.splitext(filename)[0]
                save_path = os.path.join(current_directory, f'{base_name}-poster.jpg')
                # Attempt to download the thumbnail
                download_thumbnail(video_id, save_path)
            else:
                # If no video ID is found in the filename, print a message
                print(f'{YELLOW}No video ID found in filename: {filename}{RESET}')

if __name__ == "__main__":
    # Entry point of the script
    main()