#include "givenA1.h"

/* Task 1: Reading from file and populating the dataZoo array */
int readFromFile (char fName [30], struct Animal dataZoo [NUM_SAMPLES]){

    // declaring variables
    int index = 0;
    FILE *file;

    file = fopen(fName, "r"); // opening file

    // if file doesnt exist then return -1
    if(file == NULL){
        return -1;
    }
    else{ // else populate the dataZoo array with the data in the file
        while(!feof(file)){

            fscanf(file, "%s", dataZoo[index].animalName); // populating the animal names
            // populating the features
            for(int i = 0; i < NUM_FEATURES; i++){
                fscanf(file, "%d", &dataZoo[index].features[i]);

            }
            fscanf(file, "%d", &dataZoo[index].classLabel); // populating the class label
            index++; //increasing the index
        }
    }
    fclose(file);// closing the file

    return 1;
}

/* Task 2: Getting the distances between the two vectors*/
void distanceFunctions (int vector1 [NUM_FEATURES], int vector2 [NUM_FEATURES], float * euclideanDistance, int * hammingDistance, float * jaccardSimilarity){

    // declaring variables
    int sum = 0;
    int one = 0;
    int zero = 0;
    int diff = 0;

    // calculating the eculidean distance
    for(int i = 0; i < 16; i++){
        sum = sum + pow(vector1[i] - vector2[i], 2); // subtracting the two vectors then squaring it and add it to each other
    }
    *euclideanDistance = sqrt(sum); // square root to get the eculidean distance
    
    // calculating the hamming distance
    for(int j = 0; j < 16; j++){
        // if the indexes are not equal to each then add one to diff
        if(vector1[j] != vector2[j]){
            diff++;
        }
    }

    *hammingDistance = diff; // giving the value to hamming distance
    
    // calculatting the jaccard similarity
    for(int k = 0; k < 16; k++){
        // if both the vectors indexes are 1 or 0 then increase the one or zero variable
        if(vector1[k] == 1 && vector2[k] == 1){
            one++;
        }
        else if(vector1[k] == 0 && vector2[k] == 0){
            zero++;
        }
    }

    // making the value of variable one divided by NUM_FEATURES-the value of zero and converting it to a float
    *jaccardSimilarity = (float) one/(NUM_FEATURES-zero);
}

/* Task 3: Getting the distances between two vectors then sorting increasing or decreasing depending on which distance it is, then storing 
   the indexes into the kNearestNeighbors k times */
// The code for sorting in decreasing and increasing order is Referenced via basic programming materials
void findKNearestNeighbors (struct Animal dataZoo [NUM_SAMPLES], int newSample [NUM_FEATURES], int k, int whichDistanceFunction, int kNearestNeighbors [NUM_SAMPLES]){

    // declaring variables
    float ed = 0.0;
    int hd = 0;
    float js = 0.0;
    float * euclideanDistance = &ed;
    int * hammingDistance = &hd;
    float * jaccardSimilarity = &js;
    int indexHd[NUM_SAMPLES];
    float indexJs[NUM_SAMPLES];
    float indexEd[NUM_SAMPLES];
    int index[NUM_SAMPLES];
    int temp = 0;
    float temp2 = 0.0;

    // for eculidean distance
    if(whichDistanceFunction == 1){
        // for loop to get the distances of the two vectors and storing it in a array, and storing the indexes in an array too
        for(int i = 0; i < NUM_SAMPLES; i++){
            distanceFunctions (dataZoo[i].features, newSample, euclideanDistance, hammingDistance, jaccardSimilarity);
            indexEd[i] = *euclideanDistance;
            index[i] = i;
        }

        // bubble sort that is in increasing order
        for (int i = 0; i < NUM_SAMPLES - 1; i++){
            for (int j = 0; j < NUM_SAMPLES - i - 1; j++){
                if (indexEd[j] > indexEd[j + 1]){
                    temp2 = indexEd[j];
                    indexEd[j] = indexEd[j + 1];
                    indexEd[j + 1] = temp2;

                    temp = index[j];
                    index[j] = index[j + 1];
                    index[j + 1] = temp;
                }
            }
        }

        // populating the kNearestNeighbors array with the indexes up to k times
        for(int i = 0; i < k; i++){
            kNearestNeighbors[i] = index[i];
        }

    }
    // does the same thing as the pervious if statments but for hamming distance
    else if(whichDistanceFunction == 2){
        for(int i = 0; i < NUM_SAMPLES; i++){
            distanceFunctions (dataZoo[i].features, newSample, euclideanDistance, hammingDistance, jaccardSimilarity);
            indexHd[i] = *hammingDistance;
            index[i] = i;
        }

        for (int i = 0; i < NUM_SAMPLES - 1; i++){
            for (int j = 0; j < NUM_SAMPLES - i - 1; j++){
                if (indexHd[j] > indexHd[j + 1]){
                    temp = indexHd[j];
                    indexHd[j] = indexHd[j + 1];
                    indexHd[j + 1] = temp;

                    temp = index[j];
                    index[j] = index[j + 1];
                    index[j + 1] = temp;
                }
            }
        }

        for(int i = 0; i < k; i++){
            kNearestNeighbors[i] = index[i];
        }

    }
    // does the same thing as the two pervious if statements but for jaccard similarity and 
    // the bubble sort is in decreasing order instead of increasing
    else if(whichDistanceFunction == 3){
        for(int i = 0; i < NUM_SAMPLES; i++){
            distanceFunctions (dataZoo[i].features, newSample, euclideanDistance, hammingDistance, jaccardSimilarity);
            indexJs[i] = *jaccardSimilarity;
            index[i] = i;
        }


        for (int i = 0; i < NUM_SAMPLES - 1; i++){
            for (int j = 0; j < NUM_SAMPLES - i - 1; j++){
                if (indexJs[j] < indexJs[j + 1]){
                    temp2 = indexJs[j];
                    indexJs[j] = indexJs[j + 1];
                    indexJs[j + 1] = temp2;

                    temp = index[j];
                    index[j] = index[j + 1];
                    index[j + 1] = temp;
                }
            }
        }

        for(int i = 0; i < k; i++){
            kNearestNeighbors[i] = index[i];
        }
    }
}

/* Task 4: Getting the indices from task 3 and getting the line at that index in a1Data.txt and getting the class label of that line and counting it.
    Then getting the most frequent class label and returning that*/
int predictClass (struct Animal dataZoo [NUM_SAMPLES], int newSample [NUM_FEATURES], int whichDistanceFunction, int k){
    
    // declaring variables
    int count[NUM_CLASSES] = {};
    int classLabel = 0;
    int predictedClass = 0;
    int kNearestNeighbors[NUM_SAMPLES];
    int index = 0;
    int mostFreq = 0;

    // calling task3 in this function to get the indices
    findKNearestNeighbors(dataZoo, newSample, k, whichDistanceFunction, kNearestNeighbors);

    // for loop that runs k times
    for(int i = 0; i < k; i++){
        // gets the value of the indices and stores it in index
        index = kNearestNeighbors[i];
        classLabel = dataZoo[index].classLabel; // getting the class label at that index
        count[classLabel-1]++; // adding a count to that class label
    }

    for(int i = 0; i < NUM_CLASSES; i++){
        /* if the value at the index in count is greater than mostFreq */
        /*also if the frequency is the same between two class labels then it will come back 
        false and will go for the lower class label because it is first*/
        if(count[i] > mostFreq){
            mostFreq = count[i];// mostFreq will equal that value
            predictedClass = i+1; // predicted class is equal to the index + 1
        }
    }

    // return the predicted class
    return predictedClass;
}

/* Task 5: Scanning the csv file and getting rid of the commas, then getting the accuracy of the predict classes*/
float findAccuracy (struct Animal dataZoo [NUM_SAMPLES], int whichDistanceFunction, struct Animal testData [NUM_TEST_DATA], int k){
    
    // declaring variables
    float accuracy = 0.0;
    char lines[100];
    int index = 0;
    int prediction = 0;
    int correctPred = 0;
    int totalPred = 20;
    
    // opening and reading the file
    FILE * fptr = fopen ("testData.csv", "r");

    if(fptr == NULL){ // if file does not exist then return -1
        return -1;
    }
    else{
        // while loop that goes until the end of the file
        while (!feof(fptr)){
            // getting the whole line using each fgets and storing it in lines array
            fgets(lines, 100, fptr);

            // for loop that goes until the end of the line (NULL character)
            for(int i = 0; lines[i] != '\0'; i++){
                // if there is a comma then replace it with a space
                if(lines[i] == ','){
                    lines[i] = ' ';
                }
            }
            
            // populating the testData array with the values
            sscanf(lines, "%s %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d", testData[index].animalName,
                            &testData[index].features[0], &testData[index].features[1], &testData[index].features[2],
                            &testData[index].features[3], &testData[index].features[4], &testData[index].features[5], 
                            &testData[index].features[6], &testData[index].features[7], &testData[index].features[8],
                            &testData[index].features[9], &testData[index].features[10], &testData[index].features[11],
                            &testData[index].features[12], &testData[index].features[13], &testData[index].features[14],
                            &testData[index].features[15], &testData[index].classLabel);

            // increasing index by 1 at the end of the while loop
            index++;
        }
    }

    // for loop that runs 20 times
    for(int i = 0; i < NUM_TEST_DATA; i++){
        // getting the predict class from the task 4 function
        prediction = predictClass(dataZoo, testData[i].features, whichDistanceFunction, k);
        // if the predict class is equal the the class label then increase the correctPred by 1
        if(prediction == testData[i].classLabel){
            correctPred++;
        }
    } 
    
    // calculating the accuracy
    accuracy = (float) correctPred/totalPred;

    // returning the accuracy
    return accuracy;
}