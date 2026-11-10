```python
def cal_PRF1(labels, preds):
    """
    计算查准率P，查全率R，F1值。
    """
    cm = cal_conf_matrix(labels, preds)
    P = cm[0,0]/(cm[0,0]+cm[1,0])
    R = cm[0,0]/(cm[0,0]+cm[0,1])
    F1 = 2*P*R/(P+R)
    return P, R, F1
```