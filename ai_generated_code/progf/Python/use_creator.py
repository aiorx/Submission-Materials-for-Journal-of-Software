## Drafted using common development resources as of may 26 2024, tested and works as expected
## Used to generate use.csv
import os
import csv

# Specify the directory containing the images
directory = './Your_DataSet'
output_csv = 'use.csv'

# Create a list to hold the image file paths
image_files = []

# Loop through the directory and get all image files
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff')):
            file_path = os.path.join(root, file)
            image_files.append(file_path)

# Write the image file paths to a CSV file
with open(output_csv, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['mask', 'images'])
    for image_file in image_files:
        writer.writerow([image_file, image_file])

print(f"CSV file '{output_csv}' created with {len(image_files)} entries.")
