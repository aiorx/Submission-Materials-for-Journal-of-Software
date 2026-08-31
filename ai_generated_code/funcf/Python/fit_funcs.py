```python
def kde_mode(data, bandwidth = 'scott', error_mode ='bw_approx'):
    """
    Estimate the error on the mode using KDE.
    Composed with GitHub coding tools

    Parameters:
    data (array-like): Input data.
    bandwidth (str or float): Bandwidth for KDE. Maps to bw_method in gaussian_kde.
    error_mode(str): Method for estimating the error on the mode. Options are 'bw_approx' and 'half_max'.
                    'bw_approx' uses the bandwidth as an approximation of the error
                    'half_max' uses the width of the peak at half maximum as the error. (Not recommended)
                    'bootstrap' uses bootstrapping to estimate the error on the mode using 1000 bootstrap resamplings. (Will take significantly longer)

    Returns:
    float: Estimated error on the mode.
    """
    kde = gaussian_kde(data, bw_method=bandwidth)
    x = np.linspace(min(data), max(data), 1000)
    kde_values = kde(x)
    mode = x[np.argmax(kde_values)]
    
    # Estimate the width of the peak at half maximum
    half_max = np.max(kde_values) / 2
    peak_indices = np.where(kde_values >= half_max)[0]
    peak_width = x[peak_indices[-1]] - x[peak_indices[0]]
    
    bw_approxerror = kde.factor * np.std(data)
    if error_mode == 'bw_approx':
        return(mode, bw_approxerror)
    elif error_mode == 'half_max':
        return(mode, peak_width / 2)
    elif error_mode == 'bootstrap':
        return(mode, bootstrap_mode_error(data))
```