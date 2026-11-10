/**
 * DoublyLinkedList.cpp : This is the file with DoublyLinkedList class, and also the methods like: 
 * insert at head, insert at tail, findNode, deleteNode, moveToHead, moveToTail, deleteHeadNode, 
 * deleteTailNode, and deleteList.
 *
 * 11/01/24 - Designed via basic programming aids
 * 11/01/24 - Modified by Chirayu Jain
 * 12/01/24 - Modified by Chirayu Jain and Akash Goyal
 */

#include "DoublyLinkedList.hpp"
#include <memory>

DoublyLinkedList::DoublyLinkedList() : head(nullptr), tail(nullptr) {}

void DoublyLinkedList::insertAtHead(Node* newNode) {
    if (!newNode) return;
    
    newNode->prev = nullptr;
    newNode->next = head;
    
    if (head) {
        head->prev = newNode;
    } else {
        tail = newNode;
    }
    head = newNode;
}

void DoublyLinkedList::insertAtTail(Node* newNode) {
    if (!newNode) return;
    
    newNode->next = nullptr;
    newNode->prev = tail;
    
    if (tail) {
        tail->next = newNode;
    } else {
        head = newNode;
    }
    tail = newNode;
}

Node* DoublyLinkedList::findNode(int value) {
    Node* current = head;
    while (current) {
        if (current->getKey() == value) {
            return current;
        }
        current = current->next;
    }
    return nullptr;
}

void DoublyLinkedList::deleteNode(Node* existingNode) {
    if (!existingNode) return;
    
    if (existingNode->prev) {
        existingNode->prev->next = existingNode->next;
    } else {
        head = existingNode->next;
    }
    
    if (existingNode->next) {
        existingNode->next->prev = existingNode->prev;
    } else {
        tail = existingNode->prev;
    }
    
    delete existingNode;
}

void DoublyLinkedList::moveToHead(Node* existingNode) {
    if (!existingNode || existingNode == head) return;
    
    if (existingNode == tail) {
        tail = existingNode->prev;
        tail->next = nullptr;
    } else {
        existingNode->prev->next = existingNode->next;
        existingNode->next->prev = existingNode->prev;
    }
    
    existingNode->prev = nullptr;
    existingNode->next = head;
    head->prev = existingNode;
    head = existingNode;
}

void DoublyLinkedList::moveToTail(Node* existingNode) {
    if (!existingNode || existingNode == tail) return;
    
    if (existingNode == head) {
        head = existingNode->next;
        head->prev = nullptr;
    } else {
        existingNode->prev->next = existingNode->next;
        existingNode->next->prev = existingNode->prev;
    }
    
    existingNode->next = nullptr;
    existingNode->prev = tail;
    tail->next = existingNode;
    tail = existingNode;
}

void DoublyLinkedList::deleteHeadNode() {
    if (!head) return;
    
    Node* temp = head;
    head = head->next;
    
    if (head) {
        head->prev = nullptr;
    } else {
        tail = nullptr;
    }
    
    delete temp;
}

void DoublyLinkedList::deleteTailNode() {
    if (!tail) return;
    
    Node* temp = tail;
    tail = tail->prev;
    
    if (tail) {
        tail->next = nullptr;
    } else {
        head = nullptr;
    }
    
    delete temp;
}

void DoublyLinkedList::deleteList() {
    while (head) {
        deleteHeadNode();
    }
}

Node* DoublyLinkedList::getHead() {
    return head;
}