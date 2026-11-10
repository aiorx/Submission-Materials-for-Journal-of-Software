```python
def get_format(bot, update):
    logger.info("from {}: {}".format(update.message.chat_id, update.message.text)) # "history"

    try:
        video = Video(update.message.text, init_keyboard=True)
    except BadLink:
        update.message.reply_text("Bad link")
    else:
        reply_markup = InlineKeyboardMarkup(video.keyboard)
        update.message.reply_text('Choose format:', reply_markup=reply_markup)
```