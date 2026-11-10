```python
def clean_up(text):
    text = text.replace('<pad>', '')
    text = text.replace('</s>', '')
    text = text.replace(".", '')
    text = text.replace(',', '')
    text = text.replace("'", '')
    text = text.replace('"', '')
    return text
```