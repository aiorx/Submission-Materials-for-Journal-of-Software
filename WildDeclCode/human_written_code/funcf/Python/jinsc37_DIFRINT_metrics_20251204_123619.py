```python
def extract_good_matches(descriptors1, descriptors2, bf, ratio=0.7):
    """
    Extract good matches between two sets of descriptors using BFMatcher and ratio test.

    Args:
        descriptors1: Descriptors from the first image.
        descriptors2: Descriptors from the second image.
        bf: Brute-force matcher object.
        ratio: Ratio threshold for the ratio test.

    Returns:
        List of good matches.
    """
    matches = bf.knnMatch(descriptors1, descriptors2, k=2)
    goodMatches = []

    for m, n in matches:
        if m.distance < ratio * n.distance:
            goodMatches.append(m)
    return goodMatches
```