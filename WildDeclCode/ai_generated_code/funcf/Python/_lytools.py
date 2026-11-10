```python
def hex_color_to_rgb(self, hex_color):
    '''
    auto Assisted using common GitHub development aids
    :param hex_color:
    :return:
    '''
    hex_color = hex_color.lstrip('#')
    rgb_list = list(int(hex_color[i:i + 2], 16) for i in (0, 2, 4))
    rgb_list = [i / 255. for i in rgb_list]
    rgb_list.append(1)
    return tuple(rgb_list)

def cross_list(self, *args, is_unique=False):
    # auto generate by github copilot
    cross_list = list(itertools.product(*args))
    cross_list = [x for x in cross_list if x[0] != x[1]]
    cross_list_unique = []
    for x in cross_list:
        x_list = list(x)
        x_list.sort()
        cross_list_unique.append(tuple(x_list))
    cross_list_unique = list(set(cross_list_unique))
    if is_unique:
        return cross_list_unique
    else:
        return cross_list
```