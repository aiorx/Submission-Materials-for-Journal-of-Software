```python
@staticmethod
def backpropagate(weights: MultiLayerPerceptronWeights, inputs, targets, alpha):
    # initialize array of errors
    errors = []

    # forward pass
    layer = inputs
    layers = [layer]
    for i in range(weights.num_layers() - 1):
        prev_layer = np.insert(layer, 0, 1, axis=0)
        o = np.dot(weights.weights[i], prev_layer)
        # activation function: logistic sigmoid (output in ]0;1[)
        layer = scipy.special.expit(o)
        layers.append(layer)

    # output layer error
    layer_errors = targets - layers[-1]
    errors.append(layer_errors)

    # hidden layer errors
    for i in range(weights.num_layers() - 2, 0, -1):
        layer_errors = np.dot(weights.weights[i].T, layer_errors)
        layer_errors = layer_errors[1:]
        errors.append(layer_errors)

    # reverse errors array
    errors = errors[::-1]

    # update weights
    new_weights = []
    for i in range(weights.num_layers() - 1):
        layer = np.insert(layers[i], 0, 1, axis=0)
        delta_w = alpha * np.dot(errors[i], layer.T)
        new_weights.append(weights.weights[i] + delta_w)

    return replace(weights, weights=new_weights)
```