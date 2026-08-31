```python
def speed_test(input_shape, s_size, num_filter, ctx = mx.gpu(0)):
  input_channels = input_shape[0]
  data = mx.sym.var('data')
  block_list = []
  for block_idx in range(8):
    kernel_size = (_kernel[block_idx], _kernel[block_idx])
    group = _group[block_idx]
    expansion = _e[block_idx]
    stride = (s_size, s_size)
    prefix = "block_%d" % block_idx

    block_out = block_factory(data, input_channels=input_channels,
                        num_filters=num_filter, kernel_size=kernel_size,
                        prefix=prefix, expansion=expansion,
                        group=group, shuffle=False,
                        stride=stride, bn=False)
    # block_out = mx.sym.BatchNorm(data=block_out, fix_gamma=False, eps=2e-5, momentum=0.9)
    if (input_channels == num_filter) and (s_size == 1):
      block_out = block_out + data
    block_out = mx.sym.expand_dims(block_out, axis=1)
    block_list.append(block_out)
  block_list.append(data)
  # print(block_list)

  speed_list = []
  for i, sym in enumerate(block_list):

    mod = mx.mod.Module(symbol=sym, context=[ctx], data_names=['data'], label_names=None)
    mod.bind(data_shapes=[['data', (1, ) + input_shape]], for_training=False)
    mod.init_params(initializer=mx.init.Xavier(rnd_type='gaussian', factor_type="out", magnitude=2), 
                      allow_missing=True, allow_extra=True)

    data = mx.nd.random.normal(shape=(1, ) + input_shape, ctx=ctx)
    _dataiter = mx.io.NDArrayIter(data={'data': data},
                                  batch_size=1)
    tmp_data = _dataiter.next()
    mod.forward(tmp_data)
    mod.get_outputs()[0].asnumpy()
    # tic
    start = time.time()
    for _ in range(times):
      mod.forward(tmp_data)
      y = mod.get_outputs()
      y[0].asnumpy()
    # toe
    end = time.time()
    speed = 1.0 * (end - start) / times * 1000
    speed_list.append(speed)
    msg = "Block %d speed %f" % (i, speed)
    print(msg)
  print(' '.join([str(t) for t in speed_list]))
```