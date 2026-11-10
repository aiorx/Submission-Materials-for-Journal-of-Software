package chess;

import java.util.*;

import static chess.ChessPiece.PieceType.*;
import static chess.ChessGame.TeamColor.*;

/**
 * A chessboard that can hold and rearrange chess pieces.
 */
public class ChessBoard implements Cloneable {

    private ChessPiece[][] board;

    /**
     * Constructs ChessBoard object, a blank double array of size 8x8.
     */
    public ChessBoard() {
        //TODO get rid of the 1st line of this constructor (useless)
        board = new ChessPiece[ChessConstants.BOARD_SIZE][ChessConstants.BOARD_SIZE];
        resetBoard();
    }

    /**
     * Constructs a ChessBoard object by cloning another.
     *
     * @param board ChessBoard object to be cloned
     */
    public ChessBoard(ChessBoard board) throws CloneNotSupportedException {
        this.board = board.clone().getBoardMatrix();
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChessBoard that=(ChessBoard) o;
        return Arrays.deepEquals(board, that.board);
    }

    @Override
    public int hashCode() {
        return Arrays.deepHashCode(board);
    }


    /**
     * Overwritten clone method.
     *
     * @return  a deep copy of the ChessBoard object
     * @throws  CloneNotSupportedException if cloning is not supported
     */
    @Override
    public ChessBoard clone() throws CloneNotSupportedException {
        ChessBoard clonedBoard = (ChessBoard) super.clone();

        // Deep copy of the ChessPiece objects
        clonedBoard.board = new ChessPiece[ChessConstants.BOARD_SIZE][ChessConstants.BOARD_SIZE];
        for (int i = 0; i < ChessConstants.BOARD_SIZE; i++) {
            for (int j = 0; j < ChessConstants.BOARD_SIZE; j++) {
                if (board[i][j] != null) {
                    clonedBoard.board[i][j] = (ChessPiece) board[i][j].clone();
                }
            }
        }

        return clonedBoard;
    }


    /**
     * Locates and returns the position of the king on the board.
     *
     * @param teamColor the color of the king to search
     * @return          the location of the king
     */
    public ChessPosition getKingPosition(ChessGame.TeamColor teamColor) {
        int rowIt = 0;
        for (ChessPiece[] row : board) {
            int colIt = 0;
            for (ChessPiece piece : row) {
                if (piece != null && piece.getTeamColor() == teamColor && piece.getPieceType() == ChessPiece.PieceType.KING) {
                    return new ChessPosition(rowIt + 1, colIt + 1);
                }
                colIt++;
            }
            rowIt++;
        }
        throw new IllegalStateException("King not found on board");
    }


    /**
     * Used to find all friendly pieces on the 'board' attribute.
     * !Originally Assisted with basic coding tools!
     *
     * @return  coordinates array locating friendly pieces within the board
     */
    public Collection<ChessPosition> iterateForFriendlyPieces(ChessGame.TeamColor teamTurn) {

        Collection<ChessPosition> friendlyPositions = new HashSet<>();

        int rowIt = 0;
        for (ChessPiece[] row : board) {
            int colIt = 0;
            for (ChessPiece piece : row) {
                if (piece != null && piece.getTeamColor() == teamTurn) {
                    friendlyPositions.add(new ChessPosition(rowIt + 1, colIt + 1));
                }
                colIt++;
            }
            rowIt++;
        }

        return friendlyPositions;
    }


    /**
     * Makes a move on the board
     *
     * @param move chess move to update board with
     * @throws InvalidMoveException if move is invalid
     */
    public void makeMove(ChessMove move) throws InvalidMoveException {
        if (!validateMove(move)) {
            throw new InvalidMoveException("Invalid move attempted: " + move);
        }

        ChessPiece startPiece = getPiece(move);
        addEmptyPiece(move.getStartPosition());

        if (move.hasPromotionPiece()) {
            addPiece(move.getEndPosition(), new ChessPiece(startPiece.getTeamColor(), move.getPromotionPiece()));
        }
        else {
            addPiece(move.getEndPosition(), new ChessPiece(startPiece.getTeamColor(), startPiece.getPieceType()));
        }
    }


    /**
     * Checks if the ending position of a move is empty.
     *
     * @param move a move to check for emptiness
     * @return if the ending square is blank
     */
    public boolean landsOnEmpty(ChessMove move) {
        ChessPosition endPosition = move.getEndPosition();
        return (endPosition.positionIsWithinBounds() && board[endPosition.getRow() - 1][endPosition.getColumn() - 1] == null);
    }


    /**
     * Return if the starting piece and ending piece differ in color (if there is an ending piece).
     *
     * @param move  move to be checked
     * @return      if the ending position contains an enemy piece
     */
    public boolean landsOnEnemy(ChessMove move) {
        ChessPiece startPiece = getPiece(move.getStartPosition());
        ChessPiece endPiece = getPiece(move.getEndPosition());

        // The end piece exists and is an enemy
        return endPiece != null && endPiece.getTeamColor() != startPiece.getTeamColor();
    }

    /**
     * Returns the piece captured by a given move.
     *
     * @param move  given move
     * @return      the piece captured by 'move' based on 'board'
     */
    public ChessPiece getCapturedPiece(ChessMove move) {
        return getPiece(move.getEndPosition());
    }


    /**
     * Adds a chess piece to the board.
     *
     * @param position where to add piece
     * @param piece    piece to be added
     */
    public void addPiece(ChessPosition position, ChessPiece piece) {
        board[position.getRow() - 1][position.getColumn() - 1] = piece;
    }


    /**
     * Gets a chess piece on the chessboard.
     *
     * @param position The position to get the piece from
     * @return Either the piece at the position, or null if no piece is at that
     * position
     */
    public ChessPiece getPiece(ChessPosition position) {
        if (!position.positionIsWithinBounds()) {
            return null;
        }
        return board[position.getRow() - 1][position.getColumn() - 1];
    }


    /**
     * @param move selected ChessMove on the board
     * @return ChessPiece found at the start position of 'move'
     */
    public ChessPiece getPiece(ChessMove move) {
        return (getPiece(move.getStartPosition()));
    }


    /**
     * @return  'board' attribute
     */
    public ChessPiece[][] getBoardMatrix() {
        return board;
    }


    /**
     * Validates a move without checking the turn.
     *
     * @param move  move to be checked
     * @return      if the move is valid
     */
    protected boolean validateMove(ChessMove move) {
        ChessPiece piece = getPiece(move);
        if (piece.getPieceType() == PAWN) {
            return validatePawnMove(move);
        } else {
            // The end position is on the board and is either empty or occupied by an enemy piece
            return move.moveIsWithinBounds() && (landsOnEnemy(move) || landsOnEmpty(move));
        }
    }


    /**
     * Validates a pawn move.
     * A pawn move is valid if: it moves once to an empty square, it moves twice to an empty square
     * (passing through an empty square), it moves up and to the side to an enemy-occupied square
     *
     * @param move  ChessMove object to be checked
     * @return      If pawn move is valid
     */
    protected boolean validatePawnMove(ChessMove move) {

        int direction = (getPiece(move).getTeamColor() == WHITE) ? 1 : -1;

        ChessPosition startPosition = move.getStartPosition();
        ChessPosition endPosition = move.getEndPosition();

        int rowDifference = Math.abs(endPosition.getRow() - startPosition.getRow());
        int colDifference = Math.abs(endPosition.getColumn() - startPosition.getColumn());

        if (rowDifference == 1) {
            if (colDifference == 1) {       // Sideways capture
                return landsOnEnemy(move);
            }
            else if (colDifference == 0) {  // Single forward push
                return landsOnEmpty(move);
            }
            else {                          // Invalid colDifference
                return false;
            }
        }
        else if (rowDifference == 2) {    // Double forward push
            ChessMove doubleMove = new ChessMove(move.getStartPosition(), 2 * direction, 0);
            return landsOnEmpty(move) && landsOnEmpty(doubleMove);
        }
        return false;                     // Invalid pawn move
    }


    /**
     * Adds an empty piece to the board at the given position.
     *
     * @param position  position to be made empty
     */
    public void addEmptyPiece(ChessPosition position) {
        addPiece(position, null);
    }


    /**
     * Updates the chess board to the classic starting position.
     */
    public void resetBoard() {
        board = new ChessPiece[][]{
                {new ChessPiece(WHITE, ROOK), new ChessPiece(WHITE, KNIGHT), new ChessPiece(WHITE, BISHOP), new ChessPiece(WHITE, QUEEN), new ChessPiece(WHITE, KING), new ChessPiece(WHITE, BISHOP), new ChessPiece(WHITE, KNIGHT), new ChessPiece(WHITE, ROOK)},
                {new ChessPiece(WHITE, PAWN), new ChessPiece(WHITE, PAWN), new ChessPiece(WHITE, PAWN), new ChessPiece(WHITE, PAWN), new ChessPiece(WHITE, PAWN), new ChessPiece(WHITE, PAWN), new ChessPiece(WHITE, PAWN), new ChessPiece(WHITE, PAWN)},
                {null, null, null, null, null, null, null, null},
                {null, null, null, null, null, null, null, null},
                {null, null, null, null, null, null, null, null},
                {null, null, null, null, null, null, null, null},
                {new ChessPiece(BLACK, PAWN), new ChessPiece(BLACK, PAWN), new ChessPiece(BLACK, PAWN), new ChessPiece(BLACK, PAWN), new ChessPiece(BLACK, PAWN), new ChessPiece(BLACK, PAWN), new ChessPiece(BLACK, PAWN), new ChessPiece(BLACK, PAWN)},
                {new ChessPiece(BLACK, ROOK), new ChessPiece(BLACK, KNIGHT), new ChessPiece(BLACK, BISHOP), new ChessPiece(BLACK, QUEEN), new ChessPiece(BLACK, KING), new ChessPiece(BLACK, BISHOP), new ChessPiece(BLACK, KNIGHT), new ChessPiece(BLACK, ROOK)},
        };
    }
}
