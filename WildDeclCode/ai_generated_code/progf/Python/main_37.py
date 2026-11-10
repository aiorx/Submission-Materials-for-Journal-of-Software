#!/opt/homebrew/bin/python3 
from functools import cache
import re
import sys

f = open('input.txt', 'r')
lines = f.read().splitlines()
pattern = re.compile(r"X.(\d+), Y.(\d+)")

@cache
def bestPath(x, y, buttonA, buttonB):
    if x == 0 and y == 0:
        return (0, 0)
    if x < 0 or y < 0:
        return None
    
    aPath = bestPath(x - buttonA[0], y - buttonA[1], buttonA, buttonB)
    if aPath is not None:
        aPath = (aPath[0] + 1, aPath[1])

    bPath = bestPath(x - buttonB[0], y - buttonB[1], buttonA, buttonB)
    if bPath is not None:
        bPath = (bPath[0], bPath[1] + 1)

    if aPath is None and bPath is None:
        return None
    if aPath is None:
        return bPath
    if bPath is None:
        return aPath
    return aPath if sum(aPath) < sum(bPath) else bPath

# thanks chatGPT
def bestPath_linear(X, Y, buttonA, buttonB):
    ax, ay = buttonA
    bx, by = buttonB
    det = ax*by - ay*bx
    if det == 0:
        # Check special case
        # If A and B are collinear, we must see if (X,Y) is on that line.
        # If on line, try to express X,Y as n*A, then vary to find minimum sum.
        # Otherwise no solution.
        if ax == 0 and ay == 0:
            if (X,Y) == (0,0):
                return (0,0)
            return None
        # Check collinearity
        # If A is zero vector or B is zero vector, handle separately.
        if ax == 0 and ay == 0:
            if (X,Y) == (0,0):
                return (0,0)
            return None
        # If A and B are multiples of each other, just use one:
        # Suppose B = k*A. Then (X,Y) must be a multiple of A.
        # Find the nonnegative integer multiple that works and minimal sum.
        # If both are multiples of each other, choose minimal from either direction.
        # Example solution: Just try to solve with one vector if they’re collinear.
        if bx*ay == by*ax: # guaranteed collinear
            # Check if (X,Y) is multiple of A
            if ax == 0 and ay == 0:
                return None
            # scale factor
            if ax != 0:
                if X % ax == 0 and (X//ax)*ay == Y:
                    a = X//ax
                    if a >= 0:
                        return (a,0)
                return None
            else:
                if ay != 0 and Y % ay == 0 and X == 0:
                    a = Y//ay
                    if a >= 0:
                        return (a,0)
                return None
        return None
    else:
        # Normal case
        # a = (X*by - Y*bx)/det
        # b = (-X*ay + Y*ax)/det
        # Must be integers and >=0
        if (X*by - Y*bx) % det != 0 or (-X*ay + Y*ax) % det != 0:
            return None
        a = (X*by - Y*bx)//det
        b = (-X*ay + Y*ax)//det
        if a < 0 or b < 0:
            return None
        return (a,b)


part1 = 0
part2 = 0
for i in range(0, len(lines), 4):
    chunk = lines[i:i+4]
    match = pattern.search(chunk[0])
    a = (int(match.group(1)), int(match.group(2)))
    match = pattern.search(chunk[1])
    b = (int(match.group(1)), int(match.group(2)))
    match = pattern.search(chunk[2])
    gx, gy = int(match.group(1)), int(match.group(2))

    path = bestPath(gx, gy ,a, b)
    if path != None and sum(path) <= 200:
        part1 += path[0] * 3 + path[1]


    # Part 2
    increase = 10000000000000
    path = bestPath_linear(gx + increase, gy + increase, a, b)
    if path != None:
        part2 += path[0] * 3 + path[1]
print(part1)
print(part2)

    


