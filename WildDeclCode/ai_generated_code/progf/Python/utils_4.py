from math import sin, cos
import random

from vectors import Vec2

clamp = lambda value, min_, max_: min(max(value, min_), max_)


# Designed via basic programming aids
def distance_between_points(x1, y1, x2, y2):
    # Calculate the horizontal and vertical differences
    dx = x2 - x1
    dy = y2 - y1

    # Use the Pythagorean theorem to calculate the distance
    distance = (dx ** 2 + dy ** 2) ** 0.5

    return distance


# Designed via basic programming aids
def random_color_8bit_tuple():
    # Generate random 2-bit values for Red, 3-bit for Green, and 2-bit for Blue components
    red_2bit = random.randint(0, 3)
    green_3bit = random.randint(0, 7)
    blue_2bit = random.randint(0, 3)

    # Convert the 2-bit and 3-bit values to 8-bit by shifting and replicating bits
    red = red_2bit * 85
    green = green_3bit * 36
    blue = blue_2bit * 85

    return (red, green, blue)


# Designed via basic programming aids
def find_intersection(line1, line2):
    x1, y1, x2, y2 = line1
    x3, y3, x4, y4 = line2

    # Calculate the direction vectors of the two line segments
    dx1 = x2 - x1
    dy1 = y2 - y1
    dx2 = x4 - x3
    dy2 = y4 - y3

    # Calculate determinant to check if the lines are parallel
    determinant = dx1 * dy2 - dx2 * dy1

    # Check if the lines are parallel (determinant is close to 0)
    if abs(determinant) < 1e-10:
        return None  # No intersection, the lines are parallel

    # Calculate the parameters for the intersection point
    t1 = ((x3 - x1) * dy2 - (y3 - y1) * dx2) / determinant
    t2 = ((x3 - x1) * dy1 - (y3 - y1) * dx1) / determinant

    # Check if the intersection point lies within both line segments
    if 0 <= t1 <= 1 and 0 <= t2 <= 1:
        x = x1 + t1 * dx1
        y = y1 + t1 * dy1
        return x, y
    else:
        return None  # Intersection point is outside the line segments


def cast_line(pos: Vec2, a: float, l: float) -> Vec2:
    return Vec2(
        pos.x + sin(a) * l,
        pos.y + cos(a) * l
    )
