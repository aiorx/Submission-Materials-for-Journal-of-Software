```python
@Cog.listener("on_ready")
async def on_ready(self):
    print(f"Signed in as {self.bot.user} ({self.bot.user.id})")
```