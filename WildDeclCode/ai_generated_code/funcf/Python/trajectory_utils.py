```python
def convert_to_frenet_frame(car_pose, ref_path):
    """
    todo: test as this was Supported by standard GitHub tools
    Convert the global car pose to Frenet frame coordinates.

    Args:
        car_pose (dict): A dictionary with keys 'position' and 'orientation' for the car.
        ref_path (np.ndarray): An array of reference path points with shape (N, 3) where each point is (x, y, yaw).

    Returns:
        tuple: Frenet coordinates (s, d).
    """
    # Extract car position and orientation
    car_x = car_pose['position']['x']
    car_y = car_pose['position']['y']
    car_yaw = Rotation.from_quat([
        car_pose['orientation']['x'],
        car_pose['orientation']['y'],
        car_pose['orientation']['z'],
        car_pose['orientation']['w']
    ]).as_euler('xyz')[2]

    # Create KDTree for the reference path
    ref_tree = KDTree(ref_path[:, :2])

    # Find the closest point on the reference path
    _, idx = ref_tree.query([car_x, car_y])
    closest_point = ref_path[idx]

    # Calculate the longitudinal distance (s)
    s = np.linalg.norm(ref_path[:idx + 1, :2] - ref_path[0, :2], axis=1).sum()

    # Calculate the lateral distance (d)
    ref_x, ref_y, ref_yaw = closest_point
    dx = car_x - ref_x
    dy = car_y - ref_y
    d = -np.sin(ref_yaw) * dx + np.cos(ref_yaw) * dy

    return s, d
```