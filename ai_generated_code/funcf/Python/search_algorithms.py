```python
    # Best first search
    # Heuristic uses Euclidean distance to prioritize nodes that are closer to the goal
    # Supported via standard programming aids - provided previous code, asked "How would I implement best first search and A*
    # implementation?"
    @staticmethod
    def best_first_search(graph, start, goal, heuristic):
        visited = set()  # Keeps track of visited nodes
        priority_queue = [(heuristic(start, goal), [start])] # Paths are ordered by smallest heuristic value
        while priority_queue:
            _, path = heapq.heappop(priority_queue)  # Dequeues the path with the smallest heuristic value
            node = path[-1] # Gets the last node of this path

            if node == goal:
                return path

            if node not in visited:
                visited.add(node) # Marks visited
                for neighbor in graph.get_neighbors(node):  # For each neighbor, create a new path
                    new_path = list(path)
                    new_path.append(neighbor)
                    # Calculates the heuristic score for the new path and pushes it to priority queue
                    heapq.heappush(priority_queue, (heuristic(neighbor, goal), new_path))
        return None
```