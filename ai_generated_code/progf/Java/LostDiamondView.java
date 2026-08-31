package edu.ntnu.idatt2003.view.gameviews;

import edu.ntnu.idatt2003.controller.gamecontrollers.DiamondGameController;
import edu.ntnu.idatt2003.enums.ActionType;
import edu.ntnu.idatt2003.models.Board;
import edu.ntnu.idatt2003.models.Player;
import edu.ntnu.idatt2003.models.Tile;
import edu.ntnu.idatt2003.models.lostdiamondgame.LostDiamondGame;
import edu.ntnu.idatt2003.models.lostdiamondgame.SpecialTile;
import edu.ntnu.idatt2003.view.components.ActionBox;
import edu.ntnu.idatt2003.view.components.DiceContainer;
import edu.ntnu.idatt2003.view.components.DirectionPad;
import edu.ntnu.idatt2003.view.components.TilePane;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import javafx.scene.image.ImageView;
import javafx.scene.layout.ColumnConstraints;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.StackPane;


/**
 * View for the {@link LostDiamondGame} board game.
 *
 * <p>This class extends GameUI to provide specific rendering and interaction capabilities for the
 * lost diamond game. It handles the visual representation of the board, including tiles, paths and
 * flippable actions, and player pieces. Also has components like {@link DirectionPad} for choosing
 * paths, and {@link ActionBox} for opening an action.
 * </p>
 *
 * <p>The class separates the visual elements from game logic, focusing solely on representation
 * and user interaction. It works with the {@link DiamondGameController} to translate game events
 * into visual updates.
 * </p>
 */
public class LostDiamondView extends GameView {

  private DirectionPad directionPad;
  private ActionBox actionBox;
  private final Map<Integer, TilePane> flippableTiles = new HashMap<>();

  /**
   * Creates theLostDiamond view. Initializes the DiceContainer with a single die.
   */
  public LostDiamondView() {
    super();
    diceContainer = new DiceContainer(1);
  }

  /**
   * Creates the game board layout and loads action images. This method is called once during game
   * initialization. It prepares the entire board and sidebar layout. Uses {@code ColumnConstraints}
   * so the board not visually "collapses" when there is no {@link SpecialTile} on the row/column
   * (since these are visually bigger)
   *
   * @param board the game board containing all tile and path definitions
   */
  @Override
  protected void createGameLayout(Board board) {
    boardGrid = new GridPane();
    gameViewPane = new StackPane();
    tileSize = 70;
    preloadActionImages(tileSize * 0.45 * 0.90 * 2);

    int maxColumns = 26;
    for (int i = 0; i < maxColumns; i++) {
      ColumnConstraints column = new ColumnConstraints();
      column.setPrefWidth(tileSize);
      boardGrid.getColumnConstraints().add(column);
    }
    populateBoardWithTiles(board);
    gameViewPane.getChildren().addAll(boardGrid);

    addComponentsToLeftSidebar();
  }

  /**
   * Displays a welcome message to the player. Shown when a new game starts.
   */
  @Override
  protected void showWelcomeMessage() {
    addMessage("Welcome to Lost Diamond Game!");
    addMessage("Roll the dice and use the DPad to move your piece along the board.");
    addMessage("You can either roll or pay to flip a tile, and try to get the lost diamond!");
    addMessage("Good luck");
  }


  /**
   * Adds the direction pad (DPad) and action box (buttons for flipping action) to the sidebar
   * area.
   */
  private void addComponentsToLeftSidebar() {
    directionPad = new DirectionPad(100, 30);
    actionBox = new ActionBox();
    leftSide.getChildren().addAll(directionPad, actionBox);
  }

  /**
   * Draws all tiles of the board, with their branches and paths. Sets the tiles on their
   * coordinates in the GridPane. The {@link TilePane} is used to draw each tile with lines in their
   * correct path, and add an action disc on top if an action is present on the tile.
   *
   * @param board the board to be visualized
   */
  private void populateBoardWithTiles(Board board) {
    board.getTiles().forEach(tile -> {
      TilePane tilePane = new TilePane(tile, screenWidth / 40);
      boardGrid.add(tilePane, tile.getColumn(), tile.getRow());

      if (tile.getAction() != null) {
        flippableTiles.put(tile.getTileIndex(), tilePane);
      }

      ((SpecialTile) tile).getPaths().forEach(head -> {
        for (Tile t = head; t != null; t = t.getNextTile()) {
          boardGrid.add(new TilePane(t, screenWidth / 40), t.getColumn(), t.getRow());
        }
      });
    });
  }


  /**
   * Triggers the visual flip of a tile's action disc. (kind of broken)
   *
   * @param tileIndex the index of the tile to be flipped (1-based)
   */
  public void flipTile(int tileIndex) {
    flippableTiles.get(tileIndex).flipDisc();
  }

  /**
   * Gets the {@link DirectionPad} component.
   *
   * @return the on-screen direction pad component
   */
  public DirectionPad getDirectionPad() {
    return directionPad;
  }

  /**
   * Gets the interactive action box for open action.
   *
   * @return the action box
   */
  public ActionBox getActionBox() {
    return actionBox;
  }

  /**
   * Places all player pieces onto the board. Called on startup.
   *
   * @param players list of players
   */
  public void drawPiecesOnBoard(List<Player> players) {
    if (playerPieces.isEmpty()) {
      createPlayerPieces(players);
    }
    for (int i = 0; i < players.size(); i++) {
      Tile currentTile = players.get(i).getCurrentTile();
      movePieceOnBoard(i, currentTile.getColumn(), currentTile.getRow());
    }
  }

  /**
   * Moves a player piece to a new board coordinate. Used during player movement.
   *
   * @param playerNumber index of the player to move
   * @param column       the column on the board grid
   * @param row          the row on the board grid
   */
  public void movePieceOnBoard(int playerNumber, int column, int row) {
    ImageView playerPiece = playerPieces.get(playerNumber);
    boardGrid.getChildren().remove(playerPiece);

    GridPane.setRowIndex(playerPiece, row);
    GridPane.setColumnIndex(playerPiece, column);

    double offset = playerNumber * 5;
    playerPiece.setTranslateX(offset);
    playerPiece.setTranslateY(-offset);

    boardGrid.getChildren().add(playerPiece);
  }

  /**
   * Pre-loads all action PNGs once and stores ready-to-use ImagePatterns. Aided using common development resources
   *
   * @param diameterPx the pixel width and height used for each circular image
   */
  private void preloadActionImages(double diameterPx) {
    Map<ActionType, String> paths = Map.of(
        ActionType.YELLOW_DIAMOND, "/lost_diamond/80x80/yellow.png",
        ActionType.RED_DIAMOND, "/lost_diamond/80x80/red.png",
        ActionType.GREEN_DIAMOND, "/lost_diamond/80x80/green.png",
        ActionType.WINNING_DIAMOND, "/lost_diamond/80x80/diamond.png",
        ActionType.ROBBER, "/lost_diamond/80x80/robber.png",
        ActionType.VISA, "/lost_diamond/80x80/visa.png"
    );

    paths.forEach((type, path) -> {
      var img = new javafx.scene.image.Image(
          Objects.requireNonNull(getClass().getResource(path)).toExternalForm(),
          diameterPx, diameterPx, true, true, false);
      TilePane.IMAGE_CACHE.put(type, new javafx.scene.paint.ImagePattern(img));
    });
  }

  public void showMessageFromAction(ActionType actionType, String name) {
    String message = switch (actionType) {
      case YELLOW_DIAMOND -> "Yellow Diamond";
      case RED_DIAMOND -> "Red Diamond";
      case GREEN_DIAMOND -> "Green Diamond";
      case WINNING_DIAMOND -> "Winning Diamond";
      case VISA -> "Visa";
      case ROBBER -> "Robber";
      case CHECK_FOR_DIAMOND -> "Check For Diamond";
      default -> throw new IllegalArgumentException("Unknown action type: " + actionType);
    };
    addMessage(message + " was found by " + name);
  }
}
