```python
def get_host_ip():
    print("trying to get host ip address ...")
    req = urllib.request.Request(url="https://www.cloudflare.com/cdn-cgi/trace")
    with urllib.request.urlopen(req, timeout=5) as response:
        body = response.read().decode()
        for line in body.split("\n"):
            if line.startswith("ip="):
                _, _ip = line.split("=", maxsplit=2)
                if _ip != "":
                    print("using host ipaddress: {}, if not intended, use --addr option to specify".format(_ip))
                    return _ip
    return ""
```