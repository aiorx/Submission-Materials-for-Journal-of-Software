```python
def __init__(self, S=7, B=2, C=1):
    """
    YOLOv1 Loss Function, Formed using standard development resources, based on the original paper's loss criterion.
    There was a problem with a negative sqrt, but that seems to have been sorted out.

    Args:
    - S (int): Grid size (default 7x7).
    - B (int): Number of bounding boxes per grid cell.
    - C (int): Number of classes.
    """
    super(YOLOv1Loss, self).__init__()
    self.S = S
    self.B = B
    self.C = C
    self.mse = MSELoss(reduction="sum")
```