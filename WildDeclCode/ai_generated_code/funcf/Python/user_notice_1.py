```python
def to_dict(self) -> dict:
    """Return a JSON format of the user notice."""

    return {
        "id": self.id,
        "user": self.user.to_dict() if self.user else None,
        "subject": self.subject,
        "content": self.content,
        "module": self.module.value,
        "status": self.status,
        "create_at": format_datetime_to_readable_string(self.create_at),
        "update_at": format_datetime_to_readable_string(self.update_at),
        "diff_date": format_datetime_to_local_date_diff(self.create_at),
    }
```