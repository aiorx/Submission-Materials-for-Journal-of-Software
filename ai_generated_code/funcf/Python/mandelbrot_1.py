```python
def sample_area(real_start, real_end, imag_start, image_end, max_iters, width, height):
    """
    Loops over an area and assigns points to the Mandelbrot set
    Thanks chatGPT for this vectorized version (although it was wrong to begin with)
    """
    x, y = np.meshgrid(np.linspace(real_start, real_end, width),
                       np.linspace(imag_start, image_end, height))
    mandelbrot_set = np.zeros((height, width))
    c = x + y * 1j        # Map x, y to their complex values
    z = np.zeros_like(c)  # Initialise the value of 'z' at each location
    for i in range(max_iters):
        z = z**2 + c               # Iterate
        mask = np.abs(z) > 2.      # Select points that are diverging
        mandelbrot_set[mask] = i   # Set is number of iterations for divergence
        z[mask], c[mask] = 0., 0.  # Reset the diverging point so that it will not diverge in future
    return mandelbrot_set
```