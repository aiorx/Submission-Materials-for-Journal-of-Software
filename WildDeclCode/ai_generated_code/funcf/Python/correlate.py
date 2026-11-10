```python
def dtw_distance(s1, s2):
    # Dynamic time warping function Aided using standard development resources
    # Get the lengths of the two input sequences
    n, m = len(s1), len(s2)

    # Initialize a (n+1) x (m+1) matrix with zeros
    DTW = np.zeros((n + 1, m + 1))

    # Set the first row and first column of the matrix to infinity, since
    # the first element of each sequence cannot be aligned with an empty sequence
    DTW[1:, 0] = np.inf
    DTW[0, 1:] = np.inf

    # Compute the DTW distance by iteratively filling in the matrix
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            # Compute the cost of aligning the i-th element of s1 with the j-th element of s2
            cost = abs(s1[i - 1] - s2[j - 1])

            # Compute the minimum cost of aligning the first i-1 elements of s1 with the first j elements of s2,
            # the first i elements of s1 with the first j-1 elements of s2, and the first i-1 elements of s1
            # with the first j-1 elements of s2, and add this to the cost of aligning the i-th element of s1
            # with the j-th element of s2
            DTW[i, j] = cost + np.min([DTW[i - 1, j], DTW[i, j - 1], DTW[i - 1, j - 1]])

    # Return the DTW distance between the two sequences, which is the value in the last cell of the matrix
    return DTW[n, m]
```