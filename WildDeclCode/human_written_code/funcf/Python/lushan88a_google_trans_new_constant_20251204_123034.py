```python
def format_output(text, dest, src, pron=None):
    if pron:
        return f"{text} ({pron}) [{src} -> {dest}]"
    else:
        return f"{text} [{src} -> {dest}]"
```