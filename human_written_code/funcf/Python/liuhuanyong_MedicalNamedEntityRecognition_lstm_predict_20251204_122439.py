```python
def load_worddict(self):
    vocabs = [line.strip() for line in open(self.vocab_path)]
    word_dict = {wd: index for index, wd in enumerate(vocabs)}
    return word_dict
```