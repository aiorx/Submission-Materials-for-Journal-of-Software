```python
def resize(image, size):
    """
    Resize the input image to the given size.

    Args:
        image (PIL.Image or np.ndarray): The input image to resize.
        size (tuple): The desired output size as (width, height).

    Returns:
        PIL.Image: The resized image.
    """
    if isinstance(image, np.ndarray):
        image = Image.fromarray(image)
    return image.resize(size, Image.ANTIALIAS)
```