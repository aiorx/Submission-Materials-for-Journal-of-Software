```python
def get_venderId(shop_id):
    """
    将 `shop_id` 转换为 `venderId`
    :param shop_id:
    :return: bool: 是否成功, str: venderID
    """
    try:
        res = requests.get("https://shop.m.jd.com/?shopId=" + str(shop_id), verify=False)
        _res = re.compile("venderId: '(\\d*)'").findall(res.text)
        if res.status_code == 200 and len(_res):
            return True, re.compile("venderId: '(\\d*)'").findall(res.text)[0]
        else:
            return False, None
    except:
        return False, None
```