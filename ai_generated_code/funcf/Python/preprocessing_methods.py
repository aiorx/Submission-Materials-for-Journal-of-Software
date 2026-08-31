```python
def normalize_by_housekeeping_list(df, housekeeping_list: list, factor = 1, scale_by_housekeep_mean = False, mode = 'test', housekeep_mean = None, **kwargs):
    """
    Composed with basic coding tools
    Sample-wise scaling. Normalize miRNA expression df by housekeeping gene(s).
    Assumes:
    - Rows = samples
    - Columns = miRNAs

    Parameters:
    - df: pandas DataFrame (rows = samples, columns = miRNAs), raw counts
    - housekeeping_list: list of miRNA names (column names) to use as reference
    - factor: normalization factor (default = 1)

    Returns:
    - normalized_df: pandas DataFrame of normalized expression values
    """
    # Check that all HK miRNAs exist in columns
    if mode == 'train':
        train_params = {}

    missing = [mir for mir in housekeeping_list if mir not in df.columns]
    if missing:
        raise ValueError(f"Missing housekeeping miRNAs in input df: {missing}")

    # Reference = mean expression of housekeeping miRNA(s) for each sample
    hk_expr = df[housekeeping_list]
    if len(housekeeping_list) > 1:
        reference = hk_expr.mean(axis=1)
    else:
        reference = hk_expr.iloc[:, 0]

    if scale_by_housekeep_mean:
        if mode == 'train':
            # Scale by mean of housekeeping genes; factor is ignored in this case
            factor = reference.mean()
            train_params['housekeep_mean'] = factor
        elif mode == 'test':
            if housekeep_mean is None:
                raise ValueError("housekeep_mean must be provided in test mode when scale_by_housekeep_mean is True")
            factor = housekeep_mean
        else:
            raise ValueError("mode must be either 'train' or 'test'")

    normalized_df = df.div(reference / factor, axis=0)

    if mode == 'train':
        return normalized_df, train_params
    elif mode == 'test':
        return normalized_df
```