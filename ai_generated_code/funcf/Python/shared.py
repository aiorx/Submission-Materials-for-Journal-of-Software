```python
def delete(self, *keys: str | list[str]):
    # Composed with basic coding tools
    current_level = self.dictionary
    for key in keys[:-1]:
        current_level = current_level.get(key, {})

    last_key = keys[-1]
    if last_key in current_level:
        del current_level[last_key]
        self.write_file()
```