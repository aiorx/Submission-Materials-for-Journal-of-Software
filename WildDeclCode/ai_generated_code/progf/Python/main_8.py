# This program was Composed with basic coding tools and Mason Francis

import os
import argparse

def main():
    parser = argparse.ArgumentParser(description="Generate script to install programs using winget.")
    parser.add_argument("-a", "--add", metavar="filename", help="Add program names to an existing text file and generate a new script")
    parser.add_argument("-e", "--existing", metavar="filename", help="Generate a script based on an existing text file")
    parser.add_argument("-n", "--new", action="store_true", help="Interactive mode to manually enter program names")
    parser.add_argument("-o", "--output", metavar="filename", help="Specify the output filename for the script")
    parser.add_argument("-b", "--batch", action="store_true", help="Generate a batch script instead of a PowerShell script")

    args = parser.parse_args()

    if args.add:
        add_programs_from_file(args.add)
    elif args.existing:
        generate_script_from_file(args.existing, args.output, args.batch)
    elif args.new:
        interactive_input(args.output, args.batch)
    elif args.batch:  # Check if the batch flag is set
        interactive_input(args.output, is_batch=True)
    else:
        parser.print_usage()

def add_programs_from_file(filename):
    program_list = []
    with open(filename, "r") as file:
        for line in file:
            program_name = line.strip()
            if program_name:
                program_list.append(program_name)
    
    if program_list:
        generate_script(program_list)
        print("Script has been generated based on the added programs.")
        
        if input("Do you want to add more programs interactively? (y/n): ").lower() == "y":
            interactive_input(existing_programs=program_list)

def generate_script_from_file(filename, output_filename=None, is_batch=False):
    program_list = []
    with open(filename, "r") as file:
        for line in file:
            program_name = line.strip()
            if program_name:
                program_list.append(program_name)
    if program_list:
        generate_script(program_list, output_filename, is_batch)
        print(f"Script '{output_filename}' has been generated based on the provided program list.")

def interactive_input(output_filename=None, is_batch=False, existing_programs=None):
    program_list = existing_programs if existing_programs else []

    while True:
        program_name = input("Enter the name of a program (or press Enter to finish): ")
        if not program_name:
            break
        program_list.append(program_name)
        with open("programs_list.txt", "a") as file:
            file.write(program_name + "\n")

    if program_list:
        generate_script(program_list, output_filename, is_batch)
        print(f"Script '{output_filename}' and program list have been generated in the current directory.")

def generate_script(program_list, output_filename=None, is_batch=False):
    if not output_filename:
        output_filename = "install_apps.bat" if is_batch else "install_apps.ps1"

    script_content = ""

    if is_batch:
        for program in program_list:
            script_content += f'winget install "{program}"\n'
    else:
        script_content += "$programs = @(\n"
        for program in program_list:
            script_content += f'    "{program}",\n'
        script_content += ")\n\n"
        script_content += "foreach ($app in $programs) {\n"
        script_content += "    Start-Process -Wait -FilePath 'winget' -ArgumentList 'install', $app\n"
        script_content += "}\n"

    with open(output_filename, "w") as script_file:
        script_file.write(script_content)

if __name__ == "__main__":
    main()
