package virtualpetgame.ui;

import javafx.animation.AnimationTimer;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ProgressBar;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import virtualpetgame.model.ActionManager;
import virtualpetgame.model.SaveAndLoad;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;

/**
 * Class to represent the game loop sequence. Handles updating every statistic, score, coins, and checking pet state
 * changes every set amount of time (currently 1 second).
 *
 * @author Tony Wang
 */
public class GameLoop extends AnimationTimer {

    private long lastUpdate = 0; // Time of the last update in nanoseconds
    private double accumulatedTime = 0; // Accumulated time in seconds
    private double accumulatedTime2 = 0;
    private ActionManager actionController = App.getActionManager();
    ProgressBar healthBar;
    ProgressBar sleepBar;
    ProgressBar fullnessBar;
    ProgressBar happinessBar;
    ImageView spriteImage;
    Label errorLabel;
    Label scoreLabel;
    Label coinLabel;
    ArrayList<Node> nodes;
    Button newGameButton;
    Button loadPreviousButton;
    private int timeElapsed;

    /**
     * Default constructor for updating whether buttons are disabled depending on playtime restriction time range
     */
    public GameLoop () {}

    /**
     * Constructor which takes in all necessary JavaFX objects that need to be updated or disabled across the gameplay
     * period.
     *
     * @param healthBar the health bar object
     * @param sleepBar the sleep bar object
     * @param fullnessBar the fullness bar object
     * @param happinessBar the happiness bar object
     * @param spriteImage the ImageView object containing the sprite
     * @param errorLabel the label to show errors
     * @param scoreLabel the label to show score
     * @param coinLabel the label to show coins
     * @param newGameButton the button to show when pet dies
     * @param loadPreviousButton the second button to show when pet dies
     * @param nodes a list of items that will be disabled when the pet dies
     */
    public GameLoop (ProgressBar healthBar, ProgressBar sleepBar, ProgressBar fullnessBar, ProgressBar happinessBar,
                     ImageView spriteImage, Label errorLabel, Label scoreLabel, Label coinLabel, Button newGameButton,
                     Button loadPreviousButton, ArrayList<Node> nodes) {
        this.healthBar = healthBar;
        this.sleepBar = sleepBar;
        this.fullnessBar = fullnessBar;
        this.happinessBar = happinessBar;
        this.spriteImage = spriteImage;
        this.errorLabel = errorLabel;
        this.scoreLabel = scoreLabel;
        this.coinLabel = coinLabel;
        this.nodes = nodes;
        this.newGameButton = newGameButton;
        this.loadPreviousButton = loadPreviousButton;
    }

    /** Code mostly Assisted with basic coding tools */
    @Override public void handle(long now) {
        if (lastUpdate == 0) {
            lastUpdate = now;
            return;
        }

        // Calculate deltaTime in seconds
        double deltaTime = (now - lastUpdate) / 1_000_000_000.0; // Convert nanoseconds to seconds
        lastUpdate = now;

        accumulatedTime += deltaTime;
        accumulatedTime2 += deltaTime;

        while (accumulatedTime >= 1) {
            try {
                updateGame();  // Update the game logic
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            accumulatedTime -= 1;  // Subtract 1 second to allow for next update
        }

        while (accumulatedTime2 >= 5) {
            if (actionController.getState() != 1) spriteImage.setScaleX(spriteImage.getScaleX() * -1);  // Update the game logic
            accumulatedTime2 -= 5;
        }
    }

    /**
     * Changes pet sprite based on state by retrieving images from the project resources folder
     */
    public void changeSpriteState () {
        try {
            switch (actionController.getState()) {
                case 0:
                    spriteImage.setImage(new Image(getClass().getResource("/images/" + actionController.getPetType() + "/dead_" + actionController.getPetType() + ".png").toExternalForm()));
                    break;
                case 1:
                    spriteImage.setImage(new Image(getClass().getResource("/images/" + actionController.getPetType() + "/sleeping_" + actionController.getPetType() + ".png").toExternalForm()));
                    break;
                case 2:
                    spriteImage.setImage(new Image(getClass().getResource("/images/" + actionController.getPetType() + "/angry_" + actionController.getPetType() + ".png").toExternalForm()));
                    break;
                case 3:
                    spriteImage.setImage(new Image(getClass().getResource("/images/" + actionController.getPetType() + "/hungry_" + actionController.getPetType() + ".png").toExternalForm()));
                    break;
                case 4:
                    spriteImage.setImage(new Image(getClass().getResource("/images/" + actionController.getPetType() + "/normal_" + actionController.getPetType() + ".png").toExternalForm()));
                    break;
            }
        } catch (NullPointerException e) {
            System.out.print(actionController.getState() + ": ");
            System.out.println(getClass().getResource("/images/" + actionController.getPetType() + "/hungry_" + actionController.getPetType() + ".png"));
        }
    }

    /**
     * Function to handle when pet health reaches 0. Disables the screen and only allows the player to start a new game
     * or load a previous save.
     */
    public void petDied () throws IOException {
        this.stop();

        Node obj;
        Iterator iterator = nodes.iterator();
        while (iterator.hasNext()) {
            obj = (Node) iterator.next();
            obj.setDisable(true);
        }
        App.getSaveManager().saveGame(1);
        newGameButton.setVisible(true);
        loadPreviousButton.setVisible(true);
    }

    /**
     * Method to show a red outline around vital statistic bars when they reach 25% or lower. Also removes them if they
     * are above this threshold.
     */
    private void showBarWarnings () {
        if (healthBar.getProgress() < 0.25) {
            healthBar.setStyle("-fx-accent: green; -fx-border-color: red; -fx-border-width: 2;");
        } else healthBar.setStyle("-fx-accent: green; -fx-border-color: none;");
        if (sleepBar.getProgress() < 0.25) {
            sleepBar.setStyle("-fx-accent: pink; -fx-border-color: red; -fx-border-width: 2;");
        } else sleepBar.setStyle("-fx-accent: pink; -fx-border-color: none;");
        if (fullnessBar.getProgress() < 0.25) {
            fullnessBar.setStyle("-fx-accent: brown; -fx-border-color: red; -fx-border-width: 2;");
        } else fullnessBar.setStyle("-fx-accent: brown; -fx-border-color: none;");
        if (happinessBar.getProgress() < 0.25) {
            happinessBar.setStyle("fx-accent: yellow; -fx-border-color: red; -fx-border-width: 2;");
        } else happinessBar.setStyle("-fx-accent: yellow; -fx-border-color: none;");

    }

    /**
     * Main updater function for the game loop. Executes this code every second, updating pet stats, changing states,
     * adding to score, and adding to coins.
     */
    private void updateGame() throws IOException {
        if (actionController.getState() == 0) this.petDied();

        actionController.changeStats(actionController.getHealthRate(), actionController.getHappinessRate(),
                actionController.getHungerRate(), actionController.getSleepinessRate());
        healthBar.setProgress((double) actionController.getHealth() / 100);
        sleepBar.setProgress((double) actionController.getSleepiness() / 100);
        fullnessBar.setProgress((double) actionController.getHunger() / 100);
        happinessBar.setProgress((double) actionController.getHappiness() / 100);
        showBarWarnings();

        actionController.changeCoins(1);
        coinLabel.setText("Coins: " + actionController.getCoins());

        actionController.changeScore(10);
        scoreLabel.setText("Score: " + Integer.toString(actionController.getScore()));

        this.changeSpriteState();
    }

    /**
     * Method to get the time elapsed
     *
     * @return the time elapsed so far in this game session
     */
    public int getTimeElapsed() {
        return timeElapsed;
    }
}
