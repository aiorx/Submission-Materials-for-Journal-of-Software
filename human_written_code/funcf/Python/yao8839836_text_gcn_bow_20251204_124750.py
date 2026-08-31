```python
def load_data(dataset='20ng'):
    doc_name_list = []
    doc_train_list = []
    doc_test_list = []

    f = open('data/' + dataset + '.txt', 'r')
    for line in f.readlines():
        doc_name_list.append(line.strip())
        temp = line.split("\t")
        if temp[1].find('test') != -1:
            doc_test_list.append(line.strip())
        elif temp[1].find('train') != -1:
            doc_train_list.append(line.strip())
    f.close()

    doc_content_list = []
    f = open('data/corpus/' + dataset + '.clean.txt', 'r')
    for line in f.readlines():
        doc_content_list.append(line.strip())
    f.close()

    train_ids = []
    for train_name in doc_train_list:
        train_id = doc_name_list.index(train_name)
        train_ids.append(train_id)
    random.shuffle(train_ids)

    f = open('data/' + dataset + '.train.index', 'r')
    lines = f.readlines()
    f.close()
    train_ids = [int(x.strip()) for x in lines]

    test_ids = []
    for test_name in doc_test_list:
        test_id = doc_name_list.index(test_name)
        test_ids.append(test_id)
    random.shuffle(test_ids)

    ids = train_ids + test_ids

    shuffle_doc_name_list = []
    shuffle_doc_words_list = []
    for id in ids:
        shuffle_doc_name_list.append(doc_name_list[int(id)])
        shuffle_doc_words_list.append(doc_content_list[int(id)])

    return shuffle_doc_name_list, shuffle_doc_words_list, train_ids, test_ids
```