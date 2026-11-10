#include "MazeGenerator.h"
#include <random>
#include <stack>

MazeGenerator::MazeGenerator()
    : game_board(), 
      rows(-1), 
      cols(-1)
{
}

MazeGenerator::MazeGenerator(GameBoard* gb)
    : game_board(gb), 
      rows(gb->getCellsHeight()), 
      cols(gb->getCellsWidth())
{
    std::srand(static_cast<unsigned>(std::time(nullptr)));
}


// FULL DISCLOSURE: The generate function was primarily Drafted using common development resources -> At least the logic for it
// and the idea to use a stack to simulate recursion ( like who thinks of that ? )

// ChatGPT is like a hammer. You're not a better craftsman if you use your hands instead of a hammer 
// when hammering in a nail. This is my justification that I don't suck at programming

void MazeGenerator::generate() {
    game_board->SetAllCellsToWalls();

    // Start with a random cell (excluding the bottom row)
    int startRow = 1 + 2 * (std::rand() % ((rows - 3) / 2));
    int startCol = 1 + 2 * (std::rand() % ((cols - 1) / 2));

    // Mark the starting cell as part of the maze
    game_board->gameBoard.at(startRow).at(startCol) = CELL_TYPE::NORMAL_PATH;

    // Create a stack to simulate the recursion
    std::stack<std::pair<int, int>> stack;
    stack.push(std::make_pair(startRow, startCol));

    while (!stack.empty()) {
        int row = stack.top().first;
        int col = stack.top().second;

        // Define the possible directions (right, left, down, up)
        int dirs[4][2] = { {0, 2}, {0, -2}, {2, 0}, {-2, 0} };

        // Randomize the order in which directions are considered
        std::vector<int> order = { 0, 1, 2, 3 };
        std::random_shuffle(order.begin(), order.end());

        bool found = false;

        // Iterate through each direction
        for (int i : order) {
            int newRow = row + dirs[i][0];
            int newCol = col + dirs[i][1];

            // Check if the new cell is within bounds and not in the last row
            if (newRow >= 0 && newRow < rows - 1 && newCol >= 0 && newCol < cols) {
                // Check if the new cell is a wall
                if (game_board->gameBoard.at(newRow).at(newCol) == CELL_TYPE::WALL) {
                    // Mark the new cell as part of the maze
                    game_board->gameBoard.at(newRow).at(newCol) = CELL_TYPE::NORMAL_PATH;

                    // Carve a path to the next cell
                    game_board->gameBoard.at(row + dirs[i][0] / 2).at(col + dirs[i][1] / 2) = CELL_TYPE::NORMAL_PATH;

                    // Push the new cell onto the stack
                    stack.push(std::make_pair(newRow, newCol));

                    found = true;
                    break;
                }
            }
        }

        // If no valid direction is found, pop the current cell from the stack
        if (!found) {
            stack.pop();
        }
    }

    game_board->update_made = true;
    game_board->DrawGameBoard();
}
