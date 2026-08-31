```python
def to_dict(self) -> dict:
    """Return a JSON format of the user record."""

    return {
        "id": self.id,
        "user": self.user.to_dict() if self.user else None,
        "request": self.request.to_dict() if self.request else None,
        "create_at": format_datetime_to_readable_string(self.create_at),
    }
```