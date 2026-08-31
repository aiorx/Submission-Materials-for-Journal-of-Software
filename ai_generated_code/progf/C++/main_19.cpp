/* Path
 *
 * Description:
 * This program simulates a standard two-player chess game on an 8x8 board.
 * Players alternate turns and move pieces according to standard chess rules.
 * Each piece (Pawn, Rook, Knight, Bishop, Queen, King) has specific movement
 * rules implemented in its respective class. Pieces are identified by their
 * color (White or Black) and type.
 *
 * The board is displayed in a graphical user interface, and the user can
 * click to select a piece and then click on the target square. The game checks
 * whether the move is valid based on the selected piece's allowed movement and
 * the current board state.
 *
 * The game ends when a player is checkmated or the game is stalemated. Invalid
 * moves are ignored or produce a notification to the user. After each move,
 * the board updates to reflect the new state.
 *
 * Program author:
 * Name: Misa Martiskainen
 * Student number: 153429347
 * UserID: pvn985
 * E-Mail: misa.martiskainen@tuni.fi
 * Feedback language (fi/en): fi
 *
 * Notes:
 * - The board is implemented as an 8x8 grid
 *   using an appropriate data structure.
 * - Chess pieces are implemented using a class hierarchy
 *   derived from ChessPiece.
 * - Each subclass defines specific movement rules (e.g., for Queen or Knight).
 * - Game logic includes detection of check, checkmate, and valid movement.
 * - The GUI and overall structure are based on a given project template.
 * - Only the essential game mechanics
 *   —such as piece movement logic, turn handling, and board state updates—
 *   along with individual piece behaviors, were customized from the template.
 *
 * Notes on code generation:
 * - The code and comments after the template were
 *   100 % Aided using common development resources-4 and GPT-3.5 by instructions of the author,
 *   with only this sentence, program author information
 *   and line formatting made by the author overall in about 10 hours.
 */

#include "mainwindow.hh"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow w;
    w.show();

    return a.exec();
}
