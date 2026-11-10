```python
def parse():
    parser = argparse.ArgumentParser()
    parser.add_argument('--folder', help='Name of the folder containing the image data')
    parser.add_argument('--modality', nargs='+', help='Name of the modality, mr, ct, split by space')
    parser.add_argument('--size', nargs='+', type=int, help='Image dimensions')
    parser.add_argument('--folder_postfix', nargs='?', default='_train', help='Folder postfix of the folder to look for')
    parser.add_argument('--out_folder', help='Name of the output folder')
    parser.add_argument('--deci_rate', type=float, default=0., help='Decimation rate of ground truth mesh')
    parser.add_argument('--smooth_iter', type=int, default=50, help='Smoothing iterations for GT mesh')
    parser.add_argument('--seg_id', default=[], type=int, nargs='+', help='List of segmentation ids to apply marching cube')
    parser.add_argument('--aug_num', type=int, default=0, help='Number of crop augmentation')
    parser.add_argument('--intensity',nargs='+', type=int, default=[750,-750], help='Intensity range to clip to [upper, lower]')
    args = parser.parse_args()
    return args   
```