```python
def parse(names):
    """
    Turns address list into province, city, country and street.
    :param names: list of address
    :return: list of place, brand, trade, suffix
    """
    result = []
    for name in names:
        r = companynameparser.parse(name)
        result.append('\t'.join([r['place'], r['brand'], r['trade'], r['suffix']]))
    return result
```