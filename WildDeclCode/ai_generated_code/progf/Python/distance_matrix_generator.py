import csv
from math import radians, sin, cos, sqrt, atan2


# This formula was Crafted via external programming aids's ChatGPT
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of the Earth in kilometers

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c
    return distance
################################################################################################

def create_distance_matrix(city_location_file, distance_matrix_file):
    # Read city data
    with open(city_location_file, 'r', encoding='utf-8') as city_csv:
        cities_data = list(csv.reader(city_csv))

    # Extract cities and coordinates
    header, *rows = cities_data  # Assuming the header is present
    cities = [row[0].lower() for row in rows]
    coordinates = {city.lower(): {'lat': float(row[1]), 'lon': float(row[2])} for city, row in zip(cities, rows)}

    # Initialize distance matrix
    distance_matrix = [[0] * len(cities) for _ in range(len(cities))]

    # Populate the distance matrix
    for i, city1 in enumerate(cities):
        for j, city2 in enumerate(cities):
            if i < j:
                # Fetch coordinates from the dictionary
                coordinates1 = coordinates[city1]
                coordinates2 = coordinates[city2]

                distance = haversine(coordinates1['lat'], coordinates1['lon'], coordinates2['lat'], coordinates2['lon'])

                # Populate both symmetric positions in the matrix
                distance_matrix[i][j] = round(distance)
                distance_matrix[j][i] = round(distance)

    # Write distance matrix to CSV
    with open(distance_matrix_file, 'w', newline='', encoding='utf-8') as matrix_csv:
        csv.writer(matrix_csv).writerows([[''] + cities] + [[city] + row for city, row in zip(cities, distance_matrix)])

    return distance_matrix, cities


# Replace with your file paths
city_location_file_path = '../../Teams/UEFA Coefficients/city_location_data.csv'
distance_matrix_file_path = '../../Teams/UEFA Coefficients/distance_matrix.csv'

# Get the distance matrix and cities
distance_matrix, cities = create_distance_matrix(city_location_file_path, distance_matrix_file_path)

# Print cities for verification
print("Cities:", cities)
