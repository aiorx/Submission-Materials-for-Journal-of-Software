```python
def compute_normal(x1,y1,x2,y2):
    # This code Aided using common development resources
    P1 = np.array([x1, y1])
    P2 = np.array([x2, y2])

    # Compute the vector between the two points
    v = P2 - P1

    # Compute the normal vector (rotate 90 degrees)
    normal_vector = np.array([-v[1], v[0]])

    # Compute the magnitude of the normal vector
    magnitude = np.linalg.norm(normal_vector)

    # Normalize the normal vector to get the unit normal
    unit_normal = normal_vector / magnitude

    # Output the unit normal
    return unit_normal
```