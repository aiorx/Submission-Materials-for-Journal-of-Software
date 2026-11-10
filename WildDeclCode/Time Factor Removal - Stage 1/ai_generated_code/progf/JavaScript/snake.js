/*
    ! CODE MADE BY AI !
    This code was Supported via standard GitHub programming aids (GPT-4o) after
    only being given the hydra.js source code to
    learn. It's insane what AI is able to do with such
    little information nowadays.
*/

// Initialize HydraCanvasLib
var game = new HydraCanvasLib('game', {
    canvasWidth: 800,
    canvasHeight: 600,
});

// Constants
var TILE_SIZE = 20;
var INITIAL_SNAKE_LENGTH = 3;
var FPS = 10;

// Game State
var snake = [];
var direction = { x: 1, y: 0 }; // Starting direction: moving right
var food = null;
var gameOver = false;

// Utility Functions
function createApple() {
    // Create an apple sprite with a red circular body
    return SimpleRenderers.circle(TILE_SIZE / 2, 'red', { x: 0, y: 0 });
}

function spawnFood() {
    // Remove existing food if it exists
    if (food) {
        game.sprites.remove(food);
    }

    var screenSize = game.utility.getScreenSize();
    var foodX = Math.floor(Math.random() * (screenSize.width / TILE_SIZE)) * TILE_SIZE + TILE_SIZE / 2;
    var foodY = Math.floor(Math.random() * (screenSize.height / TILE_SIZE)) * TILE_SIZE + TILE_SIZE / 2;

    food = game.sprites.createNew(
        foodX,
        foodY,
        createApple()
    );

    // Add a square collider to the food
    food.collider = game.collision.makeSquareCollider(TILE_SIZE-10, TILE_SIZE-10, {x:-5, y:-5});
}

function resetGame() {
    snake.forEach(function segment { return game.sprites.remove(segment); });
    snake = [];

    // Initialize the snake segments
    for (var i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        var segment = game.sprites.createNew(
            TILE_SIZE * (INITIAL_SNAKE_LENGTH - i - 1),
            TILE_SIZE * 5,
            SimpleRenderers.rectangle(TILE_SIZE, TILE_SIZE, 'green')
        );

        // Add a square collider to each segment
        segment.collider = game.collision.makeSquareCollider(TILE_SIZE, TILE_SIZE);
        snake.push(segment);
    }

    direction = { x: 1, y: 0 }; // Reset direction
    spawnFood();
    gameOver = false;
}

// Game Over Handler
function handleGameOver() {
    gameOver = true;
    alert('Game Over! Press OK to restart.');
    resetGame();
}

// Game Loop
function gameLoop() {
    if (gameOver) return;

    // Move Snake
    var head = snake[0];
    var newHeadX = head.x + direction.x * TILE_SIZE;
    var newHeadY = head.y + direction.y * TILE_SIZE;

    // Check for collisions with walls
    var screenSize = game.utility.getScreenSize();
    if (
        newHeadX < -20 ||
        newHeadY < -20 ||
        newHeadX >= screenSize.width+20 ||
        newHeadY >= screenSize.height+20
    ) {
        handleGameOver();
        return;
    }

    // Check for collisions with itself
    for (var i = 1; i < snake.length; i++) {
        if (game.collision.checkCollision(snake[i], { x: newHeadX, y: newHeadY, collider: head.collider })) {
            handleGameOver();
            return;
        }
    }

    // Create new head
    var newHead = game.sprites.createNew(
        newHeadX,
        newHeadY,
        SimpleRenderers.rectangle(TILE_SIZE, TILE_SIZE, 'green')
    );

    // Add a collider to the new head
    newHead.collider = game.collision.makeSquareCollider(TILE_SIZE, TILE_SIZE);

    // Check for food collision
    if (food && game.collision.checkCollision(newHead, food)) {
        // Increase snake size
        game.sprites.remove(food);
        spawnFood();
    } else {
        // Remove tail
        var tail = snake.pop();
        if (tail) game.sprites.remove(tail);
    }

    // Add new head to snake
    snake.unshift(newHead);
}

// Input Handling
game.listen.addTicker(function () {
    if (game.listen.isKey('ArrowUp') && direction.y === 0) {
        direction = { x: 0, y: -1 };
    }
    if (game.listen.isKey('ArrowDown') && direction.y === 0) {
        direction = { x: 0, y: 1 };
    }
    if (game.listen.isKey('ArrowLeft') && direction.x === 0) {
        direction = { x: -1, y: 0 };
    }
    if (game.listen.isKey('ArrowRight') && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
});

// Add gameLoop to a ticker
game.listen.addTicker(function () {
    gameLoop();
});

// Set a solid background color
game.world.setBackgroundColor('lightgreen');

// Start Game
resetGame();
game.loop(FPS);