```python
def serverJ(title, content):
    """server酱服务"""
    sckey = SCKEY
    if "SCKEY" in os.environ:
        """
        判断是否运行自GitHub action,"SCKEY" 该参数与 repo里的Secrets的名称保持一致
        """
        sckey = os.environ["SCKEY"]

    if not sckey:
        print("server酱服务的SCKEY未设置!!\n取消推送")
        return
    print("serverJ服务启动")
    data = {
        "text": title,
        "desp": content
    }
    response = requests.post(f"https://sc.ftqq.com/{sckey}.send", data=data)
    print(response.text)
```