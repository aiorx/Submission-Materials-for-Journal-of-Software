#include <iostream>
#include <vector>
#include <cassert>
#include "BSTClass.h"  

// Crafted with routine coding tools  
int main() {
    BST<int, std::string> bst;

    // Test 1: Insertion and Retrieval
    std::cout << "Test 1: Insertion and Retrieval" << std::endl;
    bst.put(5, "five");
    bst.put(3, "three");
    bst.put(7, "seven");
    bst.put(1, "one");
    bst.put(4, "four");
    bst.put(6, "six");
    bst.put(8, "eight");
    //bst.remove(3);

    // Checking if values were inserted and can be retrieved correctly
    assert(bst.get(5) == "five");
    assert(bst.get(3) == "three");
    assert(bst.get(7) == "seven");
    assert(bst.get(1) == "one");
    assert(bst.get(4) == "four");
    assert(bst.get(6) == "six");
    assert(bst.get(8) == "eight");
    std::cout << "Test 1 passed." << std::endl;

    // Test 2: Tree Size
    std::cout << "\nTest 2: Tree Size" << std::endl;
    assert(bst.size() == 7);  // We inserted 7 unique keys
    std::cout << "Test 2 passed." << std::endl;

    // Test 3: Rank Function
    std::cout << "\nTest 3: Rank Function" << std::endl;
    assert(bst.rank(1) == 0);  
    assert(bst.rank(3) == 1);  
    assert(bst.rank(4) == 2);
    assert(bst.rank(6) == 4);
    assert(bst.rank(7) == 5);
    assert(bst.rank(8) == 6);  
    std::cout << "Test 3 passed." << std::endl;

    // Test 4: Floor Function
    std::cout << "\nTest 4: Floor Function" << std::endl;
    assert(bst.Floor(5) == 5);  // Exact match should return 5
    assert(bst.Floor(2) == 1);  // Floor of 2 should be 1
    assert(bst.Floor(6) == 6);  // Exact match should return 6
    assert(bst.Floor(9) == 8);  // Floor of 9 should be 8
    try {
        bst.Floor(0);  // No floor for 0 in the tree
    } catch (std::out_of_range&) {
        std::cout << "Floor function correctly threw an exception for 0." << std::endl;
    }
    std::cout << "Test 4 passed." << std::endl;

    // Test 5: Ceil Function
    std::cout << "\nTest 5: Ceil Function" << std::endl;
    assert(bst.Ceil(3) == 3);  // Exact match should return 3
    assert(bst.Ceil(5) == 5);  // Exact match should return 5
    assert(bst.Ceil(6) == 6);  // Exact match should return 6
    assert(bst.Ceil(2) == 3);  // Ceil of 2 should be 3
    try {
        bst.Ceil(9);  // No ceiling for 9 in the tree
    } catch (std::out_of_range&) {
        std::cout << "Ceil function correctly threw an exception for 9." << std::endl;
    }
    std::cout << "Test 5 passed." << std::endl;

    // Test 6: Inorder Traversal
    std::cout << "\nTest 6: Inorder Traversal" << std::endl;
    std::vector<int> keys = bst.keys();
    std::vector<int> expectedKeys = {1, 3, 4, 5, 6, 7, 8};
    assert(keys == expectedKeys);
    std::cout << "Inorder traversal is correct: ";
    for (int key : keys) std::cout << key << " ";
    std::cout << "\nTest 6 passed." << std::endl;

    // Test 7: Updating a Key's Value
    std::cout << "\nTest 7: Updating a Key's Value" << std::endl;
    bst.put(5, "FIVE");  // Update the value of key 5
    assert(bst.get(5) == "FIVE");  // Ensure value has been updated
    std::cout << "Test 7 passed." << std::endl;

    // Test 8: Edge Case - Single Element Tree
    std::cout << "\nTest 8: Edge Case - Single Element Tree" << std::endl;
    BST<int, std::string> singleNodeTree;
    singleNodeTree.put(10, "ten");
    assert(singleNodeTree.get(10) == "ten");
    assert(singleNodeTree.size() == 1);
    assert(singleNodeTree.rank(10) == 0);
    assert(singleNodeTree.Floor(10) == 10);
    assert(singleNodeTree.Ceil(10) == 10);
    std::cout << "Test 8 passed." << std::endl;

    // Test 9: Edge Case - Empty Tree
    std::cout << "\nTest 9: Edge Case - Empty Tree" << std::endl;
    BST<int, std::string> emptyTree;
    assert(emptyTree.size() == 0);
    try {
        emptyTree.get(1);
    } catch (std::out_of_range&) {
        std::cout << "Get function correctly threw an exception for an empty tree." << std::endl;
    }
    try {
        emptyTree.Floor(1);
    } catch (std::out_of_range&) {
        std::cout << "Floor function correctly threw an exception for an empty tree." << std::endl;
    }
    try {
        emptyTree.Ceil(1);
    } catch (std::out_of_range&) {
        std::cout << "Ceil function correctly threw an exception for an empty tree." << std::endl;
    }
    std::cout << "Test 9 passed." << std::endl;

    // Test 10: Removal of Nodes
    std::cout << "\nTest 10: Removal of Nodes" << std::endl;
    bst.remove(1);  // Remove leaf node
    assert(bst.size() == 6);
    assert(bst.keys() == std::vector<int>({3, 4, 5, 6, 7, 8}));
    std::cout << "Removed leaf node (1) successfully." << std::endl;

    bst.remove(3);  // Remove node with one child
    assert(bst.size() == 5);
    assert(bst.keys() == std::vector<int>({4, 5, 6, 7, 8}));
    std::cout << "Removed node with one child (3) successfully." << std::endl;
    
    std::vector<int> watch = bst.keys();
    bst.remove(5);  // Remove node with two children
    assert(bst.size() == 4);
    std::cout<< "wait";
    assert(bst.keys() == std::vector<int>({4, 6, 7, 8}));
    std::cout << "Removed node with two children (5) successfully." << std::endl;

    try {
        bst.get(5);
        assert(false);  // Should not reach here; 5 was removed
    } catch (const std::out_of_range&) {
        std::cout << "Node (5) correctly no longer in tree." << std::endl;
    }
    std::cout << "Test 10 passed." << std::endl;

    /*std::cout << "Test 11: removing everything\n";
    while(!bst.isEmpty()){
        bst.removeMax();
    }*/

    std::cout << "All tests passed successfully!" << std::endl;
    return 0;
}
