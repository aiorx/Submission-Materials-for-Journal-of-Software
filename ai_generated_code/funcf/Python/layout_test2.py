```python
def layout_text_circular(
    text,
    font_width,
    font_height
):
#this function Built using basic development resources
    """
    Wrap and center text for a circular screen.

    :param text: The full text to render.
    :param font_width: Width of each character in pixels.
    :param font_height: Height of each text line in pixels.
    :param screen_diameter: Diameter of the circular screen in pixels.
    :return: A list of (x, y, line_text) tuples.
    """
    screen_diameter=240
    radius = 240 / 2
    center_y = radius
    words = text.split()
    lines = []
    i = 0
    y_offsets = []

    # Build up vertical line positions (top to bottom)
    max_lines = int(screen_diameter / font_height)
    start_y = center_y - (max_lines / 2) * font_height
    y_positions = [start_y + i * font_height for i in range(max_lines)]

    current_line = ""
    word_index = 0

    for y in y_positions:
        dy = abs(y - center_y)
        if dy >= radius:
            continue  # Outside circle

        max_line_pixel_width = 2 * math.sqrt(radius**2 - dy**2)
        max_chars = int(max_line_pixel_width / font_width)

        line = ""
        while word_index < len(words):
            test_line = line + (" " if line else "") + words[word_index]
            if len(test_line) <= max_chars:
                line = test_line
                word_index += 1
            else:
                break

        if line:
            line_pixel_width = len(line) * font_width
            x = (screen_diameter - line_pixel_width) / 2
            lines.append((int(x), int(y), line))

        if word_index >= len(words):
            break
    #return None if the text didn't fit.
    if word_index < len(words): 
        return None
    return lines
```