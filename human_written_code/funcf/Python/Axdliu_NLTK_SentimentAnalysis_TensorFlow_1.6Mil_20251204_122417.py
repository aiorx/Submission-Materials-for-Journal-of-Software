```python
def create_lexicon(fin):
    lexicon = []
    with open(fin, 'r', buffering=100000, encoding ='latin-1') as f:
        try:
            counter = 1
            content = ''
            for line in f:
                counter+=1
                if(counter/2500.0).is_integer():
                    tweet=line.split(':::')[1]

                    content+= ' '+tweet
                    words = word_tokenize(content)
                    words = [lemmatizer.lemmatize(i) for i in words]
                    lexicon = list(set(lexicon + words))
                    print(counter, len(lexicon))
        except Exception as e:
            print(str(e))
    with open('lexicon.pickle', 'wb') as f:
        pickle.dump(lexicon, f)
```