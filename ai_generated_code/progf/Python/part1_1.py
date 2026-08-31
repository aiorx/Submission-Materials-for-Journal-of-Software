# Crafted with basic coding tools
# Date: 2023-12-16

def parse_input(input_str):
    """Parse the input string into a grid."""
    return [list(line) for line in input_str.strip().split('\n')]

def roll_rocks_north(grid):
    """Roll all rounded rocks (O) north as far as they will go."""
    height, width = len(grid), len(grid[0])
    for col in range(width):
        for row in range(1, height):
            if grid[row][col] == 'O':
                new_row = row
                while new_row > 0 and grid[new_row - 1][col] == '.':
                    new_row -= 1
                grid[row][col], grid[new_row][col] = '.', 'O'

def calculate_load(grid):
    """Calculate the total load on the north support beams."""
    load = 0
    height = len(grid)
    for row in range(height):
        for col, cell in enumerate(grid[row]):
            if cell == 'O':
                load += height - row
    return load

def solve_puzzle(input_str):
    """Solve the puzzle and return the total load."""
    grid = parse_input(input_str)
    roll_rocks_north(grid)
    return calculate_load(grid)

# Example usage
example_input = """
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
"""
print(solve_puzzle(example_input))

# To use with 'input.txt', comment out the above and uncomment below:
with open('input.txt') as file:
     input_data = file.read()
     print(solve_puzzle(input_data))
