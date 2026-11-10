```python
def contain_bad_word(first_name):
    for word in first_name:
        if word in dislike_words:
            return True
    return False
```