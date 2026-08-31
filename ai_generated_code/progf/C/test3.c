
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define CSV_LINE_MAX (1048576)
#define CSV_MAX_ROW (1)
#define CSV_MAX_COL (100000)

/*
 * Aided using common development resources -->
 */
void quickSort(int arr[], int low, int high);

void sort(int data[], int size) {
    quickSort(data, 0, size - 1);
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);

    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);

        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
/*
 * <-- Aided using common development resources
 */

int main()
{
    FILE* file;
    char csv_line[CSV_LINE_MAX];
    int csv_data[CSV_MAX_ROW][CSV_MAX_COL];
    int row = 0;
    int col = 0;
    int i, j;
    
    // load data
    file = fopen("data/data.csv", "r");
    while (fgets(csv_line, sizeof(csv_line), file)) {
        char* token = strtok(csv_line, ",");
        while (token != NULL) {
            csv_data[row][col] = atoi(token);
            col++;
            token = strtok(NULL, ",");
        }
        col = 0;
        row++;
    }
    fclose(file);
    
    // データをソート
    sort(csv_data[0], sizeof(csv_data[0]) / sizeof(csv_data[0][0]));
    
    // ソート後のデータを出力
    file = fopen("./test3/test3_result_c.txt", "w");
    for (i = 0; i < CSV_MAX_COL; i++) {
        fprintf(file, "%d\n", csv_data[0][i]);
    }
    fclose(file);
    
    return 0;
}

