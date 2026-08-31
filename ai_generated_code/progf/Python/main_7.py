#!/usr/bin/env python3

import sys
from collections import Counter

fname = sys.argv[1] if len(sys.argv[1:]) == 1 else "input.txt"

data = open(fname).read().splitlines()
height = len(data)
width = len(data[0])

xmas = "XMAS"

total = 0

for word in [xmas, xmas[::-1]]:
    for i, horizontal in enumerate(data):
        tmp = horizontal.count(word)
        total += tmp

    verticals = ["".join([row[col] for row in data]) for col in range(len(data[0]))]

    for vertical in verticals:
        total += vertical.count(word)
        pass

    # Thanks copilot
    def get_diagonals(matrix):
        if not matrix or not matrix[0]:
            return []

        rows, cols = len(matrix), len(matrix[0])
        diagonals = []

        # Top-left to bottom-right diagonals
        for d in range(rows + cols - 1):
            diagonal = []
            for row in range(max(0, d - cols + 1), min(rows, d + 1)):
                col = d - row
                diagonal.append(matrix[row][col])
            diagonals.append(diagonal)

        # Top-right to bottom-left diagonals
        for d in range(rows + cols - 1):
            diagonal = []
            for row in range(max(0, d - cols + 1), min(rows, d + 1)):
                col = cols - 1 - (d - row)
                diagonal.append(matrix[row][col])
            diagonals.append(diagonal)

        return ["".join(d) for d in diagonals]

    for diagonal in get_diagonals(data):
        total += diagonal.count(word)
        pass


print(total)
