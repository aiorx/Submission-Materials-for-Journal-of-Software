# Convert raw image data stored in an ISO Latin-1 JSON file to a PNG image.
# Designed for decrypting mods in the Mario Royale Deluxe Mod Manager format.
# Composed with basic coding tools:
# https://chat.openai.com/share/b7ae8f67-9ca3-42e8-a5e8-a4ab4c1e2a73
# This code is in the public domain.

import json

# Step 1: Read the JSON file
with open('FILENAME_GOES_HERE.json') as file:
    data = json.load(file)

# Step 2: Locate the image data
image_data = data['mods'][0]['data']  # Assuming 'image' is the key where the image data is stored

# Step 3: Decode the image data
image_bytes = image_data.encode('iso-8859-1')

# Step 4: Save the image data
with open('ConvertedMod.png', 'wb') as image_file:
    image_file.write(image_bytes)
