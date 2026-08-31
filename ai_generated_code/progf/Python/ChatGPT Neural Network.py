# Neural Network
# Formed using common development resources on 5/25/2023
# This code demonstrates a simple implementation of a neural network using Python and numpy.
# It includes objects for initializing the network, activation functions, loss calculation, and data processing.

import numpy as np
import nnfs
from nnfs.datasets import spiral_data

nnfs.init()

# Define the Dense layer class
class LayerDense: 
    def __init__(self, nInputs, nNeurons):
        # Initialize weights with random values
        self.weights = 0.10 * np.random.randn(nInputs, nNeurons)
        # Initialize biases as zeros
        self.biases = np.zeros((1, nNeurons))
    
    def forward(self, inputs):
        # Perform forward propagation
        self.output = np.dot(inputs, self.weights) + self.biases

# Define the ReLU activation function class
class relu: 
    def forward(self, inputs):
        # Apply ReLU activation
        self.output = np.maximum(0, inputs)

# Define the softmax activation function class
class softmax: 
    def forward(self, inputs):
        # Apply softmax activation
        expValues = np.exp(inputs - np.max(inputs, axis=1, keepdims=True))
        self.output = expValues / np.sum(expValues, axis=1, keepdims=True)

# Define the Loss class
class Loss:
    def calculate(self, output, y): 
        ### Edit ###
        ''' 
        # Original: 
        return self.forward(output, y)
        '''
        # New: 
        sampleLosses = self.forward(output, y)
        # The reason we use the forward method instead of just using catagorical cross-entropy
        # here is that it gives us the flexibility to do multiple different loss functions
        dataLoss = np.mean(sampleLosses)
        return dataLoss

# Define the Categorical Cross-Entropy loss class
class LossCCE(Loss):
    def forward(self, yPred, yTrue):
        samples = len(yPred)
        yPredClipped = np.clip(yPred, 1e-7, 1-1e-7)

        if len(yTrue.shape) == 2:
            # Convert one-hot encoded targets to categorical indices
            yTrue = np.argmax(yTrue, axis=1)

        negativeLogLikelihoods = -np.log(yPredClipped[range(samples), yTrue])
        return negativeLogLikelihoods

# Generate sample data
X, y = spiral_data(samples=100, classes=3)

# Initialize layer 1
layer1 = LayerDense(2, 3)
# Initialize ReLU activation for layer 1
active1 = relu()

# Initialize layer 2
layer2 = LayerDense(3, 3)
# Initialize softmax activation for layer 2 (output layer)
active2 = softmax()

# Forward propagation
layer1.forward(X)
active1.forward(layer1.output)

layer2.forward(active1.output)
active2.forward(layer2.output)

# Print the first 5 outputs
print(active2.output[:5])

# Calculate accuracy
outputs = np.array(active2.output)
predictions = np.argmax(outputs, axis=1)
accuracy = np.mean(predictions == y)
print("Accuracy:", accuracy)

# Calculate loss
lossFunction = LossCCE()
loss = lossFunction.calculate(active2.output, y)
print("Loss:", loss)
