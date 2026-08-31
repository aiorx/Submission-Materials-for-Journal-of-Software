```python
def _conv(args, output_size, k_size, bias=True, bias_start=0.0, scope=None):
  if args is None or (_is_sequence(args) and not args):
    raise ValueError("`args` must be specified")
  if not _is_sequence(args):
    args = [args]

  # Calculate the total size of arguments on dimension 3.
  # (batch_size x height x width x arg_size)
  total_arg_size = 0
  shapes = [a.get_shape().as_list() for a in args]
  height = shapes[0][1]
  width  = shapes[0][2]
  for shape in shapes:
    if len(shape) != 4:
      raise ValueError("Conv is expecting 3D arguments: %s" % str(shapes))
    if not shape[3]:
      raise ValueError("Conv expects shape[3] of arguments: %s" % str(shapes))
    if shape[1] == height and shape[2] == width:
      total_arg_size += shape[3]
    else:
      raise ValueError("Conv expects arguments with same height and width")

  with vs.variable_scope(scope or "Conv"):
    # Create a convolutional kernel variable
    kernel = vs.get_variable(
        "kernel", [k_size, k_size, total_arg_size, output_size])
    # Concatenate arguments along channel dimension
    if len(args) == 1:
      inputs = args[0]
    else:
      inputs = array_ops.concat(3, args)

    # Apply convolution
    conv = tf.nn.conv2d(inputs, kernel, strides=[1,1,1,1], padding="SAME")

    if not bias:
      return conv

    bias_term = vs.get_variable(
        "bias", [output_size],
        initializer=init_ops.constant_initializer(bias_start))
    return tf.nn.bias_add(conv, bias_term)
```