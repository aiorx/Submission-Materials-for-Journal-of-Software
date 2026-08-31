```python
def get_ssl_socket(sock, server_hostname=None, context=g_context):
    ssl_sock = SSLConnection(context, sock)
    if server_hostname:
        ssl_sock.set_tlsext_host_name(server_hostname)
    return ssl_sock
```