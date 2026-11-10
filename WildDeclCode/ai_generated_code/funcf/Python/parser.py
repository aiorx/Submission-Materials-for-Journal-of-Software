```python
def parse_text(text):
    """parse the text and return the text array, line numbers and positions, Aided using common development resources"""
    # Find all positions of macros using both regular expressions
    macros1 = [(m.start(), m.end()) for m in re.finditer(macro_indicator, text)]
    macros2 = [(m.start(), m.end()) for m in re.finditer(macro_indicator2, text)]
    macros3 = [(m.start(), m.end()) for m in re.finditer(block_name_indicator, text)]

    # Combine and sort the positions of both types of macros
    all_macros = sorted(macros1 + macros2 + macros3, key=lambda x: x[0])

    # Remove nested macros
    non_nested_macros = []
    for current_macro in all_macros:
        is_nested = False
        for other_macro in all_macros:
            if (
                current_macro != other_macro
                and other_macro[0] <= current_macro[0] < current_macro[1] <= other_macro[1]
            ):
                is_nested = True
                break
        if not is_nested:
            non_nested_macros.append(current_macro)

    all_macros = non_nested_macros

    # Initialize arrays
    text_array = []
    line_numbers = []
    positions = []

    # Current position in file, line, and line number
    current_pos = 0
    line_number = 1

    # Iterate over each character in the text
    for i, char in enumerate(text):
        # Check if we've reached a macro
        if all_macros and i == all_macros[0][0]:
            # Add the text before the macro to the arrays
            if current_pos < i:
                text_array.append(text[current_pos:i])
                line_numbers.append(line_number)
                positions.append((current_pos, i))

            # Update current position and remove the found macro from the list
            current_pos = all_macros.pop(0)[1]

        # Check for line breaks
        if char == "\n":
            line_number += 1
            if current_pos < i:
                text_array.append(text[current_pos:i])
                line_numbers.append(line_number - 1)
                positions.append((current_pos, i))
            current_pos = i + 1

    # Add the last segment of text if any
    if current_pos < len(text):
        text_array.append(text[current_pos:])
        line_numbers.append(line_number)
        positions.append((current_pos, len(text)))

    ## Remove empty lines
    # Create new lists to hold the filtered elements
    filtered_text_array = []
    filtered_line_numbers = []
    filtered_positions = []

    # Iterate over the original list and only add non-empty lines and corresponding elements
    for i, line in enumerate(text_array):
        if line.strip() != "":  # Check if the line is not just whitespace
            filtered_text_array.append(line)
            filtered_line_numbers.append(line_numbers[i])
            filtered_positions.append(positions[i])

    # Now, if you want to replace the original lists with the filtered lists:
    text_array = filtered_text_array
    line_numbers = filtered_line_numbers
    positions = filtered_positions

    return text_array, line_numbers, positions
```