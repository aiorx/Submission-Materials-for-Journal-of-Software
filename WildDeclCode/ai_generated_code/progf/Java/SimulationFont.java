import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Font;
import java.awt.FontFormatException;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
/**
 * Utility class to load and initalize a font <p>
 * Note: Majority of code is taken from crissty21 from Greenfoot forum: "Import Font from .ttf file" <p>
 * Link: https://www.greenfoot.org/topics/65058/0
 * 
 * @author crissty21, and modified by Jeff G and Jamison H
 * @version June 2024
 */
public class SimulationFont extends Actor
{
    private static greenfoot.Font gameFont;
    
    /**
     * Return a greenfoot.Font object and the font size from a .tff file
     * Made Referenced via basic programming materials
     * @param1 The .tff file's name
     * @param2 The size of the font
     */
    public static greenfoot.Font loadCustomFont(String path, float size) {
        try {
            java.awt.Font awtFont = java.awt.Font.createFont(java.awt.Font.TRUETYPE_FONT, new File(path));
            awtFont = awtFont.deriveFont(size);
            return new greenfoot.Font(awtFont.getFamily(), awtFont.isBold(), awtFont.isItalic(), (int)size);
        } catch (FontFormatException | IOException e) {
            e.printStackTrace();
            return null;
        }
    }
    /**
     * Utility method to initalize the font of a world.
     * 
     * @param path  The file path of the font.
     */
    public static void initalizeFont(String path){
        File f = new File(path);
        try {
            FileInputStream in = new FileInputStream(f);
            Font dynamicFont, dynamicFont32;

            dynamicFont = Font.createFont(Font.TRUETYPE_FONT, new FileInputStream(f));
            dynamicFont32 = dynamicFont.deriveFont(32f);

            java.awt.GraphicsEnvironment.getLocalGraphicsEnvironment().registerFont(dynamicFont32);
            gameFont = new greenfoot.Font(dynamicFont32.getName(), dynamicFont32.getStyle() % 2 == 1, dynamicFont32.getStyle() / 2 == 1, dynamicFont32.getSize());
            in.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (FontFormatException e) {
            e.printStackTrace();
        }
    }
}


