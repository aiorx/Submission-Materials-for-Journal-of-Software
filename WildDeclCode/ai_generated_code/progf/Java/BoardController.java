package controllers;

import game.*;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.stage.Stage;
import javafx.util.Duration;

import java.io.IOException;
import java.net.URL;
import java.util.Objects;
import java.util.ResourceBundle;

public class BoardController implements Initializable, EventHandler<KeyEvent> {

    private static final int CELL_SIZE = 30;
    private static final Color EMPTY_COLOUR = Color.web("2b2d30");
    private static final Color SNAKE_COLOUR = Color.LIMEGREEN;
    private static final Color SNAKE_HEAD_COLOUR = Color.GOLD;
    private static final Color APPLE_COLOUR = Color.RED;

    @FXML
    private GridPane boardGrid;
    @FXML
    private Label scoreDisplay;
    @FXML
    private Label gameOverDisplay;
    @FXML
    private Button backButton;
    @FXML
    private Pane pauseScreen;
    @FXML
    private Label pauseText;

    private Timeline clock;

    private SnakeGame snakeGame;
    private Rectangle[][] cells;
    private int rows;
    private int cols;

    /**
     * Sets up the board view, configures the game model, and starts the game clock.
     *
     * @param url the location used to resolve relative paths for FXML files
     * @param rb  the resources used for localization
     *
     * javadoc and method Aided using common development resources. April 26th 2025
     */
    @Override
    public void initialize(URL url, ResourceBundle rb) {

        // Focus the grid so it can receive key presses immediately
        Platform.runLater(() -> boardGrid.requestFocus());

        snakeGame = new SnakeGame();
        rows = snakeGame.getBoardRows();
        cols = snakeGame.getBoardColumns();
        cells = new Rectangle[rows][cols];

        /* lock GridPane size to exact board dimensions */
        double boardSide = cols * CELL_SIZE;           // 20 × 30 = 600
        boardGrid.setMinSize(boardSide, boardSide);
        boardGrid.setMaxSize(boardSide, boardSide);
        HBox.setHgrow(boardGrid, Priority.NEVER);
        boardGrid.getColumnConstraints().clear();
        boardGrid.getRowConstraints().clear();


        /* fixed-pixel column & row constraints */
        for (int c = 0; c < cols; c++) {
            ColumnConstraints columnConstraints = new ColumnConstraints(CELL_SIZE);
            columnConstraints.setMinWidth(CELL_SIZE);
            columnConstraints.setMaxWidth(CELL_SIZE);
            boardGrid.getColumnConstraints().add(columnConstraints);
        }
        for (int r = 0; r < rows; r++) {
            RowConstraints rowConstraints = new RowConstraints(CELL_SIZE);
            rowConstraints.setMinHeight(CELL_SIZE);
            rowConstraints.setMaxHeight(CELL_SIZE);
            boardGrid.getRowConstraints().add(rowConstraints);
        }

        /* create rectangles for every cell */
        for (int y = 0; y < rows; y++) {
            for (int x = 0; x < cols; x++) {
                Rectangle rect = new Rectangle(CELL_SIZE, CELL_SIZE);
                rect.setFill(EMPTY_COLOUR);
                boardGrid.add(rect, x, y);
                cells[y][x] = rect;
            }
        }

        // initialize board
        boardGrid.setGridLinesVisible(true);
        boardGrid.setFocusTraversable(true);
        boardGrid.setOnKeyPressed(this);
        boardGrid.requestFocus();
        pauseScreen.setVisible(false);
        pauseText.setVisible(false);

        // spawn snake and apple
        snakeGame.getApple().spawn();
        snakeGame.updateBoard();

        // draw snake and apple
        paint();

        /* chatgpt: timeline that drives the game */
        clock = new Timeline(new KeyFrame(Duration.millis(250), new StepHandler())); // (1s = 1e3 ms)
        clock.setCycleCount(Timeline.INDEFINITE);
        clock.play();
    }

    /**
     * Handles successive game tick actions
     */
    private void nextStep(){

        move();

        // Update board
        paint();

        // Update score
        displayScore();
    }

    /**
     * Processes player's keyboard inputs to change snake direction
     *
     */
    @Override
    public void handle(KeyEvent e) {
        KeyCode key = e.getCode();

        // Pausing + ignore all keys if game paused
        if (key == KeyCode.SPACE) {
            if (snakeGame.getState() == GameState.RUNNING) {
                snakeGame.setState(GameState.PAUSED);
                clock.pause();
                pauseScreen.setVisible(true);
                pauseText.setVisible(true);
            } else if (snakeGame.getState() == GameState.PAUSED) {
                snakeGame.setState(GameState.RUNNING);
                clock.play();
                pauseScreen.setVisible(false);
                pauseText.setVisible(false);
            }
            return;
        }
        if (snakeGame.getState() == GameState.PAUSED) {
            return;
        }

        // Direction changes
        if (key == KeyCode.W || key == KeyCode.UP) {
            snakeGame.getSnake().changeDirection(Direction.NORTH);
        } else if (key == KeyCode.A || key == KeyCode.LEFT) {
            snakeGame.getSnake().changeDirection(Direction.WEST);
        } else if (key == KeyCode.S || key == KeyCode.DOWN) {
            snakeGame.getSnake().changeDirection(Direction.SOUTH);
        } else if (key == KeyCode.D || key == KeyCode.RIGHT) {
            snakeGame.getSnake().changeDirection(Direction.EAST);
        }
    }

    /**
     * Advances the game state and repaints the board.
     * Stops early if the snake dies.
     * Displays game over message if the snake dies
     */
    private void move () {
        snakeGame.moveSnake();

        if (snakeGame.checkCollision()) {
            if (!snakeGame.getSnake().getIsSnakeAlive()) {
                displayGameOver();

                SoundEffects.playDie();
            }

            return;
        }

        if (snakeGame.checkAppleEat()){
            //play eat sound
            SoundEffects.playEat();
        }

        snakeGame.updateBoard();
    }

    /**
     * Displays a game over message to the player
     */
    private void displayGameOver(){
        String text = "game over :(";
        gameOverDisplay.setText(text);
    }

    /**
     * Updates representation of every cell based on the game grid.
     */
    private void paint() {

        int[] headPos = snakeGame.getSnake().getBody().get(0);

        int[][] grid = snakeGame.getGrid();

        for (int y = 0; y < rows; y++) {
            for (int x = 0; x < cols; x++) {

                // snake head gets different colour
                if (x == headPos[0] && y == headPos[1]) {
                    cells[y][x].setFill(SNAKE_HEAD_COLOUR);
                    continue;
                }

                switch (grid[y][x]) {
                    case 1 -> cells[y][x].setFill(SNAKE_COLOUR);
                    case 2 -> cells[y][x].setFill(APPLE_COLOUR);
                    default -> cells[y][x].setFill(EMPTY_COLOUR);
                }
            }
        }
    }

    /**
     * Updates the score display based on snake length
     */
    private void displayScore(){
        Score.updateScore(snakeGame);

        String text = "SCORE: " + Score.getCurrentScore();

        scoreDisplay.setText(text);
    }

    public void back(ActionEvent event) throws IOException {

        // stops game
        clock.stop();

        // saves score
        TopScore.updateTopScore();

        // loads menu screen
        Parent newRoot = FXMLLoader.load(Objects.requireNonNull(getClass().getResource("/controllers/menu.fxml")));

        Stage stage = (Stage) backButton.getScene().getWindow();

        stage.setScene(new Scene(newRoot));
        stage.setTitle("Main Menu");
        stage.show();
        //===
    }

    private class StepHandler implements EventHandler<ActionEvent> {

        /**
         * Called by the JavaFX timeline every tick to trigger a game update.
         *
         * @param event the action event fired by the timeline
         *
         * javadoc Aided using common development resources. April 26th 2025
         */
        @Override
        public void handle(ActionEvent event) {
            if (snakeGame.getState() == GameState.RUNNING && snakeGame.getSnake().getIsSnakeAlive()) {
                nextStep();
            }

        }
    }

}
