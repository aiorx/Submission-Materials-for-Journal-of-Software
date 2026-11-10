```python
def dict_raise_on_duplicates(ordered_pairs):
    """Reject duplicate keys."""
    d = {}
    for k, v in ordered_pairs:
        if k in d:
            raise ValueError("duplicate key: %s (value: %s)" % (k, v))
        else:
            d[k] = v
    return d
```