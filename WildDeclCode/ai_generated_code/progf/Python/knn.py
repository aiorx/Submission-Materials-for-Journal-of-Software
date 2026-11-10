# knn.py
# For CSI 480 @ Champlain College
# Starter Code by David Kopec and GitHub Copilot
# Completed by:
import csv
from dataclasses import dataclass
from pathlib import Path
from math import sqrt

@dataclass
class Fish:
    species: str
    weight: float
    length1: float
    length2: float
    length3: float
    height: float
    width: float

# Read a CSV file
# The first column is the fish species
# The second column is the weight of the fish
# The rest of the columns are the length1, length2, length3, height, width
# Created with assistance from GitHub Copilot
def read_fish_CSV(file_path: Path, species: str = "") -> list[Fish]:
    with open(file_path, 'r') as f:
        reader = csv.reader(f)
        header = next(reader)  # Skip the header
        fishes = []
        for row in reader:
            fishes.append(Fish(row[0], float(row[1]), float(row[2]), float(row[3]), float(row[4]), float(row[5]), float(row[6])))
        return fishes

# Find the Euclidean distance between two fish
def distance(fish1: Fish, fish2: Fish) -> float:
    return sqrt(
        (fish1.length1 - fish2.length1) ** 2 +
        (fish1.length2 - fish2.length2) ** 2 +
        (fish1.length3 - fish2.length3) ** 2 +
        (fish1.height - fish2.height) ** 2 +
        (fish1.width - fish2.width) ** 2
    )

# Find the k nearest neighbors of a given fish
def nearest(k: int, fish: Fish, all_fish: list[Fish]) -> list[Fish]:
    all_fish_sorted = sorted(all_fish, key=lambda x: distance(fish, x))
    return all_fish_sorted[:k]

# Classify a fish based on the k nearest neighbors
# Choose the fish species with the most neighbors and return it
def classify(k: int, fish: Fish, all_fish: list[Fish]) -> str:
    nearest_fish = nearest(k, fish, all_fish)
    species_count = {}
    for f in nearest_fish:
        if f.species in species_count:
            species_count[f.species] += 1
        else:
            species_count[f.species] = 1
    return max(species_count, key=species_count.get)

# Predict the weight of a fish based on the k nearest neighbors
# Choose the average (mean) weight of the neighbors and return it
def predict(k: int, fish: Fish, all_fish: list[Fish]) -> float:
    nearest_fish = nearest(k, fish, all_fish)
    total_weight = sum(f.weight for f in nearest_fish)
    return total_weight / k

# Plot the fish data with matplotlib by height and width, showing a different color
# for each species
# Created with assistance from GitHub Copilot
def plot_fish(all_fish: list[Fish]) -> None:
    import matplotlib.pyplot as plt
    species = {}
    for fish in all_fish:
        if fish.species in species:
            species[fish.species].append(fish)
        else:
            species[fish.species] = [fish]
    for key in species:
        plt.scatter([fish.height for fish in species[key]], [fish.width for fish in species[key]], label=key)
    plt.xlabel("Height")
    plt.ylabel("Width")
    plt.legend()
    plt.show()

if __name__ == "__main__":
    p = Path(__file__).with_name('Fish.csv')
    all_fish = read_fish_CSV(p.absolute())
    plot_fish(all_fish)
