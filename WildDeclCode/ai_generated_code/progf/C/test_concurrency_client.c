//this code is Drafted using common development resources
//makes two login requests at the same time
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <pthread.h>
#include "authentication.h"

#define PORT 1092

void* send_request(void* arg) {
    int client_socket;
    int choice;
    struct sockaddr_in server_addr;
    char buffer[1024] = {0};
    int flag;
    
    char* login_details = (char*)arg;
    char username[1000], password[1000];
    sscanf(login_details, "%d %s %s", &flag, username, password);

    int verified = 0;
    if(flag == 1) {
        verified = authenticateUser(username, password);
    } else {
        verified = authenticateLibrarian(username, password);
    }
    if(!verified) {
        printf("Invalid input\n");
        return NULL;
    }

    // create socket
    if((client_socket = socket(AF_INET, SOCK_STREAM, 0)) == -1) {
        printf("Socket creation failed\n");
        return NULL;
    }

    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(PORT);

    // connect to server
    if(connect(client_socket, (struct sockaddr*)&server_addr, sizeof(server_addr)) == -1) {
        printf("Connection failed\n");
        close(client_socket);
        return NULL;
    }

    // sleep to synchronize the start of requests
    sleep(2);

    while(1) {
        // display menu to the user
        if(flag == 2) {
            printf("1. Add user\n");
            printf("2. Add librarian\n");
            printf("3. Logout\n");
            printf("4. Add book\n");
            printf("6. Delete book\n");
            scanf("%d", &choice);
        } else if(flag == 1) {
            printf("5. Issue book\n");
            scanf("%d", &choice);
        }

        if(send(client_socket, &choice, sizeof(choice), 0) == -1) {
            printf("Send failed\n");
            close(client_socket);
            return NULL;
        }

        char data[2000] = "";
        if(choice == 1 || choice == 2) {
            char new_username[1000], new_password[1000];
            printf("Enter new username: ");
            scanf("%s", new_username);
            printf("Enter new password: ");
            scanf("%s", new_password);
            snprintf(data, sizeof(data), "%s:%s", new_username, new_password);
            send(client_socket, data, sizeof(data), 0);
        } else if(choice == 3) {
            printf("Bye\n");
            break;
        } else if(choice == 4) {
            char bookname[1000], cnt[100];
            printf("Enter book name: ");
            scanf("%s", bookname);
            printf("Enter count: ");
            scanf("%s", cnt);
            snprintf(data, sizeof(data), "%s:%s", bookname, cnt);
            send(client_socket, data, sizeof(data), 0);
        } else if(choice == 5) {
            char bookname[1000];
            printf("Enter book name: ");
            scanf("%s", bookname);
            snprintf(data, sizeof(data), "%s:%s", bookname, username);
            send(client_socket, data, sizeof(data), 0);
        } else if(choice == 6) {
            char bookname[1000];
            printf("Enter book name: ");
            scanf("%s", bookname);
            snprintf(data, sizeof(data), "%s:%s", bookname, username);
            send(client_socket, data, sizeof(data), 0);
        }

        char message[2000] = "";
        recv(client_socket, message, sizeof(message), 0);
        printf("%s\n", message);
    }

    close(client_socket);
    return NULL;
}

int main() {
    char login_details1[1000], login_details2[1000];
    
    // Prepare login details for two clients
    printf("Client 1 - 1.Login as user or 2.Login as librarian, followed by username and password:\n");
    fgets(login_details1, sizeof(login_details1), stdin);

    printf("Client 2 - 1.Login as user or 2.Login as librarian, followed by username and password:\n");
    fgets(login_details2, sizeof(login_details2), stdin);

    pthread_t thread1, thread2;

    pthread_create(&thread1, NULL, send_request, (void*)login_details1);
    pthread_create(&thread2, NULL, send_request, (void*)login_details2);

    pthread_join(thread1, NULL);
    pthread_join(thread2, NULL);

    return 0;
}
