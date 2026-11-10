/**
*
* HashTable.cpp : This is the implementation of the HashTable.
*
* 03/11/24 - Designed via basic programming aids
* 04/11/24 - Modified by Chirayu Jain and Akash Goyal
* 11/28/24 - Modified by Chirayu Jain and Akash Goyal
*/

#include "HashTable.hpp"
#include <iostream>
#include <stdexcept>

HashTable::HashTable() : numberOfItems(0) {
    table = new HashNode*[_HASH_TABLE_SIZE];
    for (int i = 0; i < _HASH_TABLE_SIZE; i++) {
        table[i] = nullptr;
    }
}

HashNode** HashTable::getTable() {
    return table;
}

int HashTable::getSize() {
    return _HASH_TABLE_SIZE;
}

bool HashTable::isEmpty() {
    return numberOfItems == 0;
}

int HashTable::getNumberOfItems() {
    return numberOfItems;
}

// bool HashTable::add(int key, HashNode* newNode) {
//     if (!newNode) return false;
    
//     int index = key % _HASH_TABLE_SIZE;
    
//     if (!table[index]) {
//         table[index] = newNode;
//         numberOfItems++;
//         return true;
//     }
    
//     // Handle collision using linear probing
//     int originalIndex = index;
//     do {
//         index = (index + 1) % _HASH_TABLE_SIZE;
//         if (!table[index]) {
//             table[index] = newNode;
//             numberOfItems++;
//             return true;
//         }
//     } while (index != originalIndex);
    
//     return false; // Table is full
// }

bool HashTable::add(int searchKey, HashNode* newItem) {
    int index = searchKey % _HASH_TABLE_SIZE; // Compute bucket index

    if (!table[index]) {
        table[index] = newItem; // Add to empty bucket
        numberOfItems++;
        return true;
    }

    Node* current = table[index]; // Traverse the bucket's linked list
    while (current) {
        if (current->key == searchKey) {
            return false; // Duplicate key not allowed
        }
        if (!current->next) {
            current->next = newItem; // Append new node at the end
            numberOfItems++;
            return true;
        }
        current = current->next;
    }

    return false;
}

bool HashTable::remove(int searchKey) {
    int index = searchKey % _HASH_TABLE_SIZE; // Compute bucket index
    Node* current = table[index];
    Node* prev = nullptr;

    while (current) {
        if (current->key == searchKey) { // Node found
            if (prev) {
                prev->next = current->next; // Update previous node's next pointer
            } else {
                table[index] = static_cast<HashNode*>(current->next); // Update bucket head
            }
            delete current; // Free memory
            numberOfItems--;
            return true;
        }
        prev = current; // Move to next node
        current = current->next;
    }

    return false; // Key not found
}

void HashTable::clear() {
    for (int i = 0; i < _HASH_TABLE_SIZE; i++) {
        Node* current = table[i];
        while (current) {
            Node* temp = current;
            current = current->next; // Move to next node
            delete temp; // Delete current node
        }
        table[i] = nullptr; // Reset bucket to nullptr
    }
    numberOfItems = 0; // Reset item count
}


HashNode* HashTable::getItem(int searchKey) {
    int index = searchKey % _HASH_TABLE_SIZE; // Compute bucket index
    Node* current = table[index];

    while (current) {
        if (current->key == searchKey) { // Node found
            return dynamic_cast<HashNode*>(current); // Cast to HashNode*
        }
        current = current->next;
    }

    return nullptr; // Key not found
}

bool HashTable::contains(int key) {
    return getItem(key) != nullptr;
}