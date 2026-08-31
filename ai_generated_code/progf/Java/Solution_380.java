
// Solution Derived using common development resources, didn't submit, need to understand later.


import java.util.*;

class RandomizedSet {
    // List to store the elements
    private List<Integer> nums;
    // HashMap to store the value and its index in the list
    private Map<Integer, Integer> map;
    // Random object to get random elements
    private Random rand;

    // Constructor to initialize the data structures
    public RandomizedSet() {
        nums = new ArrayList<>();
        map = new HashMap<>();
        rand = new Random();
    }

    // Inserts the element into the set if not already present
    public boolean insert(int val) {
        if (map.containsKey(val)) {
            return false; // Value already exists in the set
        }
        map.put(val, nums.size()); // Map value to its index in the list
        nums.add(val); // Add the value to the list
        return true;
    }

    // Removes the element from the set if present
    public boolean remove(int val) {
        if (!map.containsKey(val)) {
            return false; // Value doesn't exist in the set
        }

        // Get the index of the element to be removed
        int index = map.get(val);
        // Swap the element with the last element in the list
        int lastElement = nums.get(nums.size() - 1);
        nums.set(index, lastElement); // Move the last element to the index of the element to be removed
        map.put(lastElement, index); // Update the index of the last element in the map

        // Remove the last element from the list
        nums.remove(nums.size() - 1);
        // Remove the value from the map
        map.remove(val);

        return true;
    }

    // Returns a random element from the set
    public int getRandom() {
        int randomIndex = rand.nextInt(nums.size()); // Get a random index
        return nums.get(randomIndex); // Return the element at that index
    }
}

// Main class to demonstrate the RandomizedSet functionality
public class Solution_380 {
    public static void main(String[] args) {
        RandomizedSet randomizedSet = new RandomizedSet();

        // Testing insert operation
        System.out.println("Insert 1: " + randomizedSet.insert(1)); // Inserts 1, returns true
        System.out.println("Insert 2: " + randomizedSet.insert(2)); // Inserts 2, returns true
        System.out.println("Insert 1 again: " + randomizedSet.insert(1)); // Inserts 1 again, returns false

        // Testing getRandom operation
        System.out.println("Get Random: " + randomizedSet.getRandom()); // Should return 1 or 2 randomly

        // Testing remove operation
        System.out.println("Remove 1: " + randomizedSet.remove(1)); // Removes 1, returns true
        System.out.println("Remove 1 again: " + randomizedSet.remove(1)); // Removes 1 again, returns false

        // Testing insert operation again
        System.out.println("Insert 2 again: " + randomizedSet.insert(2)); // Inserts 2 again, returns false (since 2 is already present)

        // Testing getRandom operation
        System.out.println("Get Random: " + randomizedSet.getRandom()); // Should always return 2 because 2 is the only element left
    }
}
