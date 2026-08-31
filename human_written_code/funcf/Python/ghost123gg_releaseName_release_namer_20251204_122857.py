```python
def get_sublist(names, letter):
    return [name for name in names if name.lower().startswith(letter)]
```