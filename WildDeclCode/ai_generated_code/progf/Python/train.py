# Help from GitHub Copilot
# Resource: https://www.pyimagesearch.com/2021/04/26/keras-tensorflow-2-0-object-localization/

from pyimagesearch import config
from tensorflow.keras.applications import VGG16
from tensorflow.keras.layers import Flatten
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import Input
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.preprocessing.image import load_img
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import numpy as np
import cv2
import os

img_size = 224

print("[INFO] loading dataset...")
rows = open(config.ANNOTS_PATH).read().strip().split("\n")

data = []
targets = []
filenames = []

for row in rows[1:]:
    print("[INFO] processing {}/{}".format(rows.index(row), len(rows)))
    row = row.split(",")
    (filename, startX, startY, endX, endY, _, _, _, _, _, _) = row
    imagePath = os.path.sep.join([config.IMAGES_PATH, filename])
    image = cv2.imread(imagePath)
    (h, w) = image.shape[:2]
    startX = float(startX) / w
    startY = float(startY) / h
    endX = float(endX) / w
    endY = float(endY) / h
    image = load_img(imagePath, target_size=(img_size, img_size))
    image = img_to_array(image)
    data.append(image)
    targets.append((startX, startY, endX, endY))
    filenames.append(filename)

data = np.array(data, dtype="float32") / 255.0
targets = np.array(targets, dtype="float32")

print("[INFO] splitting dataset...")
(trainImages, testImages, trainTargets, testTargets, trainFilenames, testFilenames) = train_test_split(data, targets, filenames, test_size=0.25, random_state=42)

print("[INFO] saving testing filenames...")
f = open(config.TEST_FILENAMES, "w")
f.write("\n".join(testFilenames))
f.close()

print("[INFO] loading VGG16 network...")
vgg = VGG16(weights="imagenet", include_top=False, input_tensor=Input(shape=(img_size, img_size, 3)))

print("[INFO] freezing VGG16 layers...")
vgg.trainable = False

flatten = vgg.output
flatten = Flatten()(flatten)

bboxHead = Dense(128, activation="relu")(flatten)
bboxHead = Dense(64, activation="relu")(bboxHead)
bboxHead = Dense(32, activation="relu")(bboxHead)
bboxHead = Dense(4, activation="sigmoid", name="bounding_box")(bboxHead)

model = Model(inputs=vgg.input, outputs=bboxHead)

opt = Adam(learning_rate=config.INIT_LR)
model.compile(loss="mse", optimizer=opt)
print(model.summary())

print("[INFO] training bounding box regressor...")
H = model.fit(trainImages, trainTargets, validation_data=(testImages, testTargets), batch_size=config.BATCH_SIZE, epochs=config.NUM_EPOCHS, verbose=1)

print("[INFO] saving object detector...")
model.save(config.MODEL_PATH, save_format="h5")

print("[INFO] plotting training loss...")
N = np.arange(0, config.NUM_EPOCHS)
plt.style.use("ggplot")
plt.figure()
plt.plot(N, H.history["loss"], label="train_loss")
plt.plot(N, H.history["val_loss"], label="val_loss")
plt.title("Training Loss")
plt.xlabel("Epoch #")
plt.ylabel("Loss")
plt.legend(loc="lower left")
plt.savefig(config.PLOT_PATH)
