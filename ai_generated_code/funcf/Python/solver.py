```python
def get_adjacent_positions(self, start, end):
    adjacent_positions = []
    for i in range(start[0] - 1, end[0] + 2):
        for j in range(start[1] - 1, end[1] + 2):
            # check if the position is within the bounds of the grid
            if i >= 0 and i < self.N and j >= 0 and j < self.M:
                # check if the position is not between the start and end positions
                if not (i >= start[0] and i <= end[0] and j >= start[1] and j <= end[1]):
                    adjacent_positions.append((i,j))

    return adjacent_positions
```