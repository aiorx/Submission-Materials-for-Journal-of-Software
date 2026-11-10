```python
class Encoder(nn.Module):

    def __init__(self, input_size, hidden_size):
        super(Encoder, self).__init__()
        self.embed = nn.Linear(input_size, hidden_size)
        self.embed_2 = nn.Linear(hidden_size, hidden_size)

    def forward(self, input):
        output = F.relu(self.embed(input))
        output = self.embed_2(output)
        return output
```