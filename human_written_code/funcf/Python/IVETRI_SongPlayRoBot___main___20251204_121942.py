```python
@app.on_message(filters.create(ignore_blacklisted_users) & filters.command("help"))
async def help(client, message):
    if message.from_user["id"] == OWNER_ID:
        await message.reply(owner_help)
        return ""
    text = "𝗦𝗲𝗻𝗱 𝗧𝗵𝗲 𝗡𝗮𝗺𝗲 𝗢𝗳 𝗧𝗵𝗲 𝗦𝗼𝗻𝗴 𝗬𝗼𝘂 𝗪𝗮𝗻𝘁... 😍🥰🤗\n /song (song name) 🥳"
    await message.reply(text)
```