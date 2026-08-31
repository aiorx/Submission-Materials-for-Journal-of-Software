```python
def to_dict(self):
    """Return a JSON format of the request."""

    return {
        "id": self.id,
        "author": self.author.to_dict() if self.author else None,
        "title": self.title,
        "content": self.content,
        "community": self.community.to_dict() if self.community else None,
        "tag": self.tag.to_dict() if self.tag else None,
        "view_num": self.view_num,
        "like_num": self.like_num,
        "reply_num": self.reply_num,
        "save_num": self.save_num,
        "create_at": format_datetime_to_readable_string(self.create_at),
        "update_at": format_datetime_to_readable_string(self.update_at),
    }
```