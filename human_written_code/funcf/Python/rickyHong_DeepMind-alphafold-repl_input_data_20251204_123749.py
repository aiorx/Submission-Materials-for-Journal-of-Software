```python
def get_chunks(self, mode):
    input_file_prefix = self.train_file_prefix
    if mode == RunMode.TRAIN:
        chunks = self.train_chunks
        random.shuffle(chunks)
    elif mode == RunMode.VALIDATE:
        chunks = self.val_chunks
    elif mode == RunMode.TEST:
        input_file_prefix = self.test_file_prefix
        chunks = [0]
    elif mode == RunMode.UNLABEL:
        input_file_prefix = self.unlabel_file_prefix
        chunks = range(self.unlabel_chunk_num)
        random.shuffle(chunks)
    return ['{}_{:d}.tfrecord'.format(input_file_prefix, c)\
            for c in chunks]
```