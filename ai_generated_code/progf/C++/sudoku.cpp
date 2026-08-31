#include <iostream>
#include <random>
using namespace std;

vector<vector<char>> solutionBoard;

vector<char> generateSeed()
{
    vector<char> digits = {'1', '2', '3', '4', '5', '6', '7', '8', '9'};

    // seed an rng
    random_device rd;
    mt19937 generator(rd());

    // shuffle vector
    shuffle(digits.begin(), digits.end(), generator);
    return digits;
}

// generateStartPos method Drafted using common development resources o1-preview
vector<vector<bool>> generateStartPos(int clueNums)
{
    // Step 1: Initialize the 9x9 grid with integer characters
    vector<vector<char>> grid(9, vector<char>(9));

    // fill with nums 1 through 9
    for (int i = 0; i < 9; ++i)
    {
        for (int j = 0; j < 9; ++j)
        {
            grid[i][j] = '1' + (i + j) % 9;
        }
    }

    // generate positions from 0 to 80
    vector<int> positions(81);
    for (int i = 0; i < 81; ++i)
    {
        positions[i] = i;
    }

    // shuffle position indices
    random_device rd;
    mt19937 g(rd()); // constructor
    shuffle(positions.begin(), positions.end(), g);

    // create a 9x9 bool grid filled with false
    // then fetch first x elements from positions, a shuffled vector<int>
    // flip those elements in _show_ to false
    vector<vector<bool>> show(9, vector<bool>(9, false));
    for (int k = 0; k < clueNums; ++k)
    {
        int p = positions[k];
        int row = p / 9;
        int col = p % 9;
        show[row][col] = true;
    }

    return show;
}

class Board
{

public:
    void generateSudoku(vector<vector<char>> &board)
    {
        backtrack(board, 0, 0);
    }

    bool isValid(const vector<vector<char>> &board, int row, int col, char num)
    {
        // Check the row
        for (int i = 0; i < 9; i++)
        {
            if (board[row][i] == num)
                return false;
        }
        // Check the column
        for (int i = 0; i < 9; i++)
        {
            if (board[i][col] == num)
                return false;
        }
        // Check the 3x3 sub-box
        int boxRowStart = 3 * (row / 3);
        int boxColStart = 3 * (col / 3);
        for (int i = 0; i < 3; i++)
        {
            for (int j = 0; j < 3; j++)
            {
                if (board[boxRowStart + i][boxColStart + j] == num)
                {
                    return false;
                }
            }
        }
        return true;
    }

    // passing board by reference. We need to actually wipe away vals besides our 20
    void Render(vector<vector<char>> &board, vector<vector<bool>> itsaStartingPos, bool isInitialRender)
    {

        cout << "    1 2 3 4 5 6 7 8 9" << endl;
        cout << "    - - - - - - - - -" << endl;

        for (int i = 0; i < board.size(); i++)
        {

            // draw row lettering
            char currRow = 'a' + i;
            cout << currRow << " | ";

            for (int j = 0; j < board[i].size(); j++)
            {
                if (itsaStartingPos[i][j])
                {
                    // Display starting position in red
                    cout << "\033[31m" << board[i][j] << "\033[0m" << " ";
                }
                else
                {
                    if (isInitialRender)
                    {
                        // Clear mutable cells for initial rendering
                        board[i][j] = ' ';
                        cout << "  ";
                    }
                    else
                    {
                        // Display non-empty mutable cells for re-rendering
                        if (board[i][j] != ' ')
                        {
                            cout << board[i][j] << " ";
                        }
                        else
                        {
                            cout << "  ";
                        }
                    }
                }
            }
            cout << endl;
        }
    }

private:
    bool backtrack(vector<vector<char>> &board, int row, int col)
    {
        auto openPos = findNextOpenPos(board, row, col);
        if (!openPos.has_value())
            return true;

        int openRow = openPos->first;
        int openCol = openPos->second;

        for (char num = '1'; num <= '9'; num++)
        {
            if (isValid(board, openRow, openCol, num))
            {
                board[openRow][openCol] = num;
                if (backtrack(board, openRow, openCol))
                    return true;               // Solution found!
                board[openRow][openCol] = ' '; // Undo move
            }
        }
        return false; // Trigger backtracking
    }

    optional<pair<int, int>> findNextOpenPos(const vector<vector<char>> &board, int currRow, int currCol)
    {
        for (int i = currRow; i < 9; i++)
        {
            for (int j = (i == currRow ? currCol : 0); j < 9; j++)
            {
                if (board[i][j] == ' ')
                {
                    return make_pair(i, j);
                }
            }
        }
        return nullopt; // No open position found
    }
};

// pass board by reference
bool takeATurn(vector<vector<char>> &board, vector<vector<bool>> startingPositions)
{
    Board gameBoard;
    string userChoice;
    cout << endl
         << "Enter row,col to write number, like \"a1\": ";
    cin >> userChoice;

    if (userChoice == "s")
    {
        // show solved board.
        gameBoard.Render(solutionBoard, startingPositions, false);
        cout << endl;
        return true;
    }

    if (userChoice.length() != 2)
    {
        cout << "input can only be length 2." << endl;
        return false;
    }

    // here userChoice guaranteed to be length 2. Safe to index like so.
    int userRowConverted = userChoice[0] - 'a';
    int userColConverted = userChoice[1] - 49;

    if (userRowConverted > 8 || userRowConverted < 0 || userColConverted > 8 || userColConverted < 0)
    {
        cout << "invalid row or column" << endl;
        return false;
    }

    if (startingPositions[userRowConverted][userColConverted])
    {
        cout << "can't overwrite a starting clue." << endl;
        return false;
    }

    cout << "Enter number for \"" + userChoice + "\", or enter a '.' to erase: ";

    // always safe to read user input as a string
    string potentialNum;
    cin >> potentialNum;

    // allow user to input a '.' -> delete char at that position.
    if (potentialNum == ".")
    {
        // board augment
        board[userRowConverted][userColConverted] = ' ';
        return true;
    }

    if (potentialNum == "s")
    {
        // show solved board.
        gameBoard.Render(solutionBoard, startingPositions, false);
        cout << endl;
        return true;
    }

    int num;
    try
    {
        num = stoi(potentialNum);
    }
    catch (const invalid_argument &e)
    {
        cout << "not a number, try again" << endl;
        return false;
    }
    catch (const out_of_range &e)
    {
        cout << "number too big, try again" << endl;
        return false;
    }

    if (num < 1 || num > 9)
    {
        cout << "number must be in [1-9]" << endl;
        return false;
    }

    char character = static_cast<char>(num + '0');

    if (!gameBoard.isValid(board, userRowConverted, userColConverted, character))
    {
        cout << "number already in row, column, or box." << endl;
        return false;
    }

    // after error checking user input, we mutate board.
    board[userRowConverted][userColConverted] = character;

    return true;
}

int main()
{

    vector<vector<char>> board(9, vector<char>(9, 0));
    vector<vector<char>> boardDeepCopy(9, vector<char>(9, 0));

    // generate 9 unique ints in random order
    vector<char> seed = generateSeed();

    // build seed board
    for (int i = 0; i < board.size(); i++)
    {
        for (int j = 0; j < board.size(); j++)
        {
            if (i == 0)
            {
                board[i][j] = seed[j];
                boardDeepCopy[i][j] = seed[j];
            }
            else
            {
                board[i][j] = ' ';
                boardDeepCopy[i][j] = ' ';
            }
        }
    }

    // fill out board, and a solution board with all values present.
    Board game;
    game.generateSudoku(board);
    game.generateSudoku(boardDeepCopy);
    solutionBoard = boardDeepCopy;

    // prompt user to for num clues to start game with
    cout << "Enter # clues for game between [7-80]: ";
    string clues;
    cin >> clues;
    int clueNums;

    try
    {
        clueNums = stoi(clues);
        if (clueNums > 80 || clueNums < 7)
        {
            cout << "out of range. Starting game with 7." << endl;
            clueNums = 7;
        }
    }
    catch (const invalid_argument &e)
    {
        cout << "not a number. Starting game with 7." << endl;
        clueNums = 7;
    }
    catch (const out_of_range &e)
    {
        cout << "out of range. Starting game with 7." << endl;
        clueNums = 7;
    }

    cout << endl
         << "\033[32mat any point, type 's' to show board solution.\033[0m" << endl
         << endl;

    vector<vector<bool>> startingPositions = generateStartPos(clueNums);

    // render in console
    game.Render(board, startingPositions, true);

    // actual game loop
    bool notFinished = true;
    while (true)
    {
        bool validTurn = takeATurn(board, startingPositions);
        if (!validTurn)
        {
            // re-render
            game.Render(board, startingPositions, false);
            continue;
        }
        // valid turn here
        else
        {
            for (int q = 0; q < board.size(); q++)
            {
                if (solutionBoard[q] != board[q])
                {
                    notFinished = true;
                    break;
                }
                notFinished = false;
            }
            if (notFinished)
            {
                game.Render(board, startingPositions, false);
                continue;
            }
            // endgame
            else
            {
                game.Render(board, startingPositions, false);
                cout << "\033[32mBoard Solved.\033[0m" << endl;
                break;
            }
        }
    }
}
