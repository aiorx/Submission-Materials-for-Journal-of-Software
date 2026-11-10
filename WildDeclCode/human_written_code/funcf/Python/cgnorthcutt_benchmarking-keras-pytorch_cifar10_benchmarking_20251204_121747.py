```python
def compute_val_acc(top5preds, top5probs, labels, indices_to_ignore=None,
                    indices_to_keep=None, custom_labels=None):
    # Create a mask of having True for each example we want to include in scoring.
    bool_mask = np.ones(VAL_SIZE).astype(bool)
    if indices_to_ignore is not None:
        bool_mask[indices_to_ignore] = False
    if indices_to_keep is not None:
        bool_mask = np.zeros(VAL_SIZE).astype(bool)
        bool_mask[indices_to_keep] = True
    if custom_labels is not None:
        true = np.asarray(custom_labels)
    else:
        true = labels[bool_mask]
    pred = top5preds[range(len(top5preds)), np.argmax(top5probs, axis=1)]
    pred = pred[bool_mask]
    # print('hey!')
    # print(len(pred), pred)
    # print(len(true), true)
    # print(indices_to_keep)
    # print("sum(bool_mask)", sum(bool_mask))
    # print("len(pred)", len(pred))
    # print("len(true)", len(true))
    # print("l
    acc1 = np.sum(pred == true) / float(len(true))
    # print("acc1", acc1)
    acc5 = np.sum([true[i] in top5preds[i] for i in range(len(true))]) / float(len(true))
    if custom_labels is not None:
        cacc1 = acc1
        cacc5 = acc5
    else:
        cacc1 = None
        cacc5 = None
    return acc1, acc5, cacc1, cacc5
```