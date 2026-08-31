```python
def dijkstra(bx, by, walls, start, endy):
    """
    Dijkstra-based pathfinding that stops early if reaching any cell in the goal row.
    Uses graph and priority queue to minimize distances.
    
    Function is my original code rePenned via standard programming aids to run smother
    """
    # Build the graph
    graph = makeGraph(bx, by, walls)
    
    # Initialize the Dijkstra variables
    prev = {v: None for v in graph.keys()}
    vis = {v: False for v in graph.keys()}
    dists = {v: float("inf") for v in graph.keys()}
    dists[start] = 0
    
    # Initialize the priority queue
    unpq = [(0, start)]
    heapq.heapify(unpq)
    
    # Start Dijkstra's algorithm
    while unpq:
        rem_dist, rem = heapq.heappop(unpq)
        vis[rem] = True

        # If we reach any cell in the goal row, stop early
        x, y = rem
        if y == endy:
            return rem_dist
        
        # Visit neighbors and update distances
        for edge in graph[rem]:
            if vis[edge]:
                continue
            ndist = rem_dist + 1
            if ndist < dists[edge]:
                dists[edge] = ndist
                prev[edge] = rem
                heapq.heappush(unpq, (ndist, edge))
    
    return float("inf")  # No path found
```