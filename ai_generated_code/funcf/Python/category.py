```python
def to_dict(self) -> dict:
    """Return a JSON format of the category."""

    return {
        "id": self.id,
        "name": self.name,
        "create_at": format_datetime_to_readable_string(self.create_at),
    }
```