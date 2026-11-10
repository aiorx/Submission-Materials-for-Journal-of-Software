import os
import sys

#####-----
# This code was Produced via common programming aids-4o and I fixed this code for convenience.
#####-----

def split_xyz_file(input_file_path):
    # Open the input file and read its contents
    with open(input_file_path, 'r') as file:
        lines = file.readlines()

    # Initialize variables
    chunks = []
    current_chunk = []

    for line in lines:
        # Check if the line contains only an integer
        if line.strip().isdigit():
            if current_chunk:
                chunks.append(current_chunk)
                current_chunk = []
        current_chunk.append(line)

    # Add the last chunk if it exists
    if current_chunk:
        chunks.append(current_chunk)

    # Save each chunk to a new file
    for chunk in chunks:
        # Find the integer and comment line
        if len(chunk) < 2:
            continue
        
        integer_line = chunk[0].strip()
        comment_line = chunk[1].strip()  # The line immediately after the integer line

        # Get the file name from the comment line
        file_name = comment_line.split()[0]  # Split by spaces and take the first element
        output_file_path = f"{file_name}.xyz"

        # Write the chunk to the output file
        with open(output_file_path, 'w') as output_file:
            output_file.writelines(chunk)

    print(f"Successfully split the file into {len(chunks)} parts.")

if __name__ == "__main__":
    input_file_path = sys.argv[1]
    split_xyz_file(input_file_path)
