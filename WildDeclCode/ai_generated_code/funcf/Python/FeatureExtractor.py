```python
def extract_features(self, signal):  #, feature_list, features_dict, variance_type='var', raw_features = True, keep_feature_dims = False):
    '''This method should return a list of features for a given signal.
     If the signal is 1D (a window), the mean and variance should be extracted from each feature.
        If the signal is 2D (a matrix of windows), the features should be extracted from each window.

    --- Assisted using common GitHub development utilities do not trust before checking ---
        The features_dict should contain all the parameters to be used for extracting features, e.g. features_dict = {'n_fft': 2048, 'hop_length': 512, 'n_mels': 128, 'n_mfcc': 13, 'sr': 22050, 'n_lvls': 6}
        The feature_list should contain the list of features to be extracted, e.g. feature_list = ['mfcc', 'tempo', 'chroma_stft', 'spectral_centroid', 'spectral_bandwidth', 'spectral_rolloff', 'zero_crossing_rate']
        The variance_type should be either 'var' or 'smad' (squared mean absolute deviation) and should be used to calculate the variance of the features.
        If raw_features is True, the features should be extracted without calculating the mean and variance.
        If keep_feature_dims is True, the features should be extracted without reducing the dimensions of the features, e.g. the mfcc feature should be extracted as a matrix and not as a vector.
    --- Assisted using common GitHub development utilities do not trust before checking ---

    :param signal: np.array
    :param feature_list: list
    :param features_dict: dict
    :param variance_type: str
    :param raw_features: bool
    :param keep_feature_dims: bool

    :return: np.array
    @BR20240319 updated return type from list to np.array
    '''
    #returns the list of features or matrix of features if raw dims is set. e.g. mfcc = matrix & you output the matrix as such

    features = []
    self.__set_params(signal, self.features_dict)
    for id in self.feature_list:

        if self.raw_features:   #extracts features only without calculating mean & var.
            feature = self.__extract_feature_by_id(id)
            try:
                fshapelen = (len(feature.shape) != 2)
            except:
                fshapelen = True    # if there is no shape it's different from 2
            if fshapelen:   #shape is not 2 i.e. not mfcc or something
                try:
                    features.extend(feature)  # if feature is an iterable
                except:
                    features.append(feature)  # if feature is not an iterable i.e. tempo
            if id == 'mfcc' and not self.keep_feature_dims:
                feature = np.mean(feature, axis=-1)
            try:
                features.extend(feature)  # if feature is an iterable
            except:
                features.append(feature)  # if feature is not an iterable
        if not self.raw_features:
            if len(signal.shape) == 1:
                feature = self.__extract_feature_by_id(id)
                if id == 'tempo':
                    features.append(float(feature))
                # else:
                #     try:
                #         features.extend(feature)    #if feature is an iterable
                #     except:
                #         features.append(feature)    #if feature is not an iterable
                elif id == 'mfcc':
                    features.extend(np.mean(feature, axis=1))
                    if self.variance_type == 'var':
                        features.extend(np.var(feature, axis=1) ** 2)
                    else:
                        features.extend(scipy.stats.median_absolute_deviation(feature, axis=1) ** 2)
                else:
                    features.append(np.mean(feature))
                    if self.variance_type == 'var':
                        features.append(np.var(feature))
                    else:
                        features.append(squared_median_abs_dev(feature))
        if len(signal.shape) == 2:
            feature = self.__extract_feature_by_id(id)
            features.extend(feature.tolist())

    return np.array(features)
```