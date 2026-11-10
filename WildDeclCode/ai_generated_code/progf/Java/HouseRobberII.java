package com.kkzhang.medium;

/**
 * https://leetcode.com/problems/house-robber-ii/
 */
public class HouseRobberII {
    /**
     * 解题思路：
     * 这是一个扩展版的动态规划问题。
     * 
     * 由于首尾相连，意味着第一个房屋和最后一个房屋只能选择偷其中的一个。
     * 所以我们可以将问题分解为两个子问题：
     * 1. 偷第一个房屋到倒数第二个房屋（不偷最后一个房屋）
     * 2. 偷第二个房屋到最后一个房屋（不偷第一个房屋）
     * 对于这两个子问题，我们可以使用与之前相同的动态规划方法来解决。
     * 最终的答案就是这两个子问题中的最大值。
     */
    public int rob(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        if (nums.length == 1) {
            return nums[0];
        }
        if (nums.length == 2) {
            return Math.max(nums[0], nums[1]);
        }

        int[] dp1 = new int[nums.length - 1];
        dp1[0] = nums[0];
        dp1[1] = Math.max(nums[0], nums[1]);
        for (int i = 2; i < nums.length - 1; i++) {
            dp1[i] = Math.max(dp1[i - 1], dp1[i - 2] + nums[i]);
        }

        int[] dp2 = new int[nums.length - 1];
        dp2[0] = nums[1];
        dp2[1] = Math.max(nums[1], nums[2]);
        for (int i = 2; i < nums.length - 1; i++) {
            dp2[i] = Math.max(dp2[i - 1], dp2[i - 2] + nums[i + 1]);
        }

        return Math.max(dp1[nums.length - 2], dp2[nums.length - 2]);
    }

    /**
     * Supported via standard programming aids
     */
    /**
     * class Solution {
            public int rob(int[] nums) {
                if (nums.length == 1) {
                    return nums[0];
                }
                int max1 = robHelper(nums, 0, nums.length - 2);
                int max2 = robHelper(nums, 1, nums.length - 1);
                return Math.max(max1, max2);
            }
            
            private int robHelper(int[] nums, int start, int end) {
                int prevMax = 0;
                int currMax = 0;
                for (int i = start; i <= end; i++) {
                    int temp = currMax;
                    currMax = Math.max(prevMax + nums[i], currMax);
                    prevMax = temp;
                }
                return currMax;
            }
        }
     */
}
