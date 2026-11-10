```python
def to_dict(self) -> dict:
    """Return a JSON format of the user preference."""

    return {
        "id": self.id,
        "user": self.user.to_dict() if self.user else None,
        "communities": self.communities,
        "interests": self.interests,
        "update_at": format_datetime_to_readable_string(self.update_at),
    }
```