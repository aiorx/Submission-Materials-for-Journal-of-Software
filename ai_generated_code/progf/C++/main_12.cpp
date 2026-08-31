/*The following code was Aided using common development resources*/

#include <iostream>
#include <vector>

using namespace std;

// Define a struct for a player
struct Player {
    string name;
    char symbol;
};

// Define a class for the board
class Board {
    private:
        int rows;
        int cols;
        vector<vector<char>> board;

    public:
        // Constructor to initialize the board with empty cells
        Board(int rows, int cols) {
            this->rows = rows;
            this->cols = cols;

            for (int i = 0; i < rows; i++) {
                vector<char> row;
                for (int j = 0; j < cols; j++) {
                    row.push_back(' ');
                }
                board.push_back(row);
            }
        }

        int getRows() const {
            return rows;
        }

        int getCols() const {
            return cols;
        }


        // Print the board
        void print() {
            for (int i = 0; i < rows; i++) {
                for (int j = 0; j < cols; j++) {
                    cout << board[i][j] << " ";
                }
                cout << endl;
            }
        }

        // Check if the cell is empty
        bool isCellEmpty(int row, int col) {
            if (board[row][col] == ' ') {
                return true;
            }
            return false;
        }

        // Update the board with the player's move
        void updateBoard(int row, int col, char symbol) {
            board[row][col] = symbol;
        }

        // Check if there is a winner
        bool checkWinner(char symbol) {
            // Check rows
            for (int i = 0; i < rows; i++) {
                int count = 0;
                for (int j = 0; j < cols; j++) {
                    if (board[i][j] == symbol) {
                        count++;
                    }
                }
                if (count == cols) {
                    return true;
                }
            }

            // Check columns
            for (int i = 0; i < cols; i++) {
                int count = 0;
                for (int j = 0; j < rows; j++) {
                    if (board[j][i] == symbol) {
                        count++;
                    }
                }
                if (count == rows) {
                    return true;
                }
            }

            // Check diagonal from top-left to bottom-right
            int count = 0;
            for (int i = 0; i < rows; i++) {
                if (board[i][i] == symbol) {
                    count++;
                }
            }
            if (count == rows) {
                return true;
            }

            // Check diagonal from top-right to bottom-left
            count = 0;
            for (int i = 0; i < rows; i++) {
                if (board[i][cols-1-i] == symbol) {
                    count++;
                }
            }
            if (count == rows) {
                return true;
            }

            return false;
        }
};

// Define a class for the game
class Game {
    private:
        Board board;
        vector<Player> players;
        int currentPlayerIndex;

    public:
        // Constructor to initialize the game with a board and players
        Game(int rows, int cols, vector<Player> players) : board(rows, cols) {
            this->players = players;
            this->currentPlayerIndex = 0;

            // Print the initial game state
            cout << "Starting a new game" << endl;
            cout << "Board size: " << rows << "x" << cols << endl;
                        for (int i = 0; i < players.size(); i++) {
                cout << "Player " << i+1 << ": " << players[i].name << " (" << players[i].symbol << ")" << endl;
            }
            cout << "-----------------" << endl;
        }

        // Play the game
        void play() {
            while (true) {
                // Get the current player
                Player currentPlayer = players[currentPlayerIndex];

                // Print the board
                cout << "-----------------" << endl;
                cout << "Player " << currentPlayer.name << "'s turn" << endl;
                board.print();

                // Get the player's move
                int row, col;
                while (true) {
                    cout << "Enter row and column (e.g. 1 2): ";
                    cin >> row >> col;

                    // Check if the move is valid
                    if (row >= 1 && row <= board.getRows() && col >= 1 && col <= board.getCols()) {
                        if (board.isCellEmpty(row-1, col-1)) {
                            break;
                        }
                    }

                    cout << "Invalid move, please try again" << endl;
                }

                // Update the board with the player's move
                board.updateBoard(row-1, col-1, currentPlayer.symbol);

                // Check if the player has won
                if (board.checkWinner(currentPlayer.symbol)) {
                    cout << "-----------------" << endl;
                    board.print();
                    cout << "Player " << currentPlayer.name << " wins!" << endl;
                    break;
                }

                // Check if the game is a draw
                bool isDraw = true;
                for (int i = 0; i < board.getRows(); i++) {
                    for (int j = 0; j < board.getCols(); j++) {
                        if (board.isCellEmpty(i, j)) {
                            isDraw = false;
                            break;
                        }
                    }
                }
                if (isDraw) {
                    cout << "-----------------" << endl;
                    board.print();
                    cout << "It's a draw!" << endl;
                    break;
                }

                // Switch to the next player
                currentPlayerIndex = (currentPlayerIndex + 1) % players.size();
            }
        }
};

int main() {
    // Define the players
    vector<Player> players;
    Player player1 = {"Alice", 'X'};
    Player player2 = {"Bob", 'O'};
    players.push_back(player1);
    players.push_back(player2);

    // Define the game
    Game game(3, 3, players);

    // Play the game
    game.play();

    return 0;
}
