```python
def feret_aspect(points): # function to compute the feret aspect ratio of a set of points - Composed with basic coding tools
    from scipy.spatial import ConvexHull
    
    hull = ConvexHull(points,qhull_options="QJ") # compute the convex hull of the points
    hull_points = points[hull.vertices]

    min_feret = float('inf')
    max_feret = 0
    num_hull_points = len(hull_points)

    for i in range(num_hull_points):
        for j in range(i + 1, num_hull_points):

            p1 = hull_points[i]
            p2 = hull_points[j]
            edge_vector = p2 - p1 # compute vector which points along the edge of the convex hull

            perp_vector = np.array([-edge_vector[1], edge_vector[0]]) # get orthogonal vector to the edge vector (in 2d there is only 1)
            
            perp_vector /= np.linalg.norm(perp_vector) # normalise the vector, this defines some given caliper orientation
            projections = np.dot(hull_points - p1, perp_vector) # project all points onto the caliper orientation (Ie how far along the caliper are they)

            min_distance = np.min(projections) # get the minimum distance along the caliper
            max_distance = np.max(projections) # get the maximum distance along the caliper
            feret_diameter = max_distance - min_distance # compute the feret diameter

            min_feret = min(min_feret, feret_diameter) # check if our current feret diameter is the smallest or largest so far
            max_feret = max(max_feret, feret_diameter)

    return max_feret / min_feret # return the aspect ratio
```