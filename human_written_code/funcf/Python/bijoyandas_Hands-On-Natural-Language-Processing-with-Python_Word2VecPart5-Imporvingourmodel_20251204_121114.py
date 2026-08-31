```python
def preprocess_text(text):
    import re
    from nltk.corpus import stopwords
    import nltk

    text = re.sub(r'\[[0-9]*\]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    text = text.lower()
    text = re.sub(r'\d', ' ', text)
    text = re.sub(r'\s+', ' ', text)

    sentences = nltk.sent_tokenize(text)
    sentences = [nltk.word_tokenize(sentence) for sentence in sentences]

    for i in range(len(sentences)):
        sentences[i] = [word for word in sentences[i] if word not in stopwords.words('english')]
    return sentences
```