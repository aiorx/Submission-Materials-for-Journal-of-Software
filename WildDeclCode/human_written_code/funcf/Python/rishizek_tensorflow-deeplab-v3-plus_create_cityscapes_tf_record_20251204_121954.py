```python
def _create_tf_record(images, labels, output_path):
    writer = tf.python_io.TFRecordWriter(output_path)
    for idx, image in enumerate(images):
        if idx % 100 == 0:
            tf.logging.info('On image %d of %d', idx, len(images))
        tf_example = create_tf_example(
            image, labels[idx], is_jpeg=False)
        writer.write(tf_example.SerializeToString())
    writer.close()
    tf.logging.info('Finished writing!')
```