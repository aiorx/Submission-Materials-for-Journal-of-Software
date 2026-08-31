# this is a script Aided using common development resources, to render the cube, colour the cube, and remesh the cube for rendering. for a smoother render up the voxel size, and for a rougher render down the voxel size.

import bpy
import csv
import random

# Path to your CSV file
csv_file_path = r'{csv_file_path}'  # Using raw string to avoid escaping backslashes

# Read CSV file
height_data = []
with open(csv_file_path, newline='') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')
    for row in csvreader:
        height_data.append([float(value) for value in row])

# Dimensions
rows = len(height_data)
cols = len(height_data[0])

# Function to create a random green material
def create_random_green_material():
    mat = bpy.data.materials.new(name="GreenGrass")
    # Randomize the green color slightly
    green_value = 0.5 + random.random() * 0.5  # Random green value between 0.5 and 1.0
    mat.diffuse_color = (0, green_value, 0, 1)  # RGBA for green
    return mat

# Function to create a cube
def create_cube(x, y, height):
    base_height = height / 2  # Position the base of the cube at half the height
    bpy.ops.mesh.primitive_cube_add(size=1.1, location=(x, y, base_height))  # Increase the size to 1.1
    cube = bpy.context.active_object
    cube.scale.z = (height + 20) / 2  # Adjust the height to extend downwards by an additional 20 meters
    green_material = create_random_green_material()  # Create a random green material for each cube
    cube.data.materials.append(green_material)  # Assign the green material
    return cube

# Create cubes based on CSV values and store them in a list
cubes = []
for y in range(rows):
    for x in range(cols):
        height = height_data[y][x]
        cube = create_cube(x, -y, height)  # Note: using -y to flip the direction for Blender's coordinate system
        cubes.append(cube)

# Join all cubes into a single object
bpy.ops.object.select_all(action='DESELECT')
for cube in cubes:
    cube.select_set(True)
bpy.context.view_layer.objects.active = cubes[0]
bpy.ops.object.join()

# Apply a remesh modifier to the joined object
joined_object = bpy.context.view_layer.objects.active
remesh_modifier = joined_object.modifiers.new(name="Remesh", type='REMESH')
remesh_modifier.mode = 'VOXEL'
remesh_modifier.voxel_size = 0.4

# Update the scene to reflect changes
bpy.context.view_layer.update()
