```python
def plot_images(images, writer, step, filename, rows=None, cols=None, figsize=None):  # Drafted using common development resources
    """
    Plot a batch of images in a grid.

    Parameters:
    - images: numpy array of shape (batch_size, height, width, channels)
    - rows: number of rows in the grid, defaults to sqrt(batch_size)
    - cols: number of columns in the grid, defaults to ceil(batch_size / rows)
    - figsize: size of the figure, default to None

    Returns: None
    """
    batch_size, height, width, channels = images.shape

    if rows is None:
        rows = int(np.ceil(np.sqrt(batch_size)))
    if cols is None:
        cols = int(np.ceil(batch_size / rows))
    if figsize is None:
        figsize = (cols * height / 10, rows * width / 10)

    fig, axes = plt.subplots(rows, cols, figsize=figsize)
    for i, ax in enumerate(axes.flat):
        if i < batch_size:
            ax.imshow(images[i])
        ax.axis("off")
    plt.tight_layout()
    writer.add_figure("Batch images", fig, step)
    plt.close()
```
```python
def generate_filename(num, directory="imgs", prefix="img_", padding=5):  # Drafted using common development resources
    """
    Generate a filename for an image with a number and padding.

    Parameters:
    - directory: directory where the image will be stored
    - prefix: prefix for the filename
    - num: number for the filename
    - padding: number of zeros to pad with

    Returns:
    - Filename in the form of directory/prefix + number with padding + .jpg
    """
    filename = "{}/{}{:0>{}}.jpg".format(directory, prefix, num, padding)
    return filename
```