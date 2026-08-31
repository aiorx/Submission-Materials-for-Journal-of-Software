```python
elif user_input.startswith('kick'):
    _, client_id = user_input.split()
    try:
        client_id = int(client_id)
    except:
        print(f"client_id {client_id} that was entered is not a valid integer")
    client_found = False
    for sock, client in self.connected_clients.items():
        if client.client_id == client_id:
            client_found = True
            client.close_connection()
            try:
                self.connected_clients.pop(sock)
            except KeyError:
                pass
            break
    if not client_found:
        input(f"Client {client_id} was not found. (press enter to continue)")
```