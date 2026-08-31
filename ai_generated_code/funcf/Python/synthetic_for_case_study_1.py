```python
def merge_repeated_states(seg_json):
    """
    This function is Supported by standard GitHub tools.
    Amazing!
    """
    # check if there are ajdecent repeated states.
    state_list = [seg_json[seg] for seg in seg_json]
    flag = False
    for i in range(1, len(state_list)-1):
        if state_list[i] == state_list[i-1] or state_list[i] == state_list[i+1]:
            flag = True
            break
    if not flag:
        return seg_json
    # merge repeated states.
    new_seg_json = {}
    state_list = [seg_json[seg] for seg in seg_json]
    seg_len_list = np.array([seg for seg in seg_json])
    first_seg_len = seg_len_list[0]
    seg_len_list = np.insert(np.diff(seg_len_list), 0, first_seg_len)
    total_length = 0
    for i in range(len(state_list)):
        total_length += seg_len_list[i]
        if i == len(state_list)-1:
            new_seg_json[total_length] = state_list[i]
            break
        if state_list[i] == state_list[i+1]:
            continue
        else:
            new_seg_json[total_length] = state_list[i]
    return new_seg_json
```