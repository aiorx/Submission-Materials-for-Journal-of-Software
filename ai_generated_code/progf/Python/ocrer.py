#!/usr/bin/env python3
# Largely Built using basic development resources.

# This script metadata is cool! Try uv run ocrer.py to run the script appropriately using these dependencies.
# /// script
# dependencies = [
#   "watchdog",
#   "pillow",
#   "pytesseract",
# ]
# ///

import os
import sys
import subprocess
import datetime
import time
import re
from typing import Literal
import pytesseract
import argparse
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from PIL import Image
import select
if sys.platform.startswith('win'):
    import msvcrt # noqa: F401

def eprint(*args, **kwargs) -> None:
  print(*args, file=sys.stderr, **kwargs)

debug = False #True

def dprint(*args, **kwargs) -> None:
  if debug:
    eprint(*args, **kwargs)

def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="OCR file renamer")
    parser.add_argument("--tesseract-path", type=str, help="Path to the Tesseract executable (defaults to just calling `tesseract` on your system, so if that's in your PATH you're probably fine.)")
    parser.add_argument("--truncate-name", action=argparse.BooleanOptionalAction, default=True, help="Truncate output filename to avoid OS errors (default: true)")
    parser.add_argument("watch_folder", nargs="+", help="Folder(s) to watch for new images")
    dev = parser.add_argument_group("developer functionality")
    dev.add_argument("--update-readme", action="store_true", help="Update the readme file with the latest help output.")
    return parser.parse_args()

def update_readme() -> Literal[-1] | Literal[0]:
    p = os.path.join(os.path.dirname(__file__), "readme.txt")
    with open("readme.txt", "r", encoding="utf-8") as f:
        text = f.read()
    help_marker = r"As of \d+-\d+-\d+ it reads:"
    splut = re.split(r"As of \d+-\d+-\d+ it reads:", text)
    if len(splut) == 1:
        print(f"The help marker I expected, {help_marker}, was not found in readme.txt", file=sys.stderr)
        return -1
    d = datetime.date.today().isoformat()
    h = subprocess.run([sys.executable, os.path.abspath(__file__), "--help"], capture_output=True, text=True).stdout.strip()
    with open(p, "wb") as f:
        f.write((splut[0] + f"As of {d} it reads:\n\n{h}\n").encode())
    return 0

class OCRRenameHandler(FileSystemEventHandler):
    def on_created(self, event) -> None:
        if event.is_directory:
            return

        time.sleep(1)  # Give some time for the file to be fully written # It's crazy that this was the automatically-generated code lmao.
        self.process(event.src_path)

    def process(self, file_path) -> None:
        try:
            # Create necessary directories if they don't exist
            base_dir = os.path.dirname(file_path)
            success_dir = os.path.join(base_dir, "has-been-ocr'd")
            failure_dir = os.path.join(base_dir, "ocr-failure")
            
            os.makedirs(success_dir, exist_ok=True)
            os.makedirs(failure_dir, exist_ok=True)

            image = Image.open(file_path)
            extracted_text = pytesseract.image_to_string(image).strip()

            if not extracted_text:
                print(f"No text found in {file_path}, moving to ocr-failure.")
                os.rename(file_path, os.path.join(failure_dir, os.path.basename(file_path)))
                return

            # This logic is largely taken from Wyatt S Carpenter's tessname.py, and the code could be shared using imports (but that seems like a hassle).
            dprint("raw:", extracted_text)
            extracted_text = re.sub(r"\|", "I", extracted_text) #for some reason it often gets these wrong
            extracted_text = extracted_text.lower()
            dprint("lowered:", extracted_text)
            extracted_text = re.sub(r"[^\w\s-]", "", extracted_text)
            dprint("sub out non-word:", extracted_text)
            extracted_text = re.sub(r"\s+", " ", extracted_text).strip()
            dprint("sub out spaces:", extracted_text)
            if not extracted_text:
                print(f"No recognizable text found in {file_path} after filtering, moving to ocr-failure.")
                os.rename(file_path, os.path.join(failure_dir, os.path.basename(file_path)))
                return
            
            ext = os.path.splitext(file_path)[1] #this is "split ext(ension)", not "split text", btw.
            if args.truncate_name:
                extracted_text = extracted_text[0:255-len(ext)-1] #limit name to make operating system happy #the -1 is for good luck! or, possibly, the trailing nul that other systems (file explorer, perhaps) occasionally must slap on there. Anyway, you get weird "too long" errors on windows and this makes those happen less often.
            new_file_name = f"{extracted_text}{ext}"
            new_file_path = os.path.join(success_dir, new_file_name)

            os.rename(file_path, new_file_path)
            print(f"Successfully processed {file_path} -> {new_file_name}")
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

def main() -> None | Literal[-1]:
    global args
    args = parse_arguments()
    if args.update_readme:
        if err := update_readme():
            return err

    if args.tesseract_path:
        pytesseract.pytesseract.tesseract_cmd = args.tesseract_path

    event_handler = OCRRenameHandler()
    observers = []
    for WATCH_FOLDER in args.watch_folder:
        print(f"Processing any pre-existing files in {WATCH_FOLDER}...")
        if not os.path.exists(WATCH_FOLDER):
            print(f"Error: path does not exist: {WATCH_FOLDER}", sys.stderr)
            return -1 
        for filename in os.listdir(WATCH_FOLDER):
            file_path = os.path.join(WATCH_FOLDER, filename)
            if os.path.isfile(file_path):
                event_handler.process(file_path)

        # Set up the observer for new files
        observer = Observer()
        observer.schedule(event_handler, WATCH_FOLDER, recursive=False)
        observer.start()
        observers.append((observer, WATCH_FOLDER))

    print(f"Watching folder(s): {', '.join(args.watch_folder)}")
    print("Type 'q' to quit, 'e' to open the folder(s) in the file browser.")
    try:
        while True:
            if sys.platform.startswith('win'):
                import msvcrt
                start_time = time.time()
                while True:
                    if msvcrt.kbhit():
                        ch = msvcrt.getwch()
                        if ch.lower() == 'q':
                            print("Quitting...")
                            exit()
                        elif ch.lower() == 'e':
                            for _, folder in observers:
                                print(f"Opening {folder} in file explorer...")
                                os.startfile(folder)
                        elif ch == '\r' or ch == '\n':
                            break
                    if time.time() - start_time > 10:
                        break
                    time.sleep(0.1)
            else:
                rlist, _, _ = select.select([sys.stdin], [], [], 10)
                if rlist:
                    user_input = sys.stdin.readline().strip().lower()
                    if user_input == 'q':
                        print("Quitting...")
                        exit()
                    elif user_input == 'e':
                        for _, folder in observers:
                            print(f"Opening {folder} in file browser...")
                            import subprocess
                            subprocess.Popen(['xdg-open', folder])
    except KeyboardInterrupt:
        for observer, _ in observers:
            observer.stop()
    for observer, _ in observers:
        observer.join()

if __name__ == "__main__":
    exit(main())