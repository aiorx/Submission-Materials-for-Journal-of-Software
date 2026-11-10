```python
def build(self, input_shape):
    channel_axis = -1
    if input_shape[0][channel_axis] is None:
        raise ValueError('The channel dimension of the inputs '
                         'should be defined. Found `None`.')
    input_dim = input_shape[0][channel_axis]
    kernel_shape = self.kernel_size + (input_dim, self.filters)

    if input_shape[1][-1] != input_dim:
        raise ValueError('The last dimension of modulation input should be equal to input dimension.')

    self.kernel = self.add_weight(shape=kernel_shape,
                                  initializer=self.kernel_initializer,
                                  name='kernel',
                                  regularizer=self.kernel_regularizer,
                                  constraint=self.kernel_constraint)

    # Set input spec.
    self.input_spec = [InputSpec(ndim=4, axes={channel_axis: input_dim}),
                        InputSpec(ndim=2)]
    self.built = True
```