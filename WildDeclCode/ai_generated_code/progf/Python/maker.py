# DISCLAIMER, Formed using common development resources IN ORDER TO EASILY CREATE TEST CASES
import random

# Parameters for the large graph
num_vertices = 13  # Number of vertices
num_edges = 14     # Number of edges (ensure this is >= num_vertices - 1 for connectivity)
max_weight = 100   # Maximum weight of an edge

# Generate unique vertex titles
vertices = [f"v{i}" for i in range(1, num_vertices + 1)]

# Helper function to generate random edges
edges = {}
def add_edge(v1, v2, weight):
    """Adds an edge to the graph, ensuring no reverse edges with differing weights."""
    if (v2, v1) in edges:
        # If reverse edge exists, ensure weights are consistent
        if edges[(v2, v1)] != weight:
            print(f"Reverse edge inconsistency detected between {v1}-{v2} and {v2}-{v1}. Adjusting weight.")
            edges[(v2, v1)] = weight  # Update reverse edge to match weight
    else:
        edges[(v1, v2)] = weight

def generate_edges():
    """Generates random edges, avoiding duplicates and ensuring reverse consistency."""
    while len(edges) < num_edges:
        v1, v2 = random.sample(vertices, 2)  # Randomly pick two distinct vertices
        if (v1, v2) not in edges and (v2, v1) not in edges:  # Avoid duplicate edges
            weight = random.randint(1, max_weight)
            add_edge(v1, v2, weight)

# Ensure the graph is connected (at least a spanning tree)
for i in range(1, num_vertices):
    add_edge(vertices[i - 1], vertices[i], random.randint(1, max_weight))

# Generate additional random edges
generate_edges()

# Output the edges in the specified format
output = str(num_vertices) + " " + str(num_edges) + "\n"
output += "\n".join(f"{v1} {v2} {weight}" for (v1, v2), weight in edges.items())

# Save the result to a file (optional) or return as a string
with open("inputs/bigtest.txt", "w") as file:
    file.write(output)

print(output[:500])  # Show a preview of the first few edges
