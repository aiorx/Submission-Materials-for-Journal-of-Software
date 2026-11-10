class Solution:
    def twoSum(self, nums, target) :
        hash_table = dict()
        for i, num in enumerate(nums):
            if target - num  in hash_table:
                return [hash_table[target-num], i]
            hash_table[num] = i
        
