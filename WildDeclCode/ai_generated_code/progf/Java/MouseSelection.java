package cosc202.andie;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.event.*;
import javax.swing.*;

/**
 * <p>
 * MouseSelection to apply a selection box to the image panel
 * using the users input of mouse click and release
 * </p>
 *
 * <p>
 * This class uses the Mouselisner to record the coordinates of whne the mouse
 * is clicked and released
 * in order to draw a selction box on top of the image panel
 * </p>
 *
 * Some code are Produced via common programming aids3.5.
 *
 * @see java.awt.event.MouseListener
 * @author Emma
 * @version 2.0
 */
public class MouseSelection implements MouseListener, MouseMotionListener {

    /** The start point */
    private Point start;
    /** The end point */
    private Point end;
    /** Our imagePanel */
    public static ImagePanel imagePanel;
    /** The width of the image */
    private int imageWidth;
    /** The height of the image */
    private int imageHeight;
    /** The seclection rectangle */
    private Rectangle selectionRect;
    /**
     * A boolean that decides whether the dotten lines box should stay on the screen
     */
    private boolean isSelecting;
    /** The rotation angle to make the dotted lines move */
    private int rotationAngle = 0;

    /**
     * Initilises MouseSelection
     *
     * @param imagePanel The image panel that the selction is drawn on
     */
    public MouseSelection(ImagePanel imagePanel) {
        this.imagePanel = imagePanel;
        this.imageWidth = imagePanel.getImage().getCurrentImage().getWidth();
        this.imageHeight = imagePanel.getImage().getCurrentImage().getHeight();
        this.imagePanel.addMouseListener(this);
        this.imagePanel.addMouseMotionListener(this);
    }

    // public static Point getStartPoint() {
    // return start;
    // }

    // public static Point getEndPoint() {
    // return end;
    // }

    // public static ImagePanel getImagePanel(){
    // return imagePanel;
    // }

    /**
     * Records start coordinates of selection when mouse is pressed
     */
    @Override
    public void mousePressed(MouseEvent e) {
        start = e.getPoint();
        imagePanel.setStartPoint(start);
        end = start;
        imagePanel.setEndPoint(end);
        isSelecting = true;
        imagePanel.setIsSelecting(isSelecting);
        rotationAngle = 0;
        imagePanel.setRotationAngle(rotationAngle);
        // clearSelection();
        imagePanel.repaint();
        this.imageWidth = (int) (imagePanel.getImage().getCurrentImage().getWidth() * (imagePanel.getZoom() / 100));
        this.imageHeight = (int) (imagePanel.getImage().getCurrentImage().getHeight() * (imagePanel.getZoom() / 100));
    }

    /**
     * Records end coordinates of selection when mouse is released
     */
    @Override
    public void mouseReleased(MouseEvent e) {
        if (start != end) {
            if (DrawingOperations.isDrawingRect) {
                Color color = ColourWheel.getChosenColour();
                imagePanel.getImage().apply(new DrawingOperations('r', start, end, color));
                DrawingOperations.isDrawingRect = false;
                selectionRect = null;
            } else if (DrawingOperations.isDrawingOval) {
                Color color = ColourWheel.getChosenColour();

                imagePanel.getImage().apply(new DrawingOperations('o', start, end, color));
                DrawingOperations.isDrawingOval = false;
                selectionRect = null;

            } else if (DrawingOperations.isDrawingLine) {
                Color color = ColourWheel.getChosenColour();

                imagePanel.getImage().apply(new DrawingOperations('l', start, end, color));
                DrawingOperations.isDrawingLine = false;
                selectionRect = null;

            }
        }

        imagePanel.repaint();
        imagePanel.getParent().revalidate();

        isSelecting = false;
        imagePanel.setIsSelecting(isSelecting);

        if (selectionRect != null && selectionRect.width != 0 && selectionRect.height != 0) {
            // Ensure selection rectangle is normalized
            selectionRect = new Rectangle(
                    Math.min(start.x, end.x),
                    Math.min(start.y, end.y),
                    Math.abs(end.x - start.x),
                    Math.abs(end.y - start.y));
        } else {
            // Reset selection rectangle if it's just a click
            selectionRect = null;
        }
        if (!DrawingOperations.isDrawingRect || !DrawingOperations.isDrawingOval || !DrawingOperations.isDrawingLine) {
            imagePanel.setSelectionRect(selectionRect);
            imagePanel.repaint();
            imagePanel.setCrop(true);
            Andie.toolbar.changeCropStatus(true);
        }
    }

    /**
     * Calculates and draws the selction box
     */
    private void drawSelection() {
        // Calculating selction
        // Finds starting y and x values of selction
        int x = Math.min(start.x, end.x);
        int y = Math.min(start.y, end.y);
        // finds width and height of selction, bounded by the image dimensions
        int width = Math.min(imageWidth - x, Math.abs(start.x - end.x));
        int height = Math.min(imageHeight - y, Math.abs(start.y - end.y));

        // Draws the selction box on panel
        Graphics g = imagePanel.getGraphics();
        g.setColor(Color.RED);
        g.drawRect(x, y, width, height);
    }

    /**
     * Clears the selection box from the image panel
     */
    private void clearSelection() {
        // Removes the selection box
        imagePanel.repaint();
        imagePanel.setCrop(false);
        Andie.toolbar.changeCropStatus(false);
    }

    /** Decides app behaviour when the mouse is dragged. */
    @Override
    public void mouseDragged(MouseEvent e) {
        this.imageWidth = (int) (imagePanel.getImage().getCurrentImage().getWidth() * (imagePanel.getZoom() / 100));
        this.imageHeight = (int) (imagePanel.getImage().getCurrentImage().getHeight() * (imagePanel.getZoom() / 100));
        end = e.getPoint();
        imagePanel.setEndPoint(end);
        System.out.println(imagePanel.getImage());
        if (imagePanel.getImage() != null) {
            // int imageWidth = Math.min(
            // imagePanel.getImage().getCurrentImage().getWidth(imagePanel.getImage().getCurrentImage()),
            // imagePanel.getImage().getCurrentImage().getWidth());
            // int imageHeight = Math.min(
            // imagePanel.getImage().getCurrentImage().getHeight(imagePanel.getImage().getCurrentImage()),
            // imagePanel.getImage().getCurrentImage().getHeight());
            if (end.x < 0) {
                end.x = 0;
            } else if (end.x > imageWidth) {
                end.x = imageWidth;
            }
            if (end.y < 0) {
                end.y = 0;
            } else if (end.y > imageHeight) {
                end.y = imageHeight;
            }
            if (start.x < 0) {
                start.x = 0;
            } else if (start.x > imageWidth) {
                start.x = imageWidth;
            }
            if (start.y < 0) {
                start.y = 0;
            } else if (start.y > imageHeight) {
                start.y = imageHeight;
            }
            if (isSelecting) {
                // Create the selection rectangle within the image bounds
                selectionRect = new Rectangle(
                        Math.min(start.x, end.x),
                        Math.min(start.y, end.y),
                        Math.abs(end.x - start.x),
                        Math.abs(end.y - start.y));
                imagePanel.setSelectionRect(selectionRect);
            }
        }
        imagePanel.repaint();
    }

    /**
     * a getter for the selection rectangle
     *
     * @return the selection rectangle
     */
    public Rectangle getSelectionRect() {
        return selectionRect;
    }

    /**
     * Not needed for this implimentation
     */
    @Override
    public void mouseClicked(MouseEvent e) {
        if (DrawingOperations.isDrawingRect || DrawingOperations.isDrawingOval || DrawingOperations.isDrawingLine) {
            DrawingOperations.isDrawingRect = false;
            DrawingOperations.isDrawingOval = false;
            DrawingOperations.isDrawingLine = false;
        }
        clearSelection();
    }

    /**
     * Not needed for this implimentation
     */
    @Override
    public void mouseEntered(MouseEvent e) {
    }

    /**
     * Not needed for this implimentation
     */
    @Override
    public void mouseExited(MouseEvent e) {
    }

    /** not needed ofr this implementation */
    @Override
    public void mouseMoved(MouseEvent e) {
    }
}
