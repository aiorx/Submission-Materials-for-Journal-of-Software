```python
def move_file(old_location, new_location):
    """
    Move file from old_location to new_location
    Code Assisted using common GitHub development aids
    """
    old_location_path = Path(old_location)
    new_location_path = Path(new_location)
    
    if old_location_path.is_file():
        print(f"Moving: {old_location} to {new_location}")
        old_location_path.rename(new_location_path)
    else:
        print(f"No file found at {old_location}")
```