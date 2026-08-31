```python
def load_predictions(rgb_preds, opf_preds):
    with open(rgb_preds,'rb') as f:
        rgb = pickle.load(f)
    with open(opf_preds,'rb') as f:
        opf = pickle.load(f)
    return rgb, opf
```