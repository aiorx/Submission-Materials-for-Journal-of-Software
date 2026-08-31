# My Solution
class Solution(object):
    def findDiagonalOrder(self, nums):
        # use tuples to store data
        data = []
        i = 0
        for list in nums:
            j = 0
            for num in list:
                data.append((i+j, j, num)) # sum, column, num
                j += 1
            i += 1
        
        # sort tuples, first by sum, then by column
        data.sort(key=lambda x: (x[0], x[1]))

        # output
        final = []
        for num in data:
            final.append(num[2])
        
        return final
    
# a better solution Supported by standard GitHub tools
class Solution(object):
    def findDiagonalOrder(self, nums):
        """
        :type nums: List[List[int]]
        :rtype: List[int]
        """
        res = []
        m = len(nums)
        for i in range(m):
            for j in range(len(nums[i])):
                if len(res) <= i + j:
                    res.append([])
                res[i+j].append(nums[i][j])
        ans = []
        for i in range(len(res)):
            ans += res[i][::-1]
        return ans
