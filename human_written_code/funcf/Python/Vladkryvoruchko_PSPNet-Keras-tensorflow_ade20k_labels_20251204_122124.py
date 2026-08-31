```python
def id2label(id):
    """Return the label with the given id."""
    for label in labels:
        if label.id == id:
            return label
    return None
```