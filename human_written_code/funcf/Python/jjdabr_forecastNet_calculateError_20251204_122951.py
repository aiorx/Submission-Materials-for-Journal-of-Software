```python
def calculate_miltidim_error(Yhat, Y, print_errors=False):
    """
    Calculate errors for multi-dimensional arrays (more than 3 dimensions or 3D with last dimension > 1).
    :param Yhat: Prediction
    :param Y: Ground truth
    :param print_errors: If true the errors are printed.
    :return mase: Mean Absolute Scaled Error
    :return se: Scaled Error
    :return smape: Symmetric Mean Absolute Percentage Error
    :return nrmse: Normalised Root Mean Squared Error
    """

    # Ensure arrays are at least 3D
    assert np.ndim(Y) >= 3, 'Y must be at least three dimensional for multi-dimensional error calculation'
    assert np.ndim(Yhat) >= 3, 'Yhat must be at least three dimensional for multi-dimensional error calculation'
    assert Y.shape == Yhat.shape, 'Y and Yhat must have the same shape'

    # Flatten all but the first dimension (sequence dimension)
    n_sequences = Y.shape[0]
    flattened_dim = np.prod(Y.shape[1:])
    Y_flat = Y.reshape(n_sequences, flattened_dim)
    Yhat_flat = Yhat.reshape(n_sequences, flattened_dim)

    # Symmetric Mean Absolute Percentage Error (M4 comp)
    smape = []
    for i in range(n_sequences):
        numerator = np.absolute(Y_flat[i] - Yhat_flat[i])
        denominator = (np.absolute(Y_flat[i]) + np.absolute(Yhat_flat[i]))
        non_zeros = denominator != 0
        numerator = numerator[non_zeros]
        denominator = denominator[non_zeros]
        length = numerator.shape[0]
        smape.append(200.0 / length * np.sum(numerator / denominator))
    smape = np.array(smape)
    if print_errors:
        print('Symmetric mean absolute percentage error (sMAPE) = ', smape)

    # Mean absolute scaled error
    se = []
    mase = []
    for i in range(n_sequences):
        numerator = (Y_flat[i] - Yhat_flat[i])
        denominator = np.sum(np.absolute(Y_flat[i][1:] - Y_flat[i][:-1]), axis=0)
        if denominator == 0:
            warnings.warn("The denominator for the MASE is zero")
            se.append(np.NaN * np.ones(length))
            mase.append(np.NaN)
            continue
        length = numerator.shape[0]
        scaled_error = (length - 1) * numerator / denominator
        se.append(scaled_error)
        mase.append(np.mean(np.absolute(scaled_error)))
    mase = np.array(mase)
    if print_errors:
        print('Scaled error (SE) = ', se)
        print('Mean absolute scaled error (MASE) = ', mase)

    # Normalised Root Mean Squared Error
    nrmse = []
    for i in range(n_sequences):
        numerator = 100 * np.sqrt(np.mean(np.square(Y_flat[i] - Yhat_flat[i])))
        denominator = np.max(Y_flat[i]) - np.min(Y_flat[i])
        if denominator == 0:
            warnings.warn("The denominator for the NRMSE is zero")
            nrmse.append(np.NaN)
            continue
        nrmse.append(numerator / denominator)
    nrmse = np.array(nrmse)
    if print_errors:
        print('Normalised root mean squared error (NRMSE) = ', nrmse)

    return mase, se, smape, nrmse
```