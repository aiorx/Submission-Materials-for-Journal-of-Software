```python
def test(self, message):
    self.bot.send_message(chat_id=self.config['chat_id'], text=message)
```