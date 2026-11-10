```python
def weights_init(m):
    classname = m.__class__.__name__
    if "Linear" in classname or "Embedding" == classname:
        print(f"Initializing Module {classname}.")
        nn.init.trunc_normal_(m.weight.data, 0.0, 0.02)
    # elif "Parameter" in classname:
    #     return nn.init.trunc_normal_(m, 0.0, 0.02)
```