```python
def render_recv(resp):
    global prev_frame_time

    fps = 1 / (time.perf_counter() - prev_frame_time)

    prev_frame_time = time.perf_counter()

    for d in resp.docs:
        frame = d.tensor
        # putting the FPS count on the frame
        cv2.putText(
            frame,
            f'FPS {fps:0.0f}',
            (7, 70),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (100, 255, 0),
            3,
            cv2.LINE_AA,
        )

        # displaying the frame with fps
        cv2.imshow('output', frame)
```