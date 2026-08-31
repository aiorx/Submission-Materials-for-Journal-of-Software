```python
def load_and_prepare_data(confirmed, MIN_CASES=1000, NORMALIZE=True):
    features = []
    targets = []

    for val in np.unique(confirmed["Country/Region"]):
        df = data.filter_by_attribute(
            confirmed, "Country/Region", val)
        cases, labels = data.get_cases_chronologically(df)
        features.append(cases)
        targets.append(labels)

    features = np.concatenate(features, axis=0)
    targets = np.concatenate(targets, axis=0)

    # Filter features and targets based on MIN_CASES and normalize if needed
    above_min_cases = features.sum(axis=-1) > MIN_CASES
    filtered_features = np.diff(features[above_min_cases], axis=-1)
    if NORMALIZE:
        filtered_features = filtered_features / filtered_features.sum(axis=-1, keepdims=True)
    filtered_targets = targets[above_min_cases]

    return filtered_features, filtered_targets
```