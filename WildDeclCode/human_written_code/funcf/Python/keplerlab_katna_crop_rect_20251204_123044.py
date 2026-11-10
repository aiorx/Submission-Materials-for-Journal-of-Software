```python
def __str__(self):
    """Print crop rectangle

    :param object: base class inheritance
    :type object: class:`Object`
    """
    rep = (
        " x_pos: "
        + str(self.x)
        + " y_pos: "
        + str(self.y)
        + " width: "
        + str(self.w)
        + " height: "
        + str(self.h)
        + " target_crop_width: "
        + str(self.target_crop_width)
        + " target_crop_height: "
        + str(self.target_crop_height)
    )
    return rep
```