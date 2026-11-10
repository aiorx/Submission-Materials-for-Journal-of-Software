# Penned via standard programming aids

from rgbmatrix import RGBMatrix, RGBMatrixOptions
from PIL import Image, ImageDraw, ImageFont
import time

# Matrix configuration
options = RGBMatrixOptions()
options.rows = 32
options.cols = 64
options.chain_length = 1
options.parallel = 1
options.hardware_mapping = 'adafruit-hat'  # Or 'regular'

matrix = RGBMatrix(options=options)

# Create an image
image = Image.new("RGB", (64, 32))
draw = ImageDraw.Draw(image)

# Load a font
font = ImageFont.load_default()

# Draw some text
draw.text((1, 10), "Hello Metro!", fill=(0, 255, 0), font=font)

# Display the image
matrix.SetImage(image)

# Keep it visible for 10 seconds
time.sleep(10)
