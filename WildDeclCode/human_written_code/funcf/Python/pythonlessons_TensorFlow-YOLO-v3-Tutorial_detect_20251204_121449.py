```python
def main(type, iou_threshold, confidence_threshold, input_names):
    global detection_result
    class_names = load_class_names(_CLASS_NAMES_FILE)
    n_classes = len(class_names)

    model = Yolo_v3(n_classes=n_classes, model_size=_MODEL_SIZE,
                    max_output_size=_MAX_OUTPUT_SIZE,
                    iou_threshold=iou_threshold,
                    confidence_threshold=confidence_threshold)

    if type == 'images':
        #batch_size = len(input_names)
        batch = load_images(input_names, model_size=_MODEL_SIZE)
        inputs = tf.placeholder(tf.float32, [1, *_MODEL_SIZE, 3])
        detections = model(inputs, training=False)
        saver = tf.train.Saver(tf.global_variables(scope='yolo_v3_model'))

        with tf.Session() as sess:
            saver.restore(sess, './weights/model.ckpt')
            detection_result = sess.run(detections, feed_dict={inputs: batch})

        #detection_result = detection_result[0]
        print("detection_result", detection_result)
        draw_boxes(input_names, detection_result, class_names, _MODEL_SIZE)

        print('Detections have been saved successfully.')

    elif type == 'video':
        inputs = tf.placeholder(tf.float32, [1, *_MODEL_SIZE, 3])
        detections = model(inputs, training=False)
        saver = tf.train.Saver(tf.global_variables(scope='yolo_v3_model'))

        with tf.Session() as sess:
            saver.restore(sess, './weights/model.ckpt')

            win_name = 'Video detection'
            cv2.namedWindow(win_name)
            cap = cv2.VideoCapture(input_names[0])
            frame_size = (cap.get(cv2.CAP_PROP_FRAME_WIDTH),
                          cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fourcc = cv2.VideoWriter_fourcc(*'X264')
            fps = cap.get(cv2.CAP_PROP_FPS)
            out = cv2.VideoWriter('./detections/detections.mp4', fourcc, fps,
                                  (int(frame_size[0]), int(frame_size[1])))

            try:
                while True:
                    ret, frame = cap.read()
                    if not ret:
                        break
                    resized_frame = cv2.resize(frame, dsize=_MODEL_SIZE[::-1],
                                               interpolation=cv2.INTER_NEAREST)
                    detection_result = sess.run(detections,
                                                feed_dict={inputs: [resized_frame]})

                    draw_frame(frame, frame_size, detection_result,
                               class_names, _MODEL_SIZE)

                    cv2.imshow(win_name, frame)

                    key = cv2.waitKey(1) & 0xFF

                    if key == ord('q'):
                        break

                    out.write(frame)
            finally:
                cv2.destroyAllWindows()
                cap.release()
                print('Detections have been saved successfully.')

    else:
        raise ValueError("Inappropriate data type. Please choose either 'video' or 'images'.")
```