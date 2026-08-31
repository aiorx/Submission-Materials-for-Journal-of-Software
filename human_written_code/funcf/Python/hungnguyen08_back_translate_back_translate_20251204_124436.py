```python
if __name__ == '__main__':
  tf.logging.set_verbosity(tf.logging.INFO)

  # Set up some decoding flags depending on the input text language.
  if FLAGS.lang == 'vi':
    from_data_dir, to_data_dir = FLAGS.vien_data_dir, FLAGS.envi_data_dir
    from_problem, to_problem = FLAGS.vien_problem, FLAGS.envi_problem
    from_ckpt, to_ckpt = FLAGS.vien_ckpt, FLAGS.envi_ckpt
    proxy_lang = 'en'
  elif FLAGS.lang == 'en':
    from_data_dir, to_data_dir = FLAGS.envi_data_dir, FLAGS.vien_data_dir
    from_problem, to_problem = FLAGS.envi_problem, FLAGS.vien_problem
    from_ckpt, to_ckpt = FLAGS.envi_ckpt, FLAGS.vien_ckpt
    proxy_lang = 'vi'
  else:
    raise ValueError('Not supported language: {}'.format(lang))

  # Convert directory into checkpoints
  if tf.gfile.IsDirectory(from_ckpt):
    from_ckpt = tf.train.latest_checkpoint(from_ckpt)
  if tf.gfile.IsDirectory(to_ckpt):
    to_ckpt = tf.train.latest_checkpoint(to_ckpt)

  # For back translation, we need a temporary file in the other language
  # before back-translating into the source language.
  tmp_file = os.path.join(
      '{}.tmp.{}.txt'.format(FLAGS.paraphrase_from_file, proxy_lang)
  )

  # Step 1: Translating from source language to the other language.
  if not tf.gfile.Exists(tmp_file):
    decoding.t2t_decoder(from_problem, from_data_dir,
                         FLAGS.paraphrase_from_file, tmp_file,
                         from_ckpt)

  # Step 2: Translating from the other language (tmp_file) to source.
  decoding.t2t_decoder(to_problem, to_data_dir,
                       tmp_file, FLAGS.paraphrase_to_file,
                       to_ckpt)
```