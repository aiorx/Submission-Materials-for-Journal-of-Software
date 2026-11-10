```python
def visualize_landmarks(image_path, b_box, landmarks, base_path='../data/'):
    import cv2
    import numpy as np
    import os

    img = cv2.imread(os.path.join(base_path, image_path))
    cv2.rectangle(img, (int(b_box[2]), int(b_box[1])),
                  (int(b_box[0]) + int(b_box[2]), int(b_box[1]) + int(b_box[3])), (0, 0, 255), 2)
    landmarks = np.reshape(landmarks, (-1, 2))
    for (x, y) in landmarks:
        cv2.circle(img, (int(x), int(y)), 2, (255, 0, 0), -1)
    cv2.imshow("image", img)
    cv2.waitKey(0)
```