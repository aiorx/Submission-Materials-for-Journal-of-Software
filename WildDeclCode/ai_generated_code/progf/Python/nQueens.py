
# Solve N-Queens
# https://leetcode.com/problems/n-queens/
# Solved Aided via basic GitHub coding utilities

# The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.

# Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.

# Each solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.

class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        def DFS(queens, xy_dif, xy_sum):
            print(queens)
            if len(queens) == n:
                result.append(queens)
                return
            for i in range(n):
                if i not in queens and len(queens) - i not in xy_dif and len(queens) + i not in xy_sum:
                    DFS(queens + [i], xy_dif + [len(queens) - i],
                        xy_sum + [len(queens) + i])
        result = []
        DFS([], [], [])
        return [['.' * i + 'Q' + '.' * (n - i - 1) for i in sol] for sol in result]


# display the solution
for sol in Solution().solveNQueens(4):
    print(sol)
    print('\n')
