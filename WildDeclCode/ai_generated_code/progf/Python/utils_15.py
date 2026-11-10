from concurrent.futures import ThreadPoolExecutor, as_completed
from enum import Enum
import random
import math
import os
import cv2

def get_distance(point1, point2):
  x1, y1 = point1
  x2, y2 = point2
  distance = math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  return distance

def set_pixel(image_array, y, x, rgb):
  image_array[y, x] = rgb
  
def get_pixel(image_array, y, x):
  return image_array[y, x]

def is_black(rgb, threshold = 20): # Higher the threshold, the more gray colors it includes
  return rgb[0] < threshold and rgb[1] < threshold and rgb[2] < threshold

def is_white(rgb, threshold = 200): # Lower the threshold, the more gray colors it includes
  return rgb[0] > threshold and rgb[1] > 200 and rgb[2] > 200

def random_boolean(tendency = False):
  if tendency:
    return 0 < random.randint(-5, 5)
  else:
    return random.randint(-5, 5) < 0

def find_nearest(modifications, x2, y2, threaded=False, num_threads=4):
  nearest_point = None
  min_distance = float("inf")
  
  if threaded:
    def find_nearest_point(y1, x1):
      nonlocal nearest_point, min_distance
      
      distance = get_distance((x1, y1), (x2, y2))
      if distance < min_distance:
        nearest_point = (x1, y1)
        min_distance = distance

    with ThreadPoolExecutor(max_workers=num_threads) as executor:
      futures = [executor.submit(find_nearest_point, y1, x1) for (y1, x1, rgb) in modifications]
      
    for future in as_completed(futures):
      future.result()
  else:
    for (y1, x1, rgb) in modifications:
      distance = get_distance((x1, y1), (x2, y2))
      
      if distance < min_distance:
        nearest_point = (x1, y1)
        min_distance = distance
    
  return nearest_point

def get_similar_color(rgb, variation=30):
  r, g, b = rgb
  new_r = max(0, min(255, r + random.randint(-variation, variation)))
  new_g = max(0, min(255, g + random.randint(-variation, variation)))
  new_b = max(0, min(255, b + random.randint(-variation, variation)))
  
  return (new_r, new_g, new_b)

# Thanks ChatGPT
def video_from_image_sequence(image_folder, output_video_path, fps=30):
  images = sorted([img for img in os.listdir(image_folder) if img.endswith((".png", ".jpg", ".jpeg"))]) # Get a sorted list of image filenames in the folder

  # Load the first image to get the dimensions
  first_image_path = os.path.join(image_folder, images[0])
  frame = cv2.imread(first_image_path)
  height, width, layers = frame.shape

  # Define the video codec and create VideoWriter object
  fourcc = cv2.VideoWriter_fourcc(*"mp4v")  # Use 'XVID' for .avi files
  video = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

  # Add each image to the video
  for image in images:
    image_path = os.path.join(image_folder, image)
    frame = cv2.imread(image_path)
    video.write(frame)

  # Release the video writer
  video.release()
  print(f"Saved {output_video_path}")

class Filters(Enum):
  GLITCHY_RANDOM_DOWN = 1
  GLITCHY_CONSTANT = 2
  GLITCHY_CONSTANT_DOWN_ON_WHITE = 3
  GLITCHY_CONSTANT_DOWN_ON_BLACK = 4
  GLITCHY_RANDOM_DOWN_ON_WHITE = 5
  GLITCHY_RANDOM_DOWN_ON_BLACK = 6
  RANDOM_PIXELS = 7
  FIREFLIES = 8