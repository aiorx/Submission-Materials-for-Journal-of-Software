/*
    ! CODE MADE BY AI !
    This code was Assisted using common GitHub development utilities (GPT-4o) after
    only being given the hydra.js source code to
    learn. It's insane what AI is able to do with such
    little information nowadays.
*/

var canvasId = 'game';
var hydra = new HydraCanvasLib(canvasId);

var playerMap = [
    "01110",
    "11111",
    "11111"
];

var enemyMap = [
    "10101",
    "01110",
    "11111",
    "01110",
    "10101"
];

var bulletMap = [
    "1",
    "1",
    "1"
];

var colors = {
    "0": "transparent",
    "1": "white"
};

var player = hydra.sprites.createNew(400, 550, SimpleRenderers.pixelMap(50, 20, 5, 3, playerMap, colors));
player.collider = hydra.collision.makeSquareCollider(50, 20);

var bullets = [];
var enemies = [];
var canShoot = true;
var gameOver = false;

// Create enemies
for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 11; j++) {
        var enemy = hydra.sprites.createNew(50 + j * 60, 50 + i * 40, SimpleRenderers.pixelMap(40, 20, 5, 5, enemyMap, { "0": "transparent", "1": "red" }));
        enemy.collider = hydra.collision.makeSquareCollider(40, 20);
        enemies.push(enemy);
    }
}

// Player movement and shooting
hydra.listen.addTicker(function (deltaTime) {
    if (hydra.listen.isKey('ArrowLeft') && player.x > 0) {
        hydra.sprites.moveBy(player, -5, 0);
    }
    if (hydra.listen.isKey('ArrowRight') && player.x < hydra.utility.getScreenSize().width - 50) {
        hydra.sprites.moveBy(player, 5, 0);
    }
    
    // Player shooting
    if (hydra.listen.isKey(' ') && canShoot) {
        var bullet = hydra.sprites.createNew(player.x + 22.5, player.y - 10, SimpleRenderers.pixelMap(5, 10, 1, 3, bulletMap, colors));
        bullet.collider = hydra.collision.makeSquareCollider(5, 10);
        bullets.push(bullet);
        canShoot = false;
        setTimeout(() => {
            canShoot = true;
        }, 500);  // Adjust the delay as needed
    }
});

// Bullet movement and collision detection
hydra.listen.addTicker(function (deltaTime) {
    if (gameOver) return;
    
    for (var bullet of bullets) {
        hydra.sprites.moveBy(bullet, 0, -10);
        
        // Check for collisions with enemies
        for (var enemy of enemies) {
            if (hydra.collision.checkCollision(bullet, enemy)) {
                hydra.sprites.remove(bullet);
                hydra.sprites.remove(enemy);
                bullets.splice(bullets.indexOf(bullet), 1);
                enemies.splice(enemies.indexOf(enemy), 1);
                break;
            }
        }
        
        // Remove off-screen bullets
        if (bullet.y < 0) {
            hydra.sprites.remove(bullet);
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    }
});

// Enemy movement
var enemyDirection = 1;
hydra.listen.addTicker(function (deltaTime) {
    if (gameOver) return;
    
    for (var enemy of enemies) {
        hydra.sprites.moveBy(enemy, enemyDirection * 2, 0);
    }
    
    // Change direction if an enemy hits the edge
    var leftMostEnemy = Math.min(...enemies.map(e => e.x));
    var rightMostEnemy = Math.max(...enemies.map(e => e.x));
    if (leftMostEnemy <= 0 || rightMostEnemy >= hydra.utility.getScreenSize().width - 40) {
        enemyDirection *= -1;
        for (var enemy of enemies) {
            hydra.sprites.moveBy(enemy, 0, 20);
            // Game over if enemies reach the bottom
            if (enemy.y + enemy.collider.height >= hydra.utility.getScreenSize().height) {
                gameOver = true;
                alert('Game Over!');
                break;
            }
        }
    }
});

// Game loop
hydra.loop();