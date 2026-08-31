```python
def load_semantic(self):
    sem_dict = {}
    for line in codecs.open(self.cilin_path):
        line = line.strip().split(' ')
        sem_type = line[0]
        words = line[1:]
        for word in words:
            if word not in sem_dict:
                sem_dict[word] = sem_type
            else:
                sem_dict[word] += ';' + sem_type

    for word, sem_type in sem_dict.items():
        sem_dict[word] = sem_type.split(';')
    return sem_dict
```