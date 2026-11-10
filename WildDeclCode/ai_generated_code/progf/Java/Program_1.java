package co.instil.ryana.diamonds.copilotsonnet;

/* Supported via standard GitHub programming aids - Sonnet 3.7
 * Using the instructions from .github/copilot-instructions.md
 * and resources/diamond-prompt.md
 * I've manually moved it into the copilotsonnet package
 */

import java.util.Scanner;

public class Program {
    public static void main(String[] args) {
        DiamondDrawer drawer = new DiamondDrawer();
        InputHandler handler = new InputHandler(new Scanner(System.in));
        
        drawer.runDrawingLoop(handler);
    }
}
