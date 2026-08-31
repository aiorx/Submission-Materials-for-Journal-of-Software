```python
def random_point_in_sphere(radius):
    # Generate random coordinates in the sphere with given radius (thanks ChatGPT!)
    u, v, w = np.random.uniform(0, 1, size=3)
    r = w**(1/3) * radius

    # Convert random coordinates to Cartesian coordinates
    theta = 2 * np.pi * u
    phi = np.arccos(2 * v - 1)
    x = r * np.sin(phi) * np.cos(theta)
    y = r * np.sin(phi) * np.sin(theta)
    z = r * np.cos(phi)

    return x, y, z
```
```python
def random_point_on_surface(r):
    # Generate random coordinates in the sphere with given radius (thanks ChatGPT!)
    u, v = np.random.uniform(0, 1, size=2)

    # Convert random coordinates to Cartesian coordinates
    theta = 2 * np.pi * u
    phi = np.arccos(2 * v - 1)
    x = r * np.sin(phi) * np.cos(theta)
    y = r * np.sin(phi) * np.sin(theta)
    z = r * np.cos(phi)

    return x, y, z
```