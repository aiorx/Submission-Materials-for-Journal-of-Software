// This code was Aided using common development resources

#include <iostream>
#include <vector>

using namespace std;

void merge(vector<int> &arr, int left, int middle, int right) {
    int i, j, k;
    int n1 = middle - left + 1;
    int n2 = right - middle;

    vector<int> L(n1), R(n2);

    for (i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (j = 0; j < n2; j++)
        R[j] = arr[middle + 1 + j];

    i = 0;
    j = 0;
    k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(vector<int> &arr, int left, int right) {
    if (left < right) {
        int middle = left + (right - left) / 2;
        mergeSort(arr, left, middle);
        mergeSort(arr, middle + 1, right);
        merge(arr, left, middle, right);
    }
}

void printArray(const vector<int> &arr) {
    int size = arr.size();
    for (int i = 0; i < size; i++)
        cout << arr[i] << " ";
    cout << endl;
}

int main() {
    vector<int> arr = {9,
                       4,
                       7,
                       4,
                       2,
                       5,
                       8,
                       3,
                       1,
                       6};
    int arrSize = arr.size();

    cout << "Given array is \n";
    printArray(arr);

    mergeSort(arr, 0, arrSize - 1);

    cout << "\nSorted array is \n";
    printArray(arr);

    return 0;
}
