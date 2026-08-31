// NOTE:- The following code is not written by me-it is Supported via standard programming aids. Thus, it may be prone to errors
// This is just there so as to revise the concept and all

#include <stdio.h>
#include <stdlib.h>

#define TABLE_SIZE 10
#define EMPTY -1

int hash1(int key) {
    return key % TABLE_SIZE;
}

int hash2(int key) {
    return 7 - (key % 7); // Second hash function
}

void insertDoubleHash(int table[], int key) {
    int index = hash1(key);
    if (table[index] == EMPTY) {
        table[index] = key;
    }
    else {
        int stepSize = hash2(key);
        int i = 1;
        while (table[(index + (i * stepSize)) % TABLE_SIZE] != EMPTY) {
            i++;
        }
        table[(index + i * stepSize) % TABLE_SIZE] = key;
    }
}

void displayHashTable(int table[]) {
    for (int i = 0; i < TABLE_SIZE; i++) {
        if (table[i] != EMPTY) {
            printf("%d\n", table[i]);
        }
        else {
            printf("~~\n");
        }
    }
    printf("\n");
}

int main() {
    int table[TABLE_SIZE];
    for (int i = 0; i < TABLE_SIZE; i++) {
        table[i] = EMPTY;
    }

    int keys[] = {23, 43, 13, 27, 73};
    int n = sizeof(keys) / sizeof(keys[0]);

    for (int i = 0; i < n; i++) {
        insertDoubleHash(table, keys[i]);
    }

    displayHashTable(table);

    return 0;
}
