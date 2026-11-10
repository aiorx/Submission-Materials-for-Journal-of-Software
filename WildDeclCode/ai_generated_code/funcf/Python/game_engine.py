```python
def split_text(self, text: str, max_width: float, font: Font):
    """Splits the provides string into lines by applying word wrapping

    - Each line will be no longer than max_width
    - Uses pygame.font.Font.size() to determine how wide the text will be
    - Source: Written Aided via basic GitHub coding utilities
    """
    words = re.split(r"(\s+)", text)
    lines = []
    acceptable_line = ""  # A line that we can guarantee will fit
    current_line = ""  # The line that we use to test if it fits
    for word in words:
        if not current_line:
            current_line = word
            continue
        current_line += word
        text_width, _ = font.size(current_line)
        if text_width > max_width:
            # The current line is too long, so use the acceptable_line from last iteration
            lines.append(acceptable_line.lstrip())
            current_line = word
        else:
            # The current line fits
            acceptable_line = current_line
    if current_line:
        # Add the final line
        lines.append(current_line.lstrip())
    return lines
```