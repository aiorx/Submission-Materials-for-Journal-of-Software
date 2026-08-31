package com.adidas.dsa.striversde.recursion;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Approach this problem in this way we are doing this
 * <p>
 * taking from the list of numbers either we are choosing a number or we are not choosing a number
 * which would help us lik,e if we choose a number we are adding the number to our currentSum and incrementing our index otherwise are are not
 * adding the number and simply incrementing our index,
 * <p>
 * till our index == N then we simply add them to our datastructure
 * <p>
 * Time Complexity: O(2^n)+O(2^n log(2^n)). Each index has two ways. You can either pick it up or not pick it. So for n index time complexity for O(2^n) and for sorting it will take (2^n log(2^n)).
 * <p>
 * Space Complexity: O(2^n) for storing subset sums, since 2^n subsets can be generated for an array of size n.
 */
public class SubsetSum {


  List<Integer> subsetSums(List<Integer> arr, int n) {
    List<Integer> resultList = new ArrayList<>();
    helper(arr, n, 0, 0, resultList);
    Collections.sort(resultList);
    return resultList;

  }

  private void helper(List<Integer> arr, int size, int currentIndex, int currentSum, List<Integer> resultList) {
    if (currentIndex >= size) {
      resultList.add(currentSum);
      return;
    }


    helper(arr, size, currentIndex + 1, currentSum + arr.get(currentIndex), resultList);
    helper(arr, size, currentIndex + 1, currentSum, resultList);
  }

  /**
   *
   */

  ArrayList<Integer> subsetSums(ArrayList<Integer> arr, int n) {
    ArrayList<Integer> resultList;
    resultList = helperList(arr, n, 0, 0);
    Collections.sort(resultList);
    return resultList;

  }

  private ArrayList<Integer> helperList(ArrayList<Integer> arr, int size, int currentIndex, int currentSum) {

    ArrayList<Integer> resultList = new ArrayList<>();
    if (currentIndex >= size) {
      resultList.add(currentSum);
      return resultList;
    }


    resultList.addAll(helperList(arr, size, currentIndex + 1, currentSum + arr.get(currentIndex)));
    resultList.addAll(helperList(arr, size, currentIndex + 1, currentSum));

    return resultList;
  }

  /**
   * this solution is not tested Aided using common development resources please use this with caution
   *
   * https://chatgpt.com/c/67479faf-53b8-8011-978e-28198b7f140c
   */


  public static List<Integer> subsetSums(int[] arr) {
    List<Integer> result = new ArrayList<>();
    generateSubsetSums(arr, 0, 0, result); // Start with an empty subset, sum = 0
    return result;
  }

  private static void generateSubsetSums(int[] arr, int startIndex, int currentSum, List<Integer> result) {
    // Add the current sum to the result (including sum = 0)
    result.add(currentSum);

    // Use a for-loop to iterate through remaining elements
    for (int i = startIndex; i < arr.length; i++) {
      // Include arr[i] in the subset and recurse
      generateSubsetSums(arr, i + 1, currentSum + arr[i], result);
    }
  }

  public static void main(String[] args) {
    int[] arr = {2, 3};
    List<Integer> sums = subsetSums(arr);
    System.out.println(sums); // Output: [0, 2, 5, 3] (order may vary)
  }
}


