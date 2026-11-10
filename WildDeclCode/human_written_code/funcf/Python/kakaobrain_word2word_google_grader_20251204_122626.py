```python
def convert_google_translate(item, level=2):
    ratings = ["Common translation", "Uncommon translation", "Rare translation"][:level]
    # Rare translation
    return [e[1].lower() for e in item['trans'] if e[0] in ratings]
```