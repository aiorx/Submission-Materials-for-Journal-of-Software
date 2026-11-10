```python
# 预处理图片
def paa(file):
    img = Image.open(file).convert('L') # 读取图片并灰度化

    img = img.crop((2, 1, 66, 22)) # 裁掉边变成 64x21

    # 分离数字
    img1 = img.crop((0, 0, 16, 21))
    img2 = img.crop((16, 0, 32, 21))
    img3 = img.crop((32, 0, 48, 21))
    img4 = img.crop((48, 0, 64, 21))

    img1 = np.array(img1).flatten() # 扁平化，把二维弄成一维度
    img1 = list(map(lambda x: 1 if x <= 180 else 0, img1)) # 二值化
    img2 = np.array(img2).flatten()
    img2 = list(map(lambda x: 1 if x <= 180 else 0, img2))
    img3 = np.array(img3).flatten()
    img3 = list(map(lambda x: 1 if x <= 180 else 0, img3))
    img4 = np.array(img4).flatten()
    img4 = list(map(lambda x: 1 if x <= 180 else 0, img4))

    return (img1, img2, img3, img4)
```