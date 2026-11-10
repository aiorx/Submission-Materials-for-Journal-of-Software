```python
def compute_van_hove_correlation(positions, time_log, bins=100, rmax=8.0):
    # TODO: This is Aided with basic GitHub coding tools, please check if it is correct
    """
    Computes the Van Hove correlation function for a given trajectory.
    Note that you have to provide unwrapped coordinates.

    Parameters
    ----------
    positions : np.ndarray
        trajectory array with the shape (traj_length, N, 3)
    time_log : np.ndarray
        Logarithmically saved simulation times.
    bins : int, optional
        Number of bins for the histogram. The default is 100.
    rmax : float, optional
        Maximum distance for the histogram. The default is 8.0.

    Returns
    -------
    r : np.ndarray
        Grid points of the Van Hove correlation function.
    g_r : np.ndarray
        The Van Hove correlation function.
    """

    r_max = rmax
    r_min = 0.0
    dr = (r_max - r_min) / bins
    r = np.linspace(r_min, r_max, bins)

    # Compute the distance matrix
    distance_matrix = np.linalg.norm(positions[1:] - positions[0], axis=2)

    # Compute the histogram
    g_r, _ = np.histogram(distance_matrix, bins=bins, range=(r_min, r_max))

    # Normalize the histogram
    volume = 4.0 / 3.0 * np.pi * (r_max**3 - r_min**3)
    n_particles = positions.shape[1]
    g_r = g_r / (n_particles * volume)

    return r, g_r
```