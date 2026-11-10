/**
*
* HashTable.cpp : This is the implementation of the HashTable.
*
* 03/11/24 - Designed via basic programming aids
* 04/11/24 - Modified by Chirayu Jain and Akash Goyal
*/

#include "HashTable.hpp"
#include <iostream>
#include <string>

// Default constructor
HashTable::HashTable() {
    // Initialize the hash table and set numberOfItems to 0
    table = new HashNode*[_HASH_TABLE_SIZE]();
    numberOfItems = 0;
}


// Method to return the hash table array (for verification purposes)
HashNode** HashTable::getTable() {
    return table;
}

// Method to return the size of the hash table
int HashTable::getSize() {
    return _HASH_TABLE_SIZE;
}

// Method to check if the hash table is empty
bool HashTable::isEmpty() {
    return numberOfItems == 0;
}

// Method to get the number of items in the hash table
int HashTable::getNumberOfItems() {
    return numberOfItems;
}

// Method to add a new item to the hash table
bool HashTable::add(int searchKey, HashNode* newItem) {
    int index = searchKey % _HASH_TABLE_SIZE;  // Calculate index directly
    HashNode* current = table[index];

    // Check if the key already exists in the chain
    while (current != nullptr) {
        if (current->key == searchKey) {
            //it means Key already exists, do not add duplicate
            return false;
        }
        current = current->next;
    }

    // Insert the new item at the beginning of the chain
    newItem->next = table[index];
    if (table[index] != nullptr) {
        table[index]->prev = newItem;
    }
    table[index] = newItem;

    numberOfItems++;
    return true;
}

// Method to remove an item from the hash table
bool HashTable::remove(int searchKey) {
    int index = searchKey % _HASH_TABLE_SIZE;  // to Calculate index directly
    HashNode* current = table[index];

    while (current != nullptr) {
        if (current->key == searchKey) {
            // Node found, remove it from the list
            if (current->prev != nullptr) {
                current->prev->next = current->next;
            } else {
                table[index] = current->next; // Update head if it's the first node
            }

            if (current->next != nullptr) {
                current->next->prev = current->prev;
            }

            delete current;
            numberOfItems--;
            return true;
        }
        current = current->next;
    }

    return false; // Key not found
}

// Method to clear all items from the hash table
void HashTable::clear() {
    for (int i = 0; i < _HASH_TABLE_SIZE; ++i) {
        HashNode* current = table[i];
        while (current != nullptr) {
            HashNode* toDelete = current;
            current = current->next;
            delete toDelete;
        }
        table[i] = nullptr;
    }
    numberOfItems = 0;
}

// Method to get an item by its search key
HashNode* HashTable::getItem(int searchKey) {
    int index = searchKey % _HASH_TABLE_SIZE;  // Calculate index directly
    HashNode* current = table[index];

    while (current != nullptr) {
        if (current->key == searchKey) {
            return current; // Item found
        }
        current = current->next;
    }

    return nullptr; // Item not found
}

// Method to check if an item with the given search key exists
bool HashTable::contains(int searchKey) {
    return getItem(searchKey) != nullptr;
}

// Destructor to clean up the hash table
HashTable::~HashTable() {
    clear();           // Clears all items in the hash table to avoid memory leaks
    delete[] table;    // Deletes the hash table array
}