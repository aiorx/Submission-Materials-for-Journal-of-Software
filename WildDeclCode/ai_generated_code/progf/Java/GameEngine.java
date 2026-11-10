package core;

import edu.princeton.cs.algs4.StdDraw;
import music.SoundPlayer;
import tileengine.TERenderer;
import tileengine.TETile;
import java.util.List;

import java.awt.*;


   //Overarching game mechanics class

   //Includes HUDs, starting and ending the game, input logic


public class GameEngine {
    private SoundPlayer soundPlayer;
    private World world;
    private TERenderer ter;
    private SaveAndLoad saveAndLoad = new SaveAndLoad();
    private Avatar avatar;
    private boolean render = true;
    private GameState gameState;
    private boolean isGameOver = false;

    // contains 2 different constructors, one with an additional render variable for AutoGraderBuddy and testing
    public GameEngine() {
        // Initialize rendering
        this.ter = new TERenderer();
        this.ter.initialize(World.WIDTH, World.HEIGHT);

        // Set up StdDraw
        StdDraw.setCanvasSize(World.WIDTH * 16, World.HEIGHT * 16);
        StdDraw.setXscale(0, World.WIDTH);
        StdDraw.setYscale(0, World.HEIGHT);
        StdDraw.enableDoubleBuffering();
    }
    public GameEngine(boolean render) {
        this.render = render;
        if (this.render) {

            this.ter = new TERenderer();
            this.ter.initialize(World.WIDTH, World.HEIGHT);

            StdDraw.setCanvasSize(World.WIDTH * 16, World.HEIGHT * 16);
            StdDraw.setXscale(0, World.WIDTH);
            StdDraw.setYscale(0, World.HEIGHT);
            StdDraw.enableDoubleBuffering();
        }
    }


// @source This code is partially generated with ChatGPT. It displays the main menu and changes the font
    public void displayMenu() {
        // Clear the screen and set up for drawing the menu
        StdDraw.clear();
        StdDraw.enableDoubleBuffering();

        // Title
        Font titleFont = new Font("Arial", Font.BOLD, 30);
        StdDraw.setFont(titleFont);
        StdDraw.text(World.WIDTH / 2.0, World.HEIGHT * 3 / 4.0, "THE MANTED HAUNSION");

        // Button options
        Font optionsFont = new Font("Arial", Font.PLAIN, 20);
        StdDraw.setFont(optionsFont);
        StdDraw.text(World.WIDTH / 2.0, World.HEIGHT / 2.0, "New Game (N)");
        StdDraw.text(World.WIDTH / 2.0, World.HEIGHT / 2.0 - 4, "Start (S)");
        StdDraw.text(World.WIDTH / 2.0, World.HEIGHT / 2.0 - 8, "Load Game (L)");
        StdDraw.text(World.WIDTH / 2.0, World.HEIGHT / 2.0 - 12, "Quit (:Q)");

        StdDraw.show();
    }

    // @source This code is Aided using common development resources. It starts the game
    // from a new seed and from a loaded seed and begins mainGameLoop()

    public void start() {
        displayMenu();
        boolean acceptingInput = true;

        // ghost_music.wav is a clip from "Ghost House" of Nintendo New Super Mario Bros Wii
        // This music is owned and copyrighted by Nintendo
        soundPlayer = new SoundPlayer("/music/ghost-music.wav");
        soundPlayer.start();

        while (acceptingInput) {
            if (StdDraw.hasNextKeyTyped()) {
                char key = StdDraw.nextKeyTyped();
                if (key == 'N' || key == 'n') {
                    handleNewGameInput();
                    acceptingInput = false; // Stop accepting input to move to the main game loop
                } else if (key == 'L' || key == 'l') {
                    loadGame();
                    acceptingInput = false;
                }
            }
            StdDraw.pause(50); // @source delay recommended and coded by ChatGPT, may help CPU management
        }
        mainGameLoop();
        displayTileInformation();
    }

    // stops music
    public void stopMusic() {
        if (soundPlayer != null) {
            soundPlayer.stopLooping();
        }
    }

    // @source This code was Aided using common development resources. It returns a GameState class
    // containing the positioning of all tiles and current health
    public GameState getGameState() {
        List<int[]> heartPositions = world.getHeartPositions();
        List<int[]> skullPositions = world.getSkullPositions();

        return new GameState(
                world.getSeed(),
                avatar.getX(),
                avatar.getY(),
                avatar.getHealth(),
                heartPositions,
                skullPositions
        );
    }

    // calls saveAndLoad save() with current GameState when
    // game is quit
    public void saveGame() {
        // Pass the GameState object to the save method
        if (saveAndLoad.save(getGameState())) {
            System.out.println("Game saved successfully.");
        } else {
            System.out.println("Failed to save the game.");
        }
    }

    // @source This code is partially Aided using common development resources. It displays the current tile
    // that the mouse pointer is on
    private void displayTileInformation() {
        int mouseX = (int) StdDraw.mouseX();
        int mouseY = (int) StdDraw.mouseY();

        if (mouseX >= 0 && mouseX < World.WIDTH && mouseY >= 0 && mouseY < World.HEIGHT) {
            TETile mouseTile = world.getWorld()[mouseX][mouseY];
            displayHUD(mouseTile.description());
        }
    }

    // logic for updating HUD
    public void updateHUD(String tileDescription) {
        if (avatar != null) {
            displayHUD(tileDescription);
        }
    }

    // @source This code is Aided using common development resources. It draws and displays
    // the current health bar
    private void displayHUD(String tileDescription) {
        int hudX = World.WIDTH / 2;
        int hudY = World.HEIGHT - 1;
        StdDraw.setPenColor(Color.WHITE);
        StdDraw.filledRectangle(hudX, hudY, World.WIDTH / 2.0, 1);

        String healthDisplay = "";
        for (int i = 0; i < avatar.getHealth(); i++) {
            healthDisplay += "❤ ";
        }

        String displayText = tileDescription + "                 Health: " + healthDisplay;

        Font hudFont = new Font("Arial", Font.PLAIN, 14);
        StdDraw.setFont(hudFont);
        StdDraw.setPenColor(Color.BLACK);

        StdDraw.text(hudX, hudY, displayText);
    }

    // loads game after "L" or "l" is pressed calling SaveLoad load()
    public void loadGame() {
        GameState gameState = saveAndLoad.load();
        if (gameState != null) {
            world = new World(this, gameState.getSeed());
            world.placeHeartsAndSkulls(gameState.getHeartPositions(), gameState.getSkullPositions());
            world.setAvatarPosition(gameState.getAvatarX(), gameState.getAvatarY(), gameState.getAvatarHealth());
            avatar = world.getAvatar();
            System.out.println("Game loaded successfully.");
        } else {
            System.out.println("Failed to load the game.");
        }
    }

    // loop ran after game has been started, updates
    // and renders and checks if health has been depleted
    private void mainGameLoop() {
        while (!isGameOver) {
            updateGame();
            renderGame();
            StdDraw.show();
            StdDraw.pause(20);
        }
        gameOver();
    }

    // @source This code was generated with ChatGPT. It displays
    // the seed as it is being typed and creates a world using
    // that seed if "S" or "s" is pressed
    private void handleNewGameInput() {
        StringBuilder seed = new StringBuilder();

        StdDraw.clear();
        StdDraw.text(World.WIDTH / 2.0, World.HEIGHT / 2.0, "Enter Seed: " + seed.toString());
        StdDraw.show();

        while (true) {
            if (StdDraw.hasNextKeyTyped()) {
                char ch = StdDraw.nextKeyTyped();
                if (Character.isDigit(ch)) {
                    seed.append(ch);
                } else if (ch == 'S' || ch == 's') {
                    System.out.println("Seed entered: " + seed.toString()); // Debug output
                    break; // Exit the loop if 'S' is pressed
                }
                // Re-render the text with the current seed
                StdDraw.clear();
                StdDraw.text(World.WIDTH / 2.0, World.HEIGHT / 2.0, "Enter Seed: " + seed.toString());
                StdDraw.show();
            }
            StdDraw.pause(50);
        }

        try {
            long parsedSeed = Long.parseLong(seed.toString());
            initializeGameWithSeed(parsedSeed);
        } catch (NumberFormatException e) {
            System.err.println("Error parsing seed: " + e.getMessage()); // Error output
        }
    }

    // creates the world with given seed and places Key tile
    public void initializeGameWithSeed(long seed) {
        // Instantiate the world with the seed
        System.out.println("Initializing game with seed: " + seed);
        this.world = new World(this, seed);
        this.world.initializeAvatar();
        this.avatar = this.world.getAvatar();
        this.world.placeKey();
    }

    // @source This code was Aided using common development resources.
    private void updateGame() {
        boolean colonPressed = false;  // Flag to remember if ':' was pressed

        while (true) {
            if (StdDraw.hasNextKeyTyped()) {
                char ch = StdDraw.nextKeyTyped();

                if (colonPressed) {
                    if (ch == 'Q' || ch == 'q') {
                        saveGame();
                        stopMusic();
                        System.exit(0); // Exit after saving
                    }
                    colonPressed = false;
                } else if (ch == ':') {
                    colonPressed = true; // Set flag if ':' is pressed
                } else {
                    handleMovement(ch);
                }
            }
            renderGame();
            StdDraw.show();
            StdDraw.pause(20);
            checkGameOver();
            checkVictory();
        }
    }

    // @source This code was Aided using common development resources.
    public void handleMovement(char ch) {
        Avatar.Direction direction = null;
        switch (ch) {
            case 'w':
                direction = Avatar.Direction.UP;
                break;
            case 'a':
                direction = Avatar.Direction.LEFT;
                break;
            case 's':
                direction = Avatar.Direction.DOWN;
                break;
            case 'd':
                direction = Avatar.Direction.RIGHT;
                break;
            default:
                break;
        }
        if (direction != null && avatar != null) {
            world.getAvatar().move(direction, world.getWorld());
            world.moveSkullTiles();
        }
    }
    private void renderGame() {
        if (render) {
            StdDraw.clear();
            ter.renderFrame(world.getWorld());
            displayTileInformation();
            StdDraw.show();
        }
    }

    public World getWorld() {
        return world;
    }

    private void checkGameOver() {
        if (avatar.getHealth() <= 0 && !isGameOver) {
            isGameOver = true;
            gameOver();
        }
    }

    // It displays Game Over text and allows user to quit
    private void gameOver() {
        StdDraw.clear(StdDraw.BLACK);

        StdDraw.setPenColor(StdDraw.WHITE);
        StdDraw.setFont(new Font("Arial", Font.BOLD, 30));
        StdDraw.text(World.WIDTH / 2.0, World.HEIGHT / 2.0, "Game Over!");
        StdDraw.text(World.WIDTH / 2.0, World.HEIGHT / 2.0 - 4, "Quit: (Q)");

        StdDraw.show();
        while (true) {
            if (StdDraw.hasNextKeyTyped()) {
                char key = StdDraw.nextKeyTyped();
                if (key == 'q' || key == 'Q') {
                    System.exit(0); // Exit the game when 'q' is pressed
                }
            }
            StdDraw.pause(100); // delay for CPU
        }
    }

    private void checkVictory() {
        if (avatar.getX() == world.getKeyPosition()[0] && avatar.getY() == world.getKeyPosition()[1]) {
            isGameOver = true;
            gameWon();
        }
    }

    private void gameWon() {
        StdDraw.clear(StdDraw.BLACK);

        StdDraw.setPenColor(StdDraw.WHITE);
        StdDraw.setFont(new Font("Arial", Font.BOLD, 30));
        StdDraw.text(World.WIDTH / 2.0, World.HEIGHT / 2.0, "Congratulations, you win!");
        StdDraw.text(World.WIDTH / 2.0, World.HEIGHT / 2.0 - 4, "Quit: (Q)");

        StdDraw.show();

        while (true) {
            if (StdDraw.hasNextKeyTyped()) {
                char key = StdDraw.nextKeyTyped();
                if (key == 'q' || key == 'Q') {
                    System.exit(0);
                }
            }
            StdDraw.pause(100);
        }
    }

    public static void main(String[] args) {
        GameEngine gameEngine = new GameEngine();
        gameEngine.start();
    }
}
