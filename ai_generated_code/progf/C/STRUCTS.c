// #include<stdio.h>
// #include<string.h>

// struct player{
//     char name[12];
//     int score;
// };

// int main(){
//     // struct = collection of related numbers("variable").
//     //          they can be of different data types.
//     //          listed under one name in a block of memory.
//     //          very similar to classes in other languages(but no methods).

//     struct player player1;
//     struct player player2;

//     strcpy(player1.name, "samrat");
//     player1.score = 5;

//     strcpy(player2.name, "ahan");
//     player2.score = 10;

//     printf("%s\n",player1.name);
//     printf("%d\n",player1.score);

//     printf("%s\n",player2.name);
//     printf("%d\n",player2.score);

//     return 0;
// }

/* ---> CHALLANGE WILL BE TO MAKE THE NAME ARRAY AND SCORE BE USER DEFINED AND DYNAMICALLY ALLOCATED.
WITH THE OUTPUT BEING IN A FORM OF A TABLE WHRER IT SHOWS NAME AND SCORE ADJACENTLY.*/

// CODE:->

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct player {
    char *name; // Pointer for dynamic allocation
    int score;
};

int main() {
    int numPlayers;

    // Ask the user for the number of players
    printf("Enter the number of players: ");
    scanf("%d", &numPlayers);

    // Dynamically allocate memory for an array of players
    struct player *players = malloc(numPlayers * sizeof(struct player));
    if (players == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        return 1;
    }

    // Input player names and scores
    for (int i = 0; i < numPlayers; i++) {
        players[i].name = malloc(12 * sizeof(char)); // Allocate memory for name
        if (players[i].name == NULL) {
            fprintf(stderr, "Memory allocation failed\n");
            return 1;
        }

        printf("Enter name for player %d: ", i + 1);
        scanf("%s", players[i].name); // Read player name
        printf("Enter score for player %d: ", i + 1);
        scanf("%d", &players[i].score); // Read player score
    }

    // Print the table header
    printf("\n%-12s | Score\n", "Name");
    printf("-------------------\n");

    // Output player names and scores in a table format
    for (int i = 0; i < numPlayers; i++) {
        printf("%-12s | %d\n", players[i].name, players[i].score);
    }

    // Free allocated memory
    for (int i = 0; i < numPlayers; i++) {
        free(players[i].name); // Free each name
    }
    free(players); // Free the array of players

    return 0;
}

/*To modify the given C program so that the name array and score are user-defined and dynamically allocated, we can use pointers and dynamic memory allocation with malloc. We'll also format the output to display the names and scores in a table format. Here's how you can achieve that:

Explanation:
Dynamic Memory Allocation: We use malloc to allocate memory for an array of player structures and for each player's name. This allows the user to define the number of players and their names dynamically.


Input Handling: We loop through the number of players to get their names and scores.


Table Formatting: We print the names and scores in a formatted table using printf with specific formatting options (%-12s for left-aligned names in a field of width 12).


Memory Management: After we're done using the dynamically allocated memory, we free it to avoid memory leaks.


Usage:
Compile the program using a C compiler (e.g., gcc) and run it. It will prompt you to enter the number of players, followed by their names and scores, and finally display the results in a table format.*/

// TAKEN Derived using common development resources.