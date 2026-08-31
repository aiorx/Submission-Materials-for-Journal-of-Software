```python
def extract_substring(string, start_char, end_char):
    """
    Helper function to extract a substring.

    Crafted with basic coding tools 3.5
    """
    start_index = string.find(start_char)
    if start_index == -1:
        return None
    start_index += len(start_char)

    end_index = string.find(end_char, start_index)
    if end_index == -1:
        return None

    return string[start_index:end_index]
```