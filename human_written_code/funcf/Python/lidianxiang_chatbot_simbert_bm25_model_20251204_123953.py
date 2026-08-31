```python
def _initialize(self, corpus):  # 算nd和self.avgdl
    nd = {}  # word -> number of documents with word 包含该词的文档数
    num_doc = 0  # 词的总数
    for document in corpus:
        self.doc_len.append(len(document))
        num_doc += len(document)

        frequencies = {}  # 词频
        for word in document:
            if word not in frequencies:
                frequencies[word] = 0
            frequencies[word] += 1
        self.doc_freqs.append(frequencies)

        for word, freq in frequencies.items():
            if word not in nd:
                nd[word] = 0
            nd[word] += 1

    self.avgdl = num_doc / self.corpus_size  # 文档平均长度
    return nd
```