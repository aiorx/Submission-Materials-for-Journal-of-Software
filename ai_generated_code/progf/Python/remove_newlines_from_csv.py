# Formed using common development resources
# write me a script to remove newlines from within fields of a csv file
# make it read stdin and write to stdout
#
# Usage: cat input.csv | python remove_newlines_from_csv.py > output.csv
#
# https://chat.openai.com/c/536fbd55-0a31-4429-955a-78dcb021d701

import csv
import sys

# Create CSV reader and writer for stdin and stdout
reader = csv.reader(sys.stdin)
writer = csv.writer(sys.stdout)

for row in reader:
	# Remove newlines from each field in the row
	cleaned_row = [field.replace('\n', ' ').replace('\r', ' ') for field in row]
	
	# Write the cleaned row to stdout
	writer.writerow(cleaned_row)
