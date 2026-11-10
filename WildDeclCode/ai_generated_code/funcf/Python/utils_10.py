```python
def find_nearest_indices(reference_vector, samples, N=1):
    # Aided using standard development resources :P
    # Calculate the squared differences
    diff = samples - reference_vector
    squared_diff = np.square(diff)
    
    # Sum along axis 1 to get the squared distance
    squared_distance = np.sum(squared_diff, axis=1)
    
    # Sort and get the N nearest indices
    nearest_indices = np.argsort(squared_distance)[:N]
    
    return nearest_indices
```