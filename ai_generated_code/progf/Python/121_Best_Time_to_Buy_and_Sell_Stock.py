# O(n) Aided using common development resources:
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        
        for price in prices:
            if price < min_price:
                min_price = price
            elif price - min_price > max_profit:
                max_profit = price - min_price
        
        return max_profit


# ================================================================
# On a scale of 10, I would give your code a 5. Here's the breakdown of the assessment:

# Understanding the Problem (7/10): You understood the problem and attempted to find the maximum profit by comparing prices. However, the solution can be optimized.

# Implementation (4/10): Your code works in terms of logic for comparing prices and calculating profit differences, but it uses nested loops which makes it inefficient for large inputs.

# Efficiency (3/10): The nested loops result in 
# 𝑂
# (
# 𝑛
# 2
# )
# O(n 
# 2
#  ) time complexity, which is not optimal. The problem can be solved in 
# 𝑂
# (
# 𝑛
# )
# O(n) time complexity using a more efficient approach.

# Clarity and Simplicity (6/10): Your code is fairly clear and you have included comments. However, there's some commented-out code which might make it a bit confusing. Simplifying the logic and removing unnecessary parts would improve clarity.

# Correctness (5/10): The code attempts to find the maximum profit correctly, but the inefficiency and overcomplication make it less practical for larger inputs.

# Suggestions for Improvement:
# Focus on optimizing the solution for better time complexity.
# Simplify the logic to make the code easier to read and maintain.
# Remove any commented-out code that isn't necessary for the final solution.
# Keep practicing and refining your approach to problem-solving, and you'll continue to improve!


# O(n^2) solution:
# class Solution:
#     def maxProfit(self, prices: List[int]) -> int:
#         profits = {}
#         all_profits = []
#         max_found_so_far = 0
#         for day_idx, check_price in enumerate(prices, start = 0):
#             for next_price in prices[day_idx+1:]:
#                 if next_price < check_price:
#                     continue
                    
#                 cost_diff = next_price - check_price
#                 if cost_diff > max_found_so_far:
#                     max_found_so_far = cost_diff
                    
            #     all_profits.append(cost_diff)

            # profits[day_idx] = all_profits
            # all_profits = [] 
        # print(f"profits : {profits}")
        # print(f"max_found_so_far : {max_found_so_far}")

        # max_found_so_far = 0
        # max_idx = 0
        # for key in profits.keys():
        #     for ele in profits[key]:
        #         if ele > max_found_so_far:
        #             max_found_so_far = ele
        #             max_idx = key

        # print(f"max_found_so_far : {max_found_so_far}")
        # print(f"max_idx : {max_idx + 1}")
        # return max_found_so_far
