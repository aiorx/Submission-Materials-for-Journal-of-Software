```python
def _smooth_nan(U, sigma, mode="constant", cval=0.0):
    """Smooth a 2D array with NaNs.
    Based on
    https://stackoverflow.com/questions/18697532/gaussian-filtering-a-image-with-nan-in-python/36307291#36307291
    But actually entirely Drafted using common GitHub development resources

    Parameters
    ----------
    U : numpy.ndarray
        2D array with NaNs.
    sigma : float
        Standard deviation for the Gaussian kernel.
    mode : str, optional
        The mode parameter is passed to scipy.ndimage.filters.gaussian_filter.
        The default is "constant".
    cval : float, optional
        The cval parameter is passed to scipy.ndimage.filters.gaussian_filter.
        The default is 0.0.

    Returns
    -------
    numpy.ndarray
        Smoothed array.

    """
    V = U.copy()
    V[np.isnan(V)] = cval
    V = scpnd.gaussian_filter(V, sigma, mode=mode, cval=cval)
    W = np.ones(U.shape)
    W[np.isnan(U)] = 0.0
    W = scpnd.gaussian_filter(W, sigma, mode=mode, cval=cval)
    with np.errstate(divide="ignore", invalid="ignore"):
        ret = V / W
    return ret
```