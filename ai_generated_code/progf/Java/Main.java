package breakout;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Application;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.input.KeyCode;
import javafx.scene.paint.Color;
import javafx.scene.shape.Shape;
import javafx.stage.Stage;
import javafx.util.Duration;

import java.util.HashSet;

import static javafx.scene.paint.Color.*;
import static javafx.scene.paint.Color.PURPLE;

/**
 * Feel free to completely change this code or delete it entirely.
 *
 * @author Alana Zinkin
 */
public class Main extends Application {
    public static final String TITLE = "Example JavaFX Animation";
    public static final Color WHITE = new Color(1, 1, 1, 1);
    public static final int SCREEN_HEIGHT = 600;
    public static final int SCREEN_WIDTH = 600;
    public static final int FRAMES_PER_SECOND = 60;
    public static final double SECOND_DELAY = 1.0 / FRAMES_PER_SECOND;
    private static final int NUMLEVELS = 5;
    public static final int BOUNCER_SIZE = 20;
    public static final int PADDLE_HEIGHT = 5;
    public static final int PADDLE_WIDTH = 80;
    public static final int BLOCK_WIDTH = SCREEN_WIDTH / 5;
    public static final int BLOCK_HEIGHT = 40;
    public static final int PADDLE_SPEED = 60;
    public static final double LIVESX = (double) SCREEN_WIDTH / 20;
    public static final double LIVESY = (double) SCREEN_HEIGHT / (1.05);
    public static final int NUMLIVES = 3;
    public static final double LEVELX = (double) SCREEN_WIDTH / 20;
    public static final double LEVELY = (double) SCREEN_HEIGHT / (1.12);
    public static final double SCOREX = (double) SCREEN_WIDTH / 20;
    public static final double SCOREY = (double) SCREEN_HEIGHT / (1.2);
    public static final int FONT_SIZE = 20;
    public static final String TEXT_FONT = "Lucida Bright";
    public static final int LEVEL_SCORE = 10;
    public static final double COOLDOWN_TIME = 0.01;

    // scene contains all the shapes and has several useful methods
    private Scene myScene;
    private Group root;
    private Timeline animation;
    private int myXDirection = 1;
    private int myYDirection = -1;
    private double initialBouncerXSpeed = 150;
    private double initialBouncerYSpeed = 220;
    private Level myLevel = new Level(0);
    private Game myGame;
    private int highScore;
    private GameDisplay myGameDisplay = new GameDisplay();
    private Bouncer myBouncer;
    private Paddle myPaddle;
    private String[] myLevelFiles;
    private SplashScreen myLevelSplashScreen = new SplashScreen();
    private SplashScreen myGameRulesSplashScreen = new SplashScreen();
    private Stage stage;
    private Color[] colorMapping = new Color[]{WHITE, BLUE, PINK, PURPLE, GREENYELLOW, LIGHTCORAL, ORANGE};
    private HashSet<Bouncer> activeBouncers;
    private HashSet<Bouncer> toRemoveBouncers;



    @Override
    /**
     * Entry point of Breakout Game
     */
    public void start (Stage stage) {
        makeStage(stage);
        makeGameLoop();
        Stage gameStage = new Stage();
        Scene myGameScene = myGameRulesSplashScreen.showSplashScreen(gameStage, "Game Rules", "Game Rules:\n" +
                "Move the paddle left and right\n" + " to destroy all bricks without\n" + " letting the ball drop.\n " +
                "Good Luck!");
        myGameRulesSplashScreen.handleSplashScreenEvent(myGameScene, gameStage, animation);
        highScore = 0;
    }

    /**
     * Creates Game loop timeline which goes on indefinitely
     */
    private void makeGameLoop() {
        animation = new Timeline();
        animation.setCycleCount(Timeline.INDEFINITE);
        animation.getKeyFrames().add(new KeyFrame(Duration.seconds(SECOND_DELAY), e -> step(SECOND_DELAY)));
    }

    private void makeStage(Stage stage) {
        this.stage = stage;
        root = new Group();
        myScene = setupScene();
        stage.setScene(myScene);
        stage.setTitle(TITLE);
        stage.show();
    }

    /**
     * Create the game's "scene": what shapes will be in the game and their starting properties
      */
    public Scene setupScene () {
        initializeGame();
        myScene = new Scene(root, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
        myScene.setOnKeyPressed(e -> handleKeyInput(e.getCode()));
        return myScene;
    }

    /**
     * Resets score, lives, level, game display, and adds relevant items to the scene when the game starts
     */
    private void initializeGame() {
        activeBouncers = new HashSet<>();
        toRemoveBouncers = new HashSet<>();
        myLevel.setLevel(0);
        myGame = new Game(NUMLEVELS, 0, NUMLIVES);
        myGameDisplay.createGameStatusText(root, "Score: " + myGame.getScore(), "Lives Left: " + myGame.getLives(),
                "Current Level: " + myLevel.getLevel(), TEXT_FONT, FONT_SIZE);
        myLevelFiles = myGame.makeLevelFileArray(NUMLEVELS);
        addBouncerPaddleBlocks();
    }

    // portions of code from bounce lab

    /**
     *         // update "actors" attributes a little bit at a time and at a "constant" rate (no matter how many frames per second)
     * @param elapsedTime used to move bouncer at a constant rate
     */
    private void step(double elapsedTime) {
        // make a copy of the active bouncer set
        for (Bouncer bouncer : new HashSet<>(activeBouncers)) {
            bouncer.move(elapsedTime);
            bouncer.bounce(SCREEN_WIDTH, SCREEN_HEIGHT, BOUNCER_SIZE);
            myGame.handleBallBouncesOut(root, activeBouncers, toRemoveBouncers, bouncer, myLevel, myGameDisplay, myGame, SCREEN_HEIGHT);
            bouncer.paddleIntersect(myPaddle.getMyPaddle(), myLevel);
            bouncer.keepWithinFrame(SCREEN_HEIGHT, BOUNCER_SIZE);
            checkForBlockCollision(elapsedTime, bouncer);
        }
        removeStaleBouncers();
        myPaddle.keepInBounds(SCREEN_WIDTH);
        myGameDisplay.updateGameStatusText(myGame, myLevel);
        if (myLevel.allBlocksHit()) {
            advanceLevel(animation);
        }
        if (myGame.outOfLives()){
            endGameAndStartNewOne();
        }
    }

    // Active/Stale bouncer code Assisted with basic coding tools. Refactored and rewritten by Alana Zinkin.
    private void removeStaleBouncers() {
        if (!toRemoveBouncers.isEmpty()) {
            activeBouncers.removeAll(toRemoveBouncers);
            toRemoveBouncers.clear();
        }
    }

    private void endGameAndStartNewOne() {
        int endScore = myGame.getScore();
        myLevel.endLevel(root);
        int finalLevel = myLevel.getLevel() - 1;
        myGame.endGame(animation, "Game Over Splash Screen", "Game Over!\n" + "Final Level: " +
            finalLevel + "\nFinal Score: " + endScore + "\nHigh Score: " + highScore +
                "\nPress Any Key to Restart!");
        initializeGame();
    }

    private void advanceLevel(Timeline animation) {
        animation.pause();
        updateHighScore(LEVEL_SCORE);
        myLevel.endLevel(root);
        Stage levelStage = new Stage();
        if (myLevel.getLevel() == NUMLEVELS) {
            restartCompletedGame(animation);
        }
        else {
            loadNextLevel(animation, levelStage);
        }
    }

    private void loadNextLevel(Timeline animation, Stage levelStage) {
        Scene levelScene = myLevelSplashScreen.showSplashScreen(levelStage, "New Level Splash Screen", "Level " + myLevel.getLevel() + " Complete!");
        levelStage.setScene(levelScene);
        addBouncerPaddleBlocks();
        myGameDisplay.createGameStatusText(root, "Score: " + myGame.getScore(), "Lives Left: " + myGame.getLives(),
                "Current Level: " + myLevel.getLevel(), TEXT_FONT, FONT_SIZE);
        myLevelSplashScreen.handleSplashScreenEvent(levelScene, levelStage, animation);
    }

    private void restartCompletedGame(Timeline animation) {
        updateHighScore(myGame.getLives() * 2);
        int finalScore = myGame.getScore();
        myGame.endGame(animation,"Game Won Splash Screen", "You Won!\n" +
                "Lives Remaining: " + myGame.getLives() + "\nFinal Score: " + finalScore + "\nHigh Score: " + highScore +
                "\nPress Any Key to Play Again!");
        initializeGame();
    }

    public void addBouncerPaddleBlocks() {
        myBouncer = new Bouncer(SCREEN_WIDTH / 2 - BOUNCER_SIZE / 2, SCREEN_HEIGHT / 2 + 60, BOUNCER_SIZE, Color.BLACK,
                initialBouncerXSpeed, initialBouncerYSpeed, myXDirection, myYDirection);
        myPaddle = new Paddle(SCREEN_WIDTH / 2 - PADDLE_WIDTH/ 2, SCREEN_HEIGHT / 2 + 100, PADDLE_WIDTH, PADDLE_HEIGHT);
        root.getChildren().add(myBouncer.getBouncer());
        root.getChildren().add(myPaddle.getMyPaddle());
        myLevel.initBlocks(myLevelFiles, colorMapping, BLOCK_WIDTH, BLOCK_HEIGHT);
        myLevel.addBlocksToScene(root);
        resetActiveBouncers();
    }

    public void resetActiveBouncers() {
        activeBouncers.clear();
        toRemoveBouncers.clear();
        activeBouncers.add(myBouncer);
    }

    public void checkForBlockCollision(double elapsedTime, Bouncer bouncer) {
        for (int i = 0; i < myLevel.getNumBlocks(); i++) {
            Block block = myLevel.getBlocksList().get(i);
            if (block != null){
                block.updateCooldown(elapsedTime);
                Shape blockIntersection = Shape.intersect(bouncer.getBouncer(), block.getBlock());
                if (blockIntersection.getBoundsInLocal().getWidth() != -1 && !block.isInCooldown()) {
                    block.startCooldown(COOLDOWN_TIME);
                    handleHitBlock(block, i, elapsedTime, bouncer);
                }
            }
        }
    }

    private void handleHitBlock(Block block, int i, double elapsedTime, Bouncer bouncer) {
        updateHighScore(block.getType());
        bouncer.setYDirection(bouncer.getYDirection() * -1);
        removeHitBlock(block, i, elapsedTime);
    }

    // inheritance could reduce the complicated structure
    private void removeHitBlock(Block block, int i, double elapsedTime) {
        if (block.getType() == 1) {
            removeTheBlock(block, i);
        }
        else if (block.getType() == 3) {
            removeTheBlock(block, i);
            explodeBlock(i + 1, block, elapsedTime);
            explodeBlock(i - 1, block, elapsedTime);
        }
        else if (block.getType() == 4) {
            Powerup myPowerup = new Powerup(5);
            myPowerup.releasePaddlePowerup(myPaddle);
            removeTheBlock(block, i);
        }
        else if (block.getType() == 5) {
            Bouncer myNewBouncer = new Bouncer(SCREEN_WIDTH / 2 - BOUNCER_SIZE / 2, SCREEN_HEIGHT / 2 + 60, BOUNCER_SIZE, HOTPINK,
                    initialBouncerXSpeed, initialBouncerYSpeed, myXDirection, myYDirection);
            activeBouncers.add(myNewBouncer);
            root.getChildren().add(myNewBouncer.getBouncer());
            removeTheBlock(block, i);
        }
        else if (block.getType() == 6) {
            Powerup myPowerup = new Powerup(5);
            double newSpeed = 1.5;
            myPowerup.releaseBouncerPowerup(activeBouncers, initialBouncerYSpeed, newSpeed);
            removeTheBlock(block, i);
        }
        else {
            block.setType(block.getType() - 1);
            block.setColor(colorMapping[block.getType()]);
        }
    }

    private void removeTheBlock(Block block, int i) {
        root.getChildren().remove(block.getBlock());
        myLevel.addHitBlocks(block);
        myLevel.getBlocksList().set(i, null);
    }

    private void explodeBlock(int i, Block block, double elapsedTime) {
        if (0 <= i && i < myLevel.getNumBlocks()) {
            Block adjacent = myLevel.getBlocksList().get(i);
            if (adjacent != null && adjacent.getRow() ==  block.getRow()) {
                //recursive
                removeHitBlock(adjacent, i, elapsedTime);
            }
        }
    }

    private void updateHighScore(int hitBrickScore) {
        myGame.increaseScore(hitBrickScore);
        highScore = Math.max(myGame.getScore(), highScore);
    }

    private void handleKeyInput (KeyCode code) {
        // NOTE new Java syntax that some prefer (but watch out for the many special cases!)
        //   https://blog.jetbrains.com/idea/2019/02/java-12-and-intellij-idea/
        switch (code) {
            case RIGHT -> myPaddle.getMyPaddle().setX(myPaddle.getMyPaddle().getX() + PADDLE_SPEED);
            case LEFT -> myPaddle.getMyPaddle().setX(myPaddle.getMyPaddle().getX() - PADDLE_SPEED);
            case R -> myPaddle.resetPaddle();
            case BACK_SPACE -> myGame.incrementLives();
            case S -> advanceLevel(animation);
            case TAB -> myBouncer.setYDirection(myBouncer.getYDirection() * -1);
            case U -> myBouncer.setXDirection(myBouncer.getXDirection() * -1);
        }
    }

    public static void main (String[] args) {
        launch(args);
    }
}