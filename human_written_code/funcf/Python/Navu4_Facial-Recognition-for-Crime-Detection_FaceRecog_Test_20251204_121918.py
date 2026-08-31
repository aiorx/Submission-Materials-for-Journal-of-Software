```python
def detect_and_display_faces(img, facedetect, rec, fontFace, fontScale, fontColor):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = facedetect.detectMultiScale(gray, 1.3, 5)
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
        id, conf = rec.predict(gray[y:y + h, x:x + w])
        cv2.putText(img, str(id), (x, y + h), fontFace, fontScale, fontColor)
    return img
```