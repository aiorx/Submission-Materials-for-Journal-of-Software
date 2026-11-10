# day8.py
# AoC Day 8: Haunted Wasteland
# 12.8.2023
#

import math

import math

# Read input
file = open("day08/input.txt", "r")
lines = file.readlines()

# Part 1
instruction = lines[0].strip()
print( f"|{instruction}|")

locations = []
left = {}
right = {}

for i in range(2, len(lines)):
    data = lines[i].strip().split(" ")
    node = data[0]
    left_value = data[2][1:-1]
    right_value = data[3][:-1]

    #print(i, node, left, right)

    left[node] = left_value
    right[node] = right_value

    # store nodes that end with A
    if node[-1] == "A":
        locations.append(node)

print("--end read input --")

print( locations)

# store the first Z for each location
firstZ = []

for j in range(0, len(locations)):

    print(f"starting with {locations[j]}")
    zs = []
    count = 0
    steps = 0
    stop = False
    while stop == False:
        for i in instruction:

            if i == "L":
                locations[j] = left[locations[j]]
            else:
                locations[j] = right[locations[j]]

            steps += 1

            if locations[j][-1] ==  "Z":
                print(f"{locations[j]} at {steps} steps")
                firstZ.append(steps)
                stop = True
                break
   

# used Wolfram Alpha to find the LCM of the numbers to get start
print()
print( locations )
print( firstZ )


# thanks copilot for the following code to automate the LCM
def lcm(a, b):
    return abs(a*b) // math.gcd(a, b)

def lcm_multiple(numbers):
    result = numbers[0]
    for number in numbers[1:]:
        result = lcm(result, number)
    return result

print(f"The least common multiple is {lcm_multiple(firstZ):,d}") #15995167053923
      


