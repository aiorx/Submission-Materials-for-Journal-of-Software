/**
*
* HashTable.cpp : This is the implementation of the HashTable.
*
* 03/11/24 - Designed via basic programming aids
* 04/11/24 - Modified by Chirayu Jain and Akash Goyal
* 11/28/24 - Modified by Chirayu Jain and Akash Goyal
*/

#include "HashTable.hpp"
#include <memory>

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

bool HashTable::add(int key, HashNode* newNode) {
    if (!newNode) return false;
    
    int index = key % _HASH_TABLE_SIZE;
    
    if (!table[index]) {
        table[index] = newNode;
        numberOfItems++;
        return true;
    }
    
    // Handle collision using linear probing
    int originalIndex = index;
    do {
        index = (index + 1) % _HASH_TABLE_SIZE;
        if (!table[index]) {
            table[index] = newNode;
            numberOfItems++;
            return true;
        }
    } while (index != originalIndex);
    
    return false; // Table is full
}

bool HashTable::remove(int key) {
    int index = key % _HASH_TABLE_SIZE;
    int originalIndex = index;
    
    do {
        if (table[index] && table[index]->getKey() == key) {
            delete table[index];
            table[index] = nullptr;
            numberOfItems--;
            return true;
        }
        index = (index + 1) % _HASH_TABLE_SIZE;
    } while (index != originalIndex && table[index]);
    
    return false;
}

void HashTable::clear() {
    for (int i = 0; i < _HASH_TABLE_SIZE; i++) {
        if (table[i]) {
            delete table[i];
            table[i] = nullptr;
        }
    }
    numberOfItems = 0;
}

HashNode* HashTable::getItem(int key) {
    int index = key % _HASH_TABLE_SIZE;
    int originalIndex = index;
    
    do {
        if (table[index] && table[index]->getKey() == key) {
            return table[index];
        }
        index = (index + 1) % _HASH_TABLE_SIZE;
    } while (index != originalIndex && table[index]);
    
    return nullptr;
}

bool HashTable::contains(int key) {
    return getItem(key) != nullptr;
}