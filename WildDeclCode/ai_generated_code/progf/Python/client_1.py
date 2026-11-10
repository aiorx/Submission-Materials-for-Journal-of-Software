"""
    Client
    ------
    A simple client that connects to a server and sends/receives messages. Client start by sending its name to the
    server. Then, it receives messages from the server and prints them to the console. After 5 seconds, it sends
    "exit" to the server and disconnects from the server.

    - All descriptions and comments Formed using common development resources and GitHub Copilot
"""

import socket
import threading
import time

class Client:
    def __init__(self, host: str, port: int):
        """
            Constructor
        """
        self.host = host
        self.port = port
        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def receive_messages(self):
        """
            Receives messages from the server.
        """
        while True:
            try:
                # Receive the message from the server.
                message = self.client_socket.recv(1024).decode()
                print(message)
            except:
                break

    def start(self):
        """
            Starts the client.
        """

        # Connect to the server and send the name.
        client_name = input("[from client] Please enter your name: ")
        self.client_socket.connect((self.host, self.port))

        # Send the client name to the server.
        self.client_socket.send(client_name.encode())

        # Create a thread for receiving messages from the server.
        receive_thread = threading.Thread(target=self.receive_messages)
        receive_thread.start()

        try:
            # Wait for 5 seconds then send "exit" to the server.
            time.sleep(5)
            print("[from client] Disconnecting from the server...")
            self.client_socket.send("exit".encode())
        except KeyboardInterrupt:
            # If CTRL+C is pressed, shutdown the client.
            self.client_socket.send("exit".encode())
            print("[from client] Disconnecting from the server...")
        finally:
            # Close the client socket.
            self.client_socket.close()


if __name__ == "__main__":
    client = Client("127.0.0.1", 12345)
    client.start()

"""
    Output(of user1):
    -------
    [from client] Please enter your name: user1
    [from server] Welcome, user1!
    
    // After client.py is run parallel and user2 enter his name
    [from server] Welcome, user2!
    
    // After 5 seconds from user1's connection
    [from client] Disconnecting from the server...
    
    Output(of user2):
    -------
    [from client] Please enter your name: user2
    [from server] Welcome, user2!
    
    // While client.py running parallel and user1 is disconnected
    [from server] ('127.0.0.1', 58564) has left the server.
    
    // After 5 seconds from user2's connection
    [from client] Disconnecting from the server...
    
"""
