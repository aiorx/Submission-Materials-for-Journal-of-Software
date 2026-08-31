GRID_SIZE = 300
GRID_SERIAL = 8772

def calculate_power(x, y):
    rack_id = x + 10
    power_level = rack_id * y
    power_level += GRID_SERIAL
    power_level *= rack_id
    power_level = power_level // 100 % 10
    return power_level - 5

def init_grid():
    grid = [[0 for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]
    for y in range(GRID_SIZE):
        for x in range(GRID_SIZE):
            grid[y][x] = calculate_power(x, y)
    return grid

# thanks chatgpt, for pointing out the summed-area table calculation
def init_summed_area_table(grid):
    summed_area = [[0 for _ in range(GRID_SIZE + 1)] for _ in range(GRID_SIZE + 1)]
    for y in range(1, GRID_SIZE + 1):
        for x in range(1, GRID_SIZE + 1):
            summed_area[y][x] = grid[y - 1][x - 1] \
                              + summed_area[y - 1][x] \
                              + summed_area[y][x - 1] \
                              - summed_area[y - 1][x - 1]
    return summed_area

def get_submatrix_sum(x1, y1, x2, y2):
    return summed_area[y2 + 1][x2 + 1] \
         - summed_area[y1][x2 + 1] \
         - summed_area[y2 + 1][x1] \
         + summed_area[y1][x1]


grid = init_grid()
summed_area = init_summed_area_table(grid)

def part1(size):
    max_power = float('-inf')
    best_coords = (0, 0)
    for y in range(GRID_SIZE - size + 1):
        for x in range(GRID_SIZE - size + 1):
            submatrix_sum = get_submatrix_sum(x, y, x + size - 1, y + size - 1)
            if submatrix_sum > max_power:
                max_power = submatrix_sum
                best_coords = (x, y)
    return (best_coords, max_power)


def part2():
    max_power = float('-inf')
    best_coords = (0, 0)
    best_size = 0

    for size in range(1, GRID_SIZE + 1):
        coords, power = part1(size)
        if power > max_power:
            max_power = power
            best_coords = coords
            best_size = size

    return (best_coords, best_size)


print("Part 1: ", part1(3))
print("Part 2: ", part2())
