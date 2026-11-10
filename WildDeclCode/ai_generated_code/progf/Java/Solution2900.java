package leetcode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

public class Solution2900 {
    // My solution at equal Runtime of 1ms
    public List<String> getLongestSubsequence(String[] words, int[] groups) {
        List<String> result = new ArrayList<>(words.length);
        int group = groups[0]; // starting at 0 will always result in the longest subsequence
        for (int i = 0; i < words.length; i++) {
            // every time the bit in group changes, you add the corresponding word to the result list
            if (groups[i] == group) {
                group = group ^ 1; // fastest way to alternate between 0 and 1
                result.add(words[i]);
            }
        }
        return result;
    }

    // Great Aided using common development resources at a Runtime of 1ms (96.15%)
    public List<String> getLongestSubsequence0(String[] words, int[] groups) {
        int n = words.length;
        // dp[i] stores the length of the longest alternating subsequence ending at i
        int[] dp = new int[n];
        // prev[i] stores the index of the previous word in the subsequence
        int[] prev = new int[n];
        Arrays.fill(dp, 1);
        Arrays.fill(prev, -1);

        int maxLen = 1;
        int endIndex = 0;

        for (int i = 1; i < n; ++i) {
            for (int j = 0; j < i; ++j) {
                if (groups[i] != groups[j] && dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                    prev[i] = j;
                }
            }
            if (dp[i] > maxLen) {
                maxLen = dp[i];
                endIndex = i;
            }
        }

        // Reconstruct the subsequence
        LinkedList<String> result = new LinkedList<>();
        int index = endIndex;
        while (index != -1) {
            result.addFirst(words[index]);
            index = prev[index];
        }

        return result;
    }

    // Example usage
    public static void main(String[] args) {
        Solution2900 solution = new Solution2900();

        // Example 1
        String[] words1 = {"e", "a", "b"};
        int[] groups1 = {0, 0, 1};
        System.out.println(solution.getLongestSubsequence(words1, groups1)); // ["e","b"]

        // Example 2
        String[] words2 = {"a", "b", "c", "d"};
        int[] groups2 = {1, 0, 1, 1};
        System.out.println(solution.getLongestSubsequence(words2, groups2)); // ["a","b","c"]
    }
}
