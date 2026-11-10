def read_maze(file_path):
    with open(file_path, 'r') as file:
        maze = []
        start = None
        end = None
        for y, line in enumerate(file):
            row = list(line.strip())
            if 'S' in row:
                start = (y, row.index('S'))
            if 'E' in row:
                end = (y, row.index('E'))
            maze.append(row)
    return maze, start, end

# Example usage
file_path = 'input.txt'
maze, start, end = read_maze(file_path)
print("Maze:", maze)
print("Start:", start)
print("End:", end)

def print_maze(maze):
    for row in maze:
        print(''.join(row))
    print()

# find way with minimal cossts through the maze. 
# The costs are the number of steps + 1000 points for each turn by 90 degrees
# we use a recrsive function to find the way, store allpossible paths in a list and 
# return the path with the minimal costs

# by me
def find_way(maze, start, end, path=[], costs=0, direction=None, turns=0):
    x, y = start
    if maze[x][y] == '#': # the maze is surrounded by a wall
        return None
    if start == end:
        print("found a way through maze! with costs:", costs, "turns:", turns)
        return path, costs, turns
    if start in path:
        return None
    path.append(start)
    costs += 1
    results = []
    for dx, dy, new_direction in [(0, 1, 'right'), (1, 0, 'down'), (0, -1, 'left'), (-1, 0, 'up')]:
        # print(f"dxdy: {dx}, {dy}, new_direction: {new_direction} directions: {direction}")
        if direction == None or direction != new_direction:
            results.append(find_way(maze, (x+dx, y+dy), end, path.copy(), costs+1000, new_direction, turns+1))
        else:
            results.append(find_way(maze, (x+dx, y+dy), end, path.copy(), costs, direction, turns))
    results = [result for result in results if result]
    if results:
        # print("Results:", results)
        return min(results, key=lambda x: x[1])


# Aided via basic GitHub coding utilities

def find_way_copilot(maze, start, end, path=[], costs=0, direction=None, turns=0):
    x, y = start
    if x < 0 or y < 0 or x >= len(maze) or y >= len(maze[0]) or maze[x][y] == '#':
        return None
    if start == end:
        return path, costs
    if start in path:
        return None
    path.append(start)
    # print("Path:", path, "Costs:", costs, "Direction:", direction)
    costs += 1
    if direction:
        print("Turns:", turns)
        costs += 1000
        turns +=1
    results = []
    for dx, dy, new_direction in [(0, 1, 'right'), (1, 0, 'down'), (0, -1, 'left'), (-1, 0, 'up')]:
        print(f"dxdy: {dx}, {dy}, new_direction: {new_direction} directions: {direction}")
        if direction != new_direction:
            results.append(find_way(maze, (x+dx, y+dy), end, path.copy(), costs, new_direction, turns))
        else:
            results.append(find_way(maze, (x+dx, y+dy), end, path.copy(), costs, direction, turns))
    results = [result for result in results if result]
    if results:
        print("Results:", results)
        return min(results, key=lambda x: x[1])

# Example usage
print_maze(maze)
path, costs, turns = find_way(maze, start, end)
print("Path:", path, "Costs:", costs, "Len of path:", len(path), "turns:", turns)

