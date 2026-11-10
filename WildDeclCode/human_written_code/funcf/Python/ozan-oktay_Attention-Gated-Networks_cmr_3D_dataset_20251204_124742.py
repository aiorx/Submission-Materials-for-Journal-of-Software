```python
def __getitem__(self, index):
    # update the seed to avoid workers sample the same augmentation parameters
    np.random.seed(datetime.datetime.now().second + datetime.datetime.now().microsecond)

    # load the nifti images
    if not self.preload_data:
        input, _ = load_nifti_img(self.image_filenames[index], dtype=np.int16)
        target, _ = load_nifti_img(self.target_filenames[index], dtype=np.uint8)
    else:
        input = np.copy(self.raw_images[index])
        target = np.copy(self.raw_labels[index])

    # handle exceptions
    check_exceptions(input, target)
    if self.transform:
        input, target = self.transform(input, target)

    return input, target
```