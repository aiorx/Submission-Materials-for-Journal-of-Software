/*
    Task 2:

        Create a data structure that supports the following operations: access and remove. The access
        operation inserts the item onto the data structure if it's not already present. The remove operation
        deletes and returns the item that was least recently accessed.

        Hint: maintain the items in order of access in a doubly linked list, along with pointers to the first and
        last nodes. Use a symbol table with keys = items, values = location in linked list. When you access an
        element, delete it from the linked list and re-insert it at the beginning. When you remove an element,
        delete it from the end and remove it from the symbol table.

        Implement the LRU class with the following methods:
            - void access(int item): insert the item if not already present
            - int remove(): remove and return the least recently accessed item
            - void print(): print the items in the order of access
            - bool contains(int item): return true if the item is present
            - int size(): return the number of items in the cache
            - bool empty(): return true if the cache is empty

*/

#include <iostream>
#include <unordered_map>
#include <list>

class LRUCache {
    std::unordered_map<int, std::list<int>::iterator> cache; // Symbol table with keys = items, values = location in linked list
    std::list<int> order; // Doubly linked list to maintain the items in order of access
    int capacity; // Capacity of the cache

public:
    // Constructor
    LRUCache(int capacity) : capacity(capacity) {}

    // Insert the item if not already present
    void access(const int& item) {
        // If the item is already present, delete it from the linked list
        if (cache.find(item) != cache.end()) {
            order.erase(cache[item]);
        }
        // Insert the item at the beginning of the linked list
        order.push_front(item);
        // Update the location of the item in the symbol table
        cache[item] = order.begin();
        // If the size of the cache exceeds the capacity, remove the least recently accessed item
        if (order.size() > capacity) {
            cache.erase(order.back());
            order.pop_back();
        }
    }

    // Remove and return the least recently accessed item
    int remove() {
        // Get the least recently accessed item
        int item = order.back();
        // Remove the item from the linked list
        order.pop_back();
        // Remove the item from the symbol table
        cache.erase(item);
        return item; // Return the least recently accessed item
    }

    // Print the items in the order of access
    void print() {
        for (const auto& item : order) {
            std::cout << item << " ";
        }
        std::cout << std::endl;
    }

    // Return true if the item is present
    bool contains(const int& item) {
        return cache.find(item) != cache.end();
    }

    // Return the number of items in the cache
    int size() {
        return order.size();
    }

    // Return true if the cache is empty
    bool empty() {
        return order.empty();
    }
};


// Example usage - code Adapted from standard coding samples
int main() {
    LRUCache cache(3); // Create a cache with capacity 3

    cache.access(1);
    cache.access(2);
    cache.access(3);
    cache.print(); // Output: 3 2 1

    cache.access(4);
    cache.print(); // Output: 4 3 2

    cache.access(2);
    cache.print(); // Output: 2 4 3

    std::cout << "Remove: " << cache.remove() << std::endl; // Output: Remove: 3
    cache.print(); // Output: 2 4

    std::cout << "Contains 1: " << cache.contains(1) << std::endl; // Output: 0 (false)
    std::cout << "Contains 2: " << cache.contains(2) << std::endl; // Output: 1 (true)

    std::cout << "Cache size: " << cache.size() << std::endl; // Output: Cache size: 2
    std::cout << "Is cache empty: " << cache.empty() << std::endl; // Output: Is cache empty: 0 (false)

    return 0;
}