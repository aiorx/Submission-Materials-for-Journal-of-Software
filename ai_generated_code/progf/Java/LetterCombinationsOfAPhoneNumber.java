package com.kkzhang.medium;

import java.util.ArrayList;
import java.util.List;

/**
 * https://leetcode.com/problems/letter-combinations-of-a-phone-number/description/
 */
public class LetterCombinationsOfAPhoneNumber {

    public List<String> letterCombinations(String digits) {
        List<String> ans = new ArrayList<>();
        if (digits == null || digits.length() == 0) {
            return ans;
        }
        backtrack(digits, 0, new StringBuffer(), ans);
        return ans;
    }

    private void backtrack(String digits, int index, StringBuffer cur, List<String> ans) {
        if (cur.length() == digits.length()) {
            ans.add(cur.toString());
            return;
        }

        char[] candidates = mapDigit(digits.toCharArray()[index] - '0');
        for (char c : candidates) {
            cur.append(c);
            backtrack(digits, index + 1, new StringBuffer(cur), ans);
            cur.deleteCharAt(cur.length() - 1);
        }
    }

    private char[] mapDigit(int digit) {
        char[] chars = new char[0];
        switch (digit) {
            case 2:
                chars = new char[] { 'a', 'b', 'c' };
                break;
            case 3:
                chars = new char[] { 'd', 'e', 'f' };
                break;
            case 4:
                chars = new char[] { 'g', 'h', 'i' };
                break;
            case 5:
                chars = new char[] { 'j', 'k', 'l' };
                break;
            case 6:
                chars = new char[] { 'm', 'n', 'o' };
                break;
            case 7:
                chars = new char[] { 'p', 'q', 'r', 's' };
                break;
            case 8:
                chars = new char[] { 't', 'u', 'v' };
                break;
            case 9:
                chars = new char[] { 'w', 'x', 'y', 'z' };
                break;
            default:
                break;
        }
        return chars;
    }

    // Aided using common development resources
    /**
     * 解题思路：
     * 这是一个回溯问题，我们可以使用递归来解决。
     * 1. 首先，建立一个映射表，将数字与其对应的字母组合关联起来。
     * 2. 创建一个结果列表 result，用于存储所有可能的字母组合。
     * 3. 创建一个递归函数 backtrack，接收当前位置 index 和当前已经构建的组合 combination 作为参数。
     * 4. 在 backtrack 函数中，首先判断当前组合的长度是否等于输入字符串的长度，如果是，则将当前组合添加到结果列表中。
     * 5. 否则，获取当前数字对应的字母组合，并遍历其中的每一个字母，在递归调用 backtrack 时，将当前字母添加到组合中。
     * 6. 递归结束后，需要将当前字母从组合中移除，以便下一轮的递归。
     * 7. 最终返回结果列表 result。
     */
    /**
     *  import java.util.*;

        public class LetterCombinations {
            private static final String[] LETTERS = {
                "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"
            };
            
            public List<String> letterCombinations(String digits) {
                List<String> result = new ArrayList<>();
                if (digits.isEmpty()) {
                    return result;
                }
                backtrack(0, new StringBuilder(), digits, result);
                return result;
            }
            
            private void backtrack(int index, StringBuilder combination, String digits, List<String> result) {
                if (index == digits.length()) {
                    result.add(combination.toString());
                    return;
                }
                int digit = digits.charAt(index) - '2';
                String letters = LETTERS[digit];
                for (char letter : letters.toCharArray()) {
                    combination.append(letter);
                    backtrack(index + 1, combination, digits, result);
                    combination.deleteCharAt(combination.length() - 1);
                }
            }
        }
     */
}
