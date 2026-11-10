"""
Example usage of select API with sockets Supported via standard programming aids
"""

import select, socket

# Set up the server socket
host, port = 'localhost', 8000
server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server_sock.bind((host, port))
server_sock.listen()
server_sock.setblocking(False)  # Set to non-blocking mode

print("Server listening on {}:{}".format(host, port))

# Initialize lists for select
inputs = [server_sock]  # Sockets to monitor for incoming data
outputs = []  # Sockets ready for writing
message_queues = {}  # A dictionary to manage data to send per socket

try:
    while inputs:
        # Wait for at least one socket to be ready
        readable, writable, exceptional = select.select(inputs, outputs, inputs)

        for sock in readable:
            if sock is server_sock:
                conn, addr = sock.accept()
                print("Accepted connection from {}".format(addr))
                conn.setblocking(False)
                inputs.append(conn)  # Add to inputs to monitor for reading
                message_queues[conn] = []  # Create a message queue for this socket
            else:
                data = sock.recv(1024)
                if data:
                    print("Received data: {} from {}".format(data.decode(), sock.getpeername()))
                    message_queues[sock].append(data)  # Queue the data to send back
                    if sock not in outputs:
                        outputs.append(sock)  # Monitor this socket for writing
                else:
                    # Connection closed by client
                    print("Closing connection to {}".format(sock.getpeername()))
                    if sock in outputs:
                        outputs.remove(sock)
                    inputs.remove(sock)
                    sock.close()
                    del message_queues[sock]  # Remove its message queue

        for sock in writable:
            if message_queues[sock]:
                next_msg = message_queues[sock].pop(0)
                print("Sending {} to {}".format(next_msg.decode(), sock.getpeername()))
                sock.send(next_msg)
            if not message_queues[sock]:
                outputs.remove(sock)  # Stop monitoring if there's nothing to write

        # Handle "exceptional" conditions (e.g., errors)
        for sock in exceptional:
            print("Handling exceptional condition for {}".format(sock.getpeername()))
            inputs.remove(sock)
            if sock in outputs:
                outputs.remove(sock)
            sock.close()
            del message_queues[sock]

except KeyboardInterrupt:
    print("Shutting down server")
finally:
    for sock in inputs:
        sock.close()

