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
```