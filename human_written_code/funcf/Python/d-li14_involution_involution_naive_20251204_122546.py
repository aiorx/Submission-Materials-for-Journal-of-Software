```python
def forward(self, x):
    weight = self.conv2(self.conv1(x if self.stride == 1 else self.avgpool(x)))
    b, c, h, w = weight.shape
    weight = weight.view(b, self.groups, self.kernel_size**2, h, w).unsqueeze(2)
    out = self.unfold(x).view(b, self.groups, self.group_channels, self.kernel_size**2, h, w)
    out = (weight * out).sum(dim=3).view(b, self.channels, h, w)
    return out
```