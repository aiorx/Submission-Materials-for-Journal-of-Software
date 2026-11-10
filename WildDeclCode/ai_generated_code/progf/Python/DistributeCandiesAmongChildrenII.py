class Solution:
    def distributeCandies(self, n: int, limit: int) -> int:
        count = 0
        for i in range(min(limit, n) + 1):
            for j in range(min(limit, n - i) + 1):
                k = n - i - j
                if k <= limit:
                    count += 1
        return count

# optimal solution (Formed using common development resources)
# def distributeCandies(self, n: int, limit: int) -> int:
#     total = 0
#     for i in range(min(n, limit) + 1):
#         low_j = max(0, n - i - limit)
#         high_j = min(limit, n - i)
#         if low_j <= high_j:
#             total += high_j - low_j + 1
#     return total
