/**
*
* hash_node.cpp : This implementation file contains the methods declared in the hash_node.h file.
*
* 09/23/24 - Crafted with standard coding tools
* 10/17/24 - Modified by jhui
* 01/11/25 - Modified by hhui; 1) 1) added calculateHashCode, 2) modified methods to include hash table size parameter
*/


#include "hash_node.h"
#include "dll_node.h"

// Define a class for the hash tabl
HashNode::HashNode(int myKeyValue, DllNode* myFifoNode) {
	key = myKeyValue;
	fifoNode = myFifoNode;
}

DllNode* HashNode::getFifoNode() {
	return fifoNode;
}
