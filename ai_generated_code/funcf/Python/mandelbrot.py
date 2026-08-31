```python
def sample_area_python(real_start: float, real_end: float, imag_start: float, imag_end: float,
                       max_iters: int, width: int, height: int, smooth=False) -> np.array:
    """
    Loops over an area and assigns points to the Mandelbrot set
    Thanks chatGPT for this vectorized version (although it was wrong to begin with)
    """
    m = np.zeros((height, width))
    for irow in range(height):
        for icol in range(width):
            x = real_start + (real_end - real_start) * icol / width
            y = imag_end + (imag_start - imag_end) * irow / height
            z = 0.
            c = x + y * 1j
            n = 0
            for i in range(max_iters):
                z = z**2 + c
                if np.abs(z) > 2.:  # Divergence
                    if smooth:  # Fractional iteration count
                        n = i + 1. - \
                            math.log(math.log(abs(z)))/math.log(2.)
                    else:
                        n = i
                    break
            m[irow, icol] = n
    return m


@njit(parallel=True)
def sample_area_numba(real_start: float, real_end: float, imag_start: float, imag_end: float,
                      max_iters: int, width: int, height: int, smooth=False) -> np.array:
    """
    Loops over an area and assigns points to the Mandelbrot set
    Thanks chatGPT for this vectorized version (although it was wrong to begin with)
    """
    m = np.zeros((height, width))
    for irow in prange(height):
        for icol in prange(width):
            x = real_start + (real_end - real_start) * icol / width
            y = imag_end + (imag_start - imag_end) * irow / height
            z = 0.
            c = x + y * 1j
            n = 0
            for i in range(max_iters):
                z = z**2 + c
                if np.abs(z) > 2.:  # Divergence
                    if smooth:  # Fractional iteration count
                        n = i + 1. - \
                            np.log(np.log(np.abs(z)))/np.log(2.)
                    else:
                        n = i
                    break
            m[irow, icol] = n
    return m


def sample_area_numpy(real_start: float, real_end: float, imag_start: float, imag_end: float,
                      max_iters: int, width: int, height: int, smooth=False) -> np.array:
    """
    Loops over an area and assigns points to the Mandelbrot set
    Thanks chatGPT for this vectorized version (although it was wrong to begin with)
    """
    x, y = np.meshgrid(np.linspace(real_start, real_end, width),
                       np.linspace(imag_end, imag_start, height))
    mandelbrot_set = np.zeros((height, width))
    c = x + y * 1j        # Map x, y to their complex values
    z = np.zeros_like(c)  # Initialise the value of 'z' at each location
    for i in range(max_iters):
        z = z**2 + c               # Iterate
        mask = np.abs(z) > 2.      # Select points that are diverging
        if smooth:  # Fractional iteration count
            mandelbrot_set[mask] = i + 1. - \
                np.log(np.log(np.abs(z[mask])))/np.log(2.)
        else:  # Set is number of iterations for divergence
            mandelbrot_set[mask] = i
        z[mask], c[mask] = 0., 0.  # Reset the diverging point so that it will not diverge in future
    return mandelbrot_set
```