'''
https://leetcode.com/problems/missing-number/description/

Missing Number

Given an array nums containing n distinct numbers in the range [0, n], return the only number 
in the range that is missing from the array.


# Example 1:

Input: nums = [3,0,1]

Output: 2

Explanation:

n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 

2 is the missing number in the range since it does not appear in nums.

# Example 2:

Input: nums = [0,1]

Output: 2

Explanation:

n = 2 since there are 2 numbers, so all numbers are in the range [0,2]. 

2 is the missing number in the range since it does not appear in nums.

# Example 3:

Input: nums = [9,6,4,2,3,5,7,0,1]

Output: 8

Explanation:

n = 9 since there are 9 numbers, so all numbers are in the range [0,9]. 

8 is the missing number in the range since it does not appear in nums.


Constraints:

n == nums.length
1 <= n <= 104
0 <= nums[i] <= n
All the numbers of nums are unique.
'''

from typing import List

class Solution:
  def missingNumber(self, nums: List[int]) -> int:
    expected_sum = sum([x for x in range(len(nums)+1)])
    current_sum = sum(nums)
    return expected_sum - current_sum


solution = Solution()

print(solution.missingNumber([3,0,1])) # -> 2
print(solution.missingNumber([0,1])) # -> 2
print(solution.missingNumber([9,6,4,2,3,5,7,0,1])) # -> 8

'''
Pseudocode:
- Use list comprehension to create a list containing all numbers in range of nums length +1
  - Sum all numbers in that range and assign value to expected_sum
- Sum all numbers in current nums list and assig value to current_sum
- Return expected_sum - current sum

- Time complexity: O(n)
- Space complexity: O(n)

- Note: Space complexity can be reduced to O(1) as follows (thanks ChatGPT):

def missingNumber(self, nums: List[int]) -> int:
  n = len(nums)
  expected_sum = n * (n + 1) // 2
  current_sum = sum(nums)
  return expected_sum - current_sum
'''