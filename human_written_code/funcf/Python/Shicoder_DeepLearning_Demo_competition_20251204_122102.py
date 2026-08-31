```python
def iteration(self):
    np.random.seed(len(self.generatives))
    generative = self.generatives[-1]

    x_true = self.true_model.random(self.size_batch).reshape(-1, 1)
    x_generative = generative.random(self.size_batch).reshape(-1, 1)
    x = np.concatenate((x_true, x_generative))
    y = np.concatenate((np.ones((self.size_batch,)),
                        np.zeros((self.size_batch,))))
    logger.debug("Using x: %s to y: %s", x.shape, y.shape)
    self.discriminative.fit(x, y)

    x_true = self.true_model.random(self.size_batch).reshape(-1, 1)
    x_generative = generative.random(self.size_batch).reshape(-1, 1)
    yhat_true= self.discriminative.predict(x_true)
    yhat_generative = self.discriminative.predict(x_generative)
    yhat = np.concatenate((yhat_true, yhat_generative))

    logger.debug("Computing AUC %s %s", y.shape, yhat.shape)
    self.l_auc.append(metrics.roc_auc_score(y,yhat))
    logger.debug("AUC %s", self.l_auc[-1])

    logger.debug("Computing gradient")
    d_grad = generative.d_log_likelihood(x_generative)

    logger.debug("Computing update")
    update = self.gradient_descent.transform(d_grad * (2 * yhat_generative - 1))

    new_generative = generative.updated(update)
    self.generatives.append(new_generative)
```