import json
import time

# START - CODE Built using basic development resources3
def solution():
    # Generate all polygonal numbers up to 4-digit numbers for each type
    triangles = [n*(n+1)//2 for n in range(45, 141)]
    squares = [n**2 for n in range(32, 100)]
    pentagonals = [n*(3*n-1)//2 for n in range(26, 82)]
    hexagonals = [n*(2*n-1) for n in range(23, 71)]
    heptagonals = [n*(5*n-3)//2 for n in range(21, 64)]
    octagonals = [n*(3*n-2) for n in range(19, 59)]

    # Create a dictionary to store the polygonal numbers by their last two digits
    nums_dict = {}
    for nums, name in [(triangles, 'triangles'), (squares, 'squares'), (pentagonals, 'pentagonals'),
                       (hexagonals, 'hexagonals'), (heptagonals, 'heptagonals'), (octagonals, 'octagonals')]:
        for num in nums:
            if num >= 1000:
                last_two_digits = str(num)[2:]
                if last_two_digits in nums_dict:
                    nums_dict[last_two_digits][name] = num
                else:
                    nums_dict[last_two_digits] = {name: num}

    # Find all cycles of length 6 that satisfy the conditions
    for start in octagonals:
        for chain in find_chains(start, nums_dict, ['octagonals', 'heptagonals', 'hexagonals', 'pentagonals', 'squares', 'triangles']):
            if len(chain) == 6 and chain[0] in nums_dict[str(chain[-1])]['triangles']:
                return sum(chain)

def find_chains(start, nums_dict, polygonal_names, chain=[]):
    # Recursively find all chains of polygonal numbers that satisfy the conditions
    if len(chain) == len(polygonal_names):
        if str(start)[2:] == str(chain[0])[:2]:
            yield chain
    else:
        for name in polygonal_names:
            if name not in chain:
                for num in nums_dict[str(start)[2:]].values():
                    if num not in chain:
                        for chain in find_chains(num, nums_dict, polygonal_names, chain + [name]):
                            yield chain
# END - CODE Built using basic development resources3

cpu_s, wall_s = time.process_time(), time.time()
result = solution()
cpu_e, wall_e = time.process_time(), time.time()

cpu_time, wall_time = cpu_e - cpu_s, wall_e - wall_s
print(json.dumps({"solution": result, "cpu": cpu_time, "wall": wall_time}))
