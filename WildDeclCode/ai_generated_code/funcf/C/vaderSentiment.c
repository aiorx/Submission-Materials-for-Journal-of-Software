//This function calculates the sentiment of the word
double sentimentCalculation(char* testWord, double *intensifierScore, double *negationScore) {

    //printf("Negation score: %f\n", *negationScore);

    //Create a dummy word to store the original word, this way when it is lowercased we still have an OG copy to check all caps against
    char dummyWord[100];
    strcpy(dummyWord, testWord);

    //printf("%s\n", dummyWord);

    //printf("%f\n", *negationScore);

    //Variable to store the score of the word
    double wordScore = 0;

    //Variable to store the number of exclamation points
    int exclamation_count = 0;

    //We first need to check if the word has any punctuation attached to it
    //If it does we need to remove it
    for (size_t i = 0; i < strlen(testWord); i++) {
        if (testWord[i] == '.' || testWord[i] == ',' || testWord[i] == '?' || testWord[i] == ';' || testWord[i] == ':') {
            testWord[i] = '\0';
        }
        //If it has an exclamation point we need to boost the score
        else if (testWord[i] == '!' && exclamation_count<= 3) {
            wordScore += PUNCTUTATION_BOOST;
            testWord[i] = '\0';
            exclamation_count++;
        }
    }

    //Get the word data from the lexicon, this is O(1)
    WordData* wordData = findWord(testWord);

    //If the word is in the lexicon we can calculate the sentiment
    if (wordData != NULL) {

        //Get the sentiment value from the word data
        double sentimentValue = wordData->meanSentiment;

        //Add the sentiment value to the word score, inclusive of any previous intensifiers
        wordScore += (*intensifierScore + 1) * sentimentValue * (*negationScore);

        //printf("Word: %s, Sentiment: %f\n", testWord, wordScore);

        *negationScore = 1;

        //Check if the word is all caps
        int isAllCaps = 1;
        for (size_t m = 0; m < strlen(dummyWord); m++) {

            //This was Adapted from standard coding samples
            if (dummyWord[m] < 65 || dummyWord[m] > 90) {
                isAllCaps = 0;
                break;
            }
        }

        //If the word is all caps we need to boost the score
        if (isAllCaps) {
            wordScore *= 1.5;
        }

        //Reset the intensifier score
        *intensifierScore = 0;

        //Return the word score
        return wordScore;

    }

    //Even if the word is not in the lexicon we can still check if it is an intensifier
   *intensifierScore = 0;

   //Convert the word to lowercase
   to_lowercase(testWord);

    //Check if the word is an intensifier
    for (int j = 0; j < positiveCount; j++) {
        if (strcmp(testWord, positiveIntensifiers[j]) == 0) {
            *intensifierScore = boostFactor;
        }
    }

    //Check if the word is a negative intensifier
    if(*intensifierScore == 0) {
        for (int k = 0; k < negativeCount; k++) {
            if (strcmp(testWord, negativeIntensifiers[k]) == 0) {
                *intensifierScore = boostFactor;
            }
        }
    }

    *negationScore = 1;

    //Check if the word is negated

    int isNegated = 0;
    for (int l = 0; l < negationCount; l++) {
        if (strcmp(testWord, negations[l]) == 0) {
            isNegated = 1;
            break;
        }
    }

    //If the word is negated we need to multiply the score by the negation constant, which is defined in the utility header
    if (isNegated) {
        *negationScore = -0.5;
    }

    //Return 0 if the word is not in the lexicon
    return 0;

}