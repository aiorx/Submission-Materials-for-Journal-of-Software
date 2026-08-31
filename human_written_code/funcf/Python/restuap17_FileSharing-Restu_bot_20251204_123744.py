```python
async def stop(self, *args):
    await super().stop()
    self.LOGGER(__name__).info("Bot stopped.")
```