```python
def next_raw_batch(self, batch_size, n_epoch):
    start = 0
    rand_idx = np.random.permutation(self.n_train_triple)
    
    count = 0
    while count < n_epoch:

        end = min(start + batch_size, self.n_train_triple)

        yield [self.train_data[i] for i in rand_idx[start:end]]
        
        if end == self.n_train_triple:
            start = 0
            rand_idx = np.random.permutation(self.n_train_triple)
            count += 1
        else:
            start = end
```