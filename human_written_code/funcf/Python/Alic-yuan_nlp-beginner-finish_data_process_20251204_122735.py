```python
def read_data(self):
    """读取数据"""
    stopwords = list()
    with open(self.dataset_path, encoding='utf-8') as f1:
        data = f1.readlines()
    with open(self.stopwords_path, encoding='utf-8') as f2:
        temp_stopwords = f2.readlines()
    for word in temp_stopwords:
        stopwords.append(word[:-1])
    return data, stopwords
```