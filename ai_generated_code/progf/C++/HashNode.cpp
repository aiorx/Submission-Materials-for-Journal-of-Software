/**
*
* HashNode.cpp : This is the implementation file for Hash Node.
*
* 11/27/24 - Formed using common development resources
* 11/27/24 - Modified by Chirayu Jain and Akash Goyal
* 
*/

#include "HashNode.hpp"

HashNode::HashNode(int value) : Node(value), cacheNode(nullptr) {}

Node* HashNode::getCacheNode() const {
    return cacheNode;
}

void HashNode::setCacheNode(Node* node) {
    cacheNode = node;
}