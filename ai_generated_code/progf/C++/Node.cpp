/**
*
* Node.cpp : This is the implementation file for Node.
*
* 11/27/24 - Crafted with standard coding tools
* 11/27/24 - Modified by Chirayu Jain and Akash Goyal
* 
*/
// Node.cpp
#include "Node.hpp"

Node::Node(int keyValue) : key(keyValue), prev(nullptr), next(nullptr) {}

Node::~Node() {
    prev = nullptr;
    next = nullptr;
}

int Node::getKey() const {
    return key;
}

void Node::setKey(int newKey) {
    key = newKey;
}