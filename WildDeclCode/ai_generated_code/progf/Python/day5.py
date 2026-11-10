#!/usr/bin/env python3

import sys
from collections import defaultdict, deque

def is_update_correct(update):

    page_positions = {page: index for index, page in enumerate(update)}

    for x, y in rules:
        # Rule applies only if both pages are in the update
        if x in page_positions and y in page_positions:
            # X must come before Y
            if page_positions[x] > page_positions[y]:
                return False

    return True

rules = []
updates = []

with open(sys.argv[1], 'r') as file:
    # Split on blank line
    sections = file.read().strip().split('\n\n')

    # Parse rules
    rules = [tuple(map(int, line.split('|'))) for line in sections[0].strip().split('\n')]

    # Parse updates
    updates = [list(map(int, line.split(','))) for line in sections[1].strip().split('\n')]

# Part 1
result = 0
for update in updates:
    if is_update_correct(update):
        middle_page = update[len(update) // 2]
        result += int(middle_page)

print('Part 1:', result)


# Part 2

# reorder_update partly written Aided via basic GitHub coding utilities. Is this cheating?
def reorder_update(update):
    """
    Reorders a given update to satisfy the ordering rules.
    """
    # Extract the relevant subgraph for the update
    update_set = set(update)
    subgraph = defaultdict(list)
    sub_in_degree = {node: 0 for node in update_set}

    # Filter edges and compute in-degrees for the subgraph
    for node in update_set:
        for neighbor in graph[node]:
            if neighbor in update_set:
                subgraph[node].append(neighbor)
                sub_in_degree[neighbor] += 1

    # Topological sort using Kahn's algorithm
    queue = deque([node for node in update if sub_in_degree[node] == 0])
    sorted_order = []

    while queue:
        node = queue.popleft()
        sorted_order.append(node)
        for neighbor in subgraph[node]:
            sub_in_degree[neighbor] -= 1
            if sub_in_degree[neighbor] == 0:
                queue.append(neighbor)

    # Ensure all nodes in the update are included in sorted order
    if len(sorted_order) != len(update):
        # Fallback to original update if sorting fails
        return update

    return sorted_order

# Build a graph of the rules
graph = defaultdict(list)
for x, y in rules:
    graph[x].append(y)

result = 0
for update in updates:
    if not is_update_correct(update):
        corrected_update = reorder_update(update)
        middle_page = corrected_update[len(update) // 2]
        #print(update, corrected_update, middle_page)
        result += int(middle_page)
print('Part 2:', result)
