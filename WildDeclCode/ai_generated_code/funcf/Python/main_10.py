```python
def wait_for_packet(self, client_socket, expected_header):
    max_attempts = 50 
    sleep_interval = 0.05

    for attempt in range(1, max_attempts + 1):
        try:
            data = client_socket.recv(1024) 
            #data = data[:3] + data[7:]
            if data:
                received_packet = Packet() 
                received_packet.digest_data(data)
                if received_packet.header == expected_header:
                    return received_packet
        except socket.timeout:

            pass  # Continue the loop if a timeout occurs

        # Wait for a short interval before the next attempt
        time.sleep(sleep_interval)

    return None
```