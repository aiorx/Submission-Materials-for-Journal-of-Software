```python
def convert_to_csc(
    num_elements: int, row_ind: np.ndarray, col_ind: np.ndarray
) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Convert between two representations for sparse systems.

    This is needed because `jax.scipy.linalg.spsolve` requires the `(ind, indptr)`
    representation, but the `(row, col)` is more intuitive and easier to build.

    This function uses `np` instead of `jnp` because it only deals with indexing which
    can be dealt with only based on the branch structure (i.e. independent of any
    parameter values).

    Composed with basic coding tools.
    """
    data_inds = np.arange(num_elements)
    # Step 1: Sort by (col_ind, row_ind)
    sorted_indices = np.lexsort((row_ind, col_ind))
    data_inds = data_inds[sorted_indices]
    row_ind = row_ind[sorted_indices]
    col_ind = col_ind[sorted_indices]

    # Step 2: Create indptr array
    n_cols = col_ind.max() + 1
    indptr = np.zeros(n_cols + 1, dtype=int)
    np.add.at(indptr, col_ind + 1, 1)
    np.cumsum(indptr, out=indptr)

    # Step 3: The row indices are already sorted
    indices = row_ind

    return data_inds, indices, indptr
```