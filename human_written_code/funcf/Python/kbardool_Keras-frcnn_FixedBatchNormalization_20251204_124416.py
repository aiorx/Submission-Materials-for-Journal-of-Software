```python
def build(self, input_shape):
    self.input_spec = [InputSpec(shape=input_shape)]
    shape = (input_shape[self.axis],)

    self.gamma = self.add_weight(shape=shape,
                                 initializer=self.gamma_init,
                                 regularizer=self.gamma_regularizer,
                                 name='{}_gamma'.format(self.name),
                                 trainable=False)
    self.beta = self.add_weight(shape=shape,
                                initializer=self.beta_init,
                                regularizer=self.beta_regularizer,
                                name='{}_beta'.format(self.name),
                                trainable=False)
    self.running_mean = self.add_weight(shape=shape, initializer='zero',
                                        name='{}_running_mean'.format(self.name),
                                        trainable=False)
    self.running_std = self.add_weight(shape=shape, initializer='one',
                                       name='{}_running_std'.format(self.name),
                                       trainable=False)

    if self.initial_weights is not None:
        self.set_weights(self.initial_weights)
        del self.initial_weights

    self.built = True
```