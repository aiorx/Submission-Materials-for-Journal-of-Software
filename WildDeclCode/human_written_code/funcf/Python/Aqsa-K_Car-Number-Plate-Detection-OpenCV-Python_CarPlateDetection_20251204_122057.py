```python
def find_number_plate_contour(cnts):
    """
    Loop over contours to find the best possible approximate contour of a number plate.
    The number plate contour is assumed to have 4 corners.

    Args:
        cnts (list): List of contours.

    Returns:
        approx (numpy.ndarray or None): The approximated contour with 4 corners if found, else None.
    """
    for c in cnts:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        if len(approx) == 4:  # Select the contour with 4 corners
            return approx
    return None
```