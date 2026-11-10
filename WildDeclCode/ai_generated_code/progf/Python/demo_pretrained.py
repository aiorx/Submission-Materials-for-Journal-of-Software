import torch
import torchvision.transforms as T
from PIL import Image
import matplotlib.pyplot as plt
import requests
from models import build_model
from argparse import Namespace

# Attribution: this code was Assisted with basic coding tools.
# Prompt: I trained a DETR model. How can I run it on a sample image and see the results?

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

############################
# Load the model and image #
############################

# Load pretrained DETR
model = torch.hub.load('facebookresearch/detr:main', 'detr_resnet50', pretrained=True)
model.to(device)
model.eval()

# Load sample image
image = Image.open("./sample_images/sample.jpg").convert('RGB')

# Define transform (as used during training)
transform = T.Compose([
    T.Resize(800),  # or whatever size you trained with
    T.ToTensor(),
    T.Normalize([0.485, 0.456, 0.406],
                [0.229, 0.224, 0.225])
])

img_tensor = transform(image).unsqueeze(0).cuda()  # Add batch dim

# Move model to GPU/CPU
model.to(device)

# Move input to same device
img_tensor = img_tensor.to(device)

#################
# Run inference #
#################

# Run the image through the model
outputs = model(img_tensor)

# Get the scores and keep only predictions above a threshold
prob = outputs['pred_logits'].softmax(-1)[0, :, :-1]  # Remove background class
keep = prob.max(-1).values > 0.4  # Threshold can be adjusted


############################
# Extract boxes and labels #
############################

# Get class labels and bounding boxes
labels = prob[keep].argmax(-1)
boxes = outputs['pred_boxes'][0, keep]  # [x_center, y_center, w, h] normalized

# Convert boxes to [x_min, y_min, x_max, y_max] in pixels
w, h = image.size
boxes = boxes.cpu() * torch.tensor([w, h, w, h])
boxes = boxes.detach().numpy()
boxes_xyxy = [
    [b[0] - b[2] / 2, b[1] - b[3] / 2, b[0] + b[2] / 2, b[1] + b[3] / 2]
    for b in boxes
]

print(f"Number of predictions above threshold: {keep.sum().item()}")

# Optional: COCO class names
COCO_CLASSES = [
    'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train',
    'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign',
    'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep',
    'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella',
    'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
    'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
    'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon',
    'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot',
    'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant',
    'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote',
    'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink',
    'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
    'hair drier', 'toothbrush'
]

# Print boxes and class names
labels = prob[keep].argmax(-1)
for i, box in enumerate(boxes_xyxy):
    label_id = labels[i].item()
    score = prob[keep][i].max().item()
    label_name = COCO_CLASSES[label_id] if label_id < len(COCO_CLASSES) else f"class {label_id}"
    print(f"Prediction {i}: {label_name} | Score: {score:.2f} | Box: {box}")


#####################
# Visualize results #
#####################

import matplotlib.patches as patches

# Display image with predicted boxes
fig, ax = plt.subplots(1, figsize=(12, 8))
ax.imshow(image)

for box in boxes_xyxy:
    xmin, ymin, xmax, ymax = box
    rect = patches.Rectangle((xmin, ymin), xmax - xmin, ymax - ymin,
                             linewidth=2, edgecolor='red', facecolor='none')
    ax.add_patch(rect)

plt.axis('off')
plt.savefig("sample_output/prediction_pretrained.jpg", bbox_inches='tight', pad_inches=0)
plt.close()

