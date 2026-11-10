```python
def label_encode_features(train_x, test_x, columns):
    from sklearn.preprocessing import LabelEncoder
    for c in columns:
        le = LabelEncoder()
        le.fit(train_x[c].fillna('NA'))
        train_x[c] = le.transform(train_x[c].fillna('NA'))
        test_x[c] = le.transform(test_x[c].fillna('NA'))
    return train_x, test_x
```