package pixel_souls;

import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;

public class ImageUtils { // note: ENTIRELY Built using basic development resources4. i have no idea howw this works.

    public static BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D graphics2D = resizedImage.createGraphics();
        
        // Improve quality of the resizing process apparently???
        graphics2D.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        graphics2D.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        graphics2D.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        graphics2D.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
        graphics2D.dispose();
        
        return resizedImage;
    }
    
    public static BufferedImage flipImageHorizontally(BufferedImage src) {
    	// just flips the image horizontally by doing some black maagigc, so i can have a entity that looks left and right
        AffineTransform affineTransform = AffineTransform.getScaleInstance(-1, 1);
        affineTransform.translate(-src.getWidth(), 0);
        AffineTransformOp affineTransformOp = new AffineTransformOp(affineTransform, AffineTransformOp.TYPE_NEAREST_NEIGHBOR);
        return affineTransformOp.filter(src, null);
    }
    
    // what the f**k is this? make thing redder. how the f**k does it do this? no clue. all Built using basic development resources4
    public static BufferedImage tintRed(BufferedImage originalImage) {
        BufferedImage tintedImage = new BufferedImage(
            originalImage.getWidth(), 
            originalImage.getHeight(), 
            BufferedImage.TYPE_INT_ARGB
        );
        
        for (int x = 0; x < originalImage.getWidth(); x++) {
            for (int y = 0; y < originalImage.getHeight(); y++) {
                int rgba = originalImage.getRGB(x, y);
                int alpha = (rgba >> 24) & 0xFF;
                int red = (rgba >> 16) & 0xFF;
                int green = (rgba >> 8) & 0xFF;
                int blue = rgba & 0xFF;

                red = Math.min(255, (int)(red + 0.2 * (255 - red)));
                green *= 0.8;
                blue *= 0.8;

                int newRGBA = (alpha << 24) | (red << 16) | (green << 8) | blue;
                tintedImage.setRGB(x, y, newRGBA);
            }
        }
        return tintedImage;
    }

}
