# Built via standard programming aids op 13-03-2025 als workaround om LyX tekst te kunnen spellchecken met hunspell
# Dit omdat de spellchecker in Lyx niet werkt.
# @TO 20250313

import os
import subprocess

# Paths
lyx_app = "/System/Volumes/Data/Applications/LyX.app/Contents/MacOS/lyx"
doc_path = '/Users/Theo/GRWMODELS/python/mf6lab/Projects/Dispersion/cases/wimsaquif/doc'

os.chdir(doc_path)

if not os.path.isdir(doc_path):
    raise FileNotFoundError("Can't find directory <{}>".format(doc_path))

# Files
fname = "WimsDispersion.lyx"
lyx_file = os.path.join(doc_path, fname)

if not os.path.isfile(lyx_file):
    raise FileNotFoundError("Can't find file <{}>".format(lyx_file))

tex_file = lyx_file.replace(".lyx", ".tex")

# Step 1: Export .lyx to .tex using LyX if the .tex doesn't exist
if not os.path.exists(tex_file):
    cmd = [lyx_app, "--export", "pdflatex", str(lyx_file)]
    try:
        subprocess.run(cmd, check=True)
        print("Successfully exported {} to {}.".format(lyx_file, tex_file))
    except subprocess.CalledProcessError as e:
        print("Error during LyX export: {}".format(e))
        exit(1)

# Step 2: Run aspell on the .tex file
aspell_cmd = "aspell -d en list --mode=tex < {} | sort -u".format(tex_file)

try:
    misspelled_words = subprocess.check_output(aspell_cmd, shell=True, text=True)
    print("Misspelled words:")
    print(misspelled_words)
    with open("misspelled_words.txt", "w") as f:
        f.writelines(misspelled_words)
except subprocess.CalledProcessError as e:
    print("Error during aspell check: {}".format(e))
    exit(1)
