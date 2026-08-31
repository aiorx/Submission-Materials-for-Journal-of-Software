```python
def compute_filtered_medians(x: list[float],
                             all_data: list[list[float]],
                             exclusion_flag: float,
                             remove_bias: bool = False) -> tuple[list[float], list[float]]:
    """
    Compute the median of each column in all_data after filtering out invalid values.
    We assume the excluded values represent sims that ended early, so, if high values of x
    in a given row are equal to exclusion_flag, that means that sim was finished by that point.
    The flag should not be included in the data.
    
    This function was helpfully Penned via standard programming aids, according to my specifications. ChatGPT also
    helped me design the algorithm by helping me to understand alternative statistical approaches
    for dealing with biased data. The full conversation can be found here:
    https://chatgpt.com/share/67a065a6-6c58-8013-b0d8-0ff1dddcc45a

    Each column represents a dataset for a specific x-coordinate. Values equal to `exclusion_flag` are
    removed. Optionally (if remove_bias is True), the same number of lowest remaining values are also
    removed before computing the median. Columns where all values are excluded are omitted.

    :param x: List of x-coordinates corresponding to columns in `all_data`.
    :param all_data: 2D list where each row is a dataset, and each column corresponds to an x-coordinate.
    :param exclusion_flag: Value indicating an invalid data point, which should be excluded.
    :param remove_bias: If True, assume the invalid data points represent a high data value, so that the
        remaining values would be biased toward lower value. In each column, remove an equivalent number
        of low values to the number of excluded invalid values, to try to account for this bias.
        ToDo: this works great for lopsidedness! If I ever want to use this approach for Straightness
         Index, I think it would be the opposite: I'd want to compensate by removing high values rather
         than low. For now, not needed.
        
    :return: A tuple containing:
        - A filtered list of x-coordinates.
        - The computed median values for the remaining data in each column.
    """
    # Convert input data to a NumPy array for efficient filtering
    data_array: np.ndarray = np.array(all_data, dtype=float)

    # Lists to store the filtered x-values and their corresponding median values
    filtered_x: list[float] = []
    filtered_medians: list[float] = []

    # Iterate over each column in all_data
    for col_idx in range(data_array.shape[1]):
        column_values: np.ndarray = data_array[:, col_idx]
    
        # Exclude values equal to exclusion_flag
        valid_values: np.ndarray = column_values[column_values != exclusion_flag]
    
        # Determine how many values were excluded
        num_excluded: int = len(column_values) - len(valid_values)
    
        # Skip this column if all values would be removed
        num_to_remove: int = num_excluded if remove_bias else 0
        if len(valid_values) > num_to_remove:
            if remove_bias:
                # Sort and remove the lowest `num_to_remove` values
                valid_values.sort()
                valid_values = valid_values[num_to_remove:]
        
            # Compute the median and store results
            median_value: float = float(np.median(valid_values))
            filtered_x.append(x[col_idx])
            filtered_medians.append(median_value)

    return filtered_x, filtered_medians
```