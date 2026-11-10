//Arrays
var gameIsRunning = true; // if true then the maze is shown

var playerOneAlive = true; // player 1 is alive from the beginning
var playerTwoAlive = true; // player 2 is alive from the beginning

var playerOneMove = true; // player 1 can move from the beginning, if false then the player is locked in place
var playerTwoMove = true; // player 2 can move from the beginning, if false then the player is locked in place

var gridSizeX = 101; // X-value of how big the maze is in coordinates
var gridSizeY = 101; // Y-value of how big the maze is in coordinates


var grid = []; // Stores the all of the coordinates of the lines with their values
var creatures = []; // Stores all of the creatures information such as name, riddle, answer, correct answer and x,y position on the maze
var players = []; // Stores all the players information such as hp, player-id and x,y coordinate
var hearts = []; // Stores all of the hearts information such as hp, individual id and x,y coordinate
var playerOneCorrect = []; // Stores the id's of the creatures that player 1 has answered correctly from
var playerTwoCorrect = []; // Stores the id's of the creatures that player 2 has answered correctly from
var playerOneHeart = []; // Stores the id's of the hearts that player 1 has used
var playerTwoHeart = []; // Stores the id's of the hearts that player 2 has used

// Setup for the size of the grid
function setup() {
    var renderer = createCanvas(800,800); // X size 800 and Y size 800
    renderer.parent("canvasContainer");
}

// Player constructor, x-pos, y-pos, hp, id
class Player {
    constructor(x, y, hp, id) {
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.id = id;
    }
}

// Declares the two player2 and their position, hp and id
var player1 = new Player(2, 2, 100, 1); // Coordinate (2, 2), 100 hp and player-id 1
var player2 = new Player(97, 97, 100, 2); // Coordinate (97, 97), 100 hp and player-id 2 

// Pushes the two player variables into the players array
players.push(new Player(2, 2, 100, 1));
players.push(new Player(97, 97, 100, 2));

// Trophy constructor, x-pos and y-pos
class Trophy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Declares the trophy variable with x-pos and y-pos (50, 50)
var trophy = new Trophy(50, 50);

// Heart constructor, x-pos, y-pos, hp and id
class Heart {
    constructor(x,y,hp,id) {
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.id = id;
    }
}

// Declares the seven hearts with positions, hp and individual id's
var heart1 = new Heart(27, 52, 10, 1);
var heart2 = new Heart(62, 22, 10, 2);
var heart3 = new Heart(62, 67, 10, 3);
var heart4 = new Heart(44, 82, 10, 4);
var heart5 = new Heart(77, 82, 10, 5);
var heart6 = new Heart(77, 55, 10, 6);
var heart7 = new Heart(45, 37, 10, 7);

// Pushes the seven hearts into the hearts array
hearts.push(new Heart(27, 52, 10, 1));
hearts.push(new Heart(62, 22, 10, 2));
hearts.push(new Heart(62, 67, 10, 3));
hearts.push(new Heart(44, 82, 10, 4));
hearts.push(new Heart(77, 82, 10, 5));
hearts.push(new Heart(77, 55, 10, 6));
hearts.push(new Heart(45, 37, 10, 7));

// Initializes the grid with the given values set in all of the for loops
function initializeGrid(value) {
    // Loops through each column of the grid
    for (var x = 0; x < gridSizeX; x++) {
        grid[x] = []; // Initializes the row as an empty array
        // Loops through each row of the grid
        for (var y = 0; y < gridSizeY; y++) {
            grid[x][y] = value; // Sets each cell to the given value
        }
    }
    for (var x = 0; x <= 100; x++) {
        grid[x][100] = 1;
    }
    for (var y = 0; y <= 100; y++) {
        grid[100][y] = 1;
    }
  
  for (var x = 100; x >= 0; x--) {
        grid[x][0] = 1;
    }  
  
      for (var y = 100; y >= 0; y--) {
        grid[0][y] = 1;
    }
  
    for (var y = 5; y >= 0; y--) {
        grid[5][y] = 1;
    }

    for (var x = 10; x >= 5; x--) {
        grid[x][5] = 1;
    }  

    for (var x = 10; x >= 0; x--) {
        grid[x][10] = 1;
    }  

    for (var y = 5; y >= 0; y--) {
        grid[10][y] = 1;
    }

    for (var y = 25; y >= 10; y--) {
        grid[10][y] = 1;
    }

    for (var x = 10; x >= 0; x--) {
        grid[x][25] = 1;
    }  

    for (var y = 35; y >= 30; y--) {
        grid[5][y] = 1;
    }

    for (var x = 15; x >= 5; x--) {
        grid[x][30] = 1;
    }  

    for (var y = 30; y >= 20; y--) {
        grid[15][y] = 1;
    }

    for (var y = 15; y >= 5; y--) {
        grid[15][y] = 1;
    }

    for (var x = 25; x >= 15; x--) {
        grid[x][20] = 1;
    }  

    for (var x = 25; x >= 15; x--) {
        grid[x][15] = 1;
    }  

    for (var x = 30; x >= 15; x--) {
        grid[x][5] = 1;
    }  

    for (var y = 30; y >= 20; y--) {
        grid[25][y] = 1;
    }

    for (var x = 40; x >= 30; x--) {
        grid[x][20] = 1;
    }  

    for (var y = 15; y >= 5; y--) {
        grid[35][y] = 1;
    }

    for (var y = 30; y >= 25; y--) {
        grid[20][y] = 1;
    }

    for (var y = 40; y >= 35; y--) {
        grid[20][y] = 1;
    }

    for (var x = 15; x >=5; x--) {
        grid[x][35] = 1;
    }  

    for (var x = 35; x >=20; x--) {
        grid[x][35] = 1;
    }  

    for (var y = 40; y >= 35; y--) {
        grid[35][y] = 1;
    }

    for (var y = 45; y >= 40; y--) {
        grid[47][y] = 1;
    }

    for (var x = 47; x >=40; x--) {
        grid[x][40] =1;
    }  

    for (var x = 25; x >=20; x--) {
        grid[x][30] = 1;
    }  

    for (var y = 15; y >= 5; y--) {
        grid[25][y] = 1;
    }

    for (var y = 15; y >= 5; y--) {
        grid[30][y] = 1;
    }

    for (var y = 30; y >= 20; y--) {
        grid[30][y] = 1;
    }

    for (var y = 5; y >= 0; y--) {
        grid[35][y] = 1;
    }

    for (var x = 55; x >= 53; x--) {
        grid[x][45] = 1;
    }

    for (var x = 47; x >= 45; x--) {
        grid[x][45] = 1;
    }

    for (var x = 55; x >= 53; x--) {
        grid[x][55] = 1;
    }

    for (var x = 47; x >= 45; x--) {
        grid[x][55] = 1;
    }

    for (var y = 47; y >= 45; y--) {
        grid[45][y] = 1;
    }

    for (var y = 55; y >= 53; y--) {
        grid[45][y] = 1;
    }

    for (var y = 47; y >= 45; y--) {
        grid[55][y] = 1;
    }

    for (var y = 55; y >= 53; y--) {
        grid[55][y] = 1;
    }

    for (var x = 45; x >= 40; x--) {
        grid[x][53] = 1;
    }

    for (var x = 45; x >= 40; x--) {
        grid[x][47] = 1;
    }

    for (var y = 54; y >= 46; y--) {
        grid[35][y] = 1;
    }

    for (var y = 47; y >= 41; y--) {
        grid[40][y] = 1;
    }

    for (var x = 35; x >= 20; x--) {
        grid[x][45] = 1;
    }

    for (var x = 35; x >= 20; x--) {
        grid[x][40] = 1;
    }

    for (var x = 60; x >= 55; x--) {
        grid[x][47] = 1;
    }

    for (var x = 60; x >= 55; x--) {
        grid[x][53] = 1;
    }

    for (var y = 45; y >= 40; y--) {
        grid[53][y] = 1;
    }

    for (var y = 60; y >= 55; y--) {
        grid[53][y] = 1;
    }

    for (var y = 60; y >= 55; y--) {
        grid[47][y] = 1;
    }

    for (var y = 60; y >= 53; y--) {
        grid[40][y] = 1;
    }

    for (var y = 60; y >= 53; y--) {
        grid[60][y] = 1;
    }

    for (var x = 60; x >= 53; x--) {
        grid[x][60] = 1;
    }

    for (var x = 47; x >= 40; x--) {
        grid[x][60] = 1;
    }

    for (var x = 60; x >= 53; x--) {
        grid[x][40] = 1;
    }

    for (var y = 47; y >= 40; y--) {
        grid[60][y] = 1;
    }

    for (var x = 40; x >= 30; x--) {
        grid[x][30] = 1;
    }

    for (var y = 35; y >= 20; y--) {
        grid[40][y] = 1;
    }
    
    for (var x = 47; x >= 40; x--) {
        grid[x][35] = 1;
    }

    for (var x = 95; x >= 90; x--) {
        grid[x][5] = 1;
    }

    for (var y = 10; y >= 5; y--) {
        grid[95][y] = 1;
    }

    for (var y = 95; y >= 90; y--) {
        grid[95][y] = 1;
    }

    for (var x = 100; x >= 95; x--) {
        grid[x][95] = 1;
    }

    for (var x = 100; x >= 95; x--) {
        grid[x][90] = 1;
    }

    for (var y = 100; y >= 90; y--) {
        grid[90][y] = 1;
    }

    for (var y = 95; y >= 90; y--) {
        grid[5][y] = 1;
    }

    for (var x = 10; x >= 5; x--) {
        grid[x][95] = 1;
    }

    for (var y = 60; y >= 55; y--) {
        grid[35][y] = 1;
    }

    for (var x = 35; x >= 20; x--) {
        grid[x][60] = 1;
    }

    for (var y = 60; y >= 55; y--) {
        grid[20][y] = 1;
    }

    for (var y = 50; y >= 45; y--) {
        grid[20][y] = 1;
    }

    for (var x = 30; x >= 20; x--) {
        grid[x][50] = 1;
    }

    for (var x = 30; x >= 20; x--) {
        grid[x][55] = 1;
    }

    for (var y = 55; y >= 50; y--) {
        grid[30][y] = 1;
    }

    for (var y = 30; y >= 20; y--) {
        grid[45][y] = 1;
    }

    for (var y = 30; y >= 20; y--) {
        grid[47][y] = 1;
    }

    for (var x = 47; x >= 45; x--) {
        grid[x][30] = 1;
    }

    for (var x = 47; x >= 45; x--) {
        grid[x][20] = 1;
    }

    for (var y = 50; y >= 40; y--) {
        grid[10][y] = 1;
    }
    for (var y = 50; y >= 40; y--) {
        grid[5][y] = 1;
    }
    for (var x = 10; x >= 5; x--) {
        grid[x][50] = 1;
    }
    for (var x = 10; x >= 5; x--) {
        grid[x][40] = 1;
    }

    for (var y = 50; y >= 35; y--) {
        grid[15][y] = 1;
    }

    for (var y = 65; y >= 55; y--) {
        grid[15][y] = 1;
    }

    for (var y = 65; y >= 55; y--) {
        grid[10][y] = 1;
    }
    for (var y = 65; y >= 55; y--) {
        grid[5][y] = 1;
    }
    for (var x = 10; x >= 5; x--) {
        grid[x][65] = 1;
    }
    for (var x = 10; x >= 5; x--) {
        grid[x][55] = 1;
    }

    for (var y = 30; y >= 15; y--) {
        grid[90][y] = 1;
    }
    for (var y = 30; y >= 15; y--) {
        grid[95][y] = 1;
    }

    for (var x = 100; x >= 95; x--) {
        grid[x][15] = 1;
    }

    for (var x = 100; x >= 95; x--) {
        grid[x][30] = 1;
    }

    for (var x = 95; x >= 90; x--) {
        grid[x][10] = 1;
    }

    for (var y = 10; y >= 5; y--) {
        grid[90][y] = 1;
    }

    for (var x = 85; x >= 75; x--) {
        grid[x][5] = 1;
    }

    for (var y = 10; y >= 5; y--) {
        grid[85][y] = 1;
    }

    for (var y = 20; y >= 15; y--) {
        grid[85][y] = 1;
    }

    for (var y = 30; y >= 25; y--) {
        grid[85][y] = 1;
    }

    for (var x = 85; x >= 75; x--) {
        grid[x][10] = 1;
    }

    for (var y = 10; y >= 5; y--) {
        grid[75][y] = 1;
    }

    for (var x = 85; x >= 75; x--) {
        grid[x][15] = 1;
    }

    for (var x = 85; x >= 80; x--) {
        grid[x][25] = 1;
    }

    for (var y = 25; y >= 20; y--) {
        grid[80][y] = 1;
    }

    for (var x = 80; x >= 75; x--) {
        grid[x][20] = 1;
    }

    for (var x = 85; x >= 75; x--) {
        grid[x][30] = 1;
    }

    for (var y = 30; y >= 20; y--) {
        grid[75][y] = 1;
    }

    for (var x = 90; x >= 75; x--) {
        grid[x][90] = 1;
    }

    for (var y = 100; y >= 90; y--) {
        grid[75][y] = 1;
    }

    for (var x = 70; x >= 60; x--) {
        grid[x][95] = 1;
    }

    for (var x = 90; x >= 75; x--) {
        grid[x][85] = 1;
    }

    for (var y = 85; y >= 70; y--) {
        grid[95][y] = 1;
    }

    for (var y = 80; y >= 70; y--) {
        grid[90][y] = 1;
    }

    for (var x = 90; x >= 75; x--) {
        grid[x][70] = 1;
    }

    for (var x = 85; x >= 75; x--) {
        grid[x][80] = 1;
    }

    for (var y = 85; y >= 75; y--) {
        grid[75][y] = 1;
    }

    for (var x = 85; x >= 75; x--) {
        grid[x][75] = 1;
    }

    for (var y = 80; y >= 75; y--) {
        grid[85][y] = 1;
    }

    for (var x = 70; x >= 60; x--) {
        grid[x][90] = 1;
    }

    for (var y = 95; y >= 90; y--) {
        grid[70][y] = 1;
    }

    for (var y = 95; y >= 90; y--) {
        grid[60][y] = 1;
    }

    for (var x = 70; x >= 65; x--) {
        grid[x][70] = 1;
    }
    for (var y = 70; y >= 65; y--) {
        grid[70][y] = 1;
    }

    for (var y = 70; y >= 65; y--) {
        grid[75][y] = 1;
    }
    for (var y = 70; y >= 65; y--) {
        grid[90][y] = 1;
    }

    for (var x = 90; x >= 75; x--) {
        grid[x][65] = 1;
    }

    for (var x = 100; x >= 95; x--) {
        grid[x][47] = 1;
    }

    for (var x = 100; x >= 95; x--) {
        grid[x][53] = 1;
    }

    for (var y = 53; y >= 47; y--) {
        grid[95][y] = 1;
    }

    for (var y = 42; y >= 35; y--) {
        grid[95][y] = 1;
    }

    for (var y = 65; y >= 58; y--) {
        grid[95][y] = 1;
    }

    for (var y = 42; y >= 35; y--) {
        grid[90][y] = 1;
    }

    for (var x = 95; x >= 90; x--) {
        grid[x][42] = 1;
    }

    for (var x = 95; x >= 90; x--) {
        grid[x][35] = 1;
    }

    for (var x = 70; x >= 65; x--) {
        grid[x][60] = 1;
    }

    for (var y = 75; y >= 65; y--) {
        grid[60][y] = 1;
    }

    for (var y = 70; y >= 65; y--) {
        grid[65][y] = 1;
    }

    for (var x = 70; x >= 65; x--) {
        grid[x][65] = 1;
    }

    for (var x = 60; x >= 53; x--) {
        grid[x][65] = 1;
    }

    for (var x = 53; x >= 47; x--) {
        grid[x][70] = 1;
    }

    for (var x = 47; x >= 40; x--) {
        grid[x][65] = 1;
    }
    for (var y = 75; y >= 65; y--) {
        grid[40][y] = 1;
    }

    for (var y = 75; y >= 70; y--) {
        grid[47][y] = 1;
    }

    for (var y = 75; y >= 70; y--) {
        grid[53][y] = 1;
    }

    for (var x = 53; x >= 47; x--) {
        grid[x][75] = 1;
    }

    for (var y = 75; y >= 65; y--) {
        grid[42][y] = 1;
    }

    for (var y = 75; y >= 65; y--) {
        grid[58][y] = 1;
    }

    for (var x = 60; x >= 58; x--) {
        grid[x][75] = 1;
    }

    for (var x = 42; x >= 40; x--) {
        grid[x][75] = 1;
    }


    for (var y = 35; y >= 30; y--) {
        grid[15][y] = 1;
    }

    for (var x = 90; x >= 80; x--) {
        grid[x][58] = 1;
    }

    for (var x = 90; x >= 80; x--) {
        grid[x][60] = 1;
    }

    for (var y = 60; y >= 58; y--) {
        grid[90][y] = 1;
    }
    for (var y = 60; y >= 58; y--) {
        grid[80][y] = 1;
    }

    for (var x = 90; x >= 80; x--) {
        grid[x][53] = 1;
    }

    for (var x = 90; x >= 80; x--) {
        grid[x][47] = 1;
    }

    for (var y = 53; y >= 47; y--) {
        grid[90][y] = 1;
    }

    for (var y = 53; y >= 47; y--) {
        grid[80][y] = 1;
    }

    for (var x = 85; x >= 70; x--) {
        grid[x][35] = 1;
    }

    for (var x = 85; x >= 70; x--) {
        grid[x][40] = 1;
    }

    for (var x = 85; x >= 70; x--) {
        grid[x][42] = 1;
    }

    for (var y = 42; y >= 40; y--) {
        grid[70][y] = 1;
    }

    for (var y = 42; y >= 40; y--) {
        grid[85][y] = 1;
    }

    for (var y = 60; y >= 47; y--) {
        grid[75][y] = 1;
    }

    for (var y = 30; y >= 20; y--) {
        grid[53][y] = 1;
    }

    for (var y = 30; y >= 20; y--) {
        grid[55][y] = 1;
    }

    for (var x = 53; x >= 47; x--) {
        grid[x][25] = 1;
    }

    for (var x = 55; x >= 53; x--) {
        grid[x][30] = 1;
    }

    for (var x = 55; x >= 53; x--) {
        grid[x][20] = 1;
    }

    for (var x = 60; x >= 53; x--) {
        grid[x][35] = 1;
    }

    for (var y = 35; y >= 20; y--) {
        grid[60][y] = 1;
    }
    
    for (var y = 15; y >= 5; y--) {
        grid[40][y] = 1;
    }
    for (var x = 50; x >= 40; x--) {
        grid[x][5] = 1;
    }

    for (var x = 50; x >= 45; x--) {
        grid[x][10] = 1;
    }

    for (var x = 50; x >= 45; x--) {
        grid[x][15] = 1;
    }

    for (var y = 15; y >= 10; y--) {
        grid[50][y] = 1;
    }
    for (var y = 15; y >= 10; y--) {
        grid[45][y] = 1;
    }

    for (var y = 10; y >= 0; y--) {
        grid[70][y] = 1;
    }

    for (var y = 15; y >= 5; y--) {
        grid[65][y] = 1;
    }

    for (var x = 70; x >= 65; x--) {
        grid[x][15] = 1;
    }

    for (var x = 60; x >= 55; x--) {
        grid[x][5] = 1;
    }

    for (var x = 60; x >= 55; x--) {
        grid[x][15] = 1;
    }

    for (var y = 15; y >= 5; y--) {
        grid[60][y] = 1;
    }

    for (var y = 15; y >= 5; y--) {
        grid[55][y] = 1;
    }

    for (var y = 35; y >= 25; y--) {
        grid[65][y] = 1;
    }

    for (var y = 20; y >= 15; y--) {
        grid[65][y] = 1;
    }

    for (var y = 30; y >= 20; y--) {
        grid[70][y] = 1;
    }

    for (var x = 65; x >= 60; x--) {
        grid[x][35] = 1;
    }

    for (var x = 65; x >= 60; x--) {
        grid[x][25] = 1;
    }

    for (var y = 55; y >= 40; y--) {
        grid[65][y] = 1;
    }

    for (var y = 55; y >= 47; y--) {
        grid[70][y] = 1;
    }

    for (var x = 70; x >= 65; x--) {
        grid[x][55] = 1;
    }

    for (var x = 70; x >= 65; x--) {
        grid[x][47] = 1;
    }

    for (var x = 70; x >= 60; x--) {
        grid[x][85] = 1;
    }

    for (var y = 85; y >= 75; y--) {
        grid[70][y] = 1;
    }

    for (var y = 80; y >= 75; y--) {
        grid[65][y] = 1;
    }

    for (var y = 85; y >= 80; y--) {
        grid[60][y] = 1;
    }

    for (var x = 65; x >= 60; x--) {
        grid[x][80] = 1;
    }

    for (var x = 70; x >= 65; x--) {
        grid[x][75] = 1;
    }

    for (var y = 95; y >= 85; y--) {
        grid[10][y] = 1;
    }

    for (var x = 10; x >= 5; x--) {
        grid[x][90] = 1;
    }

    for (var y = 85; y >= 70; y--) {
        grid[5][y] = 1;
    }

    for (var x = 15; x >= 10; x--) {
        grid[x][90] = 1;
    }

    for (var y = 100; y >= 85; y--) {
        grid[20][y] = 1;
    }

    for (var x = 20; x >= 15; x--) {
        grid[x][85] = 1;
    }

    for (var x = 10; x >= 5; x--) {
        grid[x][80] = 1;
    }

    for (var x = 10; x >= 5; x--) {
        grid[x][75] = 1;
    }

    for (var y = 70; y >= 65; y--) {
        grid[10][y] = 1;
    }

    for (var y = 80; y >= 75; y--) {
        grid[10][y] = 1;
    }

    for (var y = 100; y >= 95; y--) {
        grid[15][y] = 1;
    }

    for (var x = 20; x >= 15; x--) {
        grid[x][95] = 1;
    }

    for (var y = 80; y >= 75; y--) {
        grid[20][y] = 1;
    }

    for (var y = 70; y >= 65; y--) {
        grid[20][y] = 1;
    }

    for (var y = 80; y >= 75; y--) {
        grid[35][y] = 1;
    }

    for (var y = 70; y >= 65; y--) {
        grid[35][y] = 1;
    }

    for (var x = 25; x >= 20; x--) {
        grid[x][80] = 1;
    }

    for (var x = 35; x >= 30; x--) {
        grid[x][80] = 1;
    }

    for (var x = 25; x >= 20; x--) {
        grid[x][65] = 1;
    }

    for (var x = 35; x >= 30; x--) {
        grid[x][65] = 1;
    }

    for (var x = 35; x >= 30; x--) {
        grid[x][70] = 1;
    }

    for (var x = 35; x >= 30; x--) {
        grid[x][75] = 1;
    }

    for (var x = 25; x >= 20; x--) {
        grid[x][70] = 1;
    }

    for (var x = 25; x >= 20; x--) {
        grid[x][75] = 1;
    }

    for (var y = 70; y >= 65; y--) {
        grid[30][y] = 1;
    }

    for (var y = 70; y >= 65; y--) {
        grid[25][y] = 1;
    }

    for (var y = 80; y >= 75; y--) {
        grid[30][y] = 1;
    }

    for (var y = 80; y >= 75; y--) {
        grid[25][y] = 1;
    }

    for (var y = 80; y >= 75; y--) {
        grid[15][y] = 1;
    }

    for (var x = 15; x >= 10; x--) {
        grid[x][70] = 1;
    }

    for (var y = 95; y >= 90; y--) {
        grid[25][y] = 1;
    }

    for (var y = 100; y >= 90; y--) {
        grid[40][y] = 1;
    }

    for (var x = 30; x >= 25; x--) {
        grid[x][90] = 1;
    }

    for (var x = 40; x >= 35; x--) {
        grid[x][90] = 1;
    }

    for (var x = 35; x >= 30; x--) {
        grid[x][85] = 1;
    }

    for (var y = 90; y >= 85; y--) {
        grid[35][y] = 1;
    }

    for (var y = 90; y >= 85; y--) {
        grid[30][y] = 1;
    }

    for (var y = 85; y >= 80; y--) {
        grid[25][y] = 1;
    }

    for (var y = 85; y >= 80; y--) {
        grid[40][y] = 1;
    }

    for (var y = 85; y >= 80; y--) {
        grid[42][y] = 1;
    }

    for (var y = 90; y >= 85; y--) {
        grid[47][y] = 1;
    }

    for (var x = 42; x >= 40; x--) {
        grid[x][85] = 1;
    }
    for (var x = 42; x >= 40; x--) {
        grid[x][80] = 1;
    }

    for (var x = 47; x >= 40; x--) {
        grid[x][80] = 1;
    }

    for (var x = 47; x >= 40; x--) {
        grid[x][90] = 1;
    }

    for (var y = 100; y >= 95; y--) {
        grid[47][y] = 1;
    }

    for (var x = 47; x >= 40; x--) {
        grid[x][95] = 1;
    }

    for (var x = 55; x >= 40; x--) {
        grid[x][90] = 1;
    }

    for (var x = 55; x >= 52; x--) {
        grid[x][80] = 1;
    }
    for (var x = 55; x >= 52; x--) {
        grid[x][85] = 1;
    }

    for (var y = 85; y >= 80; y--) {
        grid[52][y] = 1;
    }

    for (var y = 85; y >= 80; y--) {
        grid[55][y] = 1;
    }

    for (var y = 95; y >= 90; y--) {
        grid[55][y] = 1;
    }

    for (var y = 95; y >= 90; y--) {
        grid[52][y] = 1;
    }

    for (var x = 55; x >= 52; x--) {
        grid[x][95] = 1;
    }

    for (var y = 100; y >= 95; y--) {
        grid[30][y] = 1;
    }

    for (var x = 30; x >= 25; x--) {
        grid[x][95] = 1;
    }

    //Green
    for (var y = 4; y >= 1; y--) {
        grid[6][y] = 2;
    }
    for (var y = 4; y >= 1; y--) {
        grid[7][y] = 2;
    }
    for (var y = 4; y >= 1; y--) {
        grid[8][y] = 2;
    }
    for (var y = 4; y >= 1; y--) {
        grid[9][y] = 2;
    }


    //
    for (var y = 24; y >= 11; y--) {
        grid[1][y] = 2;
    }
    for (var y = 24; y >= 11; y--) {
        grid[2][y] = 2;
    }
    for (var y = 24; y >= 11; y--) {
        grid[3][y] = 2;
    }
    for (var y = 24; y >= 11; y--) {
        grid[4][y] = 2;
    }
    for (var y = 24; y >= 11; y--) {
        grid[5][y] = 2;
    }
    for (var y = 24; y >= 11; y--) {
        grid[6][y] = 2;
    }
    for (var y = 24; y >= 11; y--) {
        grid[7][y] = 2;
    }
    for (var y = 24; y >= 11; y--) {
        grid[8][y] = 2;
    }
    for (var y = 24; y >= 11; y--) {
        grid[9][y] = 2;
    }


    //
    for (var y = 14; y >= 6; y--) {
        grid[16][y] = 2;
    }
    for (var y = 14; y >= 6; y--) {
        grid[17][y] = 2;
    }
    for (var y = 14; y >= 6; y--) {
        grid[18][y] = 2;
    }
    for (var y = 14; y >= 6; y--) {
        grid[19][y] = 2;
    }
    for (var y = 14; y >= 6; y--) {
        grid[20][y] = 2;
    }
    for (var y = 14; y >= 6; y--) {
        grid[21][y] = 2;
    }
    for (var y = 14; y >= 6; y--) {
        grid[22][y] = 2;
    }
    for (var y = 14; y >= 6; y--) {
        grid[23][y] = 2;
    }
    for (var y = 14; y >= 6; y--) {
        grid[24][y] = 2;
    }


    //
    for (var y = 29; y >= 21; y--) {
        grid[31][y] = 2;
    }
    for (var y = 29; y >= 21; y--) {
        grid[32][y] = 2;
    }
    for (var y = 29; y >= 21; y--) {
        grid[33][y] = 2;
    }
    for (var y = 29; y >= 21; y--) {
        grid[34][y] = 2;
    }
    for (var y = 29; y >= 21; y--) {
        grid[35][y] = 2;
    }
    for (var y = 29; y >= 21; y--) {
        grid[36][y] = 2;
    }
    for (var y = 29; y >= 21; y--) {
        grid[37][y] = 2;
    }
    for (var y = 29; y >= 21; y--) {
        grid[38][y] = 2;
    }
    for (var y = 29; y >= 21; y--) {
        grid[39][y] = 2;
    }


    //
    for (var x = 34; x >= 21; x--) {
        grid[x][36] = 2;
    }
    for (var x = 34; x >= 21; x--) {
        grid[x][37] = 2;
    }
    for (var x = 34; x >= 21; x--) {
        grid[x][38] = 2;
    }
    for (var x = 34; x >= 21; x--) {
        grid[x][39] = 2;
    }


    //
    for (var x = 34; x >= 21; x--) {
        grid[x][46] = 2;
    }
    for (var x = 34; x >= 21; x--) {
        grid[x][47] = 2;
    }
    for (var x = 34; x >= 21; x--) {
        grid[x][48] = 2;
    }
    for (var x = 34; x >= 21; x--) {
        grid[x][49] = 2;
    }


    for (var y = 55; y >= 50; y--) {
        grid[31][y] = 2;
    }
    for (var y = 55; y >= 50; y--) {
        grid[32][y] = 2;
    }
    for (var y = 55; y >= 50; y--) {
        grid[33][y] = 2;
    }
    for (var y = 55; y >= 50; y--) {
        grid[34][y] = 2;
    }


    for (var x = 34; x >= 21; x--) {
        grid[x][56] = 2;
    }
    for (var x = 34; x >= 21; x--) {
        grid[x][57] = 2;
    }
    for (var x = 34; x >= 21; x--) {
        grid[x][58] = 2;
    }
        for (var x = 34; x >= 21; x--) {
        grid[x][59] = 2;
    }


    //
    for (var y = 59; y >= 54; y--) {
        grid[41][y] = 2;
    }
    for (var y = 59; y >= 54; y--) {
        grid[42][y] = 2;
    }
    for (var y = 59; y >= 54; y--) {
        grid[43][y] = 2;
    }
    for (var y = 59; y >= 54; y--) {
        grid[44][y] = 2;
    }
    for (var y = 59; y >= 56; y--) {
        grid[45][y] = 2;
    }
    for (var y = 59; y >= 56; y--) {
        grid[46][y] = 2;
    }


    //
    for (var y = 59; y >= 54; y--) {
        grid[56][y] = 2;
    }
    for (var y = 59; y >= 54; y--) {
        grid[57][y] = 2;
    }
    for (var y = 59; y >= 54; y--) {
        grid[58][y] = 2;
    }
    for (var y = 59; y >= 54; y--) {
        grid[59][y] = 2;
    }
    for (var y = 59; y >= 56; y--) {
        grid[55][y] = 2;
    }
    for (var y = 59; y >= 56; y--) {
        grid[54][y] = 2;
    }


    //
    for (var y = 46; y >= 41; y--) {
        grid[56][y] = 2;
    }
    for (var y = 46; y >= 41; y--) {
        grid[57][y] = 2;
    }
    for (var y = 46; y >= 41; y--) {
        grid[58][y] = 2;
    }
    for (var y = 46; y >= 41; y--) {
        grid[59][y] = 2;
    }
    for (var y = 44; y >= 41; y--) {
        grid[55][y] = 2;
    }
    for (var y = 44; y >= 41; y--) {
        grid[54][y] = 2;
    }


    //
    for (var y = 46; y >= 41; y--) {
        grid[41][y] = 2;
    }
    for (var y = 46; y >= 41; y--) {
        grid[42][y] = 2;
    }
    for (var y = 46; y >= 41; y--) {
        grid[43][y] = 2;
    }
    for (var y = 46; y >= 41; y--) {
        grid[44][y] = 2;
    }
    for (var y = 44; y >= 41; y--) {
        grid[45][y] = 2;
    }
    for (var y = 44; y >= 41; y--) {
        grid[46][y] = 2;
    }


    //
    for (var y = 94; y >= 91; y--) {
        grid[96][y] = 2;
    }
    for (var y = 94; y >= 91; y--) {
        grid[97][y] = 2;
    }
    for (var y = 94; y >= 91; y--) {
        grid[98][y] = 2;
    }
    for (var y = 94; y >= 91; y--) {
        grid[99][y] = 2;
    }


    //
    for (var y = 29; y >= 21; y--) {
        grid[46][y] = 2;
    }


    //
    for (var y = 49; y >= 41; y--) {
        grid[6][y] = 2;
    }
    for (var y = 49; y >= 41; y--) {
        grid[7][y] = 2;
    }
    for (var y = 49; y >= 41; y--) {
        grid[8][y] = 2;
    }
    for (var y = 49; y >= 41; y--) {
        grid[9][y] = 2;
    }


    //
    for (var y = 64; y >= 56; y--) {
        grid[6][y] = 2;
    }
    for (var y = 64; y >= 56; y--) {
        grid[7][y] = 2;
    }
    for (var y = 64; y >= 56; y--) {
        grid[8][y] = 2;
    }
    for (var y = 64; y >= 56; y--) {
        grid[9][y] = 2;
    }


    //
    for (var y = 29; y >= 16; y--) {
        grid[96][y] = 2;
    }
    for (var y = 29; y >= 16; y--) {
        grid[97][y] = 2;
    }
    for (var y = 29; y >= 16; y--) {
        grid[98][y] = 2;
    }
    for (var y = 29; y >= 16; y--) {
        grid[99][y] = 2;
    }


    //
    for (var y = 9; y >= 6; y--) {
        grid[94][y] = 2;
    }
    for (var y = 9; y >= 6; y--) {
        grid[93][y] = 2;
    }
    for (var y = 9; y >= 6; y--) {
        grid[92][y] = 2;
    }
    for (var y = 9; y >= 6; y--) {
        grid[91][y] = 2;
    }


    //
    for (var y = 29; y >= 26; y--) {
        grid[84][y] = 2;
    }
    for (var y = 29; y >= 26; y--) {
        grid[83][y] = 2;
    }
    for (var y = 29; y >= 26; y--) {
        grid[82][y] = 2;
    }
    for (var y = 29; y >= 26; y--) {
        grid[81][y] = 2;
    }
    for (var y = 29; y >= 26; y--) {
        grid[80][y] = 2;
    }
    for (var y = 29; y >= 21; y--) {
        grid[79][y] = 2;
    }
    for (var y = 29; y >= 21; y--) {
        grid[78][y] = 2;
    }
    for (var y = 29; y >= 21; y--) {
        grid[77][y] = 2;
    }
    for (var y = 29; y >= 21; y--) {
        grid[76][y] = 2;
    }


    //
    for (var x = 84; x >= 76; x--) {
        grid[x][6] = 2;
    }
    for (var x = 84; x >= 76; x--) {
        grid[x][7] = 2;
    }
    for (var x = 84; x >= 76; x--) {
        grid[x][8] = 2;
    }
    for (var x = 84; x >= 76; x--) {
        grid[x][9] = 2;
    }


    //
    for (var x = 84; x >= 76; x--) {
        grid[x][76] = 2;
    }
    for (var x = 84; x >= 76; x--) {
        grid[x][77] = 2;
    }
    for (var x = 84; x >= 76; x--) {
        grid[x][78] = 2;
    }
    for (var x = 84; x >= 76; x--) {
        grid[x][79] = 2;
    }


    //
    for (var x = 89; x >= 76; x--) {
        grid[x][91] = 2;
    }
    for (var x = 89; x >= 76; x--) {
        grid[x][92] = 2;
    }
    for (var x = 89; x >= 76; x--) {
        grid[x][93] = 2;
    }
    for (var x = 89; x >= 76; x--) {
        grid[x][94] = 2;
    }
    for (var x = 89; x >= 76; x--) {
        grid[x][95] = 2;
    }
    for (var x = 89; x >= 76; x--) {
        grid[x][96] = 2;
    }
    for (var x = 89; x >= 76; x--) {
        grid[x][97] = 2;
    }
    for (var x = 89; x >= 76; x--) {
        grid[x][98] = 2;
    }
    for (var x = 89; x >= 76; x--) {
        grid[x][99] = 2;
    }


    //
    for (var x = 69; x >= 61; x--) {
        grid[x][94] = 2;
    }
    for (var x = 69; x >= 61; x--) {
        grid[x][93] = 2;
    }
    for (var x = 69; x >= 61; x--) {
        grid[x][92] = 2;
    }
    for (var x = 69; x >= 61; x--) {
        grid[x][91] = 2;
    }


    //
    for (var x = 89; x >= 76; x--) {
        grid[x][69] = 2;
    }
    for (var x = 89; x >= 76; x--) {
        grid[x][68] = 2;
    }
    for (var x = 89; x >= 76; x--) {
        grid[x][67] = 2;
    }
    for (var x = 89; x >= 76; x--) {
        grid[x][66] = 2;
    }


    //
    for (var y = 52; y >= 48; y--) {
        grid[99][y] = 2;
    }
    for (var y = 52; y >= 48; y--) {
        grid[98][y] = 2;
    }
    for (var y = 52; y >= 48; y--) {
        grid[97][y] = 2;
    }
    for (var y = 52; y >= 48; y--) {
        grid[96][y] = 2;
    }


    //
    for (var y = 41; y >= 36; y--) {
        grid[94][y] = 2;
    }
    for (var y = 41; y >= 36; y--) {
        grid[93][y] = 2;
    }
    for (var y = 41; y >= 36; y--) {
        grid[92][y] = 2;
    }
    for (var y = 41; y >= 36; y--) {
        grid[91][y] = 2;
    }


    //
    for (var y = 74; y >= 66; y--) {
        grid[59][y] = 2;
    }

    //
    for (var y = 74; y >= 66; y--) {
        grid[41][y] = 2;
    }


    //
    for (var y = 29; y >= 21; y--) {
        grid[54][y] = 2;
    }

    //
    for (var y = 69; y >= 66; y--) {
        grid[69][y] = 2;
    }
    for (var y = 69; y >= 66; y--) {
        grid[68][y] = 2;
    }
    for (var y = 69; y >= 66; y--) {
        grid[67][y] = 2;
    }
    for (var y = 69; y >= 66; y--) {
        grid[66][y] = 2;
    }


    //
    for (var x = 52; x >= 48; x--) {
        grid[x][74] = 2;
    }
    for (var x = 52; x >= 48; x--) {
        grid[x][73] = 2;
    }
    for (var x = 52; x >= 48; x--) {
        grid[x][72] = 2;
    }
    for (var x = 52; x >= 48; x--) {
        grid[x][71] = 2;
    }


    //
    for (var x = 14; x >= 6; x--) {
        grid[x][31] = 2;
    }
    for (var x = 14; x >= 6; x--) {
        grid[x][32] = 2;
    }
    for (var x = 14; x >= 6; x--) {
        grid[x][33] = 2;
    }
    for (var x = 14; x >= 6; x--) {
        grid[x][34] = 2;
    }


    //
    for (var x = 84; x >= 71; x--) {
        grid[x][41] = 2;
    }


    //
    for (var x = 89; x >= 81; x--) {
        grid[x][59] = 2;
    }


    //
    for (var x = 89; x >= 81; x--) {
        grid[x][52] = 2;
    }
    for (var x = 89; x >= 81; x--) {
        grid[x][51] = 2;
    }
    for (var x = 89; x >= 81; x--) {
        grid[x][50] = 2;
    }
    for (var x = 89; x >= 81; x--) {
        grid[x][49] = 2;
    }
    for (var x = 89; x >= 81; x--) {
        grid[x][48] = 2;
    }


    //
    for (var y = 14; y >= 6; y--) {
        grid[56][y] = 2;
    }
    for (var y = 14; y >= 6; y--) {
        grid[57][y] = 2;
    }
    for (var y = 14; y >= 6; y--) {
        grid[58][y] = 2;
    }
    for (var y = 14; y >= 6; y--) {
        grid[59][y] = 2;
    }


    //
    for (var y = 14; y >= 11; y--) {
        grid[46][y] = 2;
    }
    for (var y = 14; y >= 11; y--) {
        grid[47][y] = 2;
    }
    for (var y = 14; y >= 11; y--) {
        grid[48][y] = 2;
    }
    for (var y = 14; y >= 11; y--) {
        grid[49][y] = 2;
    }


    //
    for (var y = 34; y >= 26; y--) {
        grid[61][y] = 2;
    }
    for (var y = 34; y >= 26; y--) {
        grid[62][y] = 2;
    }
    for (var y = 34; y >= 26; y--) {
        grid[63][y] = 2;
    }
    for (var y = 34; y >= 26; y--) {
        grid[64][y] = 2;
    }


    //
    for (var y = 54; y >= 48; y--) {
        grid[66][y] = 2;
    }
    for (var y = 54; y >= 48; y--) {
        grid[67][y] = 2;
    }
    for (var y = 54; y >= 48; y--) {
        grid[68][y] = 2;
    }
    for (var y = 54; y >= 48; y--) {
        grid[69][y] = 2;
    }


    //
    for (var y = 84; y >= 76; y--) {
        grid[69][y] = 2;
    }
    for (var y = 84; y >= 76; y--) {
        grid[68][y] = 2;
    }
    for (var y = 84; y >= 76; y--) {
        grid[67][y] = 2;
    }
    for (var y = 84; y >= 76; y--) {
        grid[66][y] = 2;
    }
    for (var x = 65; x >= 61; x--) {
        grid[x][84] = 2;
    }
    for (var x = 65; x >= 61; x--) {
        grid[x][83] = 2;
    }
    for (var x = 65; x >= 61; x--) {
        grid[x][82] = 2;
    }
    for (var x = 65; x >= 61; x--) {
        grid[x][81] = 2;
    }


    //
    for (var x = 9; x >= 6; x--) {
        grid[x][94] = 2;
    }
    for (var x = 9; x >= 6; x--) {
        grid[x][93] = 2;
    }
    for (var x = 9; x >= 6; x--) {
        grid[x][92] = 2;
    }
    for (var x = 9; x >= 6; x--) {
        grid[x][91] = 2;
    }


    //
    for (var x = 9; x >= 6; x--) {
        grid[x][76] = 2;
    }
    for (var x = 9; x >= 6; x--) {
        grid[x][77] = 2;
    }
    for (var x = 9; x >= 6; x--) {
        grid[x][78] = 2;
    }
    for (var x = 9; x >= 6; x--) {
        grid[x][79] = 2;
    }


    //
    for (var x = 19; x >= 16; x--) {
        grid[x][96] = 2;
    }
    for (var x = 19; x >= 16; x--) {
        grid[x][97] = 2;
    }
    for (var x = 19; x >= 16; x--) {
        grid[x][98] = 2;
    }
    for (var x = 19; x >= 16; x--) {
        grid[x][99] = 2;
    }
    

    //
    for (var x = 24; x >= 21; x--) {
        grid[x][79] = 2;
    }
    for (var x = 24; x >= 21; x--) {
        grid[x][78] = 2;
    }
    for (var x = 24; x >= 21; x--) {
        grid[x][77] = 2;
    }
    for (var x = 24; x >= 21; x--) {
        grid[x][76] = 2;
    }


    //
    for (var x = 24; x >= 21; x--) {
        grid[x][66] = 2;
    }
    for (var x = 24; x >= 21; x--) {
        grid[x][67] = 2;
    }
    for (var x = 24; x >= 21; x--) {
        grid[x][68] = 2;
    }
    for (var x = 24; x >= 21; x--) {
        grid[x][69] = 2;
    }


    //
    for (var x = 34; x >= 31; x--) {
        grid[x][66] = 2;
    }
    for (var x = 34; x >= 31; x--) {
        grid[x][67] = 2;
    }
    for (var x = 34; x >= 31; x--) {
        grid[x][68] = 2;
    }
    for (var x = 34; x >= 31; x--) {
        grid[x][69] = 2;
    }


    //
    for (var x = 34; x >= 31; x--) {
        grid[x][76] = 2;
    }
    for (var x = 34; x >= 31; x--) {
        grid[x][77] = 2;
    }
    for (var x = 34; x >= 31; x--) {
        grid[x][78] = 2;
    }
    for (var x = 34; x >= 31; x--) {
        grid[x][79] = 2;
    }


    //
    for (var y = 94; y >= 91; y--) {
        grid[26][y] = 2;
    }
    for (var y = 94; y >= 91; y--) {
        grid[27][y] = 2;
    }
    for (var y = 94; y >= 91; y--) {
        grid[28][y] = 2;
    }
    for (var y = 94; y >= 91; y--) {
        grid[29][y] = 2;
    }
    for (var y = 94; y >= 91; y--) {
        grid[30][y] = 2;
    }

    for (var y = 99; y >= 91; y--) {
        grid[35][y] = 2;
    }
    for (var y = 99; y >= 91; y--) {
        grid[36][y] = 2;
    }
    for (var y = 99; y >= 91; y--) {
        grid[37][y] = 2;
    }
    for (var y = 99; y >= 91; y--) {
        grid[38][y] = 2;
    }
    for (var y = 99; y >= 91; y--) {
        grid[39][y] = 2;
    }

    for (var y = 99; y >= 86; y--) {
        grid[31][y] = 2;
    }
    for (var y = 99; y >= 86; y--) {
        grid[32][y] = 2;
    }
    for (var y = 99; y >= 86; y--) {
        grid[33][y] = 2;
    }
    for (var y = 99; y >= 86; y--) {
        grid[34][y] = 2;
    }
    for (var y = 99; y >= 96; y--) {
        grid[40][y] = 2;
    }


    //
    for (var y = 84; y >= 81; y--) {
        grid[41][y] = 2;
    }

    //
    for (var y = 84; y >= 81; y--) {
        grid[53][y] = 2;
    }
    for (var y = 84; y >= 81; y--) {
        grid[54][y] = 2;
    }


    //
    for (var y = 94; y >= 91; y--) {
        grid[54][y] = 2;
    }
    for (var y = 94; y >= 91; y--) {
        grid[53][y] = 2;
    }


    //
    for (var x = 46; x >= 41; x--) {
        grid[x][99] = 2;
    }
    for (var x = 46; x >= 41; x--) {
        grid[x][98] = 2;
    }
    for (var x = 46; x >= 41; x--) {
        grid[x][97] = 2;
    }
    for (var x = 46; x >= 41; x--) {
        grid[x][96] = 2;
    }

    //Trophy
    for (var x = 51; x >= 49; x--) {
        grid[x][50] = 3;
    }
    for (var y = 51; y >= 49; y--) {
        grid[50][y] = 3;
    }
    for (var x = 50; x >= 50; x--) {
        grid[x][50] = 4;
    }
}
initializeGrid(0);

// Draws the grid with different colors depending on their corresponding value
function drawGrid() {
    var cellWidth = 7.92; // Width of each cell in the grid
    var cellHeight = 7.92; // Height of each cell in the grid

    noStroke(); // Disables the stroke for each cell 

    // Loops through each column of the grid
    for (var x = 0; x < gridSizeX; x++) {
        // Loops through each row of the grid
        for (var y = 0; y < gridSizeY; y++) {
            // Determines the fill color based on the avlue in the grid cell
            if (grid[x][y] === 1) {
                fill(0); // Draw wall (black)
            } else if (grid[x][y] === 2) {
                fill(2, 100, 30); // Draw green space (Dark green)
            } else if (grid[x][y] === 3) {
                fill(184,216,231); // Draw outline of trophy (light blue)
            } else if (grid[x][y] === 4) {
                fill(154,197,219); // Draw trophy cell (Medium blue)
            } else {
                fill(149, 116, 51); // Draw pathway (brown)
            }
            //Draws the cells as rectangles
            rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight); 
        }
                // Draw Creatures
                fill(255, 0, 0); // Color Red
                rect(malvarTheMalevolent.x * cellWidth, malvarTheMalevolent.y * cellHeight, cellWidth * 2, cellHeight * 2);
                rect(vorinTheVile.x * cellWidth, vorinTheVile.y * cellHeight, cellWidth * 2, cellHeight * 2);
                rect(mordredTheMaleficent.x * cellWidth, mordredTheMaleficent.y * cellHeight, cellWidth * 2, cellHeight * 2);
                rect(sylviaTheSinister.x * cellWidth, sylviaTheSinister.y * cellHeight, cellWidth * 2, cellHeight * 2);
                rect(xantharTheExile.x * cellWidth, xantharTheExile.y * cellHeight, cellWidth * 2, cellHeight * 2);
                rect(albusDumbledore.x * cellWidth, albusDumbledore.y * cellHeight, cellWidth *2, cellHeight * 2); 
                rect(isadoraWhitewood.x * cellWidth, isadoraWhitewood.y * cellHeight, cellWidth * 2, cellHeight * 2); 
                rect(caspainAshford.x * cellWidth, caspainAshford.y * cellHeight, cellWidth * 2, cellHeight * 2);
                
                // Draw Hearts
                fill(255, 192, 203); // Color Pink
                rect(heart1.x * cellWidth, heart1.y * cellHeight, cellWidth * 2, cellHeight * 2);
                rect(heart2.x * cellWidth, heart2.y * cellHeight, cellWidth * 2, cellHeight * 2);
                rect(heart3.x * cellWidth, heart3.y * cellHeight, cellWidth * 2, cellHeight * 2);
                rect(heart4.x * cellWidth, heart4.y * cellHeight, cellWidth * 2, cellHeight * 2);
                rect(heart5.x * cellWidth, heart5.y * cellHeight, cellWidth * 2, cellHeight * 2);
                rect(heart6.x * cellWidth, heart6.y * cellHeight, cellWidth * 2, cellHeight * 2);
                rect(heart7.x * cellWidth, heart7.y * cellHeight, cellWidth * 2, cellHeight * 2);

                // Draw players
                fill(0, 0, 255); // Player 1 Blue
                rect(player1.x * cellWidth, player1.y * cellHeight, cellWidth * 2, cellHeight * 2);
                fill(255, 213, 0); // Player 2 Yellow
                rect(player2.x * cellWidth, player2.y * cellHeight, cellWidth * 2, cellHeight * 2);
    }
}

// showGame function, calls the grid function to show it on the screen
function showGame() {
    drawGrid();
}

// Function that draws the grid if gameIsRunning === true, else load the start screen
function draw (){
    if (gameIsRunning === true) {
        showGame();
    } else if (gameIsRunning === false) {
        window.location.href = "index.html";
    }
}

// Function to clear the text of the player
function clearText(playerId) {
    var creatureName = document.getElementById('name' + playerId); // gets the creature name element
    var creaturePrompt = document.getElementById('prompt' + playerId); // gets the prompt element
    var answerList = document.getElementById('answerList' + playerId); // gets the answers element
    
    // Sets all of the to empty strings
    creatureName.innerHTML = '';
    creaturePrompt.innerHTML = '';
    answerList.innerHTML = '';
}

// Handles the death of a player
function dead(playerId) {
    // Check which player's health bar is referenced and set their alive status to false
    if (playerId === "healthBarOne") {
        clearText("One");
        playerOneAlive = false;
    } else if (playerId === "healthBarTwo") {
        clearText("Two");
        playerTwoAlive = false;
    }

    // Set the player's health bar to 0 and update their health bar
    updateHealthBar(playerId, 0);

    // Check if both players are dead
    if (!playerOneAlive && !playerTwoAlive) {
        window.location.href = "deathScreen.html"; // Redirect to the death screen
    }
}

// Creature constructor, firstName, lastName, riddle, answers, correctAnswerIndex, x-pos, y-pos, creature-id
class Creature {
    constructor(firstName, lastName, riddle, answers, correctAnswerIndex, x, y, id) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.riddle = riddle;
        this.answerArray = answers;
        this.correctAnswerIndex = correctAnswerIndex;
        this.x = x;
        this.y = y;
        this.id = id;
    }
}

//Riddles

var malvarTheMalevolentRiddle = "I suck the joy and hope from your soul, leaving only despair in my wake. What am I?";
var vorinTheVileRiddle = "I weave a web of deceit and death, lurking in the shadows of the forest. What am I?";
var mordredTheMaleficentRiddle = "I am a puppet of darkness, animated by the darkest magic. What am I?";
var sylviaTheSinisterRiddle = "I slither through the depths, my gaze bringing death to those who meet it. What am I?";
var xantharTheExileRiddle = "I am the embodiment of suppressed magic, unleashed in a torrent of destruction. What am I?";
var albusDumbledoreRiddle =  "I'm a shape-shifter from black to white, once in Azkaban, now in flight. Who am I, a mystery you see?";
var isadoraWhitewoodRiddle = "Small and grand, a wizard's brand, with no wings, I soar and land. Seek me when in need, my song, a seed.";
var caspianAshfordRiddle = "Venomous might, leaves bright, in shadows, I thrive and spread fright. Deadly brew, beware, in wizarding spree, I'm there.";

//Answers

var malvarTheMalevolentArray = ["Dementor", "Boggart", "Lethifold"]; // Dementor
var vorinTheVileArray = ["Banshee", "Lycanthrope", "Acromantula"]; // Acromatula
var mordredTheMaleficentArray = ["Obscurial", "Inferius", "Poltergeist"]; // Inferius
var sylviaTheSinisterArray = ["Basilisk", "Mermish", "Kelpie"]; // Basilisk
var xantharTheExileArray = ["Horcrux", "Obscurus", "Dementor"]; // Obscurus
var albusDumbledoreArray = ['Sirius Black', 'Animagus', 'Dementor']; //Sirius Black
var isadoraWhitewoodArray = ['Golden Snitch', 'Fawkes', 'Thestral']; //Golden Snitch
var caspianAshfordArray= ['Mandrake', 'Devils Snare', 'Venemous Tentacula']; //Devils Snare




//Wizards

var malvarTheMalevolent = new Creature("Malvar", "Malevolent", malvarTheMalevolentRiddle, malvarTheMalevolentArray, 0, 62, 37, 1);
var vorinTheVile = new Creature("Vorin", "Vile", vorinTheVileRiddle, vorinTheVileArray, 2, 84, 62, 2);
var mordredTheMaleficent = new Creature("Mordred", "Maleficent", mordredTheMaleficentRiddle, mordredTheMaleficentArray, 1, 27, 42, 3);
var sylviaTheSinister = new Creature("Sylvia", "Sinister", sylviaTheSinisterRiddle, sylviaTheSinisterArray, 0, 27, 72, 4);
var xantharTheExile = new Creature("Xanthar", "Exile", xantharTheExileRiddle, xantharTheExileArray, 1, 67, 72, 5);
var albusDumbledore = new Creature('Albus', 'Dumbledore', albusDumbledoreRiddle, albusDumbledoreArray, 0, 42, 32, 6);
var isadoraWhitewood = new Creature('Isadora', 'WhiteWood', isadoraWhitewoodRiddle, isadoraWhitewoodArray, 0, 72, 44, 7);
var caspainAshford = new Creature('Caspian', 'Ashford', caspianAshfordRiddle, caspianAshfordArray, 1, 57, 87 , 8); 

// Pushes the creature information into the creatures array
creatures.push(new Creature("Malvar", "Malevolent", malvarTheMalevolentRiddle, malvarTheMalevolentArray, 0, 62, 37, 1));
creatures.push(new Creature("Vorin", "Vile", vorinTheVileRiddle, vorinTheVileArray, 2, 84, 62, 2));
creatures.push(new Creature("Mordred", "Maleficent", mordredTheMaleficentRiddle, mordredTheMaleficentArray, 1, 27, 42, 3));
creatures.push(new Creature("Sylvia", "Sinister", sylviaTheSinisterRiddle, sylviaTheSinisterArray, 0, 27, 72, 4));
creatures.push(new Creature("Xanthar", "Exile", xantharTheExileRiddle, xantharTheExileArray, 1, 67, 72, 5));
creatures.push(new Creature('Albus', 'Dumbledore', albusDumbledoreRiddle, albusDumbledoreArray, 0, 42, 32, 6));
creatures.push(new Creature('Isadora', 'WhiteWood', isadoraWhitewoodRiddle, isadoraWhitewoodArray, 0, 72, 44, 7));
creatures.push(new Creature('Caspian', 'Ashford', caspianAshfordRiddle, caspianAshfordArray, 1, 57, 87 , 8));

// Function to check if the player and the creature are colliding
function playerCreatureCollision(player, playerId) {
    // Sets the collided flag to false
    var collided = false;

    // Loops through the creature array
    for (var i = 0; i < creatures.length; i++) {
        // Sets the const creature to the creatures individual index
        var creature = creatures[i];
        // If function that is called if the player and a creature is at the same coordinate
        if (isAtSamePosition(player, creature)) {
            var creatureName = document.getElementById('name' + playerId); // Sets the name of the creature in the players text element
            var creaturePrompt = document.getElementById('prompt' + playerId); // Sets the riddle of the creature in the players text element
            var answerList = document.getElementById('answerList' + playerId); // Sets the list of answers of the creature in the players text element

            creatureName.innerText = creature.firstName + " " + creature.lastName; // sets the creatures name to the creatures first name + last name in the text element
            creaturePrompt.innerText = creature.riddle; // Sets the riddle text element to the creatures riddle

            answerList.innerHTML = ''; // clears the answer list text element

            // Determines the starting index for numbering based on the player ID
            var startIndex;
            if (playerId === "One") {
                startIndex = 1; // Player 1 starts numbering at 1
            } else if (playerId === "Two") {
                startIndex = 7; // Player 2 starts numbering at 7
            }

            // Creates a numbered list of all of the answers
            creature.answerArray.forEach(function (answer, index) {
                var listItem = document.createElement("li");
                listItem.innerText = (startIndex + index) + ". " + answer;
                answerList.appendChild(listItem);
            });


            currentCreatureIndex = i; // Sets the currentCreatureIndex to i

            // if function that checks the player id and if that player already has the creatures id in their correct array, if they do then the text field is cleared
            if ((player.id === 1 && playerOneCorrect.includes(creature.id)) ||
                (player.id === 2 && playerTwoCorrect.includes(creature.id))) {
                clearText(playerId);
                return;
            }

            // if they don't have the creature id they they get locked into place 
            if (player.id === 1) {
                playerOneMove = false;
            } else if (player.id === 2) {
                playerTwoMove = false;
            }
            collided = true; // collided flag is set to true to detect a collision
            break; 
        }
    }

    // if function for if the collided flag is not set to false and for which player it is
    if (!collided && player.id === 1) {
        playerOneMove = true; // enables player 1 to move again
        clearText(playerId); // clears player 1 text elements
    } else if (!collided && player.id === 2) {
        playerTwoMove = true; // enables player 2 to move again
        clearText(playerId); // clears player 1 text element
    }

}

//function canMove and isValidPosition were created through help Adapted from standard coding samples (problem was that I forgot that our player models were 2x2, not 1x1, so some parts would glitch halfway through certain walls before detecting collissions)
//https://chat.openai.com/share/6cdea05b-5c3b-4956-9deb-f73937126bb9

// Function to check if the player can move to the next coordinate
function canMove(x, y) {
    return (
        isValidPosition(x, y) &&           
        isValidPosition(x + 1, y) &&
        isValidPosition(x, y + 1) &&         
        isValidPosition(x + 1, y + 1)       
    );
}

// Function that checks if the position is valid (isn't a coordinate with the value 1, 2) (Wall, Greenery)
function isValidPosition(x, y) {
    return (
        x >= 0 && x < grid.length && 
        y >= 0 && y < grid[0].length && 
        (grid[x][y] === 0 || grid[x][y] === 3 || grid[x][y] === 4)
    );
}

// Function that checks if the player and the creature are at the same coordinate
function isAtSamePosition(player, creature) {
    return player.x === creature.x && player.y === creature.y;
}

// Updates the health bar display for a players
function updateHealthBar(playerId, health) {
    var healthBar = document.getElementById(playerId).querySelector('.health'); // gets the health bar element for the player depending on their player id
    var currentHealth = document.getElementById(playerId).querySelector('.currentHealth'); // gets the current health display element for the player depending on their player id
  
    // Updates the width of the healt bar by setting the width to their current hp in %
    healthBar.style.width = health + "%";
    // Updates the text under the healthbar to display the current health 
    currentHealth.textContent = "Health: " + health + " / 100";
    // Sets the text font size to 1.5rem
    currentHealth.style.fontSize = "1.5rem"; 
    
    // if function that changes the color of the health bar depending on the value of the current health
    if (health > 70) {
      healthBar.style.backgroundColor = "green"; // Green for health over 70 hp
      currentHealth.style.color = "green";
    } else if (health > 30) {
      healthBar.style.backgroundColor = "darkorange"; // Orange for health between 70 and 30 hp
      currentHealth.style.color = "darkorange";
    } else {
      healthBar.style.backgroundColor = "red"; // Red for health under 30 hp
      currentHealth.style.color = "red";
    }
  }
  
  // Function to get the current health of a player
  function getPlayerHealth(playerId) {
    var healthBar = document.getElementById(playerId).querySelector('.health'); // Gets the health bar element for the correct player depending on player-id 
    // Return the current health as a integer, if not found then the value is set to 100
    return parseInt(healthBar.style.width, 10) || 100; // 10 means base-10
}

// Function to apply damage to a player
  function takeDamage(playerId, amount) {

    // If the player is already dead then do nothing
    if (playerId === "healthBarOne" && !playerOneAlive) {
        return; 
    } else if (playerId === "healthBarTwo" && !playerTwoAlive) {
        return;
    }

    // Determine the player's coordinates based on playerId
    var player;
    if (playerId === "healthBarOne") {
        player = player1;
    } else if (playerId === "healthBarTwo") {
        player = player2;
    }

    // Check if the player's coordinates match any creature's coordinates using a for loop
    var creatureEncounter = false;
    for (var i = 0; i < creatures.length; i++) {
        if (isAtSamePosition(player, creatures[i])) {
            creatureEncounter = true;
            break;
        }
    }

    // If the player is not at the same position as any creature, do nothing
    if (!creatureEncounter) {
        return;
    }

    var healthBar = document.getElementById(playerId).querySelector('.health'); // Gets the health bar element of the player depending on player-id
    // Gets the current health of the player, if not found then the value is set to 100
    var playerHealth = parseInt(healthBar.style.width, 10) || 100; 

    // Subtract the damage amount from the player's health
    playerHealth -= amount;

    // Ensure the player's health cannot be less than 0
    if (playerHealth < 0) {
        playerHealth = 0;
    }

    // If the player's health reaches 0, then the dead function is called with the players-id
    if (playerHealth <= 0) {
        dead(playerId); 
    }

    // Updates the health bar to reflect the new health value of the player depending on player-id
    updateHealthBar(playerId, playerHealth);
}

// Function to heal a player
function healPlayer(playerId, amount) {
    // If the player is already dead, then do nothing
    if (playerId === "healthBarOne" && !playerOneAlive) {
        return; 
    } else if (playerId === "healthBarTwo" && !playerTwoAlive) {
        return; 
    }

    // Gets the current health of the player
    var playerHealth = getPlayerHealth(playerId);

    // Increases the player's health by the specific amount (in this case 5, amout is set when the function is called)
    playerHealth += amount;

    // Ensures that the players health doesn't exceed 100
    if (playerHealth > 100) {
        playerHealth = 100; 
    }

    // Updates the health bar to reflect the new health value of the player
    updateHealthBar(playerId, playerHealth);
}

// Function that checks if the player has all of the creatures id's in their correct array
function checkAnswers(player) {
    var correctAnswers;
    
    // Sets which player correct array it is matching with
    if (player === player1) {
        correctAnswers = playerOneCorrect;
    } else if (player === player2) {
        correctAnswers = playerTwoCorrect;
    }

    // Array of all of the creatures id's in order
    var expectedAnswers = [1, 2, 3, 4, 5, 6, 7, 8];
    
    // Sorts both the expectedAnswers and the players Correct array to be able to check if they are the same
    correctAnswers.sort(function (a, b) { return a - b; });
    expectedAnswers.sort(function (a, b) { return a - b; });
    
    // Checks if both arrays are identical by checking if they arrays are the same lenght and if all of the id's are in the same place as the correctArray
    var correct = correctAnswers.length === expectedAnswers.length &&
                    correctAnswers.every(function (answer, index) { return answer === expectedAnswers[index]; });
    
    // If everything is correct they the screen changes to endScreen
    if (correct) {
        window.location.href = "endScreen.html";
    }
}

// Function to check if a player and the trophy are at the same coordinate
function trophyCollision(player1, player2, trophy) {
    // If player 1 is at the same coordinates then it checks if player 1 correct array matches the correctArray
    if (player1.x === trophy.x && player1.y === trophy.y) {
        checkAnswers(player1);
            // If player 2 is at the same coordinates then it checks if player 2 correct array matches the correctArray
    } else if (player2.x === trophy.x && player2.y === trophy.y) {
        checkAnswers(player2);
    }
}

// Function to detect if a player collides with a heart
function detectCollision(player1, player2, hearts) {
    // Loops through each heart in the hearts array
    for (var i = 0; i < hearts.length; i++) {
        var heart = hearts[i]; // Gets the current heart

        // Checks if player 1 collides with the heart
        if (player1.x === heart.x && player1.y === heart.y) {
            heartCollision(player1, heart); // Calls the collision function
        }
        // Checks if player 2 collides with the heart 
        else if (player2.x === heart.x && player2.y === heart.y) {
            heartCollision(player2, heart); // Calls the collision function
        }
    }
}

// Function if players collide with a heart
function heartCollision(player, heart) {
    var correctHearts; // variable to store the correct hearts for the player
    var playerId; // Variable to store the player's ID

    // Determines which player's correct hearts array to use based on the player id
    if (player === player1) {
        correctHearts = playerOneHeart; // Sets correct hearts for player 1
        playerId = "One"; // Sets player ID for player 1
    } else if (player === player2) {
        correctHearts = playerTwoHeart; // Sets correct hearts for player 2 
        playerId = "Two"; // Sets player ID for player 2 
    }

    // Gets the current health of the player from their health bar
    var playerHealth = getPlayerHealth("healthBar" + playerId);

    // checks so that the player's health is less than 100 and the heart hasn't been collected before
    if (playerHealth < 100 && !correctHearts.includes(heart.id)) {
        correctHearts.push(heart.id); // Adds the heart id to the players correct hearts array
        healPlayer("healthBar" + playerId, 5); // Adds 5 hp to the players health
    }

    // Array of all of the heart id's in order
    var expectedHearts = [1, 2, 3, 4, 5, 6, 7];

    //Sorts the players correct hearts array 
    correctHearts.sort(function (a, b) { return a - b; });

    //Sorts the correct hearts array
    expectedHearts.sort(function (a, b) { return a - b; });
}

// Function to update the display creature count for a player
function updateCreatureCount(player) {
    var correctAnswers; // Variable to store the collected creature id's for the player
    var correctCreature; // Variable to store the element displaying the correct creatures count

    // Determines which player's correct answers and creature count element to use based on the player ID
    if (player === player1) {
        // Sets the correct answers for player 1
        correctAnswers = playerOneCorrect; 
        // Sets the creature count display for player 1
        correctCreature = creatureCountOne;
    } else if (player === player2) {
        // Sets the correct answers for player 2
        correctAnswers = playerTwoCorrect;
        // Sets the creature count display for player 2
        correctCreature = creatureCountTwo;
    }

    // Gets the number of correct answers for the player
    var correctCount = correctAnswers.length;

    // Changes the text element of creature count to show the number of correct answers out of the 8 creatures
    correctCreature.textContent = correctCount + "/8 Creatures";
}

// Event listener for the movement and answer buttons
document.addEventListener("keydown", function(event) {
    // Const obtaining key actions mapped to key codes
    var keyActions = {
        // Movement controls for player 1
        "w": function() {
            // Moves up if conditions are met
            if (playerOneMove && playerOneAlive && canMove(player1.x, player1.y - 1)) {
                player1.y -= 1;
                // Checks for collisions and interaction 
                playerCreatureCollision(player1, "One");
                trophyCollision(player1, player2, trophy);
                detectCollision(player1, player2, hearts);
            }
        },
        "a": function() {
            // Moves left if conditions are met
            if (playerOneMove && playerOneAlive && canMove(player1.x - 1, player1.y)) {
                player1.x -= 1;
                // Checks for collisions and interaction 
                playerCreatureCollision(player1, "One");
                trophyCollision(player1, player2, trophy);
                detectCollision(player1, player2, hearts);
            }
        },
        "s": function() {
            // Moves down if conditions are met
            if (playerOneMove && playerOneAlive && canMove(player1.x, player1.y + 1)) {
                player1.y += 1;
                // Checks for collisions and interaction 
                playerCreatureCollision(player1, "One");
                trophyCollision(player1, player2, trophy);
                detectCollision(player1, player2, hearts);
            }
        },
        "d": function() {
            // Moves right if conditions are met
            if (playerOneMove && playerOneAlive && canMove(player1.x + 1, player1.y)) {
                player1.x += 1;
                // Checks for collisions and interaction 
                playerCreatureCollision(player1, "One");
                trophyCollision(player1, player2, trophy);
                detectCollision(player1, player2, hearts);
            }
        },
        // Movement controls for player 2
        "ArrowUp": function() {
            // Moves up if conditions are met
            if (playerTwoMove && playerTwoAlive && canMove(player2.x, player2.y - 1)) {
                player2.y -= 1; 
                // Checks for collisions and interaction 
                playerCreatureCollision(player2, "Two");
                trophyCollision(player1, player2, trophy);
                detectCollision(player1, player2, hearts);
            }
        },
        "ArrowLeft": function() {
            // Moves left if conditions are met
            if (playerTwoMove && playerTwoAlive && canMove(player2.x - 1, player2.y)) {
                player2.x -= 1; 
                // Checks for collisions and interaction 
                playerCreatureCollision(player2, "Two");
                trophyCollision(player1, player2, trophy);
                detectCollision(player1, player2, hearts);
            }
        },
        "ArrowDown": function() {
            // Moves down if conditions are met
            if (playerTwoMove && playerTwoAlive && canMove(player2.x, player2.y + 1)) {
                player2.y += 1; 
                // Checks for collisions and interaction 
                playerCreatureCollision(player2, "Two");
                trophyCollision(player1, player2, trophy);
                detectCollision(player1, player2, hearts);
            }
        },
        "ArrowRight": function() {
            // Moves right if conditions are met
            if (playerTwoMove && playerTwoAlive && canMove(player2.x + 1, player2.y)) {
                player2.x += 1;
                // Checks for collisions and interaction 
                playerCreatureCollision(player2, "Two");
                trophyCollision(player1, player2, trophy);
                detectCollision(player1, player2, hearts);
            }
        },
        // Controls for answering questions for player 1
        "1": function() {
            // Checks if player 1 is alive and there's a current creature
            if (playerOneAlive && currentCreatureIndex !== -1) {
                var correctAnswerIndex = creatures[currentCreatureIndex].correctAnswerIndex;
                var creatureId = creatures[currentCreatureIndex].id;
                // Checks if the selected answer is correct
                if (correctAnswerIndex === 0) {
                    // Handle correct answer
                    if (!playerOneCorrect.includes(creatureId)) {
                        playerOneCorrect.push(creatureId);
                        updateCreatureCount(player1);
                    }
                    clearText("One");
                    playerOneMove = true;
                } else {
                    // Handle incorrect answer
                    takeDamage("healthBarOne", 10);
                }
            }
        },
        "2": function() {
            // Checks if player 1 is alive and there's a current creature
            if (playerOneAlive && currentCreatureIndex !== -1) {
                var correctAnswerIndex = creatures[currentCreatureIndex].correctAnswerIndex;
                var creatureId = creatures[currentCreatureIndex].id;
                // Checks if the selected answer is correct
                if (correctAnswerIndex === 1) {
                    // Handle correct answer
                    if (!playerOneCorrect.includes(creatureId)) {
                        playerOneCorrect.push(creatureId);
                        updateCreatureCount(player1);
                    }
                    clearText("One");
                    playerOneMove = true;
                } else {
                    // Handle incorrect answer
                    takeDamage("healthBarOne", 10);
                }
            }
        },
        "3": function() {
            // Checks if player 1 is alive and there's a current creature
            if (playerOneAlive && currentCreatureIndex !== -1) {
                var correctAnswerIndex = creatures[currentCreatureIndex].correctAnswerIndex;
                var creatureId = creatures[currentCreatureIndex].id;
                // Checks if the selected answer is correct
                if (correctAnswerIndex === 2) {
                    // Handle correct answer
                    if (!playerOneCorrect.includes(creatureId)) {
                        playerOneCorrect.push(creatureId);
                        updateCreatureCount(player1);
                    }
                    clearText("One");
                    playerOneMove = true;
                } else {
                    // Handle incorrect answer
                    takeDamage("healthBarOne", 10);
                }
            }
        },
        "7": function() {
            // Checks if player 2 is alive and there's a current creature
            if (playerTwoAlive && currentCreatureIndex !== -1) {
                var correctAnswerIndex = creatures[currentCreatureIndex].correctAnswerIndex;
                var creatureId = creatures[currentCreatureIndex].id;
                // Checks if the selected answer is correct
                if (correctAnswerIndex === 0) {
                    // Handle correct answer
                    if (!playerTwoCorrect.includes(creatureId)) {
                        playerTwoCorrect.push(creatureId);
                        updateCreatureCount(player2);
                    }
                    clearText("Two");
                    playerTwoMove = true;
                } else {
                    // Handle incorrect answer
                    takeDamage("healthBarTwo", 10);
                }
            }
        },
        "8": function() {
            // Checks if player 2 is alive and there's a current creature
            if (playerTwoAlive && currentCreatureIndex !== -1) {
                var correctAnswerIndex = creatures[currentCreatureIndex].correctAnswerIndex;
                var creatureId = creatures[currentCreatureIndex].id;
                // Checks if the selected answer is correct
                if (correctAnswerIndex === 1) {
                    // Handle correct answer
                    if (!playerTwoCorrect.includes(creatureId)) {
                        playerTwoCorrect.push(creatureId);
                        updateCreatureCount(player2);
                    }
                    clearText("Two");
                    playerTwoMove = true;
                } else {
                    // Handle incorrect answer
                    takeDamage("healthBarTwo", 10);
                }
            }
        },
        "9": function() {
            // Checks if player 2 is alive and there's a current creature
            if (playerTwoAlive && currentCreatureIndex !== -1) {
                var correctAnswerIndex = creatures[currentCreatureIndex].correctAnswerIndex;
                var creatureId = creatures[currentCreatureIndex].id;
                if (correctAnswerIndex === 2) {
                    // Handle correct answer
                    console.log("Player Two chose the correct answer!");
                    if (!playerTwoCorrect.includes(creatureId)) {
                        playerTwoCorrect.push(creatureId);
                        updateCreatureCount(player2);
                    }
                    clearText("Two");
                    playerTwoMove = true;
                } else {
                    // Handle incorrect answer
                    takeDamage("healthBarTwo", 10);
                }
            }
        }        
    };

    // Executes the corresponding action if a key with an associated action is pressed
    var action = keyActions[event.key];
    if (action) {
        action();
    }
});

//https://chatgpt.com/share/2e05ea85-903e-4ede-8b76-4934ca2825de
document.addEventListener('DOMContentLoaded', function() {
    var audio = document.getElementById('background-audio');
    audio.volume = 0.5; 
});

// Function that loads both healthbars and sets their value to the players hp
function load(){
    updateHealthBar('healthBarOne', player1.hp);
    updateHealthBar('healthBarTwo', player2.hp);
}


window.onload = load;