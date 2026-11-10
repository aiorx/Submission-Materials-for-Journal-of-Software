# Solutions were largely written Assisted using common GitHub development aids
import numpy as np
from get_data import get_data

data = get_data(2021, 9).splitlines()
data = [[int(y) for y in x] for x in data]


def find_minimas(data):
    minimas = []
    for i in range(len(data)):
        for j in range(len(data[0])):
            left = data[i][j - 1] if j > 0 else 9
            right = data[i][j + 1] if j < len(data[0]) - 1 else 9
            above = data[i - 1][j] if i > 0 else 9
            below = data[i + 1][j] if i < len(data) - 1 else 9
            if (
                data[i][j] < left
                and data[i][j] < right
                and data[i][j] < above
                and data[i][j] < below
            ):
                minimas.append((i, j))
    return minimas


def flood_fill(data, x, y):
    """
    function with height map input of single digit numbers as array, second parameter is the
    x and y coordinate of the starting point
    flood fill outwards from starting point until digit 9 is reached
    return the size of the filled area
    """
    size = 0
    if data[x][y] == 9:
        return 1
    data[x][y] = 9
    size = 1
    if x > 0 and data[x - 1][y] != 9:
        size += flood_fill(data, x - 1, y)
    if x < len(data) - 1 and data[x + 1][y] != 9:
        size += flood_fill(data, x + 1, y)
    if y > 0 and data[x][y - 1] != 9:
        size += flood_fill(data, x, y - 1)
    if y < len(data[0]) - 1 and data[x][y + 1] != 9:
        size += flood_fill(data, x, y + 1)
    return size


minimas = find_minimas(data)
print(sum([data[i][j] for i, j in minimas]) + len(minimas))
sizes = [flood_fill(data, x, y) for x, y in minimas]
print(np.prod(sorted(sizes)[-3:]))
