```python
def clean_attributes(attr_name):
    clean_name = attr_name.replace('_', ' ')
    clean_name = list(clean_name)
    for idx, ltr in enumerate(clean_name):
        if (idx == 0) or (idx > 0 and clean_name[idx - 1] == ' '):
            clean_name[idx] = clean_name[idx].upper()
    clean_name = ''.join(clean_name)
    return clean_name
```