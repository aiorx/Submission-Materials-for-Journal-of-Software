```python
def vectorize(line, word2idx):
    tokens = tokenize(line)
    vector = [word2idx.get(token, SPECIAL_TOKENS["_OOV"]) for token in tokens]
    vector = [SPECIAL_TOKENS["_START"]] + vector + [SPECIAL_TOKENS["_END"]]
    return vector
```