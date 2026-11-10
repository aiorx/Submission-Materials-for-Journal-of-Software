```python
def save_face_samples(face_detector, vid_cam, face_id=5, max_samples=100):
    count = 0
    while True:
        _, image_frame = vid_cam.read()
        gray = cv2.cvtColor(image_frame, cv2.COLOR_BGR2GRAY)
        faces = face_detector.detectMultiScale(gray, 1.3, 5)
        for (x, y, w, h) in faces:
            cv2.rectangle(image_frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
            count += 1
            cv2.imwrite("dataset/User." + str(face_id) + '.' + str(count) + ".jpg", gray[y:y + h, x:x + w])
            cv2.imshow('frame', image_frame)
        if cv2.waitKey(100) & 0xFF == ord('q'):
            break
        elif count > max_samples:
            break
```