/**
*
* cache_manager.h : This is the header file for cache_manager.cpp.
*
* 09/23/24 - Formed using common development resources
* 10/17/24 - Modified by jhui
* 01/11/25 - Modified by hhui; 1) added calculateHashCode, 2) modified methods to include hash table size parameter
* 01/16/2025 - Modified by hhui; created separate node structure file
* 01/27/2025 - Modified by hhui; added getMaxCacheSize
* 02/28/2025 - Modified by pdavis; Modified member variable to use stl unordered map and changed contructor. Added unordered map to include, edited get table to return the right pointer. removed check on hashtable size no longer matters with stl
* 03/01/2025 - Modified by pdavis; re-added separate hashnode to allow for looser coupling.
* 04/03/2025 - Modified by P.Davis; added printSort and printRange
*/

#ifndef _CACHE_MANAGER
#define _CACHE_MANAGER

#include <unordered_map>
#include "doubly_linked_list.h"
#include "hash_node.h"
#include "binary_search_tree.h"


extern std::ofstream& getOutFile();

// Define a class for the CacheManager 
class CacheManager {
private:
	std::unordered_map<int,HashNode*>* hashTable;
	DoublyLinkedList* doublyLinkedList;
    BinarySearchTree* binarySearchTree;

	int maxCacheSize;

public:
	// Constructor initializes an empty list
	CacheManager(int myMaxCacheSize, int myHashTableSize) {
        if(myHashTableSize>myMaxCacheSize){
            myMaxCacheSize=myHashTableSize;
            std::cout<<"Resetting MaxCacheSize, "<<myMaxCacheSize << ", to match myHashTableSize of : "<<myHashTableSize<<"! Reconsider your life choices!!!"<<std::endl;
        }
		hashTable = new std::unordered_map<int,HashNode*>; 
		doublyLinkedList = new DoublyLinkedList();
		this->maxCacheSize = myMaxCacheSize;
		hashTable->reserve(myHashTableSize);
        binarySearchTree= new BinarySearchTree();
	}



	/**
	*
	* getTable
	*
	* Method to return the hash table
	*
	* @param    none
	*
	* @return	the hash table
	*/
	std::unordered_map<int,HashNode*>* getTable();

	/**
	*
	* getList
	*
	* Method to return the FIFO list
	*
	* @param    none
	*
	* @return	the FIFO list
	*/
	DoublyLinkedList* getList();

    /**
	*
	* getBST
	*
	* Method to return the BST
	*
	* @param    none
	*
	* @return	the FIFO list
	*/
    BinarySearchTree* getBst();


	/**
	*
	* getSize
	*
	* Method to return the number of items in the CacheManager
	*
	* @param    none
	*
	* @return	number of items in the CacheManager
	*/
	int getSize();


	/**
	*
	* isEmpty
	*
	* Method to check if CacheManager is empty
	*
	* @param    none
	*
	* @return   true if the CacheManager has zero entries, false otherwise
	*/
	bool isEmpty();


	/**
	*
	* add
	*
	* Method to add a node to the CacheManager
	*
	* @param    curKey    key for this node
	* @param    myNode    new node to add to the table
	*
	* @return   true if success, false otherwise
	*/
	bool add(int curKey, DllNode* myNode);

	/**
	*
	* remove
	*
	* Method to remove node with curKey
	*
	* @param    key     key of node to remove
	*
	* @return   true if success, false otherwise
	*/
	bool remove(int curKey);

	/**
	*
	* clear
	*
	* Method to remove all entries from the CacheManager
	*
	* @param    none
	*
	* @return   nothing, but will delete all entries from the CacheManager
	*/
	void clear();

	/**
	*
	* getItem
	*
	* Method to retrieve item from the CacheManager
	*
	* @param    curKey  retrieve node from CacheManager with curKey value
	*
	* @return   pointer to the DllNode
	*/
	DllNode* getItem(int curKey);

	/**
	*
	* getMaxCacheSize
	*
	* Method to retrieve max size of cache from the CacheManager
	*
	* @param    none
	*
	* @return   max size of cache manager
	*/
	int getMaxCacheSize();

	/**
	*
	* contains
	*
	* Method to determine if a key value is in the cache
	*
	* @param    curKey  retrieve node from cacheManager with curKey value
	*
	* @return   true if exists, false otherwise
	*/
	bool contains(int curKey);


	/**
	*
	* printCache
	*
	* Method to print out the cache information
	*
	* @param    none
	*
	* @return   pointer to the hash table array
	*/
	void printCache();

    /**
	*
	* printRange
	*
	* Method to print out nodes within a range of keys
	*
	* @param    int, int low and high
	*
	* @return   nothing but will print dll nodes
	*/
    void printRange(int low, int high);

    /**
	*
	* printSort
	*
	* Method to print out the cache information in sorted order min max
	*
	* @param    none
	*
	* @return   nothing but prints out dll nodes in sorted order
	*/
    void printSort(bool ascending);



}; // end CacheManager

#endif 