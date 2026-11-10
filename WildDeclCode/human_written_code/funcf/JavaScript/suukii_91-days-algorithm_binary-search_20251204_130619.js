```javascript
/**
 * @description 在排序数组中寻找最右边的满足条件的值
 * @param {number[]} nums
 * @param {number} target
 * @returns {number}
 */
function binarySearchRight(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (nums[mid] <= target) left = mid + 1;
    else right = mid - 1;
  }

  // 检查是否越界
  if (right < 0 || nums[right] != target) return -1;

  return right;
}
```