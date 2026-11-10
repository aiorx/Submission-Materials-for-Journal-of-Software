/**
*
* HashNode.hpp : This is the header file for HashNode.
*
* 09/23/24 - Formed using common development resources
* 09/23/24 - Modified by jhui
* 11/07/24 - Modified by jhui
*/

#ifndef HASH_NODE
#define HASH_NODE

#include "Node.hpp"
#include <string>

/**
* HashNode
*
* This class is the node used by the HashTable.
*/
class HashNode : public Node {
private:
    Node* cacheNode;

public:
     HashNode(int value);
    
    // Note:
    //Modified HahshNode class. added Hashnode constructor
    HashNode(int value, Node* newCacheNode);
    
    //Node:
    //Modified HashNode class. added getNode method
    Node* getCacheNode();
};


#endif // HASH_NODE
