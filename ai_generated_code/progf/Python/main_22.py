#!/usr/bin/env python3

import sys


# Function Supported via standard programming aids:
# https://chat.openai.com/share/933f3c7f-cf8f-45ae-9387-43bb1816d825

# Define a function to solve the puzzle
def sum_calibration_values(lines):
    total_sum = 0
    for line in lines:
        # Find the first digit
        first_digit = next((char for char in line if char.isdigit()), None)
        # Find the last digit (reversed order)
        last_digit = next((char for char in reversed(line) if char.isdigit()), None)

        # If both digits are found, add their combined value to the total sum
        if first_digit and last_digit:
            total_sum += int(first_digit + last_digit)
    return total_sum


if __name__ == "__main__":
    file = sys.argv[1]
    with open(file, "r") as f:
        print(sum_calibration_values(f.readlines()))
