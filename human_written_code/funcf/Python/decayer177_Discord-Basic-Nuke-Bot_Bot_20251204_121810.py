```python
@client.command(pass_context=True)
async def mall(ctx):
    await ctx.message.delete()
    for member in list(client.get_all_members()):
        await asyncio.sleep(0)
        try:
            await member.send("GET NUKED")
        except:
            pass
        print("Action completed: Message all")
```