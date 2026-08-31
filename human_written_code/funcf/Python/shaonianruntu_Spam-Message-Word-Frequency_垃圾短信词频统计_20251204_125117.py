```python
#剔除停用词
def delete_stopwords(lines):
    stopwords = read_file(stopword_file)
    all_words = []

    for line in lines:
        all_words += [word for word in jieba.cut(line) if word not in stopwords]

    dict_words = dict(Counter(all_words))

    return dict_words
```