import numpy as np
from queue import PriorityQueue

## For this puzzle I actually asked ChatGPT to generate a dijkstras for me...
## I lost my implementation and felt lazy, so yeah

## This class was Developed via external programming aids's ChatGPT 3.0
class Graph:
    def __init__(self):
        self.nodes = set()
        self.edges = {}

    def add_node(self, node):
        self.nodes.add(node)

    def add_edge(self, node1, node2, weight):
        if node1 not in self.edges:
            self.edges[node1] = []
        self.edges[node1].append((node2, weight))

    def neighbors(self, node):
        return self.edges.get(node, [])


## This function was Developed via external programming aids's ChatGPT 3.0
def dijkstras(graph, start, end):
    # Set up the distance tracker
    distances = {node: float("inf") for node in graph.nodes}
    distances[start] = 0

    # Set up the priority queue
    queue = PriorityQueue()
    queue.put((0, start))

    # Set up the previous node tracker
    previous_nodes = {node: None for node in graph.nodes}

    # Loop until the queue is empty
    while not queue.empty():
        # Get the node with the smallest distance
        current_distance, current_node = queue.get()

        # If we have reached the end, we are done
        if current_node == end:
            break

        # Loop through the neighbors of the current node
        for neighbor, weight in graph.neighbors(current_node):
            # Calculate the distance to the neighbor
            new_distance = current_distance + weight

            # If the new distance is shorter than the current distance, update it
            if new_distance < distances[neighbor]:
                distances[neighbor] = new_distance
                previous_nodes[neighbor] = current_node

                # Add the new distance and neighbor to the priority queue
                queue.put((new_distance, neighbor))

    # Use the previous_nodes dictionary to build the shortest path
    path = []
    current_node = end
    while current_node is not None:
        path.append(current_node)
        current_node = previous_nodes[current_node]

    # Reverse the path and return it
    return list(reversed(path))


def is_valid_position(mat, coords):
    row_id = coords[0]
    col_id = coords[1]

    row_limit = mat.shape[0] - 1
    col_limit = mat.shape[1] - 1

    if row_id < 0 or col_id < 0 or row_id > row_limit or col_id > col_limit:
        return False
    else:
        return True


def get_neighbors(mat, coords):

    rid = coords[0]
    cid = coords[1]

    right_neighbor = (rid, cid + 1)
    left_neighbor = (rid, cid - 1)
    dn_neighbor = (rid + 1, cid)
    up_neighbor = (rid - 1, cid)

    candidate_neighbors = [right_neighbor, left_neighbor, dn_neighbor, up_neighbor]
    final_neighbors = [
        neighbor for neighbor in candidate_neighbors if is_valid_position(mat, neighbor)
    ]

    return final_neighbors


heightmap = np.genfromtxt("puzzle_input.txt", delimiter=1, dtype=str)
height_graph = Graph()

max_rows = heightmap.shape[0] - 1
max_cols = heightmap.shape[1] - 1

for rid, row in enumerate(heightmap):
    for cid, height in enumerate(row):

        this_node = f"{rid}_{cid}"
        this_distance = ord(height)
        ## The starting position is considered a lowest height (a)
        if height == "S":
            this_distance = ord("a")
            this_node = "S"

        if height == "E":
            this_distance = ord("z")
            this_node = "E"

        ## Add the node. Since the graph uses a set, it does not matter if it's already there
        height_graph.add_node(this_node)

        ## Check how many neighbors to add
        neighbors = get_neighbors(heightmap, (rid, cid))

        for neighbor in neighbors:
            ## This is dumbass... do smth about it (S/E stuff)
            if heightmap[neighbor[0], neighbor[1]] == "S":
                neighbor_distance = ord("a")
                neighbor_name = "S"
            elif heightmap[neighbor[0], neighbor[1]] == "E":
                neighbor_distance = ord("z")
                neighbor_name = "E"
            else:
                neighbor_distance = ord(heightmap[neighbor[0], neighbor[1]])
                neighbor_name = f"{neighbor[0]}_{neighbor[1]}"

            if neighbor_distance - this_distance <= 1:
                height_graph.add_node(neighbor_name)
                height_graph.add_edge(this_node, neighbor_name, 1)


part1_path = dijkstras(height_graph, "S", "E")
part1_answer = len(part1_path) - 1

print(f"Part 1 answer is {part1_answer}")

## For part 2, we need to collect all a's, and the S position and find the
## shortest route

## This is gonna be slow but manageable... I should try to optimize later
all_lowest_positions = np.where(np.logical_or(heightmap == "a", heightmap == "S"))

all_routes_from_lowest = []


for rid, cid in zip(*all_lowest_positions):

    if heightmap[rid, cid] == "S":
        this_node = "S"
    else:
        this_node = f"{rid}_{cid}"

    this_path = dijkstras(height_graph, this_node, "E")
    this_distance = len(this_path) - 1

    ## Unconnected nodes return 0
    if this_distance > 0:
        all_routes_from_lowest.append(this_distance)


part_2_answer = sorted(all_routes_from_lowest)[0]

print(f"Part 2 answer is {part_2_answer}")
