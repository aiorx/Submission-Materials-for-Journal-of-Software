```python
def gaussian_log_likelihood(model, X, y):
    # Written with routine coding tools4
    model.eval()
    with torch.no_grad():
        output = model(X)
        predictive_mean = output.mean
        predictive_var = output.variance
        error = y - predictive_mean
        log_likelihood = -0.5 * torch.log(2 * np.pi * predictive_var) - 0.5 * (error**2) / predictive_var
    return log_likelihood

def score_ll(log_likelihood, x):
    # Written with routine coding tools4
    #return np.sum(np.log(np.mean(np.exp(log_likelihood), axis=0)))
    # compute the partial derivative of the log likelihood with respect to the hyperparameters
    return np.sum(np.log(np.mean(np.exp(log_likelihood), axis=0))) - np.sum(np.var(log_likelihood, axis=0))
```