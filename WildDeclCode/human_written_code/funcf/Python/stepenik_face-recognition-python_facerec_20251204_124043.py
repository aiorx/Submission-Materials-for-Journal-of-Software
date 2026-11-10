```python
def extract_faces_from_frame(frame, haar_cascade, size, im_width, im_height):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    mini = cv2.resize(gray, (int(gray.shape[1] / size), int(gray.shape[0] / size)))
    faces = haar_cascade.detectMultiScale(mini)
    face_resizes = []
    face_coords = []
    for i in range(len(faces)):
        face_i = faces[i]
        (x, y, w, h) = [v * size for v in face_i]
        face = gray[y:y + h, x:x + w]
        face_resize = cv2.resize(face, (im_width, im_height))
        face_resizes.append(face_resize)
        face_coords.append((x, y, w, h))
    return face_resizes, face_coords
```