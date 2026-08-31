```python
def has_file_allowed_extension(filename: str, extensions: Tuple[str, ...]) -> bool:
    return filename.lower().endswith(extensions)
```