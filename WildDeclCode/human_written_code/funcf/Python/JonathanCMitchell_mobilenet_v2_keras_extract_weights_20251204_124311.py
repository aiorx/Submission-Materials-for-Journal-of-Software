```python
def extract_weights(models = []):

    for alpha, rows in models:

        SLIM_CKPT_base_path = get_tf_mobilenet_v2_items(alpha=alpha, rows=rows)

        checkpoint = SLIM_CKPT_base_path + '.ckpt'

        reader = tf.train.NewCheckpointReader(SLIM_CKPT_base_path + '.ckpt')

        # Get checkpoint and then do the rest

        # Obtain expanded keys and not_expanded keys
        tensor_count = 0
        weights_count = 0
        project_count = 0
        expand_count = 0
        depthwise_count = 0
        key_not_exp = 0
        layer_kind_count = {}
        expanded_keys = []
        not_expanded_keys = []
        for key in reader.get_variable_to_shape_map():
            if key.split('/')[-1] == 'ExponentialMovingAverage':
                continue
            if key.split('/')[-1] == 'RMSProp' or key.split('/')[-1] == 'RMPSProp_1':
                continue
            if key == 'global_step':
                continue

            if 'expanded' not in key.split('/')[1]:
                key_not_exp += 1
                not_expanded_keys.append(key)
            else:
                expanded_keys.append(key)

            base = key.split('/')[0]
            block_id = key.split('/')[1]
            layer_kind = key.split('/')[2]
            T = reader.get_tensor(key)

            tensor_count += 1

        # Handle not_expanded keys:
        # add shapes and filter out RMSProp to non expanded keys
        not_expanded_layers = []
        for key in not_expanded_keys:
            if key.split('/')[-1] == 'RMSProp_1':
                continue
            if len(key.split('/')) == 4:
                _, layer, kind, meta = key.split('/')
            elif len(key.split('/')) == 3:
                _, layer, meta = key.split('/')

            if layer == 'Conv':
                block_id = -1
                layer = 'Conv1'
                if meta in ['gamma', 'moving_mean', 'moving_variance', 'beta']:
                    layer = 'bn_Conv1'

            elif layer == 'Conv_1':
                block_id = 17
                if meta in ['gamma', 'moving_mean', 'moving_variance', 'beta']:
                    layer = 'Conv_1_bn'
            elif layer == 'Logits':
                block_id = 19
            else:
                print('something odd encountered')
                continue

            not_expanded_layers.append({
                'key': key,
                'block_id': block_id,
                'layer': layer,
                'mod': '',
                'meta': meta,
                'shape': reader.get_tensor(key).shape,
            })

        # Perform analysis on expanded keys
        expanded_weights_keys = []
        expanded_bn_keys = []
        for key in expanded_keys:
            # if it's length = 5 then it should be a batch norm
            # if it's len = 4 then its a conv
            if len(key.split('/')) == 4:
                #         print('weights keys: ', key)
                T = reader.get_tensor(key)
                expanded_weights_keys.append((key, T.shape))
            elif len(key.split('/')) == 5:
                #         print('batchnorm keys: ', key)
                T = reader.get_tensor(key)
                expanded_bn_keys.append((key, T.shape))
            else:
                # otherwise it's a gamma/RMSProp key
                continue


        print('len of expanded_weights keys: ', len(expanded_weights_keys))
        print('len of expanded_bn_keys: ', len(expanded_bn_keys))


        # Layer will be
        # Block_id = -1 layer => 'Conv' 'bn_Con
```