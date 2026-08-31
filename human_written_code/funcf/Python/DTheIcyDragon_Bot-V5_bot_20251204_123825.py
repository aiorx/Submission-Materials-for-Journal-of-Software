```python
async def on_ready(self) -> None:
    print(f"""
Logged in as {self.user.name}#{self.user.discriminator}
Startup @{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
    """)
    if not self.persistent_views_added:
        self.add_view(Join2CreateView())
        self.persistent_views_added = True
```