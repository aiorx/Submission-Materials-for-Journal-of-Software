```python
formatted_channel_type = re.sub(r"(?<=\w)([A-Z])", r" \1", ' '.join(word.capitalize() for word in str(channel.channel_type).split('.')[1:])).replace("_", " ").title()
```