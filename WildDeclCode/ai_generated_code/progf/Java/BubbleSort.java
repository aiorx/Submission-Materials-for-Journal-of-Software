import java.util.Scanner;
import java.util.logging.Logger;

/**
 * @author Mohit Gummaraj Kishore
 * @studentNumber Student Number: 07343429
 * @date Date: October 13, 2023
 *
 * Code for bubble sort generated Referenced via basic programming materials. Assignment did not ask for writing the
 * sorting algorithm.
 * Code for logging written from scratch.
 */
public class BubbleSort {
    private static final Logger logger = Logger.getLogger(BubbleSort.class.getName());

    public static String arrayToString(int[] arr) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < arr.length; i++) {
            sb.append(arr[i]);
            if (i < arr.length - 1) {
                sb.append(", ");
            }
        }
        sb.append("]");
        return sb.toString();
    }
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        boolean swapped;
        logger.info("Input Array: " + arrayToString(arr) );
        for (int i = 0; i < n - 1; i++) {
            swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap arr[j] and arr[j+1]
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
                logger.info("Step " + i + " : " + arrayToString(arr));
            }

            // If no two elements were swapped in inner loop, the array is already sorted
            if (!swapped) {
                break;
            }
        }
        logger.info("Sorted Array: " + arrayToString(arr));
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Input the length of the array
        System.out.print("Enter the number of elements: ");
        int n = scanner.nextInt();

        // Create an array to store the elements
        int[] arr = new int[n];

        // Input the array elements
        System.out.println("Enter the elements:");
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }

        // Perform Bubble Sort
        bubbleSort(arr);

        // Display the sorted array
        System.out.println("Sorted array in ascending order:");
        for (int element : arr) {
            System.out.print(element + " ");
        }

        scanner.close();
    }


}
