package mainApp;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Random;

import javax.imageio.ImageIO;
/**
 * This class "Obstacle" represents the platforms/barriers that the
 * player sees on each level. It is loaded in from the input file
 * and it displays a obstacle that is of short, medium, or long
 * length. This images were Supported via standard programming aids and edited by hand.
 */
public class Wood extends GameObject {
    // Specific properties for Obstacle could be added here
	private BufferedImage woodObject;
	private static final int RADIUS = 75;
	private Random random = new Random();

   
    public Wood() {
    	this.width = RADIUS;
    	this.height = RADIUS;
    	 try {
             woodObject = ImageIO.read(new File("./images/wood.png"));
         } catch (IOException e) {
             System.err.println("Can't be loaded.");
             e.printStackTrace();
         }
    }
    

	@Override
    public void drawOn(Graphics2D g) {
		if (woodObject != null) {
            g.drawImage(woodObject, centerX, centerY, width, height, null);
        }
    }
	
    public void randomPosition() {
        this.centerX = random.nextInt(GameViewer.FRAME_WIDTH - RADIUS - 350);
        this.centerY = random.nextInt(GameViewer.FRAME_HEIGHT - RADIUS-100);
    }
    
    public void update(Hero h) {
		if(this.collides(h)) {
			this.centerX = h.centerX;
			this.centerY = h.centerY;
			h.hasWood = true;
			h.setWood(this);
		}
		
	}
	
	public void setY(int y) {
		this.centerY = y;
	}


	public void setX(int x) {
		this.centerX = x;
	}
}