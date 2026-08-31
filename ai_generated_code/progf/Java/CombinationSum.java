package com.kkzhang.medium;

import java.util.ArrayList;
import java.util.List;

/**
 * https://leetcode.com/problems/combination-sum/
 */
public class CombinationSum {

    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(res, new ArrayList<>(), candidates, target, 0);
        return res;
    }

    private void backtrack(List<List<Integer>> res, List<Integer> cur, int[] candidates, int remain, int start) {
        if (remain < 0) {
            return;
        } else if (remain == 0) {
            res.add(new ArrayList<>(cur));
            return;
        } else {
            for (int i = start; i < candidates.length; i++) {
                cur.add(candidates[i]);
                // 由于当前值还可以继续选择，因此下一层递归仍从 i 开始
                backtrack(res, cur, candidates, remain - candidates[i], i);
                cur.remove(cur.size() - 1);
            }
        }
    }

    // Assisted with basic coding tools
    /**
     * 解题思路：
     * 这是一个典型的回溯法问题。
     * 
     * 我们可以使用递归来解决这个问题。
     * 1. 递归函数 combinationSumHelper 有以下参数：
     * * candidates：当前可用的数字列表。
     * * target：当前目标数。
     * * start：从数组的哪一个位置开始选数字。
     * * temp：保存当前组合的临时列表。
     * * result：保存最终的结果。
     * 2. 如果 target 等于0，说明当前组合已经满足要求，将 temp 添加到结果集中。
     * 3. 否则，从 start 开始，依次选择一个数字，将其添加到 temp 中，同时递归调用 combinationSumHelper，将 target
     * 减去当前选择的数字。
     * 4. 在递归调用后，将最后添加的数字从 temp 中移除，以便尝试下一个数字。
     * 5. 重复步骤3和4，直到组合满足要求。
     * 6. 最终，返回结果集。
     */
    /**
     * import java.util.*;

        public class CombinationSum {
            public List<List<Integer>> combinationSum(int[] candidates, int target) {
                List<List<Integer>> result = new ArrayList<>();
                List<Integer> temp = new ArrayList<>();
                combinationSumHelper(candidates, target, 0, temp, result);
                return result;
            }
            
            private void combinationSumHelper(int[] candidates, int target, int start, List<Integer> temp, List<List<Integer>> result) {
                if (target == 0) {
                    result.add(new ArrayList<>(temp));
                    return;
                }
                
                for (int i = start; i < candidates.length; i++) {
                    if (target - candidates[i] >= 0) {
                        temp.add(candidates[i]);
                        combinationSumHelper(candidates, target - candidates[i], i, temp, result);
                        temp.remove(temp.size() - 1);
                    }
                }
            }
        }
     */
}
