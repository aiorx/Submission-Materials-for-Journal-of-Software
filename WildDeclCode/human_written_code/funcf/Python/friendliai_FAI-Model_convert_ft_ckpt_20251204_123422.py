```python
def merge_ckpt(hidden_units, in_dir, out_dir, filename, factor):
    if (filename.find("args.txt") != -1
        or filename.find("config.ini") != -1
        or filename.find("model.wpe.bin") != -1
        or filename.find("model.wte.bin") != -1
        or filename.find("input_layernorm.weight") != -1
        or filename.find("input_layernorm.bias") != -1
        or filename.find("attention.dense.bias") != -1
        or filename.find("post_attention_layernorm.weight") != -1
        or filename.find("post_attention_layernorm.bias") != -1
        or filename.find("mlp.dense_4h_to_h.bias") != -1
        or filename.find("final_layernorm.weight") != -1
        or filename.find("final_layernorm.bias") != -1):
        
        copyfile(in_dir / filename, out_dir / filename)
        return

    orig_gpu_id = int(filename.split(".")[-2])
    if (orig_gpu_id % factor != 0):
        return

    file_prefix = ".".join(filename.split(".")[:-2])
    merge_files = []
    vals = []
    new_file = f"{out_dir}/{file_prefix}.{orig_gpu_id // factor}.bin"
    for k in range(factor):
        gpu_id = orig_gpu_id + k
        vals.append(np.fromfile(f"{in_dir}/{file_prefix}.{gpu_id}.bin", dtype=np.float16))
        merge_files.append(f"{in_dir}/{file_prefix}.{gpu_id}.bin")

    if filename.find("attention.dense.weight") != -1 or filename.find("mlp.dense_4h_to_h.weight") != -1:
        vals = [val.reshape(-1, hidden_units) for val in vals]
        val = np.concatenate(vals, axis=0)
    elif filename.find("attention.query_key_value.weight") != -1:
        vals = [val.reshape(hidden_units, -1) for val in vals]
        q_vals = [val[:, :hidden_units] for val in vals]
        k_vals = [val[:, hidden_units:2*hidden_units] for val in vals]
        v_vals = [val[:, 2*hidden_units:] for val in vals]
        val = np.concatenate(q_vals, axis=-1)
        val = np.concatenate([val, np.concatenate(k_vals, axis=-1)], axis=-1)
        val = np.concatenate([val, np.concatenate(v_vals, axis=-1)], axis=-1)
    elif filename.find("attention.query_key_value.bias") != -1:
        vals = [val.reshape(3, -1) for val in vals]
        q_vals = [val[0] for val in vals]
        k_vals = [val[1] for val in vals]
        v_vals = [val[2] for val in vals]
        val = np.concatenate(q_vals, axis=-1)
        val = np.concatenate([val, np.concatenate(k_vals, axis=-1)], axis=-1)
        val = np.concatenate([val, np.concatenate(v_vals, axis=-1)], axis=-1)
    elif filename.find("mlp.dense_h_to_4h.weight") != -1:
        vals = [val.reshape(hidden_units, -1) for val in vals]
        val = np.concatenate(vals, axis=-1)
    elif filename.find("mlp.dense_h_to_4h.bias") != -1:
        val = np.concatenate(vals, axis=-1)
    else:
        print(f"[ERROR] cannot find key '{filename}'")
        return

    val.tofile(new_file)
```