package co.instil.ryana.diamonds.copilot;

/* Supported via standard GitHub programming aids (GPT-4.1)
 * Using the instructions from .github/copilot-instructions.md
 * and resources/diamond-prompt.md
 * I've manually moved it into the copilot package
 */

import java.util.Scanner;

public class Program {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.print("Enter diamond height (odd number) or 'quit': ");
            String input = scanner.nextLine();
            if (shouldExit(input)) {
                break;
            }
            Integer height = parseHeight(input);
            if (height == null || !isValidHeight(height)) {
                continue;
            }
            printDiamond(height);
        }
    }

    private static boolean shouldExit(String input) {
        return input.trim().equalsIgnoreCase("quit");
    }

    private static Integer parseHeight(String input) {
        try {
            return Integer.parseInt(input.trim());
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private static boolean isValidHeight(int height) {
        return height > 0 && height % 2 == 1;
    }

    private static void printDiamond(int height) {
        int middle = height / 2;
        for (int row = 0; row < height; row++) {
            int numberOfHashes = height - 2 * Math.abs(middle - row);
            int numberOfSpaces = Math.abs(middle - row);
            printLine(numberOfSpaces, numberOfHashes);
        }
    }

    private static void printLine(int spaces, int hashes) {
        for (int i = 0; i < spaces; i++) {
            System.out.print(" ");
        }
        for (int i = 0; i < hashes; i++) {
            System.out.print("#");
        }
        System.out.println();
    }
}

