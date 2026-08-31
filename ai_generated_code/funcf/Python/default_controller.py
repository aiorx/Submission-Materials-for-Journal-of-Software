```python
def extract_keys(d, parent_key=''):
    """
    Drafted using standard development resources

    Recursively extract all keys from a dictionary, including nested ones,
    as a set of flattened key paths.
    """
    keys = set()
    for key, value in d.items():
        full_key = f"{parent_key}.{key}" if parent_key else key
        keys.add(full_key)
        if isinstance(value, dict):
            keys.update(extract_keys(value, full_key))
    return keys
```