# Penned via standard programming aids


def recover_flag(output):
    # 前8个字符直接复制
    prefix = output[:8]  # NeSE{123

    # 后续部分需要逆推
    processed_part = output[8:]  # w1{1wq84fb<1>49
    original_part = []

    for i, char in enumerate(processed_part):
        if i % 2 == 0:  # 偶数索引，减5
            original_char = chr(ord(char) - 5)
        else:  # 奇数索引，加2
            original_char = chr(ord(char) + 2)
        original_part.append(original_char)

    # 组合前缀和还原部分
    return prefix + "".join(original_part)


# 输出的字符串
output_string = "NeSE{123w1{1wq84fb<1>49}"
# 恢复flag
flag = recover_flag(output_string)
print(flag + "}")
