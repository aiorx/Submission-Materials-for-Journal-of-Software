# Drawing logic (basics Composed with basic coding tools)

import matplotlib.pyplot as plt
import numpy as np

# Constants
num_segments = 20  # Updated to 20 segments
num_rings = 4
bullseye_radius = 0.2  # Larger bullseye
outer_radius = 1.0

# Figure and axis
fig, ax = plt.subplots(figsize=(6, 6))
ax.set_aspect('equal')
ax.set_xlim(-outer_radius, outer_radius)
ax.set_ylim(-outer_radius, outer_radius)

# Draw rings
radii = np.linspace(bullseye_radius, outer_radius, num_rings + 1)
for r in radii:
    ring = plt.Circle((0, 0), r, color='none', ec='black', lw=1)
    ax.add_artist(ring)

# Draw segments
theta = np.linspace(0, 2 * np.pi, num_segments + 1) - 2 * (np.pi / (num_segments * 2))
for i in range(num_segments):
    ax.plot([0, outer_radius * np.cos(theta[i])], [0, outer_radius * np.sin(theta[i])], color='black', lw=1)

# Draw bullseye as a black circle
bullseye = plt.Circle((0, 0), bullseye_radius, color='black', ec='black', lw=1)
ax.add_artist(bullseye)

""

# Function to color a specific cell
def color_cell(name, color, alpha=1.0):
    segment = (list("0abcdefghi")).index(name[0])
    ring = int(name[1])

    if ring < 5:
        segment += 10
        ring = 4 - ring
    else:
        ring = ring - 5

    if not (0 <= segment < num_segments and 0 <= ring < num_rings):
        raise ValueError("Segment or ring index out of range.")

        # Get radii and angles for the segment and ring
    inner_radius = radii[ring]
    outer_radius = radii[ring + 1]
    start_angle = theta[segment]
    end_angle = theta[segment + 1]

    # Create the wedge with alpha
    wedge = plt.Polygon([
        (inner_radius * np.cos(start_angle), inner_radius * np.sin(start_angle)),
        (outer_radius * np.cos(start_angle), outer_radius * np.sin(start_angle)),
        (outer_radius * np.cos(end_angle), outer_radius * np.sin(end_angle)),
        (inner_radius * np.cos(end_angle), inner_radius * np.sin(end_angle))
    ], closed=True, color=color, alpha=alpha, ec='black')

    ax.add_artist(wedge)


# Function to add a circle inside a cell
def add_circle_to_cell(name, color, radius):
    segment = (list("0abcdefghi")).index(name[0])
    ring = int(name[1])

    if ring < 5:
        segment += 10
        ring = 4 - ring
    else:
        ring = ring - 5

    if not (0 <= segment < num_segments and 0 <= ring < num_rings):
        raise ValueError("Segment or ring index out of range.")

    # Calculate the center of the cell
    inner_radius = radii[ring]
    outer_radius = radii[ring + 1]
    cell_radius = (inner_radius + outer_radius) / 2
    start_angle = theta[segment]
    end_angle = theta[segment + 1]
    cell_angle = (start_angle + end_angle) / 2

    # Circle center coordinates
    x = cell_radius * np.cos(cell_angle)
    y = cell_radius * np.sin(cell_angle)

    # Add the circle
    circle = plt.Circle((x, y), radius, color=color, ec='black')
    ax.add_artist(circle)

    # Return the coordinates of the circle
    return x, y


# Function to draw a line between the centers of two segments
def draw_line_between_segments(name1, name2, color, width):
    segment1 = (list("0abcdefghi")).index(name1[0])
    ring1 = int(name1[1])

    if ring1 < 5:
        segment1 += 10
        ring1 = 4 - ring1
    else:
        ring1 = ring1 - 5

    segment2 = (list("0abcdefghi")).index(name2[0])
    ring2 = int(name2[1])

    if ring2 < 5:
        segment2 += 10
        ring2 = 4 - ring2
    else:
        ring2 = ring2 - 5

    if not (0 <= segment1 < num_segments and 0 <= ring1 < num_rings and
            0 <= segment2 < num_segments and 0 <= ring2 < num_rings):
        raise ValueError("Segment or ring index out of range.")

    # Get the coordinates of the centers of both cells
    x1, y1 = add_circle_to_cell(name1, 'none', 0)
    x2, y2 = add_circle_to_cell(name2, 'none', 0)

    # Draw the line
    ax.plot([x1, x2], [y1, y2], color=color, linewidth=width)


# Schart logic

# Create board columns like Aivd
columns = []
for sign in list("+-"):
    for letter in list("0abcdefghi"):
        columns.append(sign + letter)


columns.reverse()  # put clockwise

print(columns)


# Create board with links between cells
board = {}

for depth in range(4):
    for j, column in enumerate(columns):
        row = 8 - depth if column[0] == '+' else (1 + depth)
        id = f"{column[1]}{str(row)}"
        sign = f"{column[0]}"

        board[id] = {
            "<": (f"{columns[(j - 1) % 20][1]}{row if columns[(j - 1) % 20][0] == sign else (9 - row)}", False, columns[(j - 1) % 20][0] != sign), # last parameter indicates after this move left and right are swapped
            ">": (f"{columns[(j + 1) % 20][1]}{row if columns[(j + 1) % 20][0] == sign else (9 - row)}", False, columns[(j + 1) % 20][0] != sign),
            "^": (f"{column[1]}{str(row + 1)}" if row + 1 < 9 else None, row == 4, False),
            "v": (f"{column[1]}{str(row - 1)}" if row - 1 > 0 else None, row == 5, False)
        }

# lookup to swap a move
SWAP = {
            "<": ">",
            ">": "<",
            "^": "v",
            "v": "^"
        }

print(board)

# performs full move from move string, returns new position or None is move is not possible and if moves need to be
# swapped after this move (only useful for combo moves)
def perform_move(id, move, swap_lr, swap_ud):
    current = id
    for step in list(move):
        actual_step = step
        if actual_step in {'<', '>'} and swap_lr:
            actual_step = SWAP[actual_step]
        if actual_step in {'^', 'v'} and swap_ud:
            actual_step = SWAP[actual_step]

        current, perform_swap_lr, perform_swap_ud = board[current][actual_step]
        if perform_swap_lr:
            swap_lr = True

        if perform_swap_ud:
            swap_ud = True

        if current is None:
            return None, swap_lr, swap_ud

    if current in blocks:
        return None, swap_lr, swap_ud

    return current, swap_lr, swap_ud


color_cell('c6', 'red', 0.2)
color_cell('a5', 'grey', 0.2)
color_cell('d3', 'green', 0.2)
color_cell('b3', 'yellow', 0.2)

# possible solution: color_cell('g5', 'blue', 0.2)

blocks = {
    'a5', 'd3', 'b3'
}


# # koning zwart
# # color_cell("a5", 'yellow')
# id = "c6"
# add_circle_to_cell(id, 'red', 0.035)
#
#
# for move in ["<", ">", "v", "^", "^<", "^>", "v<", "v>"]:
#     next_id, _, _ = perform_move(id, move, False, False)
#     add_circle_to_cell(next_id, 'red', 0.035)
#     draw_line_between_segments(id, next_id, 'red', 1)
#
# # koning
# # color_cell("a5", 'yellow')
# id = "a5"
# add_circle_to_cell(id, 'grey', 0.025)
#
# for move in ["<", ">", "v", "^", "^<", "^>", "v<", "v>"]:
#     next_id, _, _ = perform_move("a5", move, False, False)
#     add_circle_to_cell(next_id, 'grey', 0.025)
#     draw_line_between_segments(id, next_id, 'grey', 1)
#
# # loper
# for move in ["^>", "^<", "v>", "v<"]:
#     current = "d3"
#     swap_lr = swap_ud = False
#     add_circle_to_cell(current, 'green', 0.025)
#     while True:
#         next, swap_lr, swap_ud = perform_move(current, move, swap_lr, swap_ud)
#         if next is None:
#             break
#         add_circle_to_cell(next, 'green', 0.025)
#         draw_line_between_segments(current, next, 'green', 1)
#
#         current = next
#
# # knightrider
# for i, move in enumerate(["^>>", "^<<", "v>>", "v<<", "^^>", "^^<", "vv>", "vv<"]):
#     current = "b3"
#     swap_lr = swap_ud = False
#     add_circle_to_cell(current, 'yellow', 0.015)
#     while True:
#         next, swap_lr, swap_ud = perform_move(current, move, swap_lr, swap_ud)
#         if next is None:
#             break
#         add_circle_to_cell(next, 'yellow', 0.015)
#         draw_line_between_segments(current, next, 'yellow', 1)
#
#         current = next

# knighterider 2: e4
for i, move in enumerate(["^>>", "^<<", "v>>", "v<<", "^^>", "^^<", "vv>", "vv<"]):
    current = "e4"
    swap_lr = swap_ud = False
    add_circle_to_cell(current, 'blue', 0.015)
    while True:
        next, swap_lr, swap_ud = perform_move(current, move, swap_lr, swap_ud)
        if next is None:
            break
        add_circle_to_cell(next, 'blue', 0.010)
        draw_line_between_segments(current, next, 'blue', 1)

        current = next

for i, move in enumerate(["^>>", "^<<", "v>>", "v<<", "^^>", "^^<", "vv>", "vv<"]):
    current = "c7"
    swap_lr = swap_ud = False
    add_circle_to_cell(current, 'blue', 0.015)
    while True:
        next, swap_lr, swap_ud = perform_move(current, move, swap_lr, swap_ud)
        if next is None:
            break
        add_circle_to_cell(next, 'yellow', 0.005)
        draw_line_between_segments(current, next, 'yellow', 1)

        current = next

# Remove axes
ax.axis('off')
plt.savefig("q11.pdf", format="pdf", bbox_inches="tight")

plt.show()

