# Supported via standard programming aids

from PIL import Image
import os
import sys

def split_image(image_path):
    # Extract the base name without the file extension
    base_name = os.path.splitext(os.path.basename(image_path))[0]
    
    # Open the image
    img = Image.open(image_path)
    
    # Verify image size is 32x32 or 48x48
    if img.size == (32, 32):
        rows = ["TOP", "BOTTOM"]
        columns = ["LEFT", "RIGHT"]
    elif img.size == (48, 48):
        rows = ["TOP", "CENTER", "BOTTOM"]
        columns = ["LEFT", "MIDDLE", "RIGHT"]
    else:
        raise ValueError("Image size must be 32x32 or 48x48 pixels.")
    
    
    # Loop over the image to create 9 sub-images of size 16x16
    for i, row in enumerate(rows):
        for j, column in enumerate(columns):
            # Define the box to crop (left, upper, right, lower)
            left = j * 16
            upper = i * 16
            right = left + 16
            lower = upper + 16
            box = (left, upper, right, lower)
            
            # Crop the sub-image
            sub_image = img.crop(box)
            
            # Create the filename
            filename = f"{base_name}_{row}_{column}.png"
            
            # Save the sub-image
            sub_image.save(filename)

    print("Images have been split and saved successfully.")

# Example usage:
split_image(sys.argv[1])
