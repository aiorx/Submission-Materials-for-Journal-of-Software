```python
def sample_border_colors(image):
	# Thanks ChatGPT, I'm lazy!
    # Define the region to sample (excluding the rounded corners)
    left = 25
    top = 25
    right = image.width - 25
    bottom = image.height - 25
    sample_region = [(x, top) for x in range(left, right)] + \
                    [(right, y) for y in range(top, bottom)] + \
                    [(x, bottom) for x in range(right, left, -1)] + \
                    [(left, y) for y in range(bottom, top, -1)]

    # Sample 20 pixels from the border
    pixels = [image.getpixel(coord) for coord in sample_region[:20]]

    # Calculate the average color
    total_r = sum(rgb[0] for rgb in pixels)
    total_g = sum(rgb[1] for rgb in pixels)
    total_b = sum(rgb[2] for rgb in pixels)
    avg_r = total_r // len(pixels)
    avg_g = total_g // len(pixels)
    avg_b = total_b // len(pixels)

    return (avg_r, avg_g, avg_b)

def reprocessImageForMPCFill(oldImagePath, newImagePath):
	# Thanks ChatGPT, I'm lazy!
	# Open the original image
	original_image = Image.open(oldImagePath)

	# Calculate the coordinates for cropping
	left = (original_image.width - 686) // 2
	top = (original_image.height - 976) // 2
	right = left + 686
	bottom = top + 976

	# Crop the image
	cropped_image = original_image.crop((left, top, right, bottom))

	# Create a new black image
	average_border_color = sample_border_colors(original_image)
	new_image = Image.new('RGB', (816, 1110), average_border_color)

	# Calculate the coordinates for pasting
	paste_left = (new_image.width - cropped_image.width) // 2
	paste_top = (new_image.height - cropped_image.height) // 2
	paste_right = paste_left + cropped_image.width
	paste_bottom = paste_top + cropped_image.height

	# Paste the cropped image onto the black image
	new_image.paste(cropped_image, (paste_left, paste_top))

	# Save the new image
	new_image.save(newImagePath)
```