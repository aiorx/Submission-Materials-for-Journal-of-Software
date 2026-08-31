```python
class L_exp(nn.Module):

    def __init__(self,patch_size):
        super(L_exp, self).__init__()
        # print(1)
        self.pool = nn.AvgPool2d(patch_size)
        # self.mean_val = mean_val
    def forward(self, x, mean_val ):

        b,c,h,w = x.shape
        x = torch.mean(x,1,keepdim=True)
        mean = self.pool(x)

        d = torch.mean(torch.pow(mean- torch.FloatTensor([mean_val] ).cuda(),2))
        return d
```