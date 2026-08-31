/**
*
* Node.hpp : This is the header file for Node.
*
* 09/23/24 - Crafted with standard coding tools
* 09/23/24 - Modified by jhui
* 11/07/24 - Modified by jhui
* 12/04/24 - Modified by Mohit Kumar 
*/
#ifndef _BASE_NODE
#define _BASE_NODE

/**
* Node
*
* This struct is the base node to be used in DoublyLinkedList.  There are Linked Lists in the HashTable's buckets needed for 
* collision resolution, as well a Linked List used in the FIFO cache.
*/
struct Node {
    int key;           // Key value associated with the node
    Node* prev;        // Pointer to the previous node in the list
    Node* next;        // Pointer to the next node in the list


        //  Node Constructor
	Node(int keyValue);

	
        //  Node Destructor
	virtual ~Node();
};



#endif

