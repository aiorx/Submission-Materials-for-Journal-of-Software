```python
def countdown(data):
    """
    定时任务,和爬取网站基本同步更新数据
    :param data:
    :return:
    """
    a2 = data['free']['next_update_date']
    now = datetime.now()
    # 把时间转换成%Y-%m-%dT%H:%M:%S.%fZ格式
    a1 = now.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
    # 把时间转换成%Y-%m-%dT%H:%M:%S.%fZ格式
    a1 = datetime.strptime(a1, "%Y-%m-%dT%H:%M:%S.%fZ")
    a2 = datetime.strptime(a2, "%Y-%m-%dT%H:%M:%S.%fZ")
    # 修改 a2增加8小时，a2时间慢了8小时
    a2 = a2 + timedelta(hours=8)
    # 计算时间差
    cc = a2 - a1
    # 把分钟转换成秒，比爬取网站更新慢一秒
    cc = cc.seconds + 1
    # print("等待时间", cc)
    time.sleep(cc)
```