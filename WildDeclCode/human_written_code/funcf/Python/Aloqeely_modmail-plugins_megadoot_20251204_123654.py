```python
@commands.command()
async def fight(self, ctx, user: discord.Member):
    if user == ctx.author:
        await ctx.send("You can't fight yourself!")
        return
    fight_msg = random.choice(self.fights).format(ctx.author.display_name, user.display_name, self.bot.user.display_name)
    await ctx.send(fight_msg)
```