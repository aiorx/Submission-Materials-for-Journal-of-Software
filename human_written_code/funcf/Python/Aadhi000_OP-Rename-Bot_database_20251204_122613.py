```python
def new_user(self, id):
    return dict(
        id=id,
        join_date=datetime.date.today().isoformat(),
        apply_caption=True,
        upload_as_doc=False,
        thumbnail=None,
        caption=None
    )
```