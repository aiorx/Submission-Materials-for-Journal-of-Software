"""
    Server
    ------
    This module represents a TCP server. It can handle multiple clients at the same time. It uses threads for handling
    the clients. It also broadcasts the messages to all clients except the sender client. It also handles the
    disconnection of the clients. If a client disconnects from the server, it removes the client from the list and
    broadcasts a message to all clients.

    - All descriptions and comments Designed via basic programming aids and GitHub Copilot
"""

import socket
import threading

class Server:
    """
        This class represents a TCP server.
    """

    def __init__(self, host: str, port: int):
        """
            Constructor
        """
        self.host = host
        self.port = port
        self.clients = []
        self.__server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        # This line is for reusing the same socket even if it is closed.
        self.__server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

        # Bind the socket to the host and port.
        self.__server_socket.bind((self.host, self.port))

    def start(self):
        """
            Starts the server.
        """

        # Listen for connections.
        self.__server_socket.listen(5)
        print(f"[from server] Server is listening on {self.host}:{self.port}")
        try:
            while True:
                # Accept the connection from the client.
                client_socket, client_address = self.__server_socket.accept()
                self.clients.append(client_socket)

                # Create a thread for the client.
                threading.Thread(target=self.handle_client, args=(client_socket, client_address)).start()
        except KeyboardInterrupt:
            print("[from server] Server is shutting down...")

            # Send a message to all clients and close the server socket.
            for client_socket in self.clients:
                client_socket.send("[from server] Server is shutting down. Goodbye!".encode())
                client_socket.close()

            self.__server_socket.close()

    def handle_client(self, client_socket: socket.socket, client_address: tuple):
        """
            Handles the client.
        """

        try:
            # Receive the client name.
            client_name = client_socket.recv(1024).decode()
            self.broadcast(f"[from server] Welcome, {client_name}!")
            print(f"[from server] {client_name} ({client_address}) has joined the server.")
            while True:
                # Receive the message from the client.
                message = client_socket.recv(1024).decode()

                # If the message is "exit", remove the client from the list and break the loop.
                if message.lower() == "exit" or not message:
                    self.remove_client(client_socket)
                    break
                else:
                    # Broadcast the message to all clients.
                    self.broadcast(f"{client_name}: {message}", client_socket)
        except:
            # If there is an error while receiving the message from the client, remove the client from the list.
            self.remove_client(client_socket)

    def broadcast(self, message: str, sender_client: socket.socket = None):
        """
            Broadcasts the message to all clients except the sender client.
        """
        for client_socket in self.clients:
            # Do not send the message to the sender client.
            if client_socket != sender_client:
                try:
                    client_socket.send(message.encode())
                except:
                    # If there is an error while sending the message to a client, remove the client from the list.
                    self.remove_client(client_socket)

    def remove_client(self, client_socket: socket.socket):
        """
            Removes the client from the list.
        """
        if client_socket in self.clients:
            client_name = client_socket.getpeername()
            self.clients.remove(client_socket)
            self.broadcast(f"[from server] {client_name} has left the server.")
            print(f"[from server] {client_name} has left the server.")
            client_socket.close()


if __name__ == "__main__":
    server = Server("127.0.0.1", 12345)
    server.start()

"""
    Output:
    ------
    [from server] Server is listening on 127.0.0.1:12345
    [from server] user1 (('127.0.0.1', 58564)) has joined the server.
    [from server] user2 (('127.0.0.1', 58566)) has joined the server.
    
    // After 5 seconds from the user1's connection and sending a message
    [from server] ('127.0.0.1', 58564) has left the server.
    
    // After 5 seconds from the user2's connection and sending a message
    [from server] ('127.0.0.1', 58566) has left the server.
    
"""