
# This script is Assisted with basic coding tools, I know simple python lol

import re
import os
import sys

BASE_DIR = "lua"
MAIN_FILE = "goobie-sql/goobie-sql.lua"
OUTPUT_FILE = "goobie-sql.lua"
COMMON_PATH = "goobie-sql/common.lua"  # Special file to inline only once.

common_defined = False  # global flag to track if common.lua was inlined
FULL_VERSION = ""

def process_file(file_relative_path):
    full_path = os.path.join(BASE_DIR, file_relative_path)
    if not os.path.exists(full_path):
        print("Error: File not found: {}".format(full_path))
        sys.exit(1)
    with open(full_path, "r") as f:
        content = f.read()

    # If processing the common file, replace version placeholders.
    if file_relative_path == COMMON_PATH:
        content = content.replace("FULL_VERSION_PLACEHOLDER", FULL_VERSION)

    # Pattern to capture optional assignment and the include statement.
    # Group 1: The full assignment string, e.g., "local common = "
    # Group 2: The variable name (e.g., "common")
    # Group 3: The file path inside include(...)
    pattern = r'(local\s+(\w+)\s*=\s*)?include\("([^"]+)"\)'

    def replace_include(match):
        global common_defined
        assignment_prefix = match.group(1)  # e.g., "local common = " (or None)
        var_name = match.group(2)            # e.g., "common" (or None)
        include_path = match.group(3)

        if include_path == COMMON_PATH:
            if not common_defined:
                processed = process_file(include_path)
                common_defined = True
                if not var_name:
                    var_name = "_COMMON_TMP_"
                    assignment_prefix = "local {} = ".format(var_name)
                return "{}(function()
{}
end)(); local _COMMON_MAIN_ = {};".format(assignment_prefix, processed, var_name)
            else:
                if assignment_prefix:
                    return "{}_COMMON_MAIN_".format(assignment_prefix)
                else:
                    return "_COMMON_MAIN_"
        else:
            processed = process_file(include_path)
            if assignment_prefix:
                return "{}(function()
{}
end)()".format(assignment_prefix, processed)
            else:
                return "(function()
{}
end)()".format(processed)

    new_content = re.sub(pattern, replace_include, content)
    return new_content

def main():
    global FULL_VERSION
    if len(sys.argv) < 2:
        print("Usage: python script.py <full_version>")
        sys.exit(1)
    FULL_VERSION = sys.argv[1]
    processed_main = process_file(MAIN_FILE)
    with open(OUTPUT_FILE, "w") as f:
        f.write(processed_main)
    print("Preprocessing complete. Output written to {}".format(OUTPUT_FILE))

if __name__ == "__main__":
    main()
