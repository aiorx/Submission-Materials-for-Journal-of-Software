```python
def add_batch(self, id, prediction, groundtruth):

    # for now, store them all (as a list of minibatch chunks)
    self._ids.append(id)
    self._predictions.append(prediction)
    self._groundtruths.append(groundtruth)
```