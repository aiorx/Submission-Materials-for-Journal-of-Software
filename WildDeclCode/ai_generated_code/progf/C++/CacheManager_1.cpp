/**
 * CacheManager.cpp : This is the implementation file for Cache Manager.
 *
 * 11/27/24 - Designed via basic programming aids
 * 11/27/24 - Modified by Chirayu Jain and Akash Goyal
 * 12/17/24 - Modified, fixed error and added Smart pointer by Chirayu Jain 
 */

#include "CacheManager.hpp"
#include <memory>
#include <iostream>

CacheManager::CacheManager(size_t capacity) 
    : _maxSize(capacity), 
      _curSize(0),
      _fifoCache(std::make_unique<DoublyLinkedList>()),
      _hashTable(std::make_unique<HashTable>()) {
}

HashTable* CacheManager::getTable() {
    return _hashTable.get();
}

DoublyLinkedList* CacheManager::getFifoList() {
    return _fifoCache.get();
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
        Node* oldestNode = _fifoCache->getTail();
        if (oldestNode) {
            _hashTable->remove(oldestNode->getKey());
            _fifoCache->deleteTailNode();
            _curSize--;
        }
    }

    std::unique_ptr<FifoNode> fifoNode(new FifoNode(key));
    fifoNode->setDataValues(data);

    std::unique_ptr<HashNode> hashNode(new HashNode(key));
    hashNode->setCacheNode(fifoNode.get());

    if (_hashTable->add(key, hashNode.get())) {
        _fifoCache->insertAtHead(fifoNode.get());
        fifoNode.release();
        hashNode.release();
        _curSize++;
        return true;
    }

    return false;
}

bool CacheManager::remove(int key) {
    if (!_hashTable->contains(key)) {
        return false;
    }

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