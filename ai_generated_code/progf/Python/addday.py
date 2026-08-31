# author: Chat GPT
# This script has been Aided using common development resources with slight modifications by marcsieber.

import os
import sys

default_year = str(2024)

def create_adventofcode_structure(day: int, year: int):
    # Format day with leading zero if less than 10
    day_str = f"{day:02d}"

    # Base paths
    base_package_path = os.path.join(f"src/main/java/year{year}", f"day{day_str}")
    resources_path = os.path.join(f"src/main/resources/{year}/provided")
    example_file = os.path.join(resources_path, f"day{day_str}-example.txt")
    input_file = os.path.join(resources_path, f"day{day_str}.txt")

    # Create directories if not exist
    os.makedirs(base_package_path, exist_ok=True)
    os.makedirs(resources_path, exist_ok=True)

    # Java class content
    java_class_content = f"""\
package year{year}.day{day_str};

import common.Utils;

import java.util.ArrayList;
import java.util.List;

/**
 * @see <a href="http://adventofcode.com/{year}/day/{day}">Day {day_str}</a>
 */
public class Day{day_str}Solution {{

    private static final String inputFile = "{year}/provided/day{day_str}-example.txt";
    //private static final String inputFile = "{year}/provided/day{day_str}.txt";

    public static void main(String[] args) {{

        final List<String> input = Utils.readInputFromResources(inputFile);

    }}
    
    // Utilities
    // ------------------------------------------------------------------------

}}
"""
    # Write Java class file if it doesn't exist
    java_class_path = os.path.join(base_package_path, f"Day{day_str}Solution.java")
    if not os.path.exists(java_class_path):
        with open(java_class_path, "w") as java_file:
            java_file.write(java_class_content)
        print(f"  -Created: {java_class_path} (java class)")
    else:
        print(f"  -Warning: {java_class_path} (class already exists)")

    # Write example file if it doesn't exist
    if not os.path.exists(example_file):
        with open(example_file, "w") as file:
            file.write(f"# Placeholder for Day {day} example input\n")
        print(f"  -Created: {example_file} (example file)")
    else:
        print(f"  -Warning: {example_file} (Example file already exists)")

    # Download and save input file if it doesn't exist
    if not os.path.exists(input_file):
        with open(input_file, "w") as file:
            file.write(f"# Placeholder for Day {day} input\n")
        print(f"  -Created: {input_file} (input file)")
    else:
        print(f"  -Warning: {input_file} (Input file already exists)")

if __name__ == "__main__":
    # Ensure day argument is provided
    if len(sys.argv) != 2 and len(sys.argv) != 3:
        print("Usage: python addday.py <day> <year> (optional)")
        sys.exit(1)

    # Validate day argument
    try:
        day = int(sys.argv[1])
        year = default_year if len(sys.argv) == 2 else sys.argv[2]
        if day < 1 or day > 25:
            raise ValueError("Day must be between 1 and 25.")
    except ValueError as e:
        print(f"Invalid day argument: {e}")
        sys.exit(1)

    # Create the structure
    create_adventofcode_structure(day, year)
