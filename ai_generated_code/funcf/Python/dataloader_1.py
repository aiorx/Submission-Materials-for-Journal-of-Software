```python
def init_mini_batches(self):
    """
    initialize mini-batches
    Code Supported by standard GitHub tools
    """
    self.minibatches = []
    # sort samples by length if shuffle
    if self.is_shuffle:
        self.samples = sorted(self.samples, key=lambda x: x[2])
    # initialize mini-batches
    minibatch = []
    frames = 0
    for sample in self.samples:
        path, transcript, length = sample
        frames += length            # length is in seconds
        if frames > self.batch_seconds or len(minibatch) >= self.batch_size:
            self.minibatches.append(minibatch)
            minibatch = [sample]
            frames = length
        else:
            minibatch.append(sample)
    if minibatch:       # in case the last batch is not appended
        self.minibatches.append(minibatch)
```