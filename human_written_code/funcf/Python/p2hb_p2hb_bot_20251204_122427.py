```python
async def _prefix_callable(bot, msg):
    user_id = bot.user.id
    base = [f'<@!{user_id}> ', f'<@{user_id}> ']
    if msg.guild is None:
        base.append(config.DEFAULT_PREFIX)
    else:
        prefix = bot.prefixes.get(msg.guild.id)
        if prefix is None:
            guild = await bot.mongo.fetch_guild(msg.guild)
            bot.prefixes[msg.guild.id] = guild.prefix
            prefix = bot.prefixes.get(msg.guild.id)

        base.append(prefix)

    return base
```