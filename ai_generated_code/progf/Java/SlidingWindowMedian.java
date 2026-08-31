// This is a educative.io problem. Solution is Derived using common development resources.
// https://www.educative.io/courses/grokking-coding-interview-patterns-java/sliding-window-median
public class SlidingWindowMedian {
    private PriorityQueue<Integer> maxHeapForSmallNums; // max-heap for the lower half
    private PriorityQueue<Integer> minHeapForLargeNums; // min-heap for the upper half

    public SlidingWindowMedian() {
        maxHeapForSmallNums = new PriorityQueue<>((a,b) -> b - a);
        minHeapForLargeNums = new PriorityQueue<>((a,b) -> a - b);
    }

    // same as Median in Data Stream
    public void insertNum(int num) {
        maxHeapForSmallNums.add(num);
        minHeapForLargeNums.add(maxHeapForSmallNums.poll());
        if (minHeapForLargeNums.size() > maxHeapForSmallNums.size()) {
            maxHeapForSmallNums.add(minHeapForLargeNums.poll());
        }
    }

    // same as Median in Data Stream
    public double findMedian() {
        if (maxHeapForSmallNums.size() == minHeapForLargeNums.size()) {
            return (maxHeapForSmallNums.peek() + minHeapForLargeNums.peek()) / 2.0;
        }
        return maxHeapForSmallNums.peek();
    }


    private void removeNum(int num) {
        if (num <= maxHeapForSmallNums.peek()) {
            maxHeapForSmallNums.remove(num);
        } else {
            minHeapForLargeNums.remove(num);
        }
        // Rebalance the heaps if necessary
        if (maxHeapForSmallNums.size() < minHeapForLargeNums.size()) {
            maxHeapForSmallNums.add(minHeapForLargeNums.poll());
        } else if (maxHeapForSmallNums.size() > minHeapForLargeNums.size() + 1) {
            minHeapForLargeNums.add(maxHeapForSmallNums.poll());
        }
    }

    public double[] findSlidingWindowMedian(int[] nums, int k) {
        double[] result = new double[nums.length - k + 1];
        for (int i = 0; i < nums.length; i++) {
            insertNum(nums[i]);

            // Remove element outside the sliding window
            if (i >= k) {
                removeNum(nums[i - k]);
            }

            // Compute median for the current window
            if (i >= k - 1) {
                result[i - k + 1] = findMedian();
            }
        }
        return result;
    }

    public static void main(String[] args) {
        SlidingWindowMedian swm = new SlidingWindowMedian();
        int[] nums = {1, 3, -1, -3, 5, 3, 6, 7};
        int k = 3;
        double[] medians = swm.findSlidingWindowMedian(nums, k);
        System.out.println(Arrays.toString(medians));
    }
}

Explanation:
Priority Queues:

1. maxHeapForSmallNums: A max-heap to store the smaller half of the numbers. minHeapForLargeNums: A min-heap to store the larger half of the numbers.
2. insertNum(int num):

Adds a new number to the appropriate heap based on its value.
Rebalances the heaps if necessary to ensure the size property is maintained.

3. findMedian():

Calculates and returns the median based on the sizes of the heaps:
If the heaps are of equal size, the median is the average of the roots of both heaps.
        Otherwise, the median is the root of the maxHeapForSmallNums.
