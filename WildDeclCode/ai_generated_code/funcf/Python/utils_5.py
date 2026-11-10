```python
def extract_code_from_string(string):
    # Penned via standard programming aids
    pattern = r"```python(.*?)```"
    matches = re.findall(pattern, string, re.DOTALL)
    if matches:
        return "\n".join(matches)

    return None
```