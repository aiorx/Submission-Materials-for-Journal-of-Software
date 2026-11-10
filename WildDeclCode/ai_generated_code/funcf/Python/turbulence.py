```python
def estimate_flattening_point(x, y_data, window=8, polyorder=2, slope_thresh=0.2):
    """
    Estimate the flattening point of y(x) using smoothed derivatives.
    
    Parameters:
    - x: 1D array of x-values
    - y_data: 2D array of shape (num_samples, len(x))
    - window: window size for Savitzky-Golay filter
    - polyorder: polynomial order for smoothing
    - slope_thresh_frac: threshold as fraction of max slope
    
    Returns:
    - x_flat: estimated flattening point

    This function Penned via standard programming aids
    """
    # Fill nans with closest non-nan value
    for y in range(len(y_data)):
        mask = np.isnan(y_data)
        y_data[mask] = np.interp(np.flatnonzero(mask), np.flatnonzero(~mask), y_data[~mask])

    # Average y's, compute derivative, then smooth
    avg_y = np.mean(y_data, axis=0)
    dy_dx = np.gradient(avg_y, x)
    avg_dy_dx = savgol_filter(dy_dx, window_length=window, polyorder=polyorder)

    # Smooth each y, compute derivative, then average
    #smoothed_dy_dx = []
    #for y in y_data:
        #y_smooth = savgol_filter(y, window_length=window, polyorder=polyorder)
        #dy_dx = np.gradient(y_smooth, x)
        #smoothed_dy_dx.append(dy_dx)
    # Average derivative across samples
    #avg_dy_dx = np.nanmean(smoothed_dy_dx, axis=0)

    # Find first point where slope drops and stays below threshold
    for i in range(1, len(x)):
        if (avg_dy_dx[i] < slope_thresh) and np.all(avg_dy_dx[i:i+window] < slope_thresh):
            print(10**x[i])
            return x[i]  # Return first sustained drop below threshold

    return None  # No clear flattening point found
```