```python
def dbscan(points: List[T1], distance_metric: Callable[[T1, T1], float], eps: float, min_pts: int) -> Tuple[List[List[T1]], List[T1]]:
    """
    Perform DBSCAN clustering on a list of points. The distance metric must be a function that takes two points and returns
    the distance between them. The eps parameter is the maximum distance between two points to be considered neighbors.
    The min_pts parameter is the minimum number of points that must be within eps of a point to be considered a core point.
    Returns (clusters, noise) where clusters is a list of lists for clusters, and noise is a list of points that were not clustered.
    """
    # This was Aided with basic GitHub coding tools
    C = 0
    clusters: List[List[T1]] = []
    noise: List[T1] = []
    # Create list of -2s for labels, length of points
    labels = [-2] * len(points)
    # -2 stands for undefined
    # -1 stands for noise
    for idx in range(len(points)):
        p = points[idx]
        if labels[idx] != -2:
            continue

        neighbor_idxs = []
        for idx2 in range(len(points)):
            q = points[idx2]
            if distance_metric(p, q) <= eps:
                neighbor_idxs.append(idx2)

        if len(neighbor_idxs) < min_pts:
            # Noise
            labels[idx] = -1
            continue
        C += 1
        labels[idx] = C

        seed_stack = set([])
        for idx3 in neighbor_idxs:
            seed_stack.add(idx3)
        seed_stack.remove(idx)

        while len(seed_stack) > 0:
            q = seed_stack.pop()
            if labels[q] == -1:
                labels[q] = C
            elif labels[q] != -2:
                continue
            labels[q] = C
            neighbor_idxs2 = []
            for idx4 in range(len(points)):
                r = points[idx4]
                if distance_metric(points[q], r) <= eps:
                    neighbor_idxs2.append(idx4)
            if len(neighbor_idxs2) >= min_pts:
                for idx5 in neighbor_idxs2:
                    seed_stack.add(idx5)
                seed_stack.remove(q)

    for idx, label in enumerate(labels):
        if label == -1:
            noise.append(points[idx])
        else:
            if len(clusters) < label:
                clusters.append([])
            clusters[label - 1].append(points[idx])

    return clusters, noise
```