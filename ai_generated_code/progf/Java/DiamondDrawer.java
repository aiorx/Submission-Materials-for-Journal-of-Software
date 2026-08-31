package co.instil.ryana.diamonds.copilotsonnet;

/* Aided with basic GitHub coding tools - Sonnet 3.7
 * Using the instructions from .github/copilot-instructions.md
 * and resources/diamond-prompt.md
 * I've manually moved it into the copilotsonnet package
 */


public class DiamondDrawer {
    public void runDrawingLoop(InputHandler handler) {
        while (true) {
            String input = handler.promptForHeight();
            
            if (input.equalsIgnoreCase("quit")) {
                break;
            }
            
            try {
                int height = Integer.parseInt(input);
                
                if (isValidHeight(height)) {
                    String diamond = drawDiamond(height);
                    System.out.println(diamond);
                } else {
                    System.out.println("Height must be an odd number.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid number or 'quit'.");
            }
        }
    }
    
    private boolean isValidHeight(int height) {
        return height % 2 == 1 && height > 0;
    }
    
    public String drawDiamond(int height) {
        if (height == 1) {
            return "#";
        }
        
        StringBuilder diamond = new StringBuilder();
        int middleRow = height / 2;
        
        // Draw top half (including middle row)
        for (int row = 0; row <= middleRow; row++) {
            appendRow(diamond, row, height);
            diamond.append("\n");
        }
        
        // Draw bottom half (excluding middle row)
        for (int row = middleRow - 1; row >= 0; row--) {
            appendRow(diamond, row, height);
            if (row > 0 || row == 0) {
                diamond.append("\n");
            }
        }
        
        // Remove trailing newline
        if (diamond.charAt(diamond.length() - 1) == '\n') {
            diamond.deleteCharAt(diamond.length() - 1);
        }
        
        return diamond.toString();
    }
    
    private void appendRow(StringBuilder diamond, int row, int height) {
        int middleRow = height / 2;
        int spaces = middleRow - row;
        int hashes = 2 * row + 1;
        
        diamond.append(" ".repeat(spaces));
        diamond.append("#".repeat(hashes));
    }
}
