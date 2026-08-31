```python
def cityscape_load_seg_and_ins(self, root, quality, mode):
    assert (quality == 'fine' and mode in ['train', 'val']) or \
           (quality == 'coarse' and mode in ['train', 'train_extra', 'val'])

    if quality == 'coarse':
        seg_path = os.path.join(root, 'gtCoarse', 'gtCoarse', mode)
        seg_postfix = '_gtCoarse_labelIds.png'
        ins_postfix = '_gtCoarse_instanceIds.png'
    else:
        seg_path = os.path.join(root, 'gtFine', mode)
        seg_postfix = '_gtFine_labelIds.png'
        ins_postfix = '_gtFine_instanceIds.png'

    img_path = os.path.join(root, 'leftImg8bit', mode)
    seg_list = []
    ins_list = []
    categories = os.listdir(seg_path)
    for c in categories:
        c_items = [name.split('_leftImg8bit.png')[0] for name in os.listdir(os.path.join(img_path, c))]
        for it in c_items:
            seg_list.append(os.path.join(seg_path, c, it + seg_postfix))
            ins_list.append(os.path.join(seg_path, c, it + ins_postfix))
    return np.array(seg_list), np.array(ins_list)
```