```python
def load_calibration(calib_file):
    """

    :param calib_file:
    :return: mtx and dist
    """
    with open(calib_file, 'rb') as file:
        # print('load calibration data')
        data= pickle.load(file)
        mtx = data['mtx']       # calibration matrix
        dist = data['dist']     # distortion coefficients

    return mtx, dist
```