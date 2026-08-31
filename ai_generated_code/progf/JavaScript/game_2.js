//board
let board;
let boardwidth = 300;
let boardheight = 450;
let context;

//bird
let birdwidth = 50;
let birdheight = 55 ;
let birdx = boardwidth / 8;
let birdy = boardheight / 2;
let bird = {
    x: birdx,
    y: birdy,
    width: birdwidth,
    height: birdheight,
    dy: 0
};

let gravity = 0.5;
let jump = -6;

// lipad
document.addEventListener("keydown", function (e) {
    if (e.code === "Space" || e.key === " ") {
        if (gameOver) {
            restartGame();
        } else {
            bird.dy = jump;
        }
    }
});

// For mobile: Built via standard GitHub programming aids kasi tinatamad nako hahaha
document.addEventListener("touchstart", function () {
    if (gameOver) {
        restartGame();
    } else {
        bird.dy = jump;
    }
});
document.addEventListener("mousedown", function () {
    if (gameOver) {
        restartGame();
    } else {
        bird.dy = jump;
    }
});

//pipes
let pipeArray = [];
let pipewidth = 50;
let pipeheight = 350;
let pipeGap = 120;
let velocityx = -2;

let gameOver = false;
let score = 0;

// animasyon 2.0
let birdimg = new Image();
birdimg.src = "bird.png";

//pipes images
let topPipeImg = new Image();
topPipeImg.src = "top.png";
let bottomPipeImg = new Image();
bottomPipeImg.src = "bot.png";

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardwidth;
    board.height = boardheight;
    context = board.getContext("2d");

    placePipes();
    setInterval(placePipes, 1500);
    update();
};

function detectCollision(bird, pipe) {
    // Top pipe collision
    if (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        bird.y < pipe.y + pipe.height &&
        bird.y + bird.height > pipe.y
    ) {
        return true;
    }
    // Bottom pipe collision
    let bottomPipeY = pipe.y + pipe.height + pipeGap;
    if (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        bird.y < bottomPipeY + pipe.height &&
        bird.y + bird.height > bottomPipeY
    ) {
        return true;
    }
    return false;


}

function update() {
    if (gameOver) {
        context.clearRect(0, 0, boardwidth, boardheight);
        context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
        for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            context.drawImage(topPipeImg, pipe.x, pipe.y, pipe.width, pipe.height);
            context.drawImage(
                bottomPipeImg,
                pipe.x,
                pipe.y + pipe.height + pipeGap,
                pipe.width,
                pipe.height
            );
        }

        return;
    }

    // gravity par
    bird.dy += gravity;
    bird.y += bird.dy;

    // Boundary
    if (bird.y + bird.height > boardheight) {
        bird.y = boardheight - bird.height;
        bird.dy = 0;
        gameOver = true;
    } else if (bird.y < 0) {
        bird.y = 0;
        bird.dy = 0;
    }

    context.clearRect(0, 0, boardwidth, boardheight);
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityx;

        // Draw top pipe
        context.drawImage(topPipeImg, pipe.x, pipe.y, pipe.width, pipe.height);

        // Draw bottom pipe
        context.drawImage(
            bottomPipeImg,
            pipe.x,
            pipe.y + pipe.height + pipeGap,
            pipe.width,
            pipe.height
        );

        // collision
        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }

        // scoring
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 1;
            pipe.passed = true;
        }
    }

    // Draw score
    context.fillStyle = "Red";
    context.font = "20px Courier";
    context.fillText("Score: " + score, 10, 40);

    if (gameOver) {
        context.fillStyle = "black";
        context.font = "16px Courier";
        context.fillText("Game Over, You Suck :P", 10, 70);
        return;
    } else {
        requestAnimationFrame(update);
    }
}


function placePipes() {
    if (gameOver) {
        return;
    }

    // minimun ng y para di lumagpas
    let minPipeY = 20;
    // maximum Y 
    let maxPipeY = boardheight - pipeGap - 20;
    let pipeY = Math.floor(Math.random() * (maxPipeY - minPipeY + 1)) + minPipeY;

    let pipe = {
        x: boardwidth,
        y: pipeY - pipeheight,
        width: pipewidth,
        height: pipeheight,
        passed: false
    };
    pipeArray.push(pipe);

}

