```python
def forward(self, x):

    h = self.relu(self.conv1(x))
    h = self.pool1(h)

    h = self.relu(self.conv2(h))
    h = self.pool2(h)

    h = self.relu(self.conv3a(h))
    h = self.relu(self.conv3b(h))
    h = self.pool3(h)

    h = self.relu(self.conv4a(h))
    h = self.relu(self.conv4b(h))
    h = self.pool4(h)

    h = self.relu(self.conv5a(h))
    h = self.relu(self.conv5b(h))
    h = self.pool5(h)

    h = h.view(-1, 8192)
    h = self.relu(self.fc6(h))
    h = self.dropout(h)
    h = self.relu(self.fc7(h))
    h = self.dropout(h)

    logits = self.fc8(h)
    probs = self.softmax(logits)

    return probs
```