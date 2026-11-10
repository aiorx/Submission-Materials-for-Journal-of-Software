    // This code is copied Derived using common development resources

    import java.util.HashMap;
    import java.util.Map;

    class LeetCode1497 {
        public static void main(String[] args) {
            int[] arr = {-1, 1, -2, 2, -3, 3, -4, 4};
            int k = 3;

            System.out.println(canArrange(arr, k));
        }

        static boolean canArrange(int[] arr, int k) {
            Map<Integer, Integer> remainderCount = new HashMap<>();

            for (int num : arr) {
                int rem = ((num % k) + k) % k;  
                remainderCount.put(rem, remainderCount.getOrDefault(rem, 0) + 1);
            }

            for (int rem : remainderCount.keySet()) {
                int count = remainderCount.get(rem);

                if (rem == 0) {  
                    if (count % 2 != 0) return false;
                } else if (rem * 2 == k) {  
                    if (count % 2 != 0) return false;
                } else {
                    int complementCount = remainderCount.getOrDefault(k - rem, 0);
                    if (count != complementCount) return false;
                }
            }
            return true;
        }
    }

