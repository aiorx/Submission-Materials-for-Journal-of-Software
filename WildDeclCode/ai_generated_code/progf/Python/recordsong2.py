# This script was Composed with basic coding tools from the following prompt

# Could you write me a small script that runs on OSX that monitors the currently playing song on
# Spotify and when the song changes pauses for 30 seconds and then starts playing again?

import time
import subprocess

import subprocess
import sys
import os
import time
import shutil

# Setup variables
piezoStorageLocation = '/Users/peppe/Music/Piezo/'
ripStorageLocation = '/Users/peppe/Music/Ripped/'
# playlistId = sys.argv[1]
folder = sys.argv[1]

currentsongpath = ""
songpath = ""
songname = ""


def run_applescript(script):
    return subprocess.run(["osascript", "-e", script], capture_output=True, text=True)


def get_songpath():
    global songpath
    # Get the artist name, track name, album name and album artwork URL from Spotify
    artist = subprocess.Popen('osascript -e "tell application \\"Spotify\\"" -e "current track\'s artist" -e "end tell"',
                              shell=True, stdout=subprocess.PIPE).stdout.read().decode('utf-8').rstrip('\r\n')
    track = subprocess.Popen('osascript -e "tell application \\"Spotify\\"" -e "current track\'s name" -e "end tell"',
                             shell=True, stdout=subprocess.PIPE).stdout.read().decode('utf-8').rstrip('\r\n')

    songname = artist+" - "+track+".mp3"
    songpath = os.path.join(ripStorageLocation, folder, songname)


def start_recording(current_track):
    global songpath, songname
    print('start recording')

    get_songpath()

    get_songpath()
    # time.sleep(1)
    subprocess.Popen(
        'osascript -e "activate application \\"Piezo\\"" -e "tell application \\"System Events\\"" -e "keystroke \\"r\\" using {command down}" -e "end tell"', shell=True, stdout=subprocess.PIPE).stdout.read()
    # subprocess.Popen('osascript -e "tell application \\"Spotify\\" to play"',
    #                  shell=True, stdout=subprocess.PIPE).stdout.read()
    time.sleep(1)
    # Resume playback
    run_applescript('tell application "Spotify" to play')
    print(f"Resumed playback: {current_track}")
    time.sleep(2)


def stop_recording(path):
    # global songpath
    print('stop recording')

    # if os.path.exists(songpath):
    # Spotify has stopped playing, stop the recording in Piezo
    subprocess.Popen(
        'osascript -e "activate application \\"Piezo\\"" -e "tell application \\"System Events\\"" -e "keystroke \\"r\\" using {command down}" -e "end tell"', shell=True, stdout=subprocess.PIPE).stdout.read()

    time.sleep(.2)

    # Move MP3 file from Piezo folder to the folder containing rips.
    for f in os.listdir(piezoStorageLocation):
        if f.endswith(".mp3"):
            shutil.move(piezoStorageLocation+f, path)

    time.sleep(2)


def main():

    global currentsongpath, songpath, songname

    # Create directory for the playlist
    if not os.path.exists(os.path.join(ripStorageLocation, folder)):
        os.makedirs(os.path.join(ripStorageLocation, folder))

    current_track = None

    # Create directory for the playlist
    if not os.path.exists(os.path.join(ripStorageLocation, folder)):
        os.makedirs(os.path.join(ripStorageLocation, folder))

    while True:
        # Get the current track name from Spotify
        script = 'tell application "Spotify" to name of current track'
        result = run_applescript(script)
        new_track = result.stdout.strip()

        # print(result)

        get_songpath()

        if os.path.exists(currentsongpath):
            print('Skipping: ' + songname, currentsongpath)

            for f in os.listdir(piezoStorageLocation):
                if f.endswith(".mp3"):
                    os.remove(os.path.join(piezoStorageLocation, f))

            current_track = new_track
            currentsongpath = songpath
            run_applescript('tell application "Spotify" to next track')

        else:

            if new_track != current_track:
                if current_track is not None:
                    # Pause playback for 30 seconds
                    run_applescript('tell application "Spotify" to pause')
                    print(f"Paused: {current_track}")

                    stop_recording(currentsongpath)
                    time.sleep(2)
                current_track = new_track
                currentsongpath = songpath

                start_recording(current_track)

            time.sleep(1)


if __name__ == "__main__":
    main()
