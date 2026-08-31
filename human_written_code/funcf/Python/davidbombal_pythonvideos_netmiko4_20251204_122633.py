```python
def send_config_to_devices(devices, config_file):
    with open(config_file) as f:
        lines = f.read().splitlines()
    print(lines)

    for device in devices:
        net_connect = ConnectHandler(**device)
        output = net_connect.send_config_set(lines)
        print(output)
```