```python
def load_and_preprocess_images(dataset_path):
    from imutils import paths
    from utilities.preprocessing import SimplePreprocessor
    from utilities.datasets import SimpleDatasetLoader

    # Get list of image paths
    image_paths = list(paths.list_images(dataset_path))

    # Initialize SimplePreprocessor and SimpleDatasetLoader and load data and labels
    print('[INFO]: Images loading....')
    sp = SimplePreprocessor(32, 32)
    sdl = SimpleDatasetLoader(preprocessors=[sp])
    (data, labels) = sdl.load(image_paths, verbose=500)

    # Reshape from (num_samples, 32, 32, 3) to (num_samples, 32*32*3=3072)
    data = data.reshape((data.shape[0], 3072))

    # Print information about memory consumption
    print('[INFO]: Features Matrix: {:.1f}MB'.format(float(data.nbytes / 1024*1000.0)))

    return data, labels
```