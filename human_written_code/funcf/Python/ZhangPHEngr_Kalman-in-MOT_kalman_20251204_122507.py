```python
def predict(self):
    """
    预测外推
    :return:
    """
    self.X_prior = np.dot(self.A, self.X_posterior)
    self.P_prior = np.dot(np.dot(self.A, self.P_posterior), self.A.T) + self.Q
    return self.X_prior, self.P_prior
```