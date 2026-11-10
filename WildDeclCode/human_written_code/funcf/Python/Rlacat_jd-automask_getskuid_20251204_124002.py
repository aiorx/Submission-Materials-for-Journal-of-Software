```python
def get_price_from_html(html):
    price_pattern = re.compile(r'"jdPrice":\[(\d+\.?\d*)\]')
    match = price_pattern.search(html)
    if match:
        return float(match.group(1))
    return None
```