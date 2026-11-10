```python
    segments = []
    current_segment = ""
    in_quotes = False
    quote_char = ""
    bracket_count = 0
    tuple_count = 0

    for char in input_str:
        if char in "\"'" and not in_quotes:
            in_quotes = True
            quote_char = char
        elif char == quote_char and in_quotes:
            in_quotes = False
            quote_char = ""
        elif char == "[":
            bracket_count += 1
        elif char == "]":
            bracket_count -= 1
        elif char == "(":
            tuple_count += 1
        elif char == ")":
            tuple_count -= 1
        elif char == "," and not in_quotes and bracket_count == 0 and tuple_count == 0:
            segments.append(current_segment.strip())
            current_segment = ""
            continue

        current_segment += char

    segments.append(current_segment.strip())  # Add the last segment
```