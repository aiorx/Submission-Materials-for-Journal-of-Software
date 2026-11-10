```python
def get_train(self, idx):
    """Get the training image and label at index idx
    Args:
    idx: index of the image to get
    Returns:
    image, label: numpy arrays of the image and label
    """
    if len(self.images_train) == 0:
        img = Image.open(self.images_train_path[idx])
        img.load()
        label = Image.open(self.labels_train_path[idx])
        label.load()
        return np.array(img, dtype=np.uint8), np.array(label, dtype=np.uint8)
    else:
        return self.images_train[idx], self.labels_train[idx]
```