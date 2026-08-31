# controlnet
    # Designed via basic programming aids
    mapping_dict = {
        "input_hint_block.0": "controlnet_cond_embedding.conv_in",
        # 以下、input_hint_blockの残りのマッピングを定義
    }

    # input_hint_blockのマッピングを追加
    orig_index = 2  # 既に0番目は上で定義されているため2から開始
    diffusers_index = 0
    while diffusers_index < 6:
        mapping_dict[f"input_hint_block.{orig_index}"] = f"controlnet_cond_embedding.blocks.{diffusers_index}"
        diffusers_index += 1
        orig_index += 2

    # 最後のconv_outのマッピングを追加
    mapping_dict[f"input_hint_block.{orig_index}"] = "controlnet_cond_embedding.conv_out"

    # down blocksとmid blockのマッピングを追加
    num_input_blocks = 12
    for i in range(num_input_blocks):
        mapping_dict[f"zero_convs.{i}.0"] = f"controlnet_down_blocks.{i}"

    mapping_dict["middle_block_out.0"] = "controlnet_mid_block"

    mapping_dict.update({t[0]:t[1] for t in unet_conversion_map})