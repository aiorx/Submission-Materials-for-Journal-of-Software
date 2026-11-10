```python
def create_sphere(
    radius: float,
    shape: tuple[int, int, int],
    offset: tuple[float, float, float] = (0, 0, 0),
) -> np.ndarray:
    """Create a 3D numpy array with a BB inside. Thanks ChatGPT."""
    # axis 0: positive -> left, offset, 1: positive -> up, 2: positive -> in
    # Calculate the center of the array
    center = np.array(shape) / 2 - 0.5 + np.array(offset)
    # Create a grid of indices
    indices = np.indices(shape)
    # Calculate the distance of each point from the center
    distances = np.sqrt(
        np.sum((indices - center[:, np.newaxis, np.newaxis, np.newaxis]) ** 2, axis=0)
    )
    # Set values inside the sphere to the distance from the center
    arr = radius - distances
    arr[arr <= 0] = 0  # Clamp negative intensity values to 0
    # Apply a sigmoidal function to the array to make the edges sharper and
    # the BB more "flat" in the center
    arr = _create_sigmoidal_array(arr)
    arr *= 1000  # Scale intensity to a reasonable range
    arr -= arr.min()  # set background to 0
    return arr
```