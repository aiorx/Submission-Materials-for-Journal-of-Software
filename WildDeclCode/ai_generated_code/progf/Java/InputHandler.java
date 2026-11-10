package co.instil.ryana.diamonds.copilotsonnet;

/* Supported via standard GitHub programming aids - Sonnet 3.7
 * Using the instructions from .github/copilot-instructions.md
 * and resources/diamond-prompt.md
 * I've manually moved it into the copilotsonnet package
 */

import java.util.Scanner;

public class InputHandler {
    private final Scanner scanner;
    
    public InputHandler(Scanner scanner) {
        this.scanner = scanner;
    }
    
    public String promptForHeight() {
        System.out.print("Enter diamond height (odd number) or 'quit' to exit: ");
        return scanner.nextLine().trim();
    }
}
