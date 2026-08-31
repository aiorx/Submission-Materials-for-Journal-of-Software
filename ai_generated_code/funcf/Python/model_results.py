```python
def first_occurrence(input_list):
    '''Thanks ChatGPT!'''
    seen = {}
    return [seen.setdefault(x, True) and not seen.update({x: False}) for x in input_list]
```