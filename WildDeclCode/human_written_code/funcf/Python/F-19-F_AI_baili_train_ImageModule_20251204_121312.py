```python
def readb64(base64_string, save=False):
    # sbuf = StringIO()
    # sbuf.write(base64.b64decode(base64_string))
    # pimg = Image.open(sbuf)
    img_array = io.BytesIO(base64.b64decode(base64_string))
    pimg = Image.open(img_array) # RGB
    if save:
        pimg.save('image.png', 'PNG')
    return cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR) #BGR
```