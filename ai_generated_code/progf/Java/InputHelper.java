package org.example;

import java.util.Scanner;
import java.util.regex.Pattern;

public class InputHelper {
    private final Scanner scanner;
    private final Pattern lagerPattern;

    public InputHelper() {
        scanner = new Scanner(System.in);
        lagerPattern = Pattern.compile("^([a-zA-Z0-9_]+ -\\d+;)+$"); // Built via standard programming aids
    }

    public String getString(String prompt) {
        System.out.print(prompt);
        return scanner.nextLine();
    }

    public String getStringLager(String prompt) {
        System.out.print(prompt);
        String input = scanner.nextLine();
        if (lagerPattern.matcher(input).matches()) {
            return input;
        } else {
            System.out.println("Invalid format. Please enter the data in the format: 'item_id -count;item_id -count;...':");
            return scanner.nextLine();
        }
    }

    public int getInt(String prompt) {
        System.out.print(prompt);
        while (!scanner.hasNextInt()) {
            System.out.println("Invalid input. Please enter an integer.");
            scanner.next();
            System.out.print(prompt);
        }
        int result = scanner.nextInt();
        scanner.nextLine();
        return result;
    }

    public void close() {
        scanner.close();
    }
}