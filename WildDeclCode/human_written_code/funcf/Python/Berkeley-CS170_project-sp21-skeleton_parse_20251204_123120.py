```python
def validate_file(path):
    """File must not exceed 100KB and must contain only numbers and spaces"""
    if os.path.getsize(path) > 100000:
        print(f"{path} exceeds 100KB, make sure you're not repeating edges!")
        return False
    with open(path, "r") as f:
        if not re.match(r"^[\d\.\s]+$", f.read()):
            print(f"{path} contains characters that are not numbers and spaces")
            return False
    return True
```