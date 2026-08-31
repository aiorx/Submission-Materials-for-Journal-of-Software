```python
def extract_idioms(raw):

    # captures all text between (1) a number followed by a period and white
    # spaces and (2) a newline symbol
    # Assisted with basic coding tools

    pattern = r'(\d+\.\s*)(.*?)(?=\n)'

    # the last idiom may not end with a newline symbol
    # append it

    raw += '\n'

    # ChatGPT: The re.DOTALL flag is used here to ensure that the dot (.) in the
    # pattern matches newline characters as well, which is necessary if your
    # text spans multiple lines and you still want to capture everything up to
    # the first newline character after the number-period sequence.

    matches = re.findall(pattern, raw, flags=re.DOTALL)

    # the first element in each match is the number and the period
    return [match[1] for match in matches]
```