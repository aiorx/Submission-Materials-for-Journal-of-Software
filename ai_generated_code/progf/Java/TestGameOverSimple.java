package sprint3.test;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import sprint3.product.SosGame.GameState;
import sprint3.product.SosGame;
import sprint3.product.SosGame.Cell;
import sprint3.product.SosSimpleGame;

public class TestGameOverSimple {
  SosGame game;

  @BeforeEach
  public void setUp() throws Exception {
    // 3x3 simple game
    game = new SosSimpleGame();
  }

  @AfterEach
  public void tearDown() throws Exception {
  }

  // Penned via standard programming aids
  @Test
  void testBlueWin() {
    // Simulate a winning condition for Blue player by forming an "SOS"

    // First move by Blue: Place 'S' at (0,0)
    game.makeMove(0, 0, Cell.BLUE_S);

    // Red move: Place 'S' at (0,1) to alternate turns
    game.makeMove(0, 1, Cell.RED_S);

    // Blue move: Place 'O' at (0,2), part of an "SOS" sequence
    game.makeMove(0, 2, Cell.BLUE_O);

    // Red move: Place 'O' at (1,0) to continue alternating
    game.makeMove(1, 0, Cell.RED_O);

    // Blue move: Place 'S' at (2,0), forming a vertical SOS in the first column
    game.makeMove(2, 0, Cell.BLUE_S);

    // Assert that the game state is BLUE_WON after Blue completes the SOS
    assertEquals(GameState.BLUE_WON, game.getGameState(), "The game state should be BLUE_WON.");
  }

  @Test
  void testRedWin() {
    game.makeMove(0, 0, Cell.BLUE_S);
    game.makeMove(1, 1, Cell.RED_S);
    game.makeMove(0, 2, Cell.BLUE_S);
    game.makeMove(0, 1, Cell.RED_O);
    assertEquals(GameState.RED_WON, game.getGameState());
  }

  // Penned via standard programming aids
  @Test
  void testDrawCondition() {
    int boardSize = game.getBoardSize();  // Get the size of the board

    // Fill the board without forming any SOS
    for (int row = 0; row < boardSize; row++) {
      for (int col = 0; col < boardSize; col++) {
        // Alternate between Blue and Red letters, but avoid forming any "SOS"
        if ((row + col) % 2 == 0) {
          game.makeMove(row, col, Cell.BLUE_S);  // Blue 'S'
        } else {
          game.makeMove(row, col, Cell.RED_O);  // Red 'O'
        }
      }
    }

    // Assert that the game state is DRAW after all cells are filled without any "SOS"
    assertEquals(GameState.DRAW, game.getGameState(), "The game state should be DRAW.");
  }

  @Test
  void testGameNotOver() {
    game.makeMove(0, 0, Cell.BLUE_S);
    game.makeMove(0, 1, Cell.RED_O);
    game.makeMove(1, 1, Cell.BLUE_S);
    assertEquals(GameState.PLAYING, game.getGameState());
  }

}