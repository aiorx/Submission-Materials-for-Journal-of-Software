```python
def rowwise_isin(array, values):
    """
    Drafted using common development resources :)
    Checks if each row in 'array' is in 'values' row-wise.
    
    Parameters:
    - array: np.ndarray, the main array where rows are to be checked
    - values: np.ndarray, the array containing rows to check against
    
    Returns:
    - np.ndarray of bools, where each element corresponds to whether
      a row in 'array' is found in 'values'
    """
    # Ensure both arrays are 2D
    array = np.atleast_2d(array)
    values = np.atleast_2d(values)

    # Use broadcasting to compare all rows of 'array' to all rows of 'values'
    # Find the rows in 'values' that match each row in 'array'
    matches = (array[:, None] == values).all(axis=2)

    # If a row in 'array' has any matching row in 'values', mark it as True
    return matches.any(axis=1)
```