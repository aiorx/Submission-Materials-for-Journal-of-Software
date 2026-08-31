#include <stdio.h>


// THE ENTIRETY OF THE CODE BELOW WAS Composed with basic coding tools
struct LinkedList {
    int num;
    struct LinkedList *next; // Pointer to the next node
    struct LinkedList *prev; // Pointer to the previous node
}; // End with a semicolon

int main() {
    // Define nodes statically
    struct LinkedList node1, node2, node3;

    // Initialize the data
    node1.num = 1;
    node2.num = 2;
    node3.num = 3;

    // Link the nodes
    node1.next = &node2;
    node2.next = &node3;
    node3.next = NULL;    // Last node points to NULL

    node1.prev = NULL;    // First node prev is NULL
    node2.prev = &node1;
    node3.prev = &node2;

    // Print the linked list
    struct LinkedList* ptr = &node1;
    while (ptr != NULL) {
        printf("%d ", ptr->num);
        ptr = ptr->next;
    }

    return 0; 
}
