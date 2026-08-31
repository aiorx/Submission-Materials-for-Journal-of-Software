// CSC-134-5H01
// Jack Sollisch
// Player cash storage & debt management Crafted with basic coding tools
// 2/27/25

#include <iostream>
#include <cmath>
#include <ctime>
#include <fstream>
#include <sstream>
#include <map>

using namespace std;

int main() {
    const int SIDES = 6;
    const double INTEREST_RATE = 0.10; // 10% interest rate
    int seed = time(0);
    srand(seed);
    int roll;
    string winGame = "win";
    string loseGame = "lose";

    // A map to store players' names and their cash balance and debt
    map<string, pair<int, int>> players; // <cash, debt>

    // Read players' cash balances and debt from a text file
    ifstream input("players.txt");
    if (input.is_open()) {
        string line;
        while (getline(input, line)) {
            stringstream ss(line);
            string name;
            int cash, debt;
            ss >> name >> cash >> debt;
            players[name] = {cash, debt};
        }
        input.close();
    }

    // Ask for the player's name
    string currentPlayer;
    cout << "Enter your player name: ";
    cin >> currentPlayer;

    // If the player does not exist, create them with an initial cash balance and no debt
    if (players.find(currentPlayer) == players.end()) {
        players[currentPlayer] = {2000, 0}; // Set initial balance to 2000, no debt
        cout << "Welcome, " << currentPlayer << "! You start with 2000 in cash and no debt." << endl;
    } else {
        int cash = players[currentPlayer].first;
        int debt = players[currentPlayer].second;
        cout << "Welcome back, " << currentPlayer << "! You have " << cash << " in cash and " << debt << " in debt." << endl;
    }

    // Ask for the bet amount
    int bet;
    cout << "Please enter the amount you're betting: ";
    cin >> bet;

    // Get current cash and debt
    int cash = players[currentPlayer].first;
    int debt = players[currentPlayer].second;

    // If the bet is greater than the available cash, the player is in debt
    if (bet > cash) {
        int debtAmount = bet - cash;
        debt += debtAmount; // Player takes out a loan
        cout << "You don't have enough cash! You've taken a loan of " << debtAmount << "." << endl;
    }

    // Roll the dice
    int roll1 = (rand() % SIDES) + 1;
    int roll2 = (rand() % SIDES) + 1;
    int total = roll1 + roll2;
    int point;

    cout << "You rolled a " << total << "." << endl;

    if (total == 11 || total == 7) {
        cout << winGame << endl;
    
        // Player wins, and the payout is their bet
        players[currentPlayer].first += bet;  // Player wins and adds bet to their cash
        cout << "You won! You got paid out " << bet << endl;
    
        // First, pay off any debt with winnings
        if (debt > 0) {
            int payment = min(debt, bet); // Pay off part of the debt
            debt -= payment;  // Reduce debt
            bet -= payment;  // Remaining money after paying off debt
            cout << "You are " << debt << " in debt after paying " << payment << " towards your loan." << endl;
        }
    
        // Now, add any remaining winnings to cash
        if (bet > 0) {
            players[currentPlayer].first += bet;  // Add remaining money to cash
        }
    
        // If debt is fully paid off, no interest should be applied
        if (debt == 0) {
            cout << "Your debt is fully paid off!" << endl;
        }
    
        // Apply interest on remaining debt if any (only if debt is not zero)
        if (debt > 0) {
            debt += (int)(debt * INTEREST_RATE);  // Apply interest on remaining debt
            cout << "Due to interest, you now owe " << debt << endl;
        } else {
            cout << "No interest applied, as you have no remaining debt." << endl;
        }
    }
    
    // Consolidating debt if the player loses (after checking for 2, 3, or 12)
    else if (total == 2 || total == 3 || total == 12) {
        cout << loseGame << endl;
        players[currentPlayer].first -= bet;  // Player loses and subtracts bet from their cash
        cout << "You lost! You now owe " << debt << " in total debt." << endl;

        // If the player is in debt, consolidate cash and debt
        if (players[currentPlayer].first < 0) {
            debt += abs(players[currentPlayer].first);  // Consolidate debt with negative cash
            players[currentPlayer].first = 0;  // Player has no cash
        }

        // Apply interest on debt
        debt += (int)(debt * INTEREST_RATE);
        cout << "Due to interest, you now owe " << debt << endl;
    }

    else if (total == 2 || total == 3 || total == 12) {
        cout << loseGame << endl;
        players[currentPlayer].first -= bet;  // Player loses and subtracts bet from their cash
        cout << "You lost! You now owe " << debt << " in total debt." << endl;

        // If the player is in debt, consolidate cash and debt
        if (players[currentPlayer].first < 0) {
            debt += abs(players[currentPlayer].first);  // Consolidate debt with negative cash
            players[currentPlayer].first = 0;  // Player has no cash
        }

        // Apply interest on debt
        debt += (int)(debt * INTEREST_RATE);
        cout << "Due to interest, you now owe " << debt << endl;
    }
    else {
        point = total;
        int total2;
        cout << "Your new point is " << point << "." << endl;
        do {
            int roll3 = (rand() % SIDES) + 1;
            int roll4 = (rand() % SIDES) + 1;
            total2 = roll3 + roll4;
            cout << "You rolled a " << total2 << "." << endl;
        } while (total2 != point && total2 != 7);

        if (total2 == point) {
            cout << winGame << endl;
            players[currentPlayer].first += bet;  // Player wins and adds bet to their cash
            cout << "You won! You got paid out " << bet << endl;

            // First, pay off any debt with winnings
            if (debt > 0) {
                int payment = min(debt, bet); // Pay off part of the debt
                debt -= payment;  // Reduce debt
                bet -= payment;  // Remaining money after paying off debt
                cout << "You are " << debt << " in debt after paying " << payment << " towards your loan." << endl;
            }

            // Now, add any remaining winnings to cash
            if (bet > 0) {
                players[currentPlayer].first += bet;  // Add remaining money to cash
            }

            // Apply interest on remaining debt
            debt += (int)(debt * INTEREST_RATE);
            cout << "Due to interest, you now owe " << debt << endl;
        }
        else if (total2 == 7) {
            cout << loseGame << endl;
            players[currentPlayer].first -= bet;  // Player loses and subtracts bet from their cash
            cout << "You lost! You now owe " << debt << " in total debt." << endl;

            // If the player is in debt, consolidate cash and debt
            if (players[currentPlayer].first < 0) {
                debt += abs(players[currentPlayer].first);  // Consolidate debt with negative cash
                players[currentPlayer].first = 0;  // Player has no cash
            }

            // Apply interest on debt
            debt += (int)(debt * INTEREST_RATE);
            cout << "Due to interest, you now owe " << debt << endl;
        }
    }

    // Update the player's debt and cash balance
    players[currentPlayer] = {players[currentPlayer].first, debt};

    // Save updated players' cash balance and debt to the file
    ofstream output("players.txt");
    for (const auto& player : players) {
        output << player.first << " " << player.second.first << " " << player.second.second << endl;
    }
    output.close();

    cout << "You now have " << players[currentPlayer].first << " remaining and " << players[currentPlayer].second << " in debt." << endl;

    return 0;
}


