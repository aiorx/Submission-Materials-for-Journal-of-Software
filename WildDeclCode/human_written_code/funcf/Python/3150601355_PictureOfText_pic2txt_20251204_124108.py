```python
try:
    import pillow
except :
    import os
    os.system('pip install pillow  -i https://pypi.mirrors.ustc.edu.cn/simple/')
    from PIL import Image, ImageDraw, ImageFont 
```