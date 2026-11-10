// This Java program was Assisted with basic coding tools

public class J1_bubblesort_benchmark {

    public J1_bubblesort_benchmark() { }

    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        boolean swapped = false;
        for (int i = 0; i < n - 1; i = i + 1) {
            swapped = false;
            for (int j = 0; j < n - i - 1; j = 1 + j) {
                if (arr[j] > arr[j + 1]) {
                    // swap arr[j] and arr[j+1]
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            // If no two elements were swapped by inner loop, then break
            if (!swapped) {
                return;
            }
        }
    }

    public static int test() {
        int[] a = new int[10000];
        for(int i = 0; i < 10000; i = i + 1) {
            if(i % 2 == 0) {
                a[i] = i*2;
            } else {
                a[i] = i*3-100;
            }
        }
        J1_bubblesort_benchmark.bubbleSort(a);
        return 0;
    }

}
