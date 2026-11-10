```python
def __init__(self, latent_size, hidden_size, output_size, num_layers):
    super(LSTMXYPredictor, self).__init__()
    self.state = None
    self.lstm = nn.LSTM(latent_size, hidden_size, num_layers, batch_first=True)
    self.fc = nn.Linear(hidden_size, output_size)

def forward(self, x):
    # x: [batch_size, sequence_length, latent_size]
    out, _ = self.lstm(x)  # LSTM output shape: [batch_size, sequence_length, hidden_size]
    out = self.fc(out[:, -1, :])  # Take last time step output and pass through the fully connected layer
    return out  # Predicted next vector

def forward_keep_state(self, x):
    """Forward, while keeping state"""
    # x: [batch_size, sequence_length, latent_size]
    out, self.state = self.lstm(x, self.state)  # LSTM output shape: [batch_size, sequence_length, hidden_size]
    out = self.fc(out[:, -1, :])  # Take last time step output and pass through the fully connected layer
    return out  # Predicted next vector
```