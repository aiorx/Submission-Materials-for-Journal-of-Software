#include <iostream>
#include <cstdlib>
#include <ctime>

using namespace std;

// 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
//       0 1 2 3 4 5 6 7 8 9
//       a
//       4



// 00 01 02 03 04 05
// 10 11 12 13 14 15
// 20 21 22 23 24 25
//
//
//
//

struct position {
    int x;
    int y;
    int health = 30;
};

const int ROW_SIZE = 10;
const int COL_SIZE = 20;
int enemyX = COL_SIZE / 5;
int enemyY = ROW_SIZE / 5;

void drawLine(int size) {
    for (int elemNumber = 0; elemNumber < size; elemNumber++)
        cout << "=";
    cout << endl;
}

void drawMap(char map[ROW_SIZE][COL_SIZE], position player) {
    for (int row = 0; row < ROW_SIZE; row++) {
        for (int col = 0; col < COL_SIZE; col++) {
            if (row == player.y && col == player.x)
                cout << "@";
            else
                cout << map[row][col];
        }
        cout << endl;
    }
}

void mapInit(char map[ROW_SIZE][COL_SIZE], char playerMap[ROW_SIZE][COL_SIZE]) {
    for (int row = 0; row < ROW_SIZE; row++) {
        for (int col = 0; col < COL_SIZE; col++) {
            if (row == 0 || col == 0 || row == ROW_SIZE - 1 || col == COL_SIZE - 1)
                map[row][col] = '*';
            else {
                int chance = rand() % 10;
                switch(chance) {
                case 1: map[row][col] = 's'; break;
                case 2: map[row][col] = 't'; break;
                default: map[row][col] = ' ';
                }
            }
            playerMap[row][col] = '*';
        }
    }
}

bool checkPosition(char map[ROW_SIZE][COL_SIZE], position pos) {
    char item = map[pos.y][pos.x];
    return item == ' ';
}

bool checkPositionEnemy(char map[ROW_SIZE][COL_SIZE], int enemyX, int enemyY) {
    char item = map[enemyX][enemyY];
    return item == ' ';
}

bool updatePlayerPosition(char map[ROW_SIZE][COL_SIZE], char direction, position *player) {
    position tempPosition;
    tempPosition = *player;
    switch (direction) {
    case 'w': tempPosition.y--; break;
    case 's': tempPosition.y++; break;
    case 'a': tempPosition.x--; break;
    case 'd': tempPosition.x++; break;
    }
    if (checkPosition(map, tempPosition)) {
        *player = tempPosition;
        return true;
    }
    return false;
}

void updatePlayerMap(char map[ROW_SIZE][COL_SIZE], char playerMap[ROW_SIZE][COL_SIZE], position player) {
    for (int row = player.y-2; row <= player.y+2; row++) {
        for (int col = player.x - 2; col <= player.x + 2; col++) {
            playerMap[row][col] = map[row][col];
            if (row == enemyY && col == enemyX)
                playerMap[row][col] = 'e';
        }
    }
}

//
//Supported via standard programming aids
// Function to update enemy position towards player
void updateEnemyPosition(char map[ROW_SIZE][COL_SIZE], int playerX, int playerY) {
    if (enemyX < playerX) {
        enemyX++;
    } else if (enemyX > playerX) {
        enemyX--;
    }

    if (enemyY < playerY) {
        enemyY++;
    } else if (enemyY > playerY) {
        enemyY--;
    }
}

int main()
{
    srand(time(NULL));

    char map[ROW_SIZE][COL_SIZE];
    char playerMap[ROW_SIZE][COL_SIZE];

    position player;
    player.x = COL_SIZE / 2;
    player.y = ROW_SIZE / 2;
    char direction = ' ';

    mapInit(map, playerMap);

    while (player.health > 0) {
        cout << "Player health: " << player.health << endl;
        drawMap(playerMap, player);
        drawLine(COL_SIZE);

        cout << "Enter direction: ";
        cin >> direction;
        if (updatePlayerPosition(map, direction, &player))
            updatePlayerMap(map, playerMap, player);
            updateEnemyPosition(map, player.x, player.y);
            if (abs(enemyX - player.x) <= 1 && abs(enemyY - player.y) <= 1) {
                player.health -= 3;
            }
        //system("CLS");
    }

    return 0;
}
