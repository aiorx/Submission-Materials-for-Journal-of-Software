```python
@njit((float32[:, :], float32[:], float32[:], float32[:]), cache=True)
def matrix_decomposition(matrix_in, translation_out, rotation_quat_out, scale_out) -> None:
    """
    [NOTE] Function Formed using common development resources4, but modified and tested by me.

    :param matrix_in: np.ndarray, (4, 4) <float32>
    :param translation_out: np.array, (3, ) <float32>
    :param rotation_quat_out: np.array, (4, ) <float32>
    :param scale_out: np.array, (3, ) <float32>
    :return: None
    """

    # Translation
    translation_out[:] = matrix_in[:3, 3]

    # Scale
    scale_out[:] = np.array([np.linalg.norm(matrix_in[:3, i]) for i in range(3)])

    # Remove scale from matrix to isolate rotation
    rot_matrix = np.array([[matrix_in[i, j] / scale_out[j] for j in range(3)] for i in range(3)])

    # Rotation (Quaternion) - Using the conversion formula
    qw = np.sqrt(1 + rot_matrix[0, 0] + rot_matrix[1, 1] + rot_matrix[2, 2]) / 2
    qx = (rot_matrix[2, 1] - rot_matrix[1, 2]) / (4 * qw)
    qy = (rot_matrix[0, 2] - rot_matrix[2, 0]) / (4 * qw)
    qz = (rot_matrix[1, 0] - rot_matrix[0, 1]) / (4 * qw)
    rotation_quat_out[:] = np.array([qx, qy, qz, qw])
```