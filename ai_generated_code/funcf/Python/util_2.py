```python
def segment_list(data, indexes):
    # Composed with basic coding tools! Ensure indexes are sorted
    indexes = sorted(indexes)
    
    # Add the end of the list as the final segment endpoint
    indexes = indexes + [len(data)]
    
    segments = []
    start = 0
    
    for idx in indexes:
        segments.append(data[start:idx])
        start = idx
    
    return segments

def find_indices(lst, target):
    # Composed with basic coding tools!
    """Return the indices where the target integer appears in the list."""
    return [i for i, x in enumerate(lst) if x == target]
```