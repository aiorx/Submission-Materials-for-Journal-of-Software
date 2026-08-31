```python
def add_key_to_json_dict(fname, key, value):
    """Thanks copilot"""
    with open(fname, "r") as f:
        d = json.load(f)
    d[key] = value
    with open(fname, "w") as f:
        json.dump(d, f)
```