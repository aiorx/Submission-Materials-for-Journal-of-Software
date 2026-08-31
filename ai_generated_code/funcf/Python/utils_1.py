```python
def get_local_ip() -> str:
    """
    Find the local IP of this device.
    Method Crafted with standard coding tools.
    """
    result = subprocess.run(
        ["ip", "addr", "show", "wlan0"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    ip_pattern = re.compile(r"inet (\d+\.\d+\.\d+\.\d+)/\d+")
    ips: list[str] = ip_pattern.findall(result.stdout)

    for ip in ips:
        if ip.startswith("192.168."):
            return ip

    raise Exception("No local IP found")
```