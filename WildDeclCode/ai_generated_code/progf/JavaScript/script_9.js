/*
   inspired by https://codepen.io/ju-az/pen/eYJQwLx/
   licensed under MIT

   sprite sheet taken by https://www.spriters-resource.com/mobile/flappybird/sheet/59894/
   (c) Superjustinbros
*/

// global variables
const gameLoopInterval = 10,
    background = {
        startLeft: 0,
        startTop: 0,
        width: 432,
        height: 768
    },
    bird = {
        startLeft: 438,
        startTop: 778,
        width: 53,
        height: 38
    },
    obstacle = {
        width: 78,
        height: 480,
        topStartLeft: 168,
        topStartTop: 969,
        topEndTop: 1449,
        bottomStartLeft: 252,
        bottomStartTop: 969,
        bottomEndTop: 1449,
        gap: 270
    },
    flappyBird = {
        startLeft: 1053,
        startTop: 273,
        width: 267,
        height: 72
    };

var preloaded = false,
    canvas,
    sCanvas,
    ctx,
    sCtx,
    img,
    birdVersion = 0,
    pipeVersion = 0,
    backgroundVersion = 0;

// general game settings
let currentScore = 0,
    lastScore = 0,
    highScore = getCookie("flappy_highscore"),
    gameReady = false,
    gamePlaying = false,
    hardMode = false,
    settingsOpened = false,
    visualSettingsOpened = false,
    playMusic = false,
    playSound = true,
    speed = 6.0 * (gameLoopInterval / 40),
    animation = 0,
    birdAnimation = 0,
    birdFlyHeight = 0,
    birdJumpHeight = -5,
    birdFlyHeightAdjustment = 0,
    gravity = 0.1 / speed;

const pipeLocation = () => (Math.random() * ((canvas.height - (obstacle.gap + obstacle.width)) - obstacle.width)) + obstacle.width;

// initialize
function init() {
    console.log("init() called!");

    // gameCanvas
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    // scoreCanvas
    sCanvas = document.getElementById("scoreCanvas");
    sCtx = sCanvas.getContext("2d");

    // preload all assets
    preloadAssets();

    // perform setup
    setup();

    // set initial window size
    resizeCanvas();
}

function setup() {

    // reset game variables
    gameReady = false;
    gamePlaying = false;

    // reset game speed
    speed = 6.0 * (gameLoopInterval / 40)

    // reset obstacle gap
    obstacle.gap = 270;

    // reset score
    lastScore = currentScore;
    currentScore = 0;

    // reset flight adjustment
    birdFlyHeightAdjustment = 0;

    // generate first three obstacles
    pipeObstacles = Array(3).fill().map((a, i) => [canvas.width + (i * (obstacle.gap + obstacle.width)), pipeLocation()]);

    // set initial bird fly height
    birdFlyHeight = (canvas.height / 2 - (bird.height / 2));

}

// game loop
function gameLoop() {

    // increase animation index to display the animations
    animation++;

    // control sounds
    audioPlayer("music");

    // draw assets
    drawAssets();

    // game functions
    if (gamePlaying) {
        birdFly();
    }
    borderCollisionDetection();

    // enable hard mode
    if (hardMode) {
        applyHardMode();
    }
}

/*
   preload assets
   (c) Prof. Dr. Brändle
*/
function preloadAssets() {

    console.log("preloadAssets() called!");

    var preloadCount = 0;

    var addImage = function (src) {

        console.log("addImage() with source '" + src + "' called!");

        var img = new Image();
        img.src = src;
        preloadCount++;

        img.addEventListener("load", function () { preloadCount-- });

        return img;
    }

    // add spritesheet
    img = addImage("assets/FlappyBird_SpriteSheet_3x.png");

    // call gameLoop if every asset is loaded
    var checkResources = function () {

        if (preloadCount === 0) {
            console.log("gameLoop() called!")
            preloaded = true;
            setInterval(gameLoop, gameLoopInterval);
        } else {
            // 200ms timeout
            console.log("waiting for " + preloadCount + " asset(s) to load!")
            setTimeout(checkResources, 200);
        }
    }
    checkResources();
}

// draw assets
function drawAssets() {


    drawBackground();

    drawButtons();

    if (settingsOpened) {
        drawSettings();
    }

    if (!gamePlaying) {
        drawMainScreen();
    } else {
        drawObstacles();
    }

    if (gameReady || settingsOpened) {
        document.getElementById("playButton").style.visibility = "hidden";
        document.getElementById("settingsButton").style.visibility = "hidden";
        document.getElementById("creditsButton").style.visibility = "hidden";
    }

    if (!gameReady && !settingsOpened) {
        document.getElementById("playButton").style.visibility = "visible";
        document.getElementById("settingsButton").style.visibility = "visible";
        document.getElementById("creditsButton").style.visibility = "visible";
    }

}

// draw buttons
function drawButtons() {
    if (!settingsOpened) {
        drawBird();
        document.getElementById("settingsButtonVisuals").style.visibility = "hidden";
        document.getElementById("settingsButtonMusic").style.visibility = "hidden";
        document.getElementById("settingsButtonSound").style.visibility = "hidden";
        document.getElementById("settingsButtonGameMode").style.visibility = "hidden";
        document.getElementById("settingsButtonBack").style.visibility = "hidden";
    } else {
        if (!visualSettingsOpened) {
            document.getElementById("settingsButtonVisuals").style.visibility = "visible";
            document.getElementById("settingsButtonMusic").style.visibility = "visible";
            document.getElementById("settingsButtonSound").style.visibility = "visible";
            document.getElementById("settingsButtonGameMode").style.visibility = "visible";
            document.getElementById("settingsButtonBack").style.visibility = "visible";
            document.getElementById("settingsButtonVisualBird").style.visibility = "hidden";
            document.getElementById("settingsButtonVisualBackground").style.visibility = "hidden";
            document.getElementById("settingsButtonVisualPipe").style.visibility = "hidden";
        } else {
            document.getElementById("settingsButtonVisuals").style.visibility = "hidden";
            document.getElementById("settingsButtonMusic").style.visibility = "hidden";
            document.getElementById("settingsButtonSound").style.visibility = "hidden";
            document.getElementById("settingsButtonGameMode").style.visibility = "hidden";
            document.getElementById("settingsButtonVisualBird").style.visibility = "visible";
            document.getElementById("settingsButtonVisualBackground").style.visibility = "visible";
            document.getElementById("settingsButtonVisualPipe").style.visibility = "visible";
            document.getElementById("settingsButtonBack").style.visibility = "visible";
        }
    }
}

// draw background
function drawBackground() {

    // draw world background (left part)
    ctx.drawImage(
        // image
        img,
        // start pos x, start pos y
        background.startLeft + (backgroundVersion * background.width),
        // width, height
        background.startTop, background.width,
        // canvas pos x, canvas pos y
        background.height, -((animation * speed) % background.width),
        // width on canvas, height on canvas
        0, background.width, background.height);

    // draw world background (right part)
    ctx.drawImage(
        // image
        img,
        // start pos x, start pos y
        background.startLeft + (backgroundVersion * background.width),
        // width, height
        background.startTop, background.width,
        // canvas pos x, canvas pos y
        background.height, -((animation * speed) % background.width) + background.width,
        // width on canvas, height on canvas
        0, background.width, background.height);

    // score
    sCtx.drawImage(
        // image
        img,
        // start pos x, start pos y
        876, 30,
        // width, height
        sCanvas.width, sCanvas.height,
        // canvas pos x, canvas pos y
        0, 0,
        // width on canvas, height on canvas
        sCanvas.width, sCanvas.height);
    sCtx.font = "20px 'Press Start 2P'";

    if (gamePlaying) {
        let currentScoreText = `Current Score: ${currentScore}`;
        let currentScoreWidth = sCtx.measureText(currentScoreText).width;
        sCtx.fillText(currentScoreText, (sCanvas.width / 2) - (currentScoreWidth / 2), 37.5);
    } else {
        let lastScoreText = `Last Score: ${lastScore}`;
        let lastScoreWidth = sCtx.measureText(lastScoreText).width;
        sCtx.fillText(lastScoreText, (sCanvas.width / 2) - (lastScoreWidth / 2), 37.5);
    }

}

function drawObstacles() {

    pipeObstacles.map(pipe => {

        // move pipe
        pipe[0] -= speed;

        // draw obstacle (top)
        ctx.drawImage(
            // image
            img,
            // start pos x, start pos y
            obstacle.topStartLeft - (pipeVersion * obstacle.topStartLeft), obstacle.topEndTop - pipe[1],
            // width, height
            obstacle.width, pipe[1],
            // canvas pos x, canvas pos y
            pipe[0], 0,
            // width on canvas, height on canvas
            obstacle.width, pipe[1]);

        // draw obstacle (bottom)
        ctx.drawImage(
            // image
            img,
            // start pos x, start pos y
            obstacle.bottomStartLeft - (pipeVersion * 168), obstacle.bottomStartTop,
            // width, height
            obstacle.width, canvas.height - pipe[1] + obstacle.gap,
            // canvas pos x, canvas pos y
            pipe[0], pipe[1] + obstacle.gap,
            // width on canvas, height on canvas
            obstacle.width ,canvas.height - pipe[1] + obstacle.gap);

        // count score and update pipes
        if (pipe[0] <= -obstacle.width) {
            // increase current score
            currentScore++;
            // update highscore (if necessary)
            highScore = Math.max(currentScore, highScore);
            setCookie("flappy_highscore", highScore, 7);

            // remove old pipe and add new one
            pipeObstacles = [...pipeObstacles.slice(1), [pipeObstacles[pipeObstacles.length - 1][0] + obstacle.gap + obstacle.width, pipeLocation()]];

            // play audio
            audioPlayer("point");
        }

        // collision detection
        if (pipe[0] <= (canvas.width / 10) + bird.width &&
            pipe[0] + obstacle.width >= (canvas.width / 10) &&
            (pipe[1] > birdFlyHeight || pipe[1] + obstacle.gap < birdFlyHeight + bird.height)) {
            audioPlayer("hit");
            setup();
        }

    });
}

function drawBird() {

    // draw bird
    if (gamePlaying) {
        ctx.drawImage(
            // image
            img,
            // start pos x, start pos y
            (bird.startLeft + (bird.width * birdAnimation)), bird.startTop + (bird.height * birdVersion),
            // width, height
            bird.width, bird.height,
            // canvas pos x, canvas pos y
            (canvas.width / 10), birdFlyHeight,
            // width on canvas, height on canvas
            bird.width, bird.height);
    } else {
        ctx.drawImage(
            // image
            img,
            // start pos x, start pos y
            (bird.startLeft + (bird.width * birdAnimation)), bird.startTop + (bird.height * birdVersion),
            // width, height
            bird.width, bird.height,
            // canvas pos x, canvas pos y
            (canvas.width / 2 - (bird.width / 2)), birdFlyHeight,
            // width on canvas, height on canvas
            bird.width, bird.height);
    }

    // bird wings animation
    if (animation % gameLoopInterval === 0) {
        birdAnimation++;
        if (birdAnimation > 2) {
            birdAnimation = 0;
        }
    }

}

function drawMainScreen() {

    // draw flappy bird logo
    ctx.drawImage(
        // image
        img,

        // start pos x, start pos y
        flappyBird.startLeft, flappyBird.startTop,
        // width, height
        flappyBird.width, flappyBird.height,

        // canvas pos x, canvas pos y
        ((canvas.width / 2) - (flappyBird.width / 2)), ((canvas.height / 2) - (flappyBird.height / 2) - 275),
        // width on canvas, height on canvas
        flappyBird.width, flappyBird.height);

    // give instructions to start the game
    if (gameReady && !settingsOpened) {
        ctx.font = "20px 'Press Start 2P'";
        ctx.fillText('Press "Space" or', 55, 550);
        ctx.fillText('tap the screen!', 60, 580);
    }

    // draw current highscore
    if (!settingsOpened) {

        let highscoreText = `Highscore: ${highScore}`;
        let highscoreWidth = sCtx.measureText(highscoreText).width;

        ctx.font = "20px 'Press Start 2P'";
        ctx.fillText(highscoreText, (canvas.width / 2) - (highscoreWidth / 2), 240);
    }

}

function drawSettings() {

    // draw bird
    ctx.drawImage(
        // image
        img,
        // start pos x, start pos y
        (bird.startLeft + (bird.width * birdAnimation)), bird.startTop + (bird.height * birdVersion),
        // width, height
        bird.width, bird.height,
        // canvas pos x, canvas pos y
        (canvas.width / 2 - (bird.width / 2)), birdFlyHeight - 50,
        // width on canvas, height on canvas
        bird.width, bird.height);

    // bird wings animation
    if (animation % gameLoopInterval === 0) {
        birdAnimation++;
        if (birdAnimation > 2) {
            birdAnimation = 0;
        }
    }

    // draw obstacle (top)
    ctx.drawImage(
        // image
        img,
        // start pos x, start pos y
        obstacle.topStartLeft - (pipeVersion * obstacle.topStartLeft), obstacle.topEndTop - 250,
        // width, height
        obstacle.width, obstacle.height,
        // canvas pos x, canvas pos y
        (canvas.width / 2 - (obstacle.width / 2)), 0,
        // width on canvas, height on canvas
        obstacle.width, obstacle.height);

    // set button texts
    document.getElementById("settingsButtonMusic").innerHTML = `Music: ${playMusic ? "ON" : "OFF"}`;
    document.getElementById("settingsButtonSound").innerHTML = `Sound: ${playSound ? "ON" : "OFF"}`;
    document.getElementById("settingsButtonGameMode").innerHTML = `Game Mode: ${hardMode ? "HARD" : "NORMAL"}`;

}

function resizeCanvas() {

    let aspectRatio = 768 / 432,
        windowHeight = (window.innerHeight - 69),
        windowWidth = (windowHeight / aspectRatio),
        buttonWidth = windowWidth - 32;


    // game canvas
    document.getElementById("gameCanvas").style.height = windowHeight + "px";
    document.getElementById("gameCanvas").style.width = windowWidth + "px";

    // score canvas
    document.getElementById("scoreCanvas").style.width = windowWidth + "px";

    // buttons: main
    document.getElementById("playButton").style.top = windowHeight - 200 + "px";
    document.getElementById("playButton").style.width = buttonWidth + "px";
    document.getElementById("settingsButton").style.top = windowHeight - 125 + "px";
    document.getElementById("settingsButton").style.width = buttonWidth + "px";
    document.getElementById("creditsButton").style.top = windowHeight - 50 + "px";
    document.getElementById("creditsButton").style.width = buttonWidth + "px";

    // buttons: settings
    document.getElementById("settingsButtonVisuals").style.top = windowHeight - 350 + "px";
    document.getElementById("settingsButtonVisuals").style.width = buttonWidth + "px";
    document.getElementById("settingsButtonGameMode").style.top = windowHeight - 275 + "px";
    document.getElementById("settingsButtonGameMode").style.width = buttonWidth + "px";
    document.getElementById("settingsButtonMusic").style.top = windowHeight - 200 + "px";
    document.getElementById("settingsButtonMusic").style.width = buttonWidth + "px";
    document.getElementById("settingsButtonSound").style.top = windowHeight - 125 + "px";
    document.getElementById("settingsButtonSound").style.width = buttonWidth + "px";
    document.getElementById("settingsButtonBack").style.top = windowHeight - 50 + "px";
    document.getElementById("settingsButtonBack").style.width = buttonWidth + "px";

    // buttons: visuals
    document.getElementById("settingsButtonVisualBird").style.top = windowHeight - 275 + "px";
    document.getElementById("settingsButtonVisualBird").style.width = buttonWidth + "px";
    document.getElementById("settingsButtonVisualBackground").style.top = windowHeight - 200 + "px";
    document.getElementById("settingsButtonVisualBackground").style.width = buttonWidth + "px";
    document.getElementById("settingsButtonVisualPipe").style.top = windowHeight - 125 + "px";
    document.getElementById("settingsButtonVisualPipe").style.width = buttonWidth + "px";
}

function birdFly() {

    // bird flight height adjustment
    birdFlyHeightAdjustment += (speed * gravity);
    birdFlyHeight = Math.min(birdFlyHeight + birdFlyHeightAdjustment, canvas.height - bird.height);

}

function borderCollisionDetection() {

    // upper canvas border
    if (birdFlyHeight <= 0) {
        audioPlayer("swoosh");
        setup();
    }

    // bottom canvas border
    if (birdFlyHeight >= (canvas.height - bird.height)) {
        audioPlayer("die");
        setup();
    }
}

function applyHardMode() {

    if (gamePlaying) {
        // increase game speed
        if ((animation * speed) % background.width === (background.width - speed)) {
            speed = Math.round(speed * 100 + ((currentScore > 0 && currentScore % 2 === 0) ? 25 : 0)) / 100;
            console.log("current game speed: " + speed);
        }

        // decrease obstacle gap
        obstacle.gap = Math.max(150, Math.max(270 - (currentScore * 5), (obstacle.gap - 0.2)));
    }
}

function audioPlayer(type) {
    // music
    if (type === "music") {
        if (playMusic) {
            document.getElementById("music").volume = 0.1;
            document.getElementById("music").play();
        } else {
            document.getElementById("music").pause();
            document.getElementById("music").currentTime = 0;
        }
    }

    if (playSound) {
        // flap
        switch (type) {
            case "flap":
                document.getElementById("flap").volume = 0.1;
                document.getElementById("flap").play();
                break;
            case "point":
                document.getElementById("point").volume = 0.1;
                document.getElementById("point").play();
                break;
            case "hit":
                document.getElementById("hit").volume = 0.1;
                document.getElementById("hit").play();
                break;
            case "die":
                document.getElementById("die").volume = 0.1;
                document.getElementById("die").play();
                break;
            case "swoosh":
                document.getElementById("swoosh").volume = 0.1;
                document.getElementById("swoosh").play();
                break;
        }
    }
}

/*
   Supported via standard programming aids with prompt:
   "javascript function to get and set a cookie value"
 */
// Function to get a cookie value
function getCookie(name) {
    var cookieName = name + "=";
    var cookieArray = document.cookie.split(";");
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return 0;
}


// Function to set a cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}


// windows resize
window.addEventListener('resize', () => resizeCanvas());

// play button
document.getElementById("playButton").addEventListener('click', () => {
    gameReady = true;
    gamePlaying = false;
});

// settings button
document.getElementById("settingsButton").addEventListener('click', () => settingsOpened = true);

// credits button
document.getElementById("creditsButton").addEventListener('click', () => document.getElementById("creditsDiv").style.visibility === "hidden" ? document.getElementById("creditsDiv").style.visibility = "visible" : document.getElementById("creditsDiv").style.visibility = "hidden");

// settings button visuals
document.getElementById("settingsButtonVisuals").addEventListener('click', () => visualSettingsOpened = !visualSettingsOpened);

// settings button change bird color
document.getElementById("settingsButtonVisualBird").addEventListener('click', () => {
    birdVersion++;
    if (birdVersion > 2) {
        birdVersion = 0;
    }
});

// settings button change background
document.getElementById("settingsButtonVisualBackground").addEventListener('click', () => backgroundVersion = !backgroundVersion);

// settings button change pipe color
document.getElementById("settingsButtonVisualPipe").addEventListener('click', () => pipeVersion = !pipeVersion);

// click actions
document.addEventListener('click', () => {

    if (gameReady) {
        gamePlaying = true
        audioPlayer("flap");
    }

});

window.onclick = () => {

    if (gamePlaying) {
        birdFlyHeightAdjustment = birdJumpHeight;
        audioPlayer("flap");
    }

};

document.getElementById("settingsButtonMusic").addEventListener('click', () => playMusic = !playMusic);
document.getElementById("settingsButtonSound").addEventListener('click', () => playSound = !playSound);
document.getElementById("settingsButtonGameMode").addEventListener('click', () => hardMode = !hardMode);
document.getElementById("settingsButtonBack").addEventListener('click', () => !visualSettingsOpened ? settingsOpened = false : visualSettingsOpened = false);

// keyboard actions
document.querySelector("html").onkeydown = function (e) {

    switch (e.code) {

        // flap
        case "Space":
            if (gameReady) {
                if (gamePlaying) {
                    birdFlyHeightAdjustment = birdJumpHeight;
                } else {
                    gamePlaying = true;
                    birdFlyHeightAdjustment = birdJumpHeight;
                }
                audioPlayer("flap");
            }
            break;

        // quit
        case "Escape":
            if (gameReady || gamePlaying) {
                gamePlaying = false;
                gameReady = false;
            }
            if (settingsOpened || visualSettingsOpened) {
                !visualSettingsOpened ? settingsOpened = false : visualSettingsOpened = false
            }
            break;

        // change background color
        case "KeyV":
            backgroundVersion = !backgroundVersion;
            break;

        // change pipe color
        case "KeyN":
            pipeVersion = !pipeVersion;
            break;

        // change bird color
        case "KeyB":
            birdVersion++;
            if (birdVersion > 2) {
                birdVersion = 0;
            }
            break;

        // toggle music
        case "KeyM":
            playMusic = !playMusic;
            break;

        // toggle sound
        case "KeyS":
            playSound = !playSound;
            break;

        // toggle game mode
        case "KeyG":
            hardMode = !hardMode;
            break;

        // quick start
        case "Enter":
            if (!gameReady && !gamePlaying && !settingsOpened && !visualSettingsOpened) {
                gameReady = true;
            }
            break;
        // no defined key
        default:
            break;

    }
}

// wait until everything is loaded
document.addEventListener("DOMContentLoaded", init);