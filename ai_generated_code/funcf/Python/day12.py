```python
def bfs(x, y):
    '''
    Perform BFS to find the region area and perimeter.
    Crafted with standard coding tools, and only used for the ChatGPT solution.
    My solution does not use this function.
    '''
    queue = deque([(x, y)])
    visited[x, y] = True
    region_type = data[x, y]
    area = 0
    perimeter = 0

    while queue:
        cx, cy = queue.popleft()
        area += 1
        # Check all 4 neighbors (up, down, left, right)
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < rows and 0 <= ny < cols:  # Valid cell
                if data[nx, ny] == region_type and not visited[nx, ny]:
                    visited[nx, ny] = True
                    queue.append((nx, ny))
                elif data[nx, ny] != region_type:  # Neighboring cell is different
                    perimeter += 1
            else:
                # Out of bounds, contributes to perimeter
                perimeter += 1

    return area, perimeter
```