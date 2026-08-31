```cpp
void Core::connect_to_server()
{
	struct addrinfo hints;
	struct addrinfo *result;
	memset(&hints, 0, sizeof(hints));
	hints.ai_family = AF_UNSPEC;
	hints.ai_socktype = SOCK_STREAM;
	hints.ai_protocol = IPPROTO_TCP;
	getaddrinfo(IP, PORT, &hints, &result);
	client_socket = socket(result->ai_family, result->ai_socktype, result->ai_protocol);
	int stat = connect(client_socket, result->ai_addr, (int)result->ai_addrlen);
	while (stat == SOCKET_ERROR) {
		client_socket = socket(result->ai_family, result->ai_socktype, result->ai_protocol);
		stat = connect(client_socket, result->ai_addr, (int)result->ai_addrlen);
		Sleep(1000);
	}
}
```