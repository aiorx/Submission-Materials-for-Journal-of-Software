import math

# This script was Assisted with basic coding tools. It calculates a bearing between
# two sets of lat/lng positions. The bearing is needed to calculate a
# relative position. The script was reimplemented in JavaScript.

def calculate_bearing(lat1, lon1, lat2, lon2):
    # Convert latitude and longitude from degrees to radians
    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    # Difference in longitude
    delta_lon = lon2 - lon1

    # Calculate the components of the formula
    x = math.sin(delta_lon) * math.cos(lat2)
    y = math.cos(lat1) * math.sin(lat2) - (math.sin(lat1) * math.cos(lat2) * math.cos(delta_lon))

    # Calculate the initial bearing
    initial_bearing = math.atan2(x, y)

    # Convert from radians to degrees
    initial_bearing = math.degrees(initial_bearing)

    # Normalize to 0-360
    compass_bearing = (initial_bearing + 360) % 360

    return compass_bearing

# Example usage
lat1 = 52.2296756  # Starting latitude
lon1 = 21.0122287  # Starting longitude
lat2 = 41.8919300  # Ending latitude
lon2 = 12.5113300  # Ending longitude

bearing = calculate_bearing(lat1, lon1, lat2, lon2)
print(f"Bearing: {bearing} degrees")
