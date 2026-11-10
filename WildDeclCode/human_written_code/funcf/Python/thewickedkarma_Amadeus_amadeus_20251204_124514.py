```python
def help(bot, update):
    """Send a message when the command /help is issued."""
    update.message.reply_text('[/reset] resets the conversation,\n [/retry] retries the last output,\n [/username name] sets your name to the bot, default is "Human",\n [/botname name] sets the bots character name, default is "AI"')
```