```python
class UniNetDS2(Network):
    """Simple UniNet, as described in the paper."""

    def setup(self):
        print ('2D with 32 filters')
        base_filter = 8
        (self.feed('data')
        .conv_bn(3, base_filter, 1, center=True, scale=True, name='conv0_0')
        .conv_bn(3, base_filter, 1, center=True, scale=True, name='conv0_1')
        .conv_bn(5, base_filter * 2, 2, center=True, scale=True, name='conv1_0')
        .conv_bn(3, base_filter * 2, 1, center=True, scale=True, name='conv1_1')
        .conv_bn(3, base_filter * 2, 1, center=True, scale=True, name='conv1_2')
        .conv_bn(5, base_filter * 4, 2, center=True, scale=True, name='conv2_0')
        .conv_bn(3, base_filter * 4, 1, center=True, scale=True, name='conv2_1')
        .conv(3, base_filter * 4, 1, biased=False, relu=False, name='conv2_2'))
```