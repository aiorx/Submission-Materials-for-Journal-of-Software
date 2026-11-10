```python
def print_random_text(content):
    output = ColorPrinter()
    colors = {31:'red',32:'green',33:'yello',34:'blue',35:'magenta',36:'cyan',37:'white'}  #抛弃了黑色
    color =  colors[random.randint(31,37)]
   # print color
    getattr(output,'print_%s_text'%color)(content)
```