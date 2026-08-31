```python
def forward(self,x):

    residual_linear_x = self.residual_linear_layer(x)
    x.contiguous()
    # attention layer
    x = self.attention(x)
    # linear layers
    x = self.fc_after_attention(x)
    x = torch.squeeze(x)
    x = F.softsign(x)
    x = F.normalize(x, dim = 1)
    x = torch.unsqueeze(x, dim=2)
    x = torch.bmm(x.transpose(1,2), residual_linear_x)
    x = torch.squeeze(x)

    return x
```