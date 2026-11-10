```python
def DWise(channels, strides, **kwargs):
    out = nn.HybridSequential(**kwargs)
    with out.name_scope():
        out.add(
            nn.Conv2D(channels, 3, strides=strides, padding=1, groups=channels, use_bias=False),
            nn.BatchNorm(scale=True),
            RELU6(prefix="relu6_")
        )
    return out
```