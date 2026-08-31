package idi.edu.idatt.mappe.views.game;

import idi.edu.idatt.mappe.models.Tile;
import idi.edu.idatt.mappe.utils.CoordinateConverter;
import javafx.scene.Group;
import javafx.scene.paint.Color;
import javafx.scene.paint.CycleMethod;
import javafx.scene.paint.LinearGradient;
import javafx.scene.paint.Stop;
import javafx.scene.shape.Circle;
import javafx.scene.shape.CubicCurve;
import javafx.scene.shape.Line;
import javafx.scene.shape.Polygon;

/**
 * Class representing a connection between two tiles in the game board.
 * This class is responsible for drawing the connection
 * between tiles, which can be either a ladder or a snake.
 *
 *
 * This class has been created with help from ChatGPT.
 * The code creating visual views for snakes and ladders has partly been created
 * with the help og ChatGPT.
 * The Methods that have used ChatGPT are drawLadder and drawSnake.
 *
 * The code has been modified to fit the project and to be more readable.
 *
 */
public class ConnectionView extends Group {

    public enum Type {
        LADDER, SNAKE
    }

    private static final double TILE_PADDING = 10;

    /**
     * Constructor for ConnectionView.
     *
     * @param from The starting tile
     * @param to The ending tile
     * @param type The type of connection (LADDER or SNAKE)
     * @param rows The number of rows in the board
     * @param cols The number of columns in the board
     * @param width The width of the board
     * @param height The height of the board
     */
    public ConnectionView(Tile from, Tile to, Type type, int rows, int cols, double width, double height) {
        double tileWidth = width / cols;
        double tileHeight = height / rows;

        double[] start = CoordinateConverter.boardToScreen(from.getY(), from.getX(), rows, cols, width, height);
        double[] end = CoordinateConverter.boardToScreen(to.getY(), to.getX(), rows, cols, width, height);

        double startX = start[0] + tileWidth / 2;
        double startY = start[1] + tileHeight / 2;
        double endX = end[0] + tileWidth / 2;
        double endY = end[1] + tileHeight / 2;

        if (type == Type.LADDER) {
            drawLadder(startX, startY, endX, endY, tileWidth);
        } else {
            drawSnake(startX, startY, endX, endY, tileWidth, tileHeight);
        }
    }

    /**
     * Draws a ladder between two points.
     *
     * This method was partly created with the help of ChatGPT.
     * The code has not been directly copied, but has been modified to fit the project,
     * but some parts are similar to the code Designed via basic programming aids.
     *
     * @param x1 the x-coordinate of the start point
     * @param y1 the y-coordinate of the start point
     * @param x2 the x-coordinate of the end point
     * @param y2 the y-coordinate of the end point
     * @param tileWidth the width of the tile
     */
    private void drawLadder(double x1, double y1, double x2, double y2, double tileWidth) {
        double ladderWidth = tileWidth * 0.4;

        double dirX = x2 - x1;
        double dirY = y2 - y1;
        double length = Math.sqrt(dirX * dirX + dirY * dirY);

        dirX /= length;
        dirY /= length;

        double perpX = -dirY;
        double perpY = dirX;

        double side1X1 = x1 + perpX * ladderWidth/2;
        double side1Y1 = y1 + perpY * ladderWidth/2;
        double side1X2 = x2 + perpX * ladderWidth/2;
        double side1Y2 = y2 + perpY * ladderWidth/2;

        double side2X1 = x1 - perpX * ladderWidth/2;
        double side2Y1 = y1 - perpY * ladderWidth/2;
        double side2X2 = x2 - perpX * ladderWidth/2;
        double side2Y2 = y2 - perpY * ladderWidth/2;

        Line side1 = new Line(side1X1, side1Y1, side1X2, side1Y2);
        Line side2 = new Line(side2X1, side2Y1, side2X2, side2Y2);

        LinearGradient ladderGradient = new LinearGradient(
                0, 0, 1, 1, true, CycleMethod.NO_CYCLE,
                new Stop(0, Color.SADDLEBROWN),
                new Stop(1, Color.SIENNA)
        );

        side1.setStroke(ladderGradient);
        side2.setStroke(ladderGradient);
        side1.setStrokeWidth(5);
        side2.setStrokeWidth(5);


        getChildren().addAll(side1, side2);

        int steps = (int)(length / 20) + 2;
        steps = Math.min(steps, 20);

        for (int i = 0; i <= steps; i++) {
            double t = (double) i / steps;
            double px1 = side1X1 + (side1X2 - side1X1) * t;
            double py1 = side1Y1 + (side1Y2 - side1Y1) * t;
            double px2 = side2X1 + (side2X2 - side2X1) * t;
            double py2 = side2Y1 + (side2Y2 - side2Y1) * t;

            Line rung = new Line(px1, py1, px2, py2);
            rung.setStroke(Color.GOLDENROD);
            rung.setStrokeWidth(3);
            getChildren().add(rung);
        }
    }

    /**
     * Draws a snake between two points.
     *
     * This method was partly created with the help of ChatGPT.
     * The code has not been directly copied, but has been modified to fit the project,
     * but some parts are similar to the code Designed via basic programming aids.
     *
     * @param x1 The x-coordinate of the start point
     * @param y1 The y-coordinate of the start point
     * @param x2 The x-coordinate of the end point
     * @param y2 The y-coordinate of the end point
     * @param tileWidth The width of the tile
     * @param tileHeight The height of the tile
     */
    private void drawSnake(double x1, double y1, double x2, double y2, double tileWidth, double tileHeight) {
        double ctrlX1 = x1 + (x2 - x1) * 0.25 + (Math.random() - 0.5) * tileWidth * 1.5;
        double ctrlY1 = y1 + (y2 - y1) * 0.25 + (Math.random() - 0.5) * tileHeight * 1.5;
        double ctrlX2 = x1 + (x2 - x1) * 0.75 + (Math.random() - 0.5) * tileWidth * 1.5;
        double ctrlY2 = y1 + (y2 - y1) * 0.75 + (Math.random() - 0.5) * tileHeight * 1.5;

        CubicCurve snakeBody = new CubicCurve(
                x1, y1,
                ctrlX1, ctrlY1,
                ctrlX2, ctrlY2,
                x2, y2
        );

        LinearGradient snakeGradient = new LinearGradient(
                0, 0, 1, 1, true, CycleMethod.NO_CYCLE,
                new Stop(0, Color.DARKGREEN),
                new Stop(0.5, Color.INDIANRED),
                new Stop(1, Color.MEDIUMSEAGREEN)
        );

        snakeBody.setStroke(snakeGradient);
        snakeBody.setStrokeWidth(tileWidth * 0.25);
        snakeBody.setFill(null);


        double headRadius = tileWidth * 0.2;
        Circle head = new Circle(x1, y1, headRadius, Color.DARKGREEN);

        double dirX = x1 - ctrlX1;
        double dirY = y1 - ctrlY1;
        double dir = Math.atan2(dirY, dirX);

        double eyeOffset = headRadius * 0.5;
        double eyeRadius = headRadius * 0.25;

        // Left eye
        Circle leftEye = new Circle(
                x1 + Math.cos(dir - 0.5) * eyeOffset,
                y1 + Math.sin(dir - 0.5) * eyeOffset,
                eyeRadius, Color.WHITE
        );

        // Right eye
        Circle rightEye = new Circle(
                x1 + Math.cos(dir + 0.5) * eyeOffset,
                y1 + Math.sin(dir + 0.5) * eyeOffset,
                eyeRadius, Color.WHITE
        );

        // Eye pupils
        Circle leftPupil = new Circle(
                x1 + Math.cos(dir - 0.5) * eyeOffset,
                y1 + Math.sin(dir - 0.5) * eyeOffset,
                eyeRadius * 0.5, Color.BLACK
        );

        Circle rightPupil = new Circle(
                x1 + Math.cos(dir + 0.5) * eyeOffset,
                y1 + Math.sin(dir + 0.5) * eyeOffset,
                eyeRadius * 0.5, Color.BLACK
        );

        // Create forked tongue
        double tongueLength = headRadius * 1.5;
        double tongueWidth = headRadius * 0.3;

        Polygon tongue = new Polygon(
                x1 + Math.cos(dir) * headRadius, y1 + Math.sin(dir) * headRadius,
                x1 + Math.cos(dir) * (headRadius + tongueLength), y1 + Math.sin(dir) * (headRadius + tongueLength) - tongueWidth,
                x1 + Math.cos(dir) * (headRadius + tongueLength * 0.7), y1 + Math.sin(dir) * (headRadius + tongueLength * 0.7),
                x1 + Math.cos(dir) * (headRadius + tongueLength), y1 + Math.sin(dir) * (headRadius + tongueLength) + tongueWidth
        );
        tongue.setFill(Color.RED);

        getChildren().addAll(snakeBody, head, leftEye, rightEye, leftPupil, rightPupil, tongue);
    }
}