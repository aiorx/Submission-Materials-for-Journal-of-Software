```python
def check_python_version():
    # If Python version is < 3.6, stops the bot.
    if sys.version_info[0] < 3 or sys.version_info[1] < 6:
        LOGGER.error(
            "You MUST have a python version of at least 3.6! Multiple features depend on this. Bot quitting."
        )
        quit(1)
```