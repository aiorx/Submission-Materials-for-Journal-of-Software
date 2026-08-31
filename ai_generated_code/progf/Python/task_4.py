# Task 4: Quick Sort by Absolute Value
# Score: 1 point
# ● Implement a version of Quick Sort that sorts elements by their absolute (ABS)
# values.
# ● Example 1: quick_sort([0, -1, -2, 3, 4]) ➞ [-1, 0, -2, 3, 4]
# ● Example 2: quick_sort([5, -5, 0, 2, -3]) ➞ [0, 2, -3, 5, -5] or
# [0, 2, -3, -5, 5]

def partition(arr, left, right, pivot):

    smaller = []
    larger = []
    pivot_count = 0  

    for i in range(left, right + 1):
        if abs(arr[i]) < abs(pivot):
            smaller.append(arr[i])
        elif abs(arr[i]) == abs(pivot):
            pivot_count += 1
        else:
            larger.append(arr[i])

    arr[left:(right + 1)] = smaller + [pivot] * pivot_count + larger
    pivot_index = left + len(smaller)
    return pivot_index


def quick_sort(arr, left, right):
    if left >= right:
        return 
    
    pivot = arr[right]
    index = partition(arr, left, right, pivot)

    quick_sort(arr, left, index - 1)
    quick_sort(arr, index + 1, right)
import unittest

#tests Assisted with basic coding tools

class TestQuickSortByAbsoluteValue(unittest.TestCase):
    def test_partition_basic(self):
        arr = [0, -1, -2, 3, 4]
        pivot = arr[-1]
        pivot_index = partition(arr, 0, len(arr) - 1, pivot)
        self.assertEqual(pivot_index, 4)
        self.assertEqual(arr, [0, -1, -2, 3, 4])  # Correct order based on absolute values

    def test_partition_duplicate_values(self):
        arr = [5, -5, 0, 2, -3]
        pivot = arr[-1]
        pivot_index = partition(arr, 0, len(arr) - 1, pivot)
        self.assertEqual(pivot_index, 2)  # Pivot -3 ends up in the correct position
        self.assertIn(arr, [
            [0, 2, -3, 5, -5],
            [0, 2, -3, -5, 5],
        ])  # Multiple valid outputs

    def test_quick_sort_all_negative(self):
        arr = [-10, -1, -7, -3, -5]
        quick_sort(arr, 0, len(arr) - 1)
        self.assertEqual(arr, [-1, -3, -5, -7, -10])  # Sorted by absolute values


    def test_quick_sort_single_element(self):
        arr = [5]
        quick_sort(arr, 0, len(arr) - 1)
        self.assertEqual(arr, [5])  # Single element, no change

    def test_quick_sort_empty_array(self):
        arr = []
        quick_sort(arr, 0, len(arr) - 1)
        self.assertEqual(arr, [])  # Empty array, no change

    def test_quick_sort_all_zeros(self):
        arr = [0, 0, 0]
        quick_sort(arr, 0, len(arr) - 1)
        self.assertEqual(arr, [0, 0, 0])  # All zeros, no change

if __name__ == '__main__':
    unittest.main()
