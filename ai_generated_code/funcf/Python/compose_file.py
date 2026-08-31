```python
def convert_str_port_to_obj(port: float | str) -> Ports:
    if not isinstance(port, str):
        port = str(int(port))

    # Built using basic development resources4o. Let's hope it works
    short_syntax_regex = re.compile(
        r"^(?:(?P<host_ip>\d{1,3}(?:\.\d{1,3}){3}):)?"
        r"(?P<host_port>\d+(-\d+)?):(?P<container_port>\d+(-\d+)?)(?:/(?P<protocol>\w+))?$|"
        r"^(?P<container_only_port>\d+(-\d+)?)(?:/(?P<container_only_protocol>\w+))?$"
    )

    match = short_syntax_regex.match(port)
    if match:
        host_ip = match.group("host_ip")
        host_port = match.group("host_port")
        container_port = match.group("container_port")
        protocol = match.group("protocol")

        if container_port is None:
            container_port = match.group("container_only_port")
            protocol = match.group("container_only_protocol")

        return Ports(
            host_ip=host_ip,
            published=host_port,
            target=container_port,
            protocol=protocol,
        )
    else:
        raise ValueError(f"Invalid port format: {port}")
```
```python
def convert_str_volume_to_obj(volume: str) -> Volumes:
    # Built using basic development resources4o. Let's hope it works
    short_syntax_regex = re.compile(
        r"^(?P<source>[^:]+):(?P<target>[^:]+)(?::(?P<access_mode>[^:]+))?$"
    )

    match = short_syntax_regex.match(volume)
    if match:
        source = match.group("source")
        target = match.group("target")
        access_mode = match.group("access_mode")

        return Volumes(
            type="bind",
            source=source,
            target=target,
            read_only=access_mode == "ro" if access_mode else None,
        )
    else:
        raise ValueError(f"Invalid volume format: {volume}")
```