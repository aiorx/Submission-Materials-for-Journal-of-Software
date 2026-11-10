package mainApp;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

/**
 * This class "Obstacle" represents the platforms/barriers that the
 * player sees on each level. It is loaded in from the input file
 * and it displays a obstacle that is of short, medium, or long
 * length. This images were Aided using common development resources and edited by hand.
 */
public class Obstacle extends GameObject {
    private BufferedImage obstacleImage;
    private static final int HEIGHT = 18;

    public Obstacle() {
        try {
            obstacleImage = ImageIO.read(new File("./images/platform_short.png"));
        } catch (IOException e) {
            System.err.println("Can't be loaded.");
            e.printStackTrace();
        }
    }

    public Obstacle(int input) {
        this.width = input;
        this.height = HEIGHT;
        try {
            obstacleImage = ImageIO.read(chooseImage());
        } catch (IOException e) {
            System.err.println("Can't be loaded.");
            e.printStackTrace();
        }
    }

    @Override
    public void drawOn(Graphics2D g) {
        if (obstacleImage != null) {
            g.drawImage(obstacleImage, centerX, centerY, width, height, null);
        }
    }

    /**
     * This switch case method determines the image to be used for this obstacle
     * based upon its assigned width.
     * 
     * @return image
     */
    private File chooseImage() {
        switch (this.width) {
            case (200):
                return new File("./images/platform_short.png");
            case (300):
                return new File("./images/platform_medium.png");
            case (400):
                return new File("./images/platform_long.png");
            default:
                return null;
        }
    }

    @Override
    public boolean collides(GameObject hero) {
        ((Hero) hero).collidesBarrier(this);
        return false;
    }

}