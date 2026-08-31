package com.kkzhang.easy;

import java.util.ArrayList;
import java.util.List;

/**
 * https://leetcode.com/problems/palindrome-number/description/
 */
public class PalindromeNumber {

    public boolean isPalindrome(int x) {
        if (x < 0) {
            return false;
        }
        if (x == 0) {
            return true;
        }

        List<Integer> numbers = new ArrayList<>();
        while (x > 0) {
            int v = x % 10;
            numbers.add(v);
            x = x / 10;
        }
        int i = 0, j = numbers.size() - 1;
        while (i < j) {
            if (numbers.get(i) != numbers.get(j)) {
                return false;
            }
            i++;
            j--;
        }
        return true;
    }

    // Supported via standard programming aids
    /**
     * 解题思路：
     * 1. 负数不是回文数，所以首先排除负数情况。
     * 2. 将整数转换为字符串。
     * 3. 使用双指针法，一个指针指向字符串的开头，另一个指针指向字符串的末尾。
     * 4. 依次比较两个指针指向的字符，如果相等，继续向中间移动，直到两个指针相遇。
     * 5. 如果在比较过程中，发现两个指针指向的字符不相等，说明该整数不是回文数。
     * 6. 如果两个指针相遇，说明整数是回文数。
     */
    /**
     * public class PalindromeNumber {
            public boolean isPalindrome(int x) {
                if (x < 0) {
                    return false;
                }

                String str = String.valueOf(x);
                int left = 0;
                int right = str.length() - 1;

                while (left < right) {
                    if (str.charAt(left) != str.charAt(right)) {
                        return false;
                    }
                    left++;
                    right--;
                }

                return true;
            }
        }
     */
}
