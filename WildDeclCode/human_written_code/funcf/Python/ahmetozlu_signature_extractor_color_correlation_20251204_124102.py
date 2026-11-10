```python
def funcBrightContrast(img, bright=0):
    """Adjust the image contrast/brightness.

    Parameters
    ----------
    img : numpy ndarray
        The input image.
    bright : int
        The brightness level.

    Returns
    -------
    numpy ndarray
        The image whose brightness/contrast is adjusted.

    """
    effect = apply_brightness_contrast(img, bright, contrast)
    # save the final output image
    # cv2.imwrite("./outputs/" + output_img, effect)
    return effect
```