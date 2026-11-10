// This file should not be modified.
package student;

import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;

/**
 * A static utility class for {@link ImageEditor}.
 */
public final class Utilities {
    private static final int IMAGE_WIDTH = 256;
    private static final int IMAGE_HEIGHT = 256;

    private Utilities() {
    }

    // Code Aided using common development resources.
    // https://chat.openai.com/share/985106a7-6c03-47ab-865c-25467bf07eeb
    static BufferedImage generateImage() {
        BufferedImage image = new BufferedImage(IMAGE_WIDTH, IMAGE_HEIGHT, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = image.createGraphics();

        g.setColor(new Color(135, 206, 50)); // medium green
        g.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

        // Enable anti-aliasing for smoother shapes
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Draw sun
        g.setColor(Color.YELLOW);
        g.fillOval(200, 20, 50, 50);

        // Draw sun rays
        g.setColor(Color.YELLOW);
        drawSunRay(g, 225, 45, 265, 45);
        drawSunRay(g, 225, 45, 205, 65);
        drawSunRay(g, 225, 45, 215, 25);
        drawSunRay(g, 225, 45, 245, 25);
        drawSunRay(g, 225, 45, 245, 65);

        // Draw smiling face
        g.setColor(Color.YELLOW);
        g.fillOval(100, 100, 100, 100); // Head
        g.setColor(Color.BLACK);
        g.drawArc(115, 130, 30, 20, 200, 140); // Left eye
        g.drawArc(155, 130, 30, 20, 200, 140); // Right eye
        g.drawArc(115, 130, 70, 60, 180, 180); // Smile

        // Draw flowers
        drawFlower(g, 30, 200, 10, 40, 5, Color.RED); // Flower 1
        drawFlower(g, 150, 210, 10, 30, 6, Color.BLUE); // Flower 2
        drawFlower(g, 220, 180, 10, 25, 4, Color.PINK); // Flower 3

        g.dispose();

        return image;
    }

    private static void drawSunRay(Graphics2D g, int x1, int y1, int x2, int y2) {
        g.drawLine(x1, y1, x2, y2);
    }

    private static void drawFlower(Graphics2D g, int x, int y, int petalWidth, int petalHeight, int numPetals,
                                   Color petalColor) {
        // Draw stem
        g.setColor(Color.GREEN);
        g.fillRect(x + 4, y + 20, 3, 40);

        // Draw petals
        g.setColor(petalColor);
        double angleIncrement = 2 * Math.PI / numPetals;
        AffineTransform originalTransform = g.getTransform();
        for (int i = 0; i < numPetals; i++) {
            AffineTransform at = new AffineTransform();
            at.rotate(i * angleIncrement, x + petalWidth / 2, y + petalHeight / 2);
            g.setTransform(at);
            g.fillOval(x, y, petalWidth, petalHeight);
        }
        g.setTransform(originalTransform);
    }
}