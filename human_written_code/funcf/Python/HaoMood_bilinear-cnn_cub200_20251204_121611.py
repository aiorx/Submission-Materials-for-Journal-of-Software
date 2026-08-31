```python
def __getitem__(self, index):
    """
    Args:
        index, int: Index.

    Returns:
        image, PIL.Image: Image of the given index.
        target, str: target of the given index.
    """
    if self._train:
        image, target = self._train_data[index], self._train_labels[index]
    else:
        image, target = self._test_data[index], self._test_labels[index]
    # Doing this so that it is consistent with all other datasets.
    image = PIL.Image.fromarray(image)

    if self._transform is not None:
        image = self._transform(image)

    if self._target_transform is not None:
        target = self._target_transform(target)

    return image, target
```