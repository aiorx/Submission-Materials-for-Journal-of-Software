# author: Chat GPT
# This script has been Aided using common development resources with slight modifications by marcsieber.

import os
import sys

default_year = str(2024)

def create_adventofcode_structure(day: int, year: int):
    # Format day with leading zero if less than 10
    day_str = "{:02d}".format(day)"

    # Base paths
    base_package_path = os.path.join("src/main/java/year{}".format(year), "day{}".format(day_str))
    resources_path = os.path.join("src/main/resources/{}/provided".format(year))
    example_file = os.path.join(resources_path, "day{}-example.txt".format(day_str))
    input_file = os.path.join(resources_path, "day{}.txt".format(day_str))

    # Create directories if not exist
    os.makedirs(base_package_path, exist_ok=True)
    os.makedirs(resources_path, exist_ok=True)

    # Java class content
    java_class_content = 'package year{}.day{};

import common.Utils;

import java.util.ArrayList;
import java.util.List;

/**
 * @see <a href="http://adventofcode.com/{}/day/{}">Day {}</a>
 */
public class Day{}Solution {{

    private static final String inputFile = "{}/provided/day{}-example.txt";
    //private static final String inputFile = "{}/provided/day{}.txt";

    public static void main(String[] args) {{

        final List<String> input = Utils.readInputFromResources(inputFile);

    }}
    
    // Utilities
    // ------------------------------------------------------------------------

}}
'.format(year, day_str, year, day, day_str, day_str, year, day_str, year, day_str)
    # Write Java class file if it doesn't exist
    java_class_path = os.path.join(base_package_path, "Day{}Solution.java".format(day_str))
    if not os.path.exists(java_class_path):
        with open(java_class_path, "w") as java_file:
            java_file.write(java_class_content)
        print("  -Created: {} (java class)".format(java_class_path))
    else:
        print("  -Warning: {} (class already exists)".format(java_class_path))

    # Write example file if it doesn't exist
    if not os.path.exists(example_file):
        with open(example_file, "w") as file:
            file.write("# Placeholder for Day {} example input
".format(day))
        print("  -Created: {} (example file)".format(example_file))
    else:
        print("  -Warning: {} (Example file already exists)".format(example_file))

    # Download and save input file if it doesn't exist
    if not os.path.exists(input_file):
        with open(input_file, "w") as file:
            file.write("# Placeholder for Day {} input
".format(day))
        print("  -Created: {} (input file)".format(input_file))
    else:
        print("  -Warning: {} (Input file already exists)".format(input_file))

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
        print("Invalid day argument: {}".format(e))
        sys.exit(1)

    # Create the structure
    create_adventofcode_structure(day, year)
