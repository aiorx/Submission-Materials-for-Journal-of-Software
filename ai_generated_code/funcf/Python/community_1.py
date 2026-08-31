```python
def to_dict(self) -> dict:
    """Return a JSON format of the community."""

    return {
        "id": self.id,
        "name": self.name,
        "category": self.category.to_dict() if self.category else None,
        "description": self.description,
        "avatar_url": self.avatar_url,
        "creator": self.creator.to_dict() if self.creator else None,
        "create_at": format_datetime_to_readable_string(self.create_at),
        "update_at": format_datetime_to_readable_string(self.update_at),
    }
```