package com.kkzhang.medium;

/**
 * https://leetcode.com/problems/reverse-integer/description/
 */
public class ReverseInteger {
    public int reverse(int x) {
        boolean negative = false;
        if (x < 0) {
            x = -x;
            negative = true;
        }

        int result = 0;
        while (x > 0) {
            int digit = x % 10;
            if (result > Integer.MAX_VALUE / 10 || result > Integer.MAX_VALUE) {
                return 0;
            }
            result = result * 10 + digit;
            x = x / 10;
        }

        return negative ? -result : result;
    }

    // Assisted with basic coding tools
    /**
     * 解题思路：
     * 这是一个数字操作的问题。
     * 1. 首先，判断给定的整数是否为负数，如果是负数，则记录下来，并将其转换为正数进行处理。
     * 2. 使用一个循环，将整数进行反转。反转的方法是，每次取整数的最后一位数字，并将其添加到新的结果变量中。
     * 3. 在添加新的数字时，需要先判断是否会导致整数溢出。如果溢出，则返回0。
     * 4. 继续循环直到整数变为0。
     * 5. 最后，根据之前记录的正负号，返回相应的结果。
     */
    /**
     * public class ReverseInteger {
            public int reverse(int x) {
                int result = 0;
                boolean isNegative = x < 0;
                
                if (isNegative) {
                    x = -x;
                }
                
                while (x > 0) {
                    int digit = x % 10;
                    
                    if (result > Integer.MAX_VALUE / 10 || (result == Integer.MAX_VALUE / 10 && digit > 7)) {
                        return 0;
                    }
                    
                    result = result * 10 + digit;
                    x /= 10;
                }
                
                return isNegative ? -result : result;
            }
        }
     */
}
