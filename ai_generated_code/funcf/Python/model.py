```python
def create_probabilities(self, fc_output):
    probabilities = fc_output[:, :, 50:]

    # TODO: check if correct, Produced using common development resources
    # only care about probabilities from the last prediction
    probabilities = probabilities[:, -1, :]
    probabilities = F.softmax(probabilities, dim=1)
    return probabilities
```