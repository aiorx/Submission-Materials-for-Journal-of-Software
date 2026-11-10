```python
def prepare_data(embeddings, sentiments, train_ids, maxlen=15):
    x_train = []
    y_train = []
    x_test = []
    y_test = []

    for vid, vdata in embeddings['embeddings'].items():
        for sid, sdata in vdata.items():
            if sdata == []:
                continue
            example = []
            for i, time_step in enumerate(sdata):
                if i == maxlen:
                    break
                example.append(time_step[2])  # use only the feature vector, ignore timestamps

            for i in range(maxlen - len(sdata)):
                example.append(np.zeros(sdata[0][2].shape))  # padding to maxlen
            example = np.asarray(example)
            label = 1 if sentiments[vid][sid] >= 0 else 0  # binarize labels

            if vid in train_ids:
                x_train.append(example)
                y_train.append(label)
            else:
                x_test.append(example)
                y_test.append(label)

    x_train = np.asarray(x_train)
    x_test = np.asarray(x_test)
    y_train = np.asarray(y_train)
    y_test = np.asarray(y_test)
    return x_train, y_train, x_test, y_test
```