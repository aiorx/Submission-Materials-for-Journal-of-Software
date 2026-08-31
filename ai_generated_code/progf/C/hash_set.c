#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#include "../headers/HashMap.h"

// since this depends on hashmap, to run this run:
// gcc hash_map/hash_set.c headers/HashMap.c headers/LinkedList.c; ./a.out; rm ./a.out
// so everything gets linked

/// NOTE: this set is just basically a wrapper around an hashmap
/// with dummy values, the actual values of the set are the map keys

#define DUMMY 0

/// An `HashSet` data structure of the type `<int>`
///
/// # Fields
///
/// - `elements` an underlying `HashMap<int, int>`, the keys of this map
/// are the values of the set, while the values of the actual keys in the
/// map are dummy values, in this case `0`
struct HashSet {
    HashMap elements;
} typedef HashSet;

HashSet create(int capacity);

void add(HashSet* set, int val);
int delete(HashSet* set, int val);

bool contains(HashSet* set, int val);

void pprint(HashSet* set);
void freeAll(HashSet* set);

/// Instanciate a new `HashSet` with a given capacity.
/// This takes `O(n)` time where `n` is the map `capacity`.
///
/// # Params
/// 
/// `capacity` an `int` representing the set initial capacity
///
/// # Returns
///
/// A new `HashSet` instance with all initialized
HashSet create(int capacity) {
    HashSet set;
    set.elements = map_create(capacity);

    return set;
}

/// Inserts a new element in an `HashSet`.
/// This takes `O(1)` time on average, worst case `O(n)`.
///
/// # Params
/// 
/// `set` a pointer to the `HashSet` in which to inset the value
/// `val` an `int` representing the val to be inserted.
void add(HashSet* set, int val) {
    map_insert(&(set->elements), val, DUMMY);
}

/// Removes an element from an `HashSet`.
/// This takes `O(1)` time on average.
///
/// # Params
/// 
/// `set` a pointer to the `HashSet` in which to remove the value
/// `val` an `int` representing the val to be removed.
///
/// # Returns
/// 
/// An `int` with the value removed if the value was in the set 
/// else `-1`
int delete(HashSet* set, int val) {
    LinkedList deleted = map_remove_key(&(set->elements), val);
    if(list_is_empty(&deleted)) {
        return -1;
    } else {
        return val;
    }
}

/// Checks if  an element is present in an `HashSet`.
/// This takes `O(1)` time.
///
/// # Params
/// 
/// `set` a pointer to the `HashSet` in which to check
/// `val` an `int` representing the val to check for.
///
/// # Returns
/// 
/// `true` if the value was in the set else `false`
bool contains(HashSet* set, int val) {
    return map_contains_key(&(set->elements), val);
}

/// Pretty prints the `HashSet` in `O(n)` time
void pprint(HashSet* set) {
    printf("[ ");
    for(int i = 0; i < set->elements.capacity; i++) {
        if(set->elements.entries[i].key != -1) {
            printf("%d ", set->elements.entries[i].key);
        }
    }
    printf("]\n");
}

/// Free all the allocated memory from the `HashSet`.
/// This takes `O(n)` time.
void freeAll(HashSet* set) {
    map_freeAll(set->elements);
}

// some random testing Supported via standard programming aids
#include <time.h>
int main() {
    srand(time(NULL)); // Seed for random number generation

    HashSet set = create(100); // Create a HashSet with enough capacity

    // Generate and add random integers to the HashSet
    for (int i = 0; i < 20; i++) {
        int random_val = rand() % 1000;
        add(&set, random_val);
    }

    // Test if the HashSet contains some random values
    add(&set, 5);
    pprint(&set);
    
    printf("HashSet contains 5: %s\n", contains(&set, 5) ? "true" : "false");
    printf("HashSet contains 1000: %s\n", contains(&set, 1000) ? "true" : "false");

    // Delete some random values from the HashSet
    delete(&set, 5);
    delete(&set, 1000);

    // Print the contents of the HashSet
    pprint(&set);

    // Free the memory allocated for the HashSet
    freeAll(&set);

    return 0;
}