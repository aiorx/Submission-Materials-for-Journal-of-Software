/**
 * CacheManager.cpp : This is the implementation file for Cache Manager.
 *
 * 11/27/24 - Designed via basic programming aids
 * 12/4/24 - Modified by Chirayu Jain and Akash Goyal
 * 12/4/24 - Added 3 extra text cases for extra credits
 * 
 */

#include "CacheManager.hpp"
#include <memory>

CacheManager::CacheManager(size_t capacity) 
    : _maxSize(capacity), _curSize(0) {
    _fifoCache = new DoublyLinkedList();
    _hashTable = new HashTable();
}

HashTable* CacheManager::getTable() {
    return _hashTable;
}

DoublyLinkedList* CacheManager::getFifoList() {
    return _fifoCache;
}

Node* CacheManager::getItem(int key) {
    HashNode* hashNode = _hashTable->getItem(key);
    if (hashNode) {
        return hashNode->getCacheNode();
    }
    return nullptr;
}

size_t CacheManager::getSize() {
    return _maxSize;
}

bool CacheManager::isEmpty() {
    return _curSize == 0;
}

size_t CacheManager::getNumberOfItems() {
    return _curSize;
}

bool CacheManager::add(int key, Data* data) {
    if (_curSize >= _maxSize) {
        // Remove oldest item from cache
        Node* oldestNode = _fifoCache->getHead();
        if (oldestNode) {
            _hashTable->remove(oldestNode->getKey());
            _fifoCache->deleteHeadNode();
            _curSize--;
        }
    }
    
    auto fifoNode = new FifoNode(key);
    fifoNode->setDataValues(data);
    
    auto hashNode = new HashNode(key);
    hashNode->setCacheNode(fifoNode);
    
    if (_hashTable->add(key, hashNode)) {
        _fifoCache->insertAtTail(fifoNode);
        _curSize++;
        return true;
    }
    
    delete fifoNode;
    delete hashNode;
    return false;
}

bool CacheManager::remove(int key) {
    HashNode* hashNode = _hashTable->getItem(key);
    if (hashNode) {
        Node* cacheNode = hashNode->getCacheNode();
        _fifoCache->deleteNode(cacheNode);
        _hashTable->remove(key);
        _curSize--;
        return true;
    }
    return false;
}

void CacheManager::clear() {
    _fifoCache->deleteList();
    _hashTable->clear();
    _curSize = 0;
}

bool CacheManager::contains(int key) {
    return _hashTable->contains(key);
}