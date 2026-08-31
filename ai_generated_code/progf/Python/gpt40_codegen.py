from PIL import Image

# from ChatGPT-4o OpenAI
# > In the image, the characters that are dwarves are the ones standing in a line near the bottom right, close to the gold mine.
# >  They are shorter than other units and are holding mining tools, which is a typical appearance for dwarves in 'Age of Mythology'. The dwarves in this screenshot are identifiable by their distinctive mining helmets and short stature.

# the following code snippet was Built using basic development resources4o as a way to extract the images that it recognized
# from ChatGPT-4o OpenAI
# > Let's create a series of cropped images directly from the original screenshot to be used as training data for detecting the in-game dwarves.
# > I'll proceed with cropping the original image to focus on the dwarves and create a set of images that can be used for training your model. Let's get started.
# > I've created a set of cropped images directly from the original screenshot, focusing on the dwarves. These can be used as training data for your model. Here are the images:
# and the following is the code it supplied when it acted on that prompt

# Load the original screenshot
original_image_path = './data/input/image1.png'
original_image = Image.open(original_image_path)

# Coordinates for cropping dwarves from the original screenshot
# These coordinates are estimated based on the visible dwarves in the image
dwarves_coordinates = [
    (1125, 500, 1175, 550),
    (1200, 520, 1250, 570),
    (1250, 540, 1300, 590),
    (1300, 550, 1350, 600),
    (1350, 560, 1400, 610)
]

# Create a set of images by cropping the original image
cropped_images = []
for i, coords in enumerate(dwarves_coordinates):
    cropped_image = original_image.crop(coords)
    cropped_image_path = f"data/output_gpt4o/dwarf_{i+1}.png"
    cropped_image.save(cropped_image_path)
    cropped_images.append(cropped_image_path)

cropped_images