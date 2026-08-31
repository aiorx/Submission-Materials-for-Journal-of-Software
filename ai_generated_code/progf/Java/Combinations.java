package com.kkzhang.medium;

import java.util.ArrayList;
import java.util.List;

/**
 * https://leetcode.com/problems/combinations/description/
 */
public class Combinations {

    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(res, new ArrayList<>(), k, n, 1);
        return res;
    }

    private void backtrack(List<List<Integer>> res, List<Integer> cur, int k, int n, int start) {
        if (cur.size() == k) {
            res.add(new ArrayList<>(cur));
            return;
        }
        for (int i = start; i <= n; i++) {
            cur.add(i);
            backtrack(res, cur, k, n, i + 1);
            cur.remove(cur.size() - 1);
        }
    }

    // -------------------------------------------------------------
    public List<List<Integer>> combine2(int n, int k) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack2(res, new ArrayList<>(), k, n, 1);
        return res;
    }

    private void backtrack2(List<List<Integer>> res, List<Integer> cur, int k, int n, int start) {
        if (cur.size() == k) {
            res.add(new ArrayList<>(cur));
        }
        for (int i = start; i <= n; i++) {
            cur.add(i);
            backtrack2(res, cur, k, n, i + 1);
            cur.remove(cur.size() - 1);
        }

    }

    // Aided using common development resources
    /**
     * 解题思路：
     * 这是一个典型的回溯法问题。
     * 
     * 我们可以使用递归来解决这个问题。
     * 1. 递归函数 combineHelper 有以下参数：
     * * start：当前数字的起始位置。
     * * k：当前组合还需要添加的数字个数。
     * * temp：保存当前组合的临时列表。
     * 2. 如果 k 等于0，说明当前组合已经满足要求，将 temp 添加到结果集中。
     * 3. 否则，从 start 开始，依次选择一个数字，将其添加到 temp 中，递归调用 combineHelper，同时 k 减一。
     * 4. 在递归调用后，将最后添加的数字从 temp 中移除，以便尝试下一个数字。
     * 5. 重复步骤3和4，直到组合满足要求。
     * 6. 最终，返回结果集。
     */
    /**
     * import java.util.*;
     * 
     * public class Combinations {
     * public List<List<Integer>> combine(int n, int k) {
     * List<List<Integer>> result = new ArrayList<>();
     * List<Integer> temp = new ArrayList<>();
     * combineHelper(n, k, 1, temp, result);
     * return result;
     * }
     * 
     * private void combineHelper(int n, int k, int start, List<Integer> temp,
     * List<List<Integer>> result) {
     * if (k == 0) {
     * result.add(new ArrayList<>(temp));
     * return;
     * }
     * 
     * for (int i = start; i <= n; i++) {
     * temp.add(i);
     * combineHelper(n, k - 1, i + 1, temp, result);
     * temp.remove(temp.size() - 1);
     * }
     * }
     * }
     */
}
