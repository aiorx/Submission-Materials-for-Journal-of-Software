#include "Communication.h"

#define IP_LENGTH 16

/*
 * -- Copied Derived using common development resources --
 * The following function prints out the IP address of the user, regardless 
 * of whether the connection is wired or wireless.
 * Input: None.
 * Output: A boolean value indicating whether or not the printing was successfull.
 */
static bool 
print_ip() {
    PIP_ADAPTER_INFO adapter_info, adapter = NULL;
    DWORD buffer_length = sizeof(IP_ADAPTER_INFO);
    bool is_wireless = false;
    char ip_address[IP_LENGTH] = "";

    adapter_info = (IP_ADAPTER_INFO*)malloc(buffer_length);
    if (!adapter_info) {
        PRINT_ERROR("Memory allocation failed\n");
        return false;
    }

    if (GetAdaptersInfo(adapter_info, &buffer_length) == R_ERROR_BUFFER_OVERFLOW) {
        free(adapter_info);
        adapter_info = (IP_ADAPTER_INFO*)malloc(buffer_length);
        if (!adapter_info) {
            PRINT_ERROR("Memory allocation failed\n");
            return false;
        }
    }

    if (GetAdaptersInfo(adapter_info, &buffer_length) == R_NO_ERROR) {
        adapter = adapter_info;
        while (adapter) {
            if (adapter->IpAddressList.IpAddress.String[0] != '\0') { // Ensure IP exists
                if (strstr(adapter->Description, "Wireless") != NULL) {
                    is_wireless = true;
                    strncpy(ip_address, adapter->IpAddressList.IpAddress.String, sizeof(ip_address));
                    break; 
                } else if (!is_wireless && ip_address[0] == '\0')
                    strncpy(ip_address, adapter->IpAddressList.IpAddress.String, sizeof(ip_address));
            }
            adapter = adapter->Next;
        }
    } else {
        PRINT_ERROR("GetAdaptersInfo failed\n");
        free(adapter_info);
        return false;
    }

    if (ip_address[0] != '\0')
        printf("%s\n", ip_address);
    else {
        PRINT_ERROR("No active network adapter found\n");
        free(adapter_info);
        return false;
    }

    free(adapter_info);
    return true;
}

bool 
accept_partner(SOCKET* p_socket) {
    SOCKET server_socket;
    struct sockaddr_in server_address, client_address;
    int address_length = sizeof(client_address);

    // Creating an accepting socket
    server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket == INVALID_SOCKET) {
        PRINT_ERROR("Socket creation failed");
        goto accepting_failure;
    }

    // Configuring server address
    server_address.sin_family = AF_INET;
    server_address.sin_addr.s_addr = INADDR_ANY;
    server_address.sin_port = htons(PORT);

    // Bind the socket
    if (bind(server_socket, (struct sockaddr*)&server_address, sizeof(server_address)) == SOCKET_ERROR) {
        PRINT_ERROR("Socket binding failed");
        closesocket(server_socket);
        goto accepting_failure;
    }

    // Displaying server's IP:
    CLEAR_TERMINAL;
    printf("%sTell your friend your IP:%s ", GREEN, RESET);
    if (!print_ip())
        return false;

    //Making the socket listen
    if (listen(server_socket, 1) == SOCKET_ERROR) {
        PRINT_ERROR("Socket listening failed");
        closesocket(server_socket);
        goto accepting_failure;
    }

    // Accepting the client 
    *p_socket = accept(server_socket, (struct sockaddr*)&client_address, &address_length);
    if (*p_socket == INVALID_SOCKET) {
        PRINT_ERROR("Client accepting failed");
        closesocket(server_socket);
        goto accepting_failure;
    }

    printf("Partner connected!\n");
    return true;

accepting_failure:
    WSACleanup();
    return false;
}

bool
connect_to_partner(SOCKET* p_socket) {
    struct sockaddr_in server_address;
    char address[IP_LENGTH];

    // Asking the user for IP
    CLEAR_TERMINAL;
    printf("Enter partner's IP: ");
    fgets(address, IP_LENGTH, stdin);
    address[strcspn(address, "\n")] = '\0';

    // Creating socket
    *p_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (*p_socket == INVALID_SOCKET) {
        PRINT_ERROR("Socket creation failed");
        goto connecting_failure;
    }

    // Configuring server address
    server_address.sin_family = AF_INET;
    server_address.sin_port = htons(PORT);
    server_address.sin_addr.s_addr = inet_addr(address);

    // Connecting to partner
    if (connect(*p_socket, (struct sockaddr*)&server_address, sizeof(server_address)) == SOCKET_ERROR) {
        PRINT_ERROR("Connection attempt to partner failed");
        closesocket(*p_socket);
        goto connecting_failure;
    }
    
    return true;

connecting_failure:
    WSACleanup();
    return false;
}
