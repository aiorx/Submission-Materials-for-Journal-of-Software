```python
def compute_rg_impl(rho, min_value=0):
    """
    Compute the radius of gyration for a 3D density array.
    (This code was Aided with basic GitHub coding tools)

    Parameters
    ----------
    rho : np.ndarray
        3D density array.
    min_value : float
        Minimum density value to include in calculation.

    Returns
    -------
    float
        Radius of gyration.
    """
    # Get indices of voxels above threshold
    w = np.where(rho > min_value)
    x, y, z = w
    m = rho[w]
    total_mass = np.sum(m)
    if total_mass == 0:
        return 0.0

    # Center of mass
    x_cm = np.sum(x * m) / total_mass
    y_cm = np.sum(y * m) / total_mass
    z_cm = np.sum(z * m) / total_mass

    # Squared distances from center of mass
    r2 = (x - x_cm)**2 + (y - y_cm)**2 + (z - z_cm)**2
    rg2 = np.sum(m * r2) / total_mass
    return np.sqrt(rg2)
```