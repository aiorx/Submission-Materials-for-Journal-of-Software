package advanced.arrays;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Stack;

// import javax.swing.tree.TreeNode;

 class TreeNode {
         int val;
         TreeNode left;
         TreeNode right;
         TreeNode() {}
         TreeNode(int val) { this.val = val; }
         TreeNode(int val, TreeNode left, TreeNode right) {
             this.val = val;
             this.left = left;
             this.right = right;
         }
     }


class ListNode {
     int val;
     ListNode next;
     ListNode() {}
     ListNode(int val) { this.val = val; }
     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 }

public class ArraysLeetCode {
    // 1331. Rank Transform of an Array
    // Solved
    // Easy
    // Topics
    // Companies
    // Hint
    // Given an array of integers arr, replace each element with its rank.

    // The rank represents how large the element is. The rank has the following rules:

    // Rank is an integer starting from 1.
    // The larger the element, the larger the rank. If two elements are equal, their rank must be the same.
    // Rank should be as small as possible.
    

    // Example 1:

    // Input: arr = [40,10,20,30]
    // Output: [4,1,2,3]
    // Explanation: 40 is the largest element. 10 is the smallest. 20 is the second smallest. 30 is the third smallest.
    // Example 2:

    // Input: arr = [100,100,100]
    // Output: [1,1,1]
    // Explanation: Same elements share the same rank.
    // Example 3:

    // Input: arr = [37,12,28,9,100,56,80,5,12]
    // Output: [5,3,4,2,8,6,7,1,3]
    

    // Constraints:

    // 0 <= arr.length <= 105
    // -109 <= arr[i] <= 109

    // Solution by me - 24 ms
    public int[] arrayRankTransform(int[] arr) {        
        int n = arr.length;
        int[] temp = new int[n];

        for(int i=0;i<n;i++) {
            temp[i] = arr[i];
        }
        Arrays.sort(temp);

        HashMap<Integer, Integer> hm = new HashMap<>();
        int rank = 0;
        for(int i=0;i<n;i++) {
            if(!hm.containsKey(temp[i])) {
                hm.put(temp[i], ++rank);
            }
        }

        for(int i=0;i<n;i++) {
            temp[i] = hm.get(arr[i]);
        }

        return temp;
    }

    // Other solution - 6 ms

    public int[] arrayRankTransformOther(int[] arr) {
        if (arr == null || arr.length == 0) {
            return new int[0];
        }

        // Find min and max values
        int min = Integer.MAX_VALUE;
        int max = Integer.MIN_VALUE;
        for (int num : arr) {
            min = Math.min(min, num);
            max = Math.max(max, num);
        }

        // Create a count array
        int range = max - min + 1;
        if (range > 2_000_000) {
            // Fall back to sorting method if range is too large
            return sortingMethod(arr);
        }

        boolean[] count = new boolean[range];
        for (int num : arr) {
            count[num - min] = true;
        }

        // Calculate ranks
        int[] ranks = new int[range];
        int rank = 1;
        for (int i = 0; i < range; i++) {
            if (count[i]) {
                ranks[i] = rank++;
            }
        }

        // Assign ranks to original array
        for (int i = 0; i < arr.length; i++) {
            arr[i] = ranks[arr[i] - min];
        }

        return arr;
    }

    private int[] sortingMethod(int[] arr) {
        int[] sortedArr = Arrays.copyOf(arr, arr.length);
        Arrays.sort(sortedArr);
        
        Map<Integer, Integer> rankMap = new HashMap<>();
        int rank = 1;
        for (int num : sortedArr) {
            if (!rankMap.containsKey(num)) {
                rankMap.put(num, rank++);
            }
        }
        
        int[] result = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            result[i] = rankMap.get(arr[i]);
        }
        
        return result;
    }

    // -------------------------------------------------------





    // 386. Lexicographical Numbers
    // Solved
    // Medium
    // Topics
    // Companies
    // Given an integer n, return all the numbers in the range [1, n] sorted in lexicographical order.

    // You must write an algorithm that runs in O(n) time and uses O(1) extra space. 

    // Example 1:

    // Input: n = 13
    // Output: [1,10,11,12,13,2,3,4,5,6,7,8,9]
    // Example 2:

    // Input: n = 2
    // Output: [1,2]

    // Constraints:

    // 1 <= n <= 5 * 104

    // Solution Recursive - 2 ms

    public List<Integer> lexicalOrderRecursive(int n) {
        List<Integer> lexicographicalNumbers = new ArrayList<>();
        // Start generating numbers from 1 to 9
        for (int start = 1; start <= 9; ++start) {
            generateLexicalNumbers(start, n, lexicographicalNumbers);
        }
        return lexicographicalNumbers;
    }

    private void generateLexicalNumbers(
        int currentNumber,
        int limit,
        List<Integer> result
    ) {
        // If the current number exceeds the limit, stop recursion
        if (currentNumber > limit) return;

        // Add the current number to the result
        result.add(currentNumber);

        // Try to append digits from 0 to 9 to the current number
        for (int nextDigit = 0; nextDigit <= 9; ++nextDigit) {
            int nextNumber = currentNumber * 10 + nextDigit;
            // If the next number is within the limit, continue recursion
            if (nextNumber <= limit) {
                generateLexicalNumbers(nextNumber, limit, result);
            } else {
                break; // No need to continue if nextNumber exceeds limit
            }
        }
    }

    // Solution Iterative - 5 ms

    public List<Integer> lexicalOrder(int n) {
        List<Integer> lexicographicalNumbers = new ArrayList<>();
        int currentNumber = 1;

        // Generate numbers from 1 to n
        for (int i = 0; i < n; ++i) {
            lexicographicalNumbers.add(currentNumber);

            // If multiplying the current number by 10 is within the limit, do it
            if (currentNumber * 10 <= n) {
                currentNumber *= 10;
            } else {
                // Adjust the current number by moving up one digit
                while (currentNumber % 10 == 9 || currentNumber >= n) {
                    currentNumber /= 10; // Remove the last digit
                }
                currentNumber += 1; // Increment the number
            }
        }

        return lexicographicalNumbers;
    }

    // ------------------------------------------------------------



    // 2751. Robot Collisions
    // Solved
    // Hard
    // Topics
    // Companies
    // Hint
    // There are n 1-indexed robots, each having a position on a line, health, and movement direction.

    // You are given 0-indexed integer arrays positions, healths, and a string directions (directions[i] is either 'L' for left or 'R' for right). All integers in positions are unique.

    // All robots start moving on the line simultaneously at the same speed in their given directions. If two robots ever share the same position while moving, they will collide.

    // If two robots collide, the robot with lower health is removed from the line, and the health of the other robot decreases by one. The surviving robot continues in the same direction it was going. If both robots have the same health, they are both removed from the line.

    // Your task is to determine the health of the robots that survive the collisions, in the same order that the robots were given, i.e. final health of robot 1 (if survived), final health of robot 2 (if survived), and so on. If there are no survivors, return an empty array.

    // Return an array containing the health of the remaining robots (in the order they were given in the input), after no further collisions can occur.

    // Note: The positions may be unsorted.

    // Example 1:

    // Input: positions = [5,4,3,2,1], healths = [2,17,9,15,10], directions = "RRRRR"
    // Output: [2,17,9,15,10]
    // Explanation: No collision occurs in this example, since all robots are moving in the same direction. So, the health of the robots in order from the first robot is returned, [2, 17, 9, 15, 10].
    // Example 2:

    // Input: positions = [3,5,2,6], healths = [10,10,15,12], directions = "RLRL"
    // Output: [14]
    // Explanation: There are 2 collisions in this example. Firstly, robot 1 and robot 2 will collide, and since both have the same health, they will be removed from the line. Next, robot 3 and robot 4 will collide and since robot 4's health is smaller, it gets removed, and robot 3's health becomes 15 - 1 = 14. Only robot 3 remains, so we return [14].
    // Example 3:

    // Input: positions = [1,2,5,6], healths = [10,10,11,11], directions = "RLRL"
    // Output: []
    // Explanation: Robot 1 and robot 2 will collide and since both have the same health, they are both removed. Robot 3 and 4 will collide and since both have the same health, they are both removed. So, we return an empty array, [].
    

    // Constraints:

    // 1 <= positions.length == healths.length == directions.length == n <= 105
    // 1 <= positions[i], healths[i] <= 109
    // directions[i] == 'L' or directions[i] == 'R'
    // All values in positions are distinct


    // Solution by me - 91 ms

    public List<Integer> survivedRobotsHealths(int[] positions, int[] healths, String directions) {
        int n = positions.length;
        int[][] robots = new int[n][4];
        
        // Combine positions, healths, and directions into a single array for sorting
        for (int i = 0; i < n; i++) {
            robots[i][0] = positions[i];
            robots[i][1] = healths[i];
            robots[i][2] = directions.charAt(i) == 'R' ? 1 : -1; // 1 for 'R', -1 for 'L'
            robots[i][3] = i; // Original index
        }
        
        // Sort robots by their positions
        Arrays.sort(robots, Comparator.comparingInt(a -> a[0]));
        
        Stack<int[]> stack = new Stack<>();
        
        for (int[] robot : robots) {
            int pos = robot[0];
            int health = robot[1];
            int dir = robot[2];
            int originalIndex = robot[3];
            
            if (dir == 1) {
                stack.push(robot);
            } else {
                while (!stack.isEmpty() && stack.peek()[2] == 1 && stack.peek()[1] < health) {
                    int[] r = stack.pop();
                    health -= 1;
                }
                if (!stack.isEmpty() && stack.peek()[2] == 1 && stack.peek()[1] == health) {
                    stack.pop();
                } else if (!stack.isEmpty() && stack.peek()[2] == 1) {
                    stack.peek()[1] -= 1;
                } else {
                    robot[1] = health;
                    stack.push(robot);
                }
            }
        }
        
        // Collect remaining robots and sort by original indices
        List<int[]> survivors = new ArrayList<>(stack);
        survivors.sort(Comparator.comparingInt(a -> a[3]));
        List<Integer> survivors1 = new ArrayList<>();
        for (int[] robot : survivors) {
                survivors1.add(robot[1]);
        }
        return survivors1;
    }


    // Fastest Solution - 11 ms 

    public List<Integer> survivedRobotsHealthsFastest(int[] positions, int[] healths, String directions) {
        var robots = new long[positions.length];
        for (int i = 0; i < robots.length; i++) {
            robots[i] = (((long) positions[i]) << 32) | i;
        }
        Arrays.sort(robots);
        int sl = 0;
        for (long posAndIndex : robots) {
            int robot = (int) posAndIndex;
            if(directions.charAt(robot) == 'R') {
                robots[sl++] = robot;
            } else {
                while(sl != 0 && healths[robot] != 0) {
                    int other = (int) robots[sl - 1];
                    if (healths[other] > healths[robot]) {
                        healths[robot] = 0;
                        healths[other]--;
                    } else if (healths[other] < healths[robot]) {
                        healths[other] = 0;
                        healths[robot]--;
                        sl--;
                    } else {
                        healths[other] = 0;
                        healths[robot] = 0;
                        sl--;
                    }
                }
            }
        }
        var ans = new ArrayList<Integer>(positions.length);
        for (int health : healths) {
            if (health > 0) ans.add(health);
        }
        return ans;
    }



    // -----------------------------------------------------


    // 1701. Average Waiting Time
    // Solved
    // Medium
    // Topics
    // Companies
    // Hint
    // There is a restaurant with a single chef. You are given an array customers, where customers[i] = [arrivali, timei]:

    // arrivali is the arrival time of the ith customer. The arrival times are sorted in non-decreasing order.
    // timei is the time needed to prepare the order of the ith customer.
    // When a customer arrives, he gives the chef his order, and the chef starts preparing it once he is idle. The customer waits till the chef finishes preparing his order. The chef does not prepare food for more than one customer at a time. The chef prepares food for customers in the order they were given in the input.

    // Return the average waiting time of all customers. Solutions within 10-5 from the actual answer are considered accepted.

    // Example 1:

    // Input: customers = [[1,2],[2,5],[4,3]]
    // Output: 5.00000
    // Explanation:
    // 1) The first customer arrives at time 1, the chef takes his order and starts preparing it immediately at time 1, and finishes at time 3, so the waiting time of the first customer is 3 - 1 = 2.
    // 2) The second customer arrives at time 2, the chef takes his order and starts preparing it at time 3, and finishes at time 8, so the waiting time of the second customer is 8 - 2 = 6.
    // 3) The third customer arrives at time 4, the chef takes his order and starts preparing it at time 8, and finishes at time 11, so the waiting time of the third customer is 11 - 4 = 7.
    // So the average waiting time = (2 + 6 + 7) / 3 = 5.
    // Example 2:

    // Input: customers = [[5,2],[5,4],[10,3],[20,1]]
    // Output: 3.25000
    // Explanation:
    // 1) The first customer arrives at time 5, the chef takes his order and starts preparing it immediately at time 5, and finishes at time 7, so the waiting time of the first customer is 7 - 5 = 2.
    // 2) The second customer arrives at time 5, the chef takes his order and starts preparing it at time 7, and finishes at time 11, so the waiting time of the second customer is 11 - 5 = 6.
    // 3) The third customer arrives at time 10, the chef takes his order and starts preparing it at time 11, and finishes at time 14, so the waiting time of the third customer is 14 - 10 = 4.
    // 4) The fourth customer arrives at time 20, the chef takes his order and starts preparing it immediately at time 20, and finishes at time 21, so the waiting time of the fourth customer is 21 - 20 = 1.
    // So the average waiting time = (2 + 6 + 4 + 1) / 4 = 3.25.
    

    // Constraints:

    // 1 <= customers.length <= 105
    // 1 <= arrivali, timei <= 104
    // arrivali <= arrivali+1

    // Solution by me - 3 ms

    public double averageWaitingTime(int[][] customers) {
        long currentTime = 0;
        long totalWaitingTime = 0;

        for (int[] customer : customers) {
            int arrival = customer[0];
            int time = customer[1];

            // The chef starts preparing the order when the customer arrives or when he finishes the previous order, whichever is later.
            currentTime = Math.max(currentTime, arrival) + time;
            totalWaitingTime += (currentTime - arrival);
        }

        return (double) totalWaitingTime / customers.length;
    }


    // Fastest solution - 2 ms
    public double averageWaitingTimeFastest(int[][] customers) {
        long totalWait = 0L;

        int shefBusy = 0;
        for (final int[] customer : customers)
        {
            int arriveTime = customer[0];
            int foodTime = customer[1];

            final int waitTime;
            if (arriveTime > shefBusy)
            {
                waitTime = foodTime;
                shefBusy = arriveTime + foodTime;
            } else {
                waitTime = foodTime + (shefBusy - arriveTime);
                shefBusy = shefBusy + foodTime;
            }

            totalWait += waitTime;
        }

        return (double) totalWait / customers.length;
    }


    // ---------------------------------------------------------

    // 2326. Spiral Matrix IV
    // Medium
    // Topics
    // Companies
    // Hint
    // You are given two integers m and n, which represent the dimensions of a matrix.

    // You are also given the head of a linked list of integers.

    // Generate an m x n matrix that contains the integers in the linked list presented in spiral order (clockwise), starting from the top-left of the matrix. If there are remaining empty spaces, fill them with -1.

    // Return the generated matrix.


    // Example 1:


    // Input: m = 3, n = 5, head = [3,0,2,6,8,1,7,9,4,2,5,5,0]
    // Output: [[3,0,2,6,8],[5,0,-1,-1,1],[5,2,4,9,7]]
    // Explanation: The diagram above shows how the values are printed in the matrix.
    // Note that the remaining spaces in the matrix are filled with -1.
    // Example 2:


    // Input: m = 1, n = 4, head = [0,1,2]
    // Output: [[0,1,2,-1]]
    // Explanation: The diagram above shows how the values are printed from left to right in the matrix.
    // The last space in the matrix is set to -1.
    

    // Constraints:

    // 1 <= m, n <= 105
    // 1 <= m * n <= 105
    // The number of nodes in the list is in the range [1, m * n].
    // 0 <= Node.val <= 1000


    // Solution by me - 20 ms

    public int[][] spiralMatrix(int m, int n, ListNode head) {
        int[][] dir = new int[][]{{0,0},{}};
        int iterationCount = 0;
        int row = 0, col = 0;
        ListNode temp = head;
        int[][] matrix = new int[m][n];
        
        while(m>1 && n>1) {
            int i=row,j=col;
            System.out.println(i + " " + j);
            for(int k=0;k<n-1;k++) {
                if(temp != null) {
                    matrix[i][j] = temp.val;
                    temp = temp.next;
                } else {
                    matrix[i][j] = -1;
                }
                j++;
            }
            for(int k=0;k<m-1;k++) {
                if(temp != null) {
                    matrix[i][j] = temp.val;
                    temp = temp.next;
                } else {
                    matrix[i][j] = -1;
                }
                i++;
            }
            for(int k=0;k<n-1;k++) {
                if(temp != null) {
                    matrix[i][j] = temp.val;
                    temp = temp.next;
                } else {
                    matrix[i][j] = -1;
                }
                j--;
            }
            for(int k=0;k<m-1;k++) {
                if(temp != null) {
                    matrix[i][j] = temp.val;
                    temp = temp.next;
                } else {
                    matrix[i][j] = -1;
                }
                i--;
            }
            row++;col++;n=n-2;m=m-2;
        }

        System.out.println("row: " + row + " col: " + col);
        System.out.println("m " + m + " " + row);

        // Case 1: Remaining row(s)
    if (m == 1) {
        for (int j = col; j < col + n; j++) {
            matrix[row][j] = temp != null ? temp.val : -1;
            temp = temp != null ? temp.next : null;
        }
    } else if (n == 1) {
        for (int i = row; i < row + m; i++) {
            matrix[i][col] = temp != null ? temp.val : -1;
            temp = temp != null ? temp.next : null;
        }
    }
        return matrix;
    }




    // Faster Assisted with basic coding tools - 7 ms

    public int[][] spiralMatrixFaster(int m, int n, ListNode head) {
        // Step 1: Create a matrix of m x n and fill it with -1
        int[][] matrix = new int[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                matrix[i][j] = -1;
            }
        }
        
        // Step 2: Define the boundaries for spiral traversal
        int top = 0, bottom = m - 1, left = 0, right = n - 1;
        
        ListNode current = head;
        
        // Step 3: Start filling the matrix in spiral order
        while (top <= bottom && left <= right && current != null) {
            // Move right
            for (int i = left; i <= right && current != null; i++) {
                matrix[top][i] = current.val;
                current = current.next;
            }
            top++;
            
            // Move down
            for (int i = top; i <= bottom && current != null; i++) {
                matrix[i][right] = current.val;
                current = current.next;
            }
            right--;
            
            // Move left
            for (int i = right; i >= left && current != null; i--) {
                matrix[bottom][i] = current.val;
                current = current.next;
            }
            bottom--;
            
            // Move up
            for (int i = bottom; i >= top && current != null; i--) {
                matrix[i][left] = current.val;
                current = current.next;
            }
            left++;
        }
        
        return matrix;
    }


    // Fastest Solution - 4 ms
        public int[][] spiralMatrixFastest(int rows, int columns, ListNode head) {
            int[][] matrix = new int[rows][];
            for (int i = 0; i < rows; i++) {
                matrix[i] = new int [columns];
                Arrays.fill(matrix[i], -1);
            }
    
            int topRow = 0, bottomRow = rows - 1, leftColumn = 0, rightColumn = columns - 1;
            while (head != null) {
            
                for (int col = leftColumn; col <= rightColumn && head != null; col++) {
                    matrix[topRow][col] = head.val;
                    head = head.next;
                }
                topRow++;
    
            
                for (int row = topRow; row <= bottomRow && head != null; row++) {
                    matrix[row][rightColumn] = head.val;
                    head = head.next;
                }
                rightColumn--;
    
     
                for (int col = rightColumn; col >= leftColumn && head != null; col--) {
                    matrix[bottomRow][col] = head.val;
                    head = head.next;
                }
                bottomRow--;
    
           
                for (int row = bottomRow; row >= topRow && head != null; row--) {
                    matrix[row][leftColumn] = head.val;
                    head = head.next;
                }
                leftColumn++;
            }
    
            return matrix;
        }


    // ----------------------------------------------------------------------------

    // 2028. Find Missing Observations
    // Solved
    // Medium
    // Topics
    // Companies
    // Hint
    // You have observations of n + m 6-sided dice rolls with each face numbered from 1 to 6. n of the observations went missing, and you only have the observations of m rolls. Fortunately, you have also calculated the average value of the n + m rolls.

    // You are given an integer array rolls of length m where rolls[i] is the value of the ith observation. You are also given the two integers mean and n.

    // Return an array of length n containing the missing observations such that the average value of the n + m rolls is exactly mean. If there are multiple valid answers, return any of them. If no such array exists, return an empty array.

    // The average value of a set of k numbers is the sum of the numbers divided by k.

    // Note that mean is an integer, so the sum of the n + m rolls should be divisible by n + m.

    

    // Example 1:

    // Input: rolls = [3,2,4,3], mean = 4, n = 2
    // Output: [6,6]
    // Explanation: The mean of all n + m rolls is (3 + 2 + 4 + 3 + 6 + 6) / 6 = 4.
    // Example 2:

    // Input: rolls = [1,5,6], mean = 3, n = 4
    // Output: [2,3,2,2]
    // Explanation: The mean of all n + m rolls is (1 + 5 + 6 + 2 + 3 + 2 + 2) / 7 = 3.
    // Example 3:

    // Input: rolls = [1,2,3,4], mean = 6, n = 4
    // Output: []
    // Explanation: It is impossible for the mean to be 6 no matter what the 4 missing rolls are.
    

    // Constraints:

    // m == rolls.length
    // 1 <= n, m <= 105
    // 1 <= rolls[i], mean <= 6


    // Solution by me - 5 ms;
    public int[] missingRolls(int[] rolls, int mean, int n) {
        int m = rolls.length;
        int sum = 0;

        for(int i=0;i<m;i++) {
            sum += rolls[i];
        }

        int sumOfRemainingElements = (n+m)*mean - sum;
        //System.out.println(sumOfRemainingElements);
        //System.out.println((sumOfRemainingElements - (n*6)));

        if(sumOfRemainingElements < 0  || sumOfRemainingElements < n || (sumOfRemainingElements - (n*6)) > 0) {
            return new int[]{};
        }
        int[] arr = new int[n];
        int tempSum = 0;
        // 9, 4 4-1*(9/4) = 6, 9-6 3
        int lastElement = sumOfRemainingElements - (n-1)*(sumOfRemainingElements/n);
        int sumToAdjust = 0;
        if((lastElement-6) > 0) {
            sumToAdjust = lastElement-6;
        }
        for(int i=0;i<n;i++) {
            if(i!=(n-1)) {
                arr[i] = sumOfRemainingElements/n;
                tempSum += arr[i];
                if(sumToAdjust > 0 && arr[i]<6) {
                    arr[i]++;
                    tempSum++;
                    sumToAdjust--;
                }
            } else {
                arr[i] = sumOfRemainingElements - tempSum;
            }
        }

        // 9, 4 4-1*(9/4) = 6, 9-6 3
        // i=0 2 2
        // i=1 2 4
        // i=2 2 6
        // i=3 3

        return arr;
    }


    // Assisted with basic coding tools - 4 ms
    public int[] missingRollsGPT(int[] rolls, int mean, int n) {
        int m = rolls.length;
        // Calculate the total sum for n + m rolls
        int totalSum = (n + m) * mean;
        
        // Calculate the sum of the given rolls
        int currentSum = 0;
        for (int roll : rolls) {
            currentSum += roll;
        }
        
        // The missing sum we need to achieve with the n missing rolls
        int missingSum = totalSum - currentSum;
        
        // Each missing roll must be between 1 and 6, so the total missing sum must be within range
        if (missingSum < n || missingSum > 6 * n) {
            return new int[0];  // No valid solution
        }
        
        // Distribute the missing sum over the n missing rolls
        int[] result = new int[n];
        Arrays.fill(result, 1);  // Start by assigning 1 to each missing roll
        missingSum -= n;  // Subtract the sum we have already assigned (n * 1)
        
        // Now distribute the remaining sum (missingSum) over the result array
        for (int i = 0; i < n && missingSum > 0; i++) {
            // We can add up to 5 to each roll (since each is already 1, and max is 6)
            int add = Math.min(5, missingSum);
            result[i] += add;
            missingSum -= add;
        }
        
        return result;
    }

    // Fastest Solution -2 ms
    public int[] missingRollsFastest(int[] rolls, int mean, int n) {
        int[] ret = new int[n];
        int sum = 0;
        for (int i : rolls) {
            sum += i;
        }
        int missingSum = mean * (n + rolls.length) - sum;
        if (missingSum > 6*n || missingSum < n) {
            return new int[]{};
        }
        int expectedAvg = missingSum/n, remainder = missingSum%n;

        for (int i = 0; i < remainder; i++) {
            ret[i] = expectedAvg + 1;
        }
        for (int i = remainder; i < n;i++) {
            ret[i] = expectedAvg;
        }
        return ret;
    }

    // --------------------------------------------------

    // 2022. Convert 1D Array Into 2D Array
    // Solved
    // Easy
    // Topics
    // Companies
    // Hint
    // You are given a 0-indexed 1-dimensional (1D) integer array original, and two integers, m and n. You are tasked with creating a 2-dimensional (2D) array with  m rows and n columns using all the elements from original.

    // The elements from indices 0 to n - 1 (inclusive) of original should form the first row of the constructed 2D array, the elements from indices n to 2 * n - 1 (inclusive) should form the second row of the constructed 2D array, and so on.

    // Return an m x n 2D array constructed according to the above procedure, or an empty 2D array if it is impossible.

    

    // Example 1:


    // Input: original = [1,2,3,4], m = 2, n = 2
    // Output: [[1,2],[3,4]]
    // Explanation: The constructed 2D array should contain 2 rows and 2 columns.
    // The first group of n=2 elements in original, [1,2], becomes the first row in the constructed 2D array.
    // The second group of n=2 elements in original, [3,4], becomes the second row in the constructed 2D array.
    // Example 2:

    // Input: original = [1,2,3], m = 1, n = 3
    // Output: [[1,2,3]]
    // Explanation: The constructed 2D array should contain 1 row and 3 columns.
    // Put all three elements in original into the first row of the constructed 2D array.
    // Example 3:

    // Input: original = [1,2], m = 1, n = 1
    // Output: []
    // Explanation: There are 2 elements in original.
    // It is impossible to fit 2 elements in a 1x1 2D array, so return an empty 2D array.
    

    // Constraints:

    // 1 <= original.length <= 5 * 104
    // 1 <= original[i] <= 105
    // 1 <= m, n <= 4 * 104



    // Solution by me - 6 ms
    public int[][] construct2DArray(int[] original, int m, int n) {
        // Check if it's possible to construct a m x n 2D array
        if (original.length != m * n) {
            return new int[0][0]; // Return empty 2D array
        }

        // Initialize the 2D array with dimensions m x n
        int[][] result = new int[m][n];

        // Populate the 2D array using elements from the original 1D array
        for (int i = 0; i < original.length; i++) {
            int row = i / n; // Calculate row index
            int col = i % n; // Calculate column index
            result[row][col] = original[i];
        }

        return result;
    }

    // Fastest solution - 2 ms

    public int[][] construct2DArrayFastest(int[] original, int m, int n) {
        if (m * n != original.length) {
            return new int[0][0]; 
        }
        
        int[][] result = new int[m][];

        for (int i = 0; i < m; i++) {
            result[i] = Arrays.copyOfRange(original, i * n, i * n + n);
        }

        return result;
    }




    // ------------------------------------------------------------------------

    // 1894. Find the Student that Will Replace the Chalk
    // Solved
    // Medium
    // Topics
    // Companies
    // Hint
    // There are n students in a class numbered from 0 to n - 1. The teacher will give each student a problem starting with the student number 0, then the student number 1, and so on until the teacher reaches the student number n - 1. After that, the teacher will restart the process, starting with the student number 0 again.

    // You are given a 0-indexed integer array chalk and an integer k. There are initially k pieces of chalk. When the student number i is given a problem to solve, they will use chalk[i] pieces of chalk to solve that problem. However, if the current number of chalk pieces is strictly less than chalk[i], then the student number i will be asked to replace the chalk.

    // Return the index of the student that will replace the chalk pieces.

    

    // Example 1:

    // Input: chalk = [5,1,5], k = 22
    // Output: 0
    // Explanation: The students go in turns as follows:
    // - Student number 0 uses 5 chalk, so k = 17.
    // - Student number 1 uses 1 chalk, so k = 16.
    // - Student number 2 uses 5 chalk, so k = 11.
    // - Student number 0 uses 5 chalk, so k = 6.
    // - Student number 1 uses 1 chalk, so k = 5.
    // - Student number 2 uses 5 chalk, so k = 0.
    // Student number 0 does not have enough chalk, so they will have to replace it.
    // Example 2:

    // Input: chalk = [3,4,1,2], k = 25
    // Output: 1
    // Explanation: The students go in turns as follows:
    // - Student number 0 uses 3 chalk so k = 22.
    // - Student number 1 uses 4 chalk so k = 18.
    // - Student number 2 uses 1 chalk so k = 17.
    // - Student number 3 uses 2 chalk so k = 15.
    // - Student number 0 uses 3 chalk so k = 12.
    // - Student number 1 uses 4 chalk so k = 8.
    // - Student number 2 uses 1 chalk so k = 7.
    // - Student number 3 uses 2 chalk so k = 5.
    // - Student number 0 uses 3 chalk so k = 2.
    // Student number 1 does not have enough chalk, so they will have to replace it.
    

    // Constraints:

    // chalk.length == n
    // 1 <= n <= 105
    // 1 <= chalk[i] <= 105
    // 1 <= k <= 109


    // Solutionby me - 2 ms

    public int chalkReplacer(int[] chalk, int k) {
        // Step 1: Calculate the total chalk needed for one full round
        long totalChalk = 0;
        for (int c : chalk) {
            totalChalk += c;
        }

        // Step 2: Reduce k using modulo to handle full rounds efficiently
        k %= totalChalk;

        // Step 3: Find the student who will run out of chalk
        for (int i = 0; i < chalk.length; i++) {
            if (k < chalk[i]) {
                return i;
            }
            k -= chalk[i];
        }

        // This line should never be reached if the input constraints are met
        return -1;
    }

    // Solution fastest - 2 ms

    public int chalkReplacerFastest(int[] chalk, int p) {
        long k = (long)(p);
        long sum = 0;
        for (int i = 0; i < chalk.length; i++) {
            sum += chalk[i];
        }
        if(k % sum == 0)return 0;
        long value = 0;
        long count = 0;
        while (sum + value < k) {
            value = (sum) + value;
            count++;
        }
       if(k - (sum * count) > 0){
            k = k - (sum * count);
       }
        

        for(int i = 0; i < chalk.length; i++){
            if(k - chalk[i] > -1){
                 k = k - chalk[i];
            }else {
                return i;
            }
           
        }
        return 0;
    }


    // 874. Walking Robot Simulation
    // Solved
    // Medium
    // Topics
    // Companies
    // A robot on an infinite XY-plane starts at point (0, 0) facing north. The robot can receive a sequence of these three possible types of commands:

    // -2: Turn left 90 degrees.
    // -1: Turn right 90 degrees.
    // 1 <= k <= 9: Move forward k units, one unit at a time.
    // Some of the grid squares are obstacles. The ith obstacle is at grid point obstacles[i] = (xi, yi). If the robot runs into an obstacle, then it will instead stay in its current location and move on to the next command.

    // Return the maximum Euclidean distance that the robot ever gets from the origin squared (i.e. if the distance is 5, return 25).

    // Note:

    // North means +Y direction.
    // East means +X direction.
    // South means -Y direction.
    // West means -X direction.
    // There can be obstacle in [0,0].
    

    // Example 1:

    // Input: commands = [4,-1,3], obstacles = []
    // Output: 25
    // Explanation: The robot starts at (0, 0):
    // 1. Move north 4 units to (0, 4).
    // 2. Turn right.
    // 3. Move east 3 units to (3, 4).
    // The furthest point the robot ever gets from the origin is (3, 4), which squared is 32 + 42 = 25 units away.
    // Example 2:

    // Input: commands = [4,-1,4,-2,4], obstacles = [[2,4]]
    // Output: 65
    // Explanation: The robot starts at (0, 0):
    // 1. Move north 4 units to (0, 4).
    // 2. Turn right.
    // 3. Move east 1 unit and get blocked by the obstacle at (2, 4), robot is at (1, 4).
    // 4. Turn left.
    // 5. Move north 4 units to (1, 8).
    // The furthest point the robot ever gets from the origin is (1, 8), which squared is 12 + 82 = 65 units away.
    // Example 3:

    // Input: commands = [6,-1,-1,6], obstacles = []
    // Output: 36
    // Explanation: The robot starts at (0, 0):
    // 1. Move north 6 units to (0, 6).
    // 2. Turn right.
    // 3. Turn right.
    // 4. Move south 6 units to (0, 0).
    // The furthest point the robot ever gets from the origin is (0, 6), which squared is 62 = 36 units away.
    

    // Constraints:

    // 1 <= commands.length <= 104
    // commands[i] is either -2, -1, or an integer in the range [1, 9].
    // 0 <= obstacles.length <= 104
    // -3 * 104 <= xi, yi <= 3 * 104
    // The answer is guaranteed to be less than 231.


    // Solution by me - 36 ms O(N)

    public int robotSim(int[] commands, int[][] obstacles) {
        // Directions: North, East, South, West
        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        int directionIndex = 0; // Starts facing North
        
        // Obstacle set
        Set<String> obstacleSet = new HashSet<>();
        for (int[] obstacle : obstacles) {
            obstacleSet.add(obstacle[0] + "," + obstacle[1]);
        }
        
        int x = 0, y = 0; // Starting position
        int maxDistanceSquared = 0;

        for (int command : commands) {
            if (command == -2) {
                // Turn left: counter-clockwise turn
                directionIndex = (directionIndex + 3) % 4;
            } else if (command == -1) {
                // Turn right: clockwise turn
                directionIndex = (directionIndex + 1) % 4;
            } else {
                // Move forward in the current direction
                int dx = directions[directionIndex][0];
                int dy = directions[directionIndex][1];

                for (int step = 0; step < command; step++) {
                    int nextX = x + dx;
                    int nextY = y + dy;
                    
                    if (obstacleSet.contains(nextX + "," + nextY)) {
                        // Encounter obstacle, stop moving
                        break;
                    }
                    
                    // Move to the next position
                    x = nextX;
                    y = nextY;
                    
                    // Update the maximum distance squared
                    maxDistanceSquared = Math.max(maxDistanceSquared, x * x + y * y);
                }
            }
        }

        return maxDistanceSquared; 
    }

    //Fastest Solution - 10 ms
    public int robotSimFastest(int[] commands, int[][] obstacles) {
        Robot robot = new Robot();
        Set<Obstacle> obstacleSet = new HashSet<>();
        for (int[] obstacle : obstacles) {
            obstacleSet.add(new Obstacle(obstacle[0], obstacle[1]));
        }
        for (int command : commands) robot.handleCommand(command, obstacleSet);
        return robot.maxDistance;
    }
    private static class Robot {
        public int x = 0, y = 0, dir = 0, maxDistance = 0;
        public Set<Obstacle> obstacles;

        Robot() {}
        private void handleCommand(int command, Set<Obstacle> obstacles) {
            switch (command) {
                case -2:
                    dir = (dir + 3) % 4;
                    return;
                case -1:
                    dir = (dir + 1) % 4;
                    return;
                default: {
                    while (command-- > 0) {
                        int newX = x, newY = y;
                        switch (dir) {
                            case 0: ++newY; break;
                            case 1: ++newX; break;
                            case 2: --newY; break;
                            default: --newX;
                        }
                        if (!obstacles.contains(new Obstacle(newX, newY))) {
                            x = newX;
                            y = newY;
                        }
                    }
                    maxDistance = Math.max(x * x + y * y, maxDistance);
                }
            }
        }
    }
    private static class Obstacle {
        public int x, y;

        public Obstacle(int x, int y) {
            this.x = x;
            this.y = y;
        }
        public boolean equals(Object other) {
            return x == ((Obstacle) other).x && y == ((Obstacle) other).y;
        }
        public int hashCode() {
            return x + y * 413;
        }
    }



    // 1038. Binary Search Tree to Greater Sum Tree
    // Given the root of a Binary Search Tree (BST), convert it to a Greater Tree such that every key of the original BST is changed to the original key plus the sum of all keys greater than the original key in BST.
    // As a reminder, a binary search tree is a tree that satisfies these constraints:
    // The left subtree of a node contains only nodes with keys less than the node's key.
    // The right subtree of a node contains only nodes with keys greater than the node's key.
    // Both the left and right subtrees must also be binary search trees.

    // Example 1:

    // Input: root = [4,1,6,0,2,5,7,null,null,null,3,null,null,null,8]
    // Output: [30,36,21,36,35,26,15,null,null,null,33,null,null,null,8]
    // Example 2:

    // Input: root = [0,null,1]
    // Output: [1,null,1]
    
    // Constraints:

    // The number of nodes in the tree is in the range [1, 100].
    // 0 <= Node.val <= 100
    // All the values in the tree are unique.
    
    // Note: This question is the same as 538: https://leetcode.com/problems/convert-bst-to-greater-tree/
    int sum = 0;
    public TreeNode bstToGst(TreeNode root) {
        traverse(root);
        return root;
    }

    private void traverse(TreeNode node) {
        if (node == null) {
            return;
        }
        
        // Traverse right subtree
        traverse(node.right);
        
        // Update the current node's value with the running sum
        sum += node.val;
        node.val = sum;
        
        // Traverse left subtree
        traverse(node.left);
    }

    // 1438. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit
    // Given an array of integers nums and an integer limit, return the size of the longest non-empty subarray such that the absolute difference between any two elements of this subarray is less than or equal to limit.

    // Example 1:

    // Input: nums = [8,2,4,7], limit = 4
    // Output: 2 
    // Explanation: All subarrays are: 
    // [8] with maximum absolute diff |8-8| = 0 <= 4.
    // [8,2] with maximum absolute diff |8-2| = 6 > 4. 
    // [8,2,4] with maximum absolute diff |8-2| = 6 > 4.
    // [8,2,4,7] with maximum absolute diff |8-2| = 6 > 4.
    // [2] with maximum absolute diff |2-2| = 0 <= 4.
    // [2,4] with maximum absolute diff |2-4| = 2 <= 4.
    // [2,4,7] with maximum absolute diff |2-7| = 5 > 4.
    // [4] with maximum absolute diff |4-4| = 0 <= 4.
    // [4,7] with maximum absolute diff |4-7| = 3 <= 4.
    // [7] with maximum absolute diff |7-7| = 0 <= 4. 
    // Therefore, the size of the longest subarray is 2.
    // Example 2:

    // Input: nums = [10,1,2,4,7,2], limit = 5
    // Output: 4 
    // Explanation: The subarray [2,4,7,2] is the longest since the maximum absolute diff is |2-7| = 5 <= 5.
    // Example 3:

    // Input: nums = [4,2,2,2,4,4,2,2], limit = 0
    // Output: 3

    // Constraints:

    // 1 <= nums.length <= 105
    // 1 <= nums[i] <= 109
    // 0 <= limit <= 109
    public int longestSubarray(int[] nums, int limit) {
        Deque<Integer> maxDeque = new LinkedList<>();
        Deque<Integer> minDeque = new LinkedList<>();
        int left = 0;
        int maxLength = 0;
        
        for (int right = 0; right < nums.length; right++) {
            // Maintain max deque
            while (!maxDeque.isEmpty() && nums[maxDeque.peekLast()] <= nums[right]) {
                maxDeque.pollLast();
            }
            maxDeque.addLast(right);
            
            // Maintain min deque
            while (!minDeque.isEmpty() && nums[minDeque.peekLast()] >= nums[right]) {
                minDeque.pollLast();
            }
            minDeque.addLast(right);
            
            // Shrink the window if the current window is invalid
            while (nums[maxDeque.peekFirst()] - nums[minDeque.peekFirst()] > limit) {
                left++;
                if (maxDeque.peekFirst() < left) {
                    maxDeque.pollFirst();
                }
                if (minDeque.peekFirst() < left) {
                    minDeque.pollFirst();
                }
            }
            
            // Update the maximum length of the valid subarray
            maxLength = Math.max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }



    // 1248. Count Number of Nice Subarrays
    // Given an array of integers nums and an integer k. A continuous subarray is called nice if there are k odd numbers on it.

    // Return the number of nice sub-arrays.
    // Example 1:

    // Input: nums = [1,1,2,1,1], k = 3
    // Output: 2
    // Explanation: The only sub-arrays with 3 odd numbers are [1,1,2,1] and [1,2,1,1].
    // Example 2:

    // Input: nums = [2,4,6], k = 1
    // Output: 0
    // Explanation: There are no odd numbers in the array.
    // Example 3:

    // Input: nums = [2,2,2,1,2,2,1,2,2,2], k = 2
    // Output: 16

    // Constraints:

    // 1 <= nums.length <= 50000
    // 1 <= nums[i] <= 10^5
    // 1 <= k <= nums.length
    public int numberOfSubarrays(int[] nums, int goal) {
            
            for(int i=0;i<nums.length;i++)
            {
                nums[i]=nums[i] & 1;
            }
        HashMap<Integer, Integer> sum = new HashMap<>();
        sum.put(0, 1);
        int total = 0;
        int ans = 0;
        for (int n : nums) {
            total += n;
            if (sum.containsKey(total - goal)) {
                int nooftimes = sum.get(Math.abs(total - goal));
                ans += nooftimes;

            }
            sum.put(total, sum.getOrDefault(total, 0) + 1);

        }
        return ans;

        }

        // or with less tc
        // more optimized solution
        // public int numberOfSubarrays(int[] nums, int k) {
        //     for (int i = 0; i < nums.length; i++) {
        //         nums[i] %= 2;
        //     }
            
        //     int[] prefixCount = new int[nums.length + 1];
        //     prefixCount[0] = 1;
        //     int s = 0;
        //     int ans = 0;
            
        //     for (int num : nums) {
        //         s += num;
        //         if (s >= k) {
        //             ans += prefixCount[s - k];
        //         }
        //         prefixCount[s]++;
        //     }
            
        //     return ans;
        // }




    // 1052. Grumpy Bookstore Owner - Sliding Window
    // There is a bookstore owner that has a store open for n minutes. Every minute, some number of customers enter the store. You are given an integer array customers of length n where customers[i] is the number of the customer that enters the store at the start of the ith minute and all those customers leave after the end of that minute.
    // On some minutes, the bookstore owner is grumpy. You are given a binary array grumpy where grumpy[i] is 1 if the bookstore owner is grumpy during the ith minute, and is 0 otherwise.
    // When the bookstore owner is grumpy, the customers of that minute are not satisfied, otherwise, they are satisfied.
    // The bookstore owner knows a secret technique to keep themselves not grumpy for minutes consecutive minutes, but can only use it once.
    // Return the maximum number of customers that can be satisfied throughout the day.
    // Example 1:
    // Input: customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], minutes = 3
    // Output: 16
    // Explanation: The bookstore owner keeps themselves not grumpy for the last 3 minutes. 
    // The maximum number of customers that can be satisfied = 1 + 1 + 1 + 1 + 7 + 5 = 16.
    // Example 2:
    // Input: customers = [1], grumpy = [0], minutes = 1
    // Output: 1
    // Constraints:
    // n == customers.length == grumpy.length
    // 1 <= minutes <= n <= 2 * 104
    // 0 <= customers[i] <= 1000
    // grumpy[i] is either 0 or 1.

    public int maxSatisfied(int[] customers, int[] grumpy, int minutes) {
        int n = grumpy.length;
        int j = 0;
        int curWin = 0;
        int maxWin = 0;

        for(int i=0;j<n;j++) {
            if(grumpy[j] == 1) {
                curWin+=customers[j];
            }
            maxWin = Math.max(curWin, maxWin);
            if(j >= minutes - 1 ) {
                if(grumpy[i] == 1) {
                curWin -= customers[i];
                }
                i++;
            }
        }
        int res = maxWin;
        for(int i=0;i<grumpy.length;i++) {
            if(grumpy[i] == 0) {
                res+=customers[i];
            }
        }
        return res;

    }
}
