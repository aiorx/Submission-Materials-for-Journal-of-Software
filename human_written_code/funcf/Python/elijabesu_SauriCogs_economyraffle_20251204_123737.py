```python
@economyraffleset.command(name="settings")
async def economyraffleset_settings(self, ctx: commands.Context):
    """See current settings."""
    data = await self.config.guild(ctx.guild).all()
    required_role = ctx.guild.get_role(
        await self.config.guild(ctx.guild).required_role()
    )
    required_role = required_role.name if required_role else "None"

    embed = discord.Embed(
        colour=await ctx.embed_colour(), timestamp=datetime.datetime.now()
    )
    embed.set_author(name=ctx.guild.name, icon_url=ctx.guild.icon_url)
    embed.title = "**__Economy Raffle settings:__**"
    embed.set_footer(text="*required to function properly")

    embed.add_field(name="Enabled:", value=required_role)
    embed.add_field(name="Amount*:", value=str(data["amount"]))
    embed.add_field(name="Message:", value=data["message"], inline=False)

    await ctx.send(embed=embed)
```