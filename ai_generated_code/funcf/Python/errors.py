```python
elif isinstance(
    error, (app_commands.CommandOnCooldown, commands.CommandOnCooldown)
):
    retry_after = humanfriendly.format_timespan(round(error.retry_after, 1))
    options = [
        (
            "Prithee, good sir or madam, 'tis requested that thou might wait a moment. "
            "Thy command dost require a brief interlude to catch its breath. "
            "Tarry but a short while, perchance 'twould be but {}, "
            "then thou mayest try thy command anew. Be patient, kind soul, and all shall be well."
        ),
        (
            "Verily, good friend, thou must grant thy command a brief respite. "
            "Tis too hasty, and needs a moment to recover. "
            "Wait {}, then try thy command once more. Have faith, all shall be well."
        ),
        (
            "Hark! Thou must be patient, gentle user. "
            "Thy command hath need of a moment's rest. "
            "In {}, thou mayest try thy command again. "
            "Fear not, all shall be right in the end."
        ),
        (
            "Hold, brave user! Thy command doth require a moment of peace. "
            "Wait {}, and then thou mayest attempt thy command once more. "
            "Have no doubt, all shall turn out well in the end."
        ),
    ]
    msg = random.choice(options).format(retry_after)
    return await ctx.reply(msg)
```