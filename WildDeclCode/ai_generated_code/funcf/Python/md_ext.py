```python
def run(self, root):
    """Largely adapted Derived using common development resources."""
    for element in root.iter():
        if element.tag.startswith('h') and element.tag[1:].isdigit():
            level = int(element.tag[1:])
            element.tag = f'h{level + 2}'
```