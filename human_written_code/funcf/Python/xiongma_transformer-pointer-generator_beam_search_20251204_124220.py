```python
def extend(self, token, log_prob, word):
    """
    Extend the hypothesis with result from latest step.
    :param token: latest token from decoding
    :param log_prob: log prob of the latest decoded tokens.
    :param word: word piece by transformer decode
    :return: new Hypothesis with the results from latest step.
    """

    return Hypothesis(self.tokens + [token], self.log_prob + log_prob, self.sents + word)
```