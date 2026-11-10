```python
def gt_box(contours):
    list_bbox = []
    for j in range(contours.shape[2]):
        quad_points = numpy.zeros((4, 1, 2), dtype='float32')
        for k in range(4):
            quad_points[k][0][0] = contours[0][k][j]
            quad_points[k][0][1] = contours[1][k][j]
        list_bbox.append(quad_points)  # quad_points.astype(numpy.int32)
    return list_bbox
```