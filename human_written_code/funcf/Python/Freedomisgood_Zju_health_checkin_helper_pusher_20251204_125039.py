```python
def gen_text_msg(content, at=None, at_all=False):
    if at is None:
        at = []
    return {
        "msgtype": "text",
        "text": {"content": content},
        "at": {"atMobiles": at, "isAtAll": at_all},
    }
```