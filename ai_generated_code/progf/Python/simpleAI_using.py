# Built via standard programming aids
# Q: And if i want to use the tarined model, how do i do this
# A:Using the trained model is straightforward. Once you have a saved model (like the 'mnist_model.pth' file from the previous example), you can load it and use it for inference. Here's how you can load the trained model and make predictions using new data:

import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image

# Define the same neural network architecture
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, 10)

    def forward(self, x):
        x = torch.flatten(x, start_dim=1)  # Flatten input images
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = self.fc3(x)
        return x

# Load the trained model
model = Net()
model.load_state_dict(torch.load('mnist_model.pth'))
model.eval()  # Set the model to evaluation mode

# Load an image for inference
transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
image = Image.open('./image/4v2.png')  # Replace with your image path
input_tensor = transform(image).unsqueeze(0)  # Add batch dimension

# Make a prediction
with torch.no_grad():
    output = model(input_tensor)
    predicted_class = torch.argmax(output).item()

print("Predicted class:", predicted_class)
