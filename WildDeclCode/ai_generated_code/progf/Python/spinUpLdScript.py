#Composed with basic coding tools
import sys
from elftools.elf.elffile import ELFFile

def get_ebss_value(elf_path):
    with open(elf_path, 'rb') as f:
        elf = ELFFile(f)

        # Access the symbol table
        symtab = elf.get_section_by_name('.symtab')

        if symtab is not None:
            # Find the symbol with name "_ebss"
            for symbol in symtab.iter_symbols():
                if symbol.name == '_ebss':
                    return symbol['st_value']

        print("Symbol _ebss not found")

def generate_linker_script(output_file, RAM_CODE_START):
    # Read the linker script template
    with open('InitCode_TEMPLATE.ld', 'r') as template_file:
        template_content = template_file.read()

    # Replace placeholders with variable values
    modified_content = template_content.replace('{RAM_CODE_START}', str(RAM_CODE_START))
    # Write the modified linker script
    with open(output_file, 'w') as output:
        output.write(modified_content)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <elf_file>")
        sys.exit(1)

    elf_file_path = sys.argv[1]
    codeStart = get_ebss_value(elf_file_path)
    generate_linker_script("InitCode.ld", hex(codeStart))