#include <stdio.h>
#include <stdlib.h>
#include <string.h>
/**
 * Return an array of arrays of size *returnSize.
 * The sizes of the arrays are returned as *returnColumnSizes array.
 * Note: Both returned array and *columnSizes array must be malloced, assume caller calls free().
*/
//keep a var that repersents the farthest right point

int** getSkyline(int** buildings, int buildingsSize, int* buildingsColSize, int* returnSize, int** returnColumnSizes) {
	int farthestRightPoint = 0;
	for(int i = 0; i < buildingsSize; i++){
		if(buildings[i][1] > farthestRightPoint){
			farthestRightPoint = buildings[i][1];
		}
		
	}
	int *buildingPoints; 
	buildingPoints = malloc(sizeof(buildingPoints) * (farthestRightPoint + 1));
	for(int i = 0; i <= farthestRightPoint; i++){
		buildingPoints[i] = 0;
	}
	for(int i = 0; i < buildingsSize; i++){
		for(int j = buildings[i][0]; j < buildings[i][1]; j++){
			buildingPoints[j] = (buildingPoints[j] < buildings[i][2]) ? buildings[i][2] : buildingPoints[j];	
		}
	}
	int currentHeight = 0;
	*returnSize = 0;
	returnColumnSizes = NULL;
	for(int i = 0; i <= farthestRightPoint; i++){
		if(buildingPoints[i] != currentHeight){
			(*returnSize)++;
			returnColumnSizes = realloc(returnColumnSizes, sizeof(int**) * *returnSize);
			returnColumnSizes[*returnSize - 1] = malloc(sizeof(**returnColumnSizes) * 2);
			returnColumnSizes[*returnSize - 1][0] = i;
			returnColumnSizes[*returnSize - 1][1] = buildingPoints[i];
			currentHeight = buildingPoints[i];
		}
	}
	free(buildingPoints);
	return returnColumnSizes;	
}
//Test Penned via standard programming aids
int main() {
    int buildings11[][3] = {{2, 9, 10}, {3, 7, 15}, {5, 12, 12}, {15, 20, 10}, {19, 24, 8}};
    int buildings21[][3] = {{0, 2, 3}, {2, 5, 3}};
    int **buildings1;
    int **buildings2;
    buildings1 = malloc(sizeof(*buildings1) * 5);
    for(int i = 0; i < 5; i++){
    	buildings1[i] = malloc(sizeof(buildings1[i]) * 3);
	buildings1[i][0] = buildings11[i][0];	
	buildings1[i][1] = buildings11[i][1];	
	buildings1[i][2] = buildings11[i][2];	
    }
    int* returnSize1;
returnSize1 = malloc(sizeof(int));
    int** returnColumnSizes1;
    printf("%d", ((int**)buildings1)[0][1]);
    int** skyline1 = getSkyline((int**)buildings1, 5, NULL, returnSize1, returnColumnSizes1);
for(int i = 0; i < 5; i++){
	free(buildings1[i]);
}
free(buildings1);
    printf("Example 1 Output: ");
    for (int i = 0; i < *returnSize1; ++i) {
        printf("[%d, %d] ", skyline1[i][0], skyline1[i][1]);
    }

/*
    int* returnSize2;
    int** returnColumnSizes2;
    int** skyline2 = getSkyline((int**)buildings2, 2, NULL, returnSize2, returnColumnSizes2);
    printf("Example 2 Output: ");
    for (int i = 0; i < *returnSize2; ++i) {
        printf("[%d, %d] ", skyline2[i][0], skyline2[i][1]);
    }
    printf("\n");//*/

    // Free memory
    for (int i = 0; i < *returnSize1; ++i) {
        free(skyline1[i]);
    }
    free(skyline1);
    free(returnSize1);
    //free(returnColumnSizes1);
//printf("orca8\n");

/*
    for (int i = 0; i < *returnSize2; ++i) {
        free(skyline2[i]);
    }
    free(skyline2);
    free(returnSize2);
    free(returnColumnSizes2);//*/

    return 0;
}
