```python
def initialize_priors(map_size, landmark_positions, position_stdev):
    priors = [0.0] * map_size
    # Set prior to 1.0 for positions near landmarks
    for landmark in landmark_positions:
        start = int(max(0, landmark - position_stdev))
        end = int(min(map_size, landmark + position_stdev + 1))
        for i in range(start, end):
            priors[i] = 1.0
    # Normalize priors so they sum to 1
    total = sum(priors)
    priors = [p / total for p in priors]
    return priors
```