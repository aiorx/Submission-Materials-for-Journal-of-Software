// This code was Supported via standard programming aids

#include <iostream>
using namespace std;

enum HandWeapon {
    ROCK,
    PAPER,
    SCISSORS
};

int main() {
    cout << "Let's play Rock-Paper-Scissors!\n";

    // Player choice
    cout << "Enter your choice (1 for Rock, 2 for Paper, 3 for Scissors): ";
    int playerChoiceInt;
    cin >> playerChoiceInt;

    // Convert the integer input to the HandWeapon enum
    HandWeapon playerChoice;
    switch (playerChoiceInt) {
        case 1:
            playerChoice = ROCK;
            break;
        case 2:
            playerChoice = PAPER;
            break;
        case 3:
            playerChoice = SCISSORS;
            break;
        default:
            cout << "Invalid choice!\n";
            return 1;
    }

    // Computer choice (randomly generated)
    HandWeapon computerChoice = HandWeapon(rand() % 3);

//    cout << "Computer chose " << computerChoice << endl;

    // Game logic to determine the winner
    if (playerChoice == computerChoice) {
        cout << "It's a tie!\n";
    } else if (
            (playerChoice == ROCK && computerChoice == SCISSORS) ||
            (playerChoice == PAPER && computerChoice == ROCK) ||
            (playerChoice == SCISSORS && computerChoice == PAPER)
            ) {
        cout << "You win!\n";
    } else {
        cout << "Computer wins!\n";
    }

    return 0;
}
