package edu.ntnu.idi.idatt.utils;

import edu.ntnu.idi.idatt.domain.Unit;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Scanner;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * A utility class to handle user input from the console.
 *
 * <p>Provides methods to read strings, integers, doubles, dates, units of measurement,
 * and other types of input from the console.</p>
 *
 * @author Gilianne Reyes
 * @version 1.2
 * @since 1.1
 */
public class  InputHandler {
  private final Scanner scanner;

  /**
   * Constructs an InputHandler instance with a new {@link Scanner} object.
   */
  public InputHandler() {
    this.scanner = new Scanner(System.in);
  }

  /**
   * Reads a string from the console. Continuously prompts the user to enter a non-empty string.
   *
   * @param prompt is the message to display to the user when asking for input.
   *
   * @return A non-empty string entered by the user.
   */
  public String readString(String prompt) {
    return readWithValidation(
      prompt,
      "Invalid input. Try again with a non-empty input.",
      input -> {
        if (input.isBlank()) {
          throw new IllegalArgumentException();
        }
        return input;
      }
    );
  }

  /**
   * Reads an integer from the console. Continuously prompts the user to enter a positive integer.
   *
   * @param prompt is the message to display to the user when asking for input.
   *
   * @return A positive integer entered by the user.
   */
  public int readInt(String prompt) {
    return readWithValidation(
        prompt,
        "Invalid input. Please enter a positive whole number.",
        input -> {
          int value = Integer.parseInt(input.trim());
          if (value <= 0) {
            throw new IllegalArgumentException();
          }
          return value;
        }
    );
  }

  /**
   * Reads a double from the console. Continuously prompts the user to enter a positive number.
   *
   * @param prompt is the message to display to the user when asking for input.
   *
   * @return A positive double entered by the user.
   */
  public double readDouble(String prompt) {
    return readWithValidation(prompt,
        "Invalid input. Please enter a positive number.",
        input -> {
          double value = Double.parseDouble(input.trim());
          if (value <= 0) {
            throw new IllegalArgumentException("Invalid input. Enter a positive number: ");
          }
          return value;
        }
    );
  }

  /**
   * Reads a date from the console. Continuously prompts the user to enter a valid date
   * in the format 'yyyy/MM/dd'.
   *
   * @param prompt is the message to display to the user when asking for input.
   *
   * @return A date entered by the user.
   */
  public LocalDate readDate(String prompt) {
    return readWithValidation(
        prompt,
        "Invalid input. Please enter a valid date in the format 'yyyy/MM/dd'.",
        input -> {
          DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
          return LocalDate.parse(input.trim(), formatter);
        }
    );
  }

  /**
   * Reads a unit from the user, chosen from a list of available units.
   *
   * @param prompt is the message to display to the user when asking for input.
   *
   * @return A unit selected by the user.
   */
  public Unit readUnit(String prompt) {
    displayUnits();
    return readWithValidation(
        prompt,
        "Invalid input. Please enter a number corresponding to a unit.",
        input -> {
          int index = Integer.parseInt(input.trim());
          return Unit.getUnitBySymbol(Unit.values()[index - 1].getSymbol());
        });
  }

  /**
   * Reads a string from the console without validation.
   *
   * @param prompt is the message to display to the user when asking for input.
   */
  public void readEnter(String prompt) {
    System.out.println(prompt);
    scanner.nextLine();
  }

  /**
   * Reads a boolean value from the user, where '1' is 'Yes' and '2' is 'No'.
   *
   * @param prompt is the message to display to the user when asking for input.
   *
   * @return {@code true} if the user enters '1' for 'Yes',
   *      {@code false} if the user enters '2' for 'No'.
   */
  public boolean readYes(String prompt) {
    return readWithValidation(
        prompt + "\n[1] Yes\n[2] No\n",
        "Invalid input. Enter '1' for 'Yes' or '2' for 'No'.",
        input -> switch (input.trim()) {
          case "1" -> true;
          case "2" -> false;
          default -> throw new IllegalArgumentException();
        });
  }

  /**
   * Closes the scanner.
   */
  public void close() {
    scanner.close();
  }

  /**
   * Displays a list of valid units in the console.
   * <strong>This method was Aided using common development resources.</strong>
   */
  private void displayUnits() {
    System.out.println("\nA list of available units of measurement:");

    Unit[] units = Unit.values();

    List<String> formattedUnits = IntStream.range(0, units.length)
        .mapToObj(i -> String.format("%d. %-10s", i + 1, units[i].getSymbol()))
        .toList();

    String output = IntStream.range(0, (formattedUnits.size() + 3) / 4)
        .mapToObj(i -> formattedUnits.stream()
            .skip(i * 4L)
            .limit(4)
            .collect(Collectors.joining(" ")))
        .collect(Collectors.joining("\n"));

    System.out.println(output);
  }

  /**
   * Reads input from the user, applies a parsing/validation function to it,
   * and retries if the input is invalid.
   *<strong>The implementation of {@code parser} in this method was Aided using common development resources.</strong>
   *
   * @param <T> The type of the value to be returned (e.g., Integer, Double, LocalDate).
   * @param prompt The message displayed to the user, asking for input.
   * @param parser A function that processes and validates the input string.
   *      It must throw an exception (e.g., {@link IllegalArgumentException}) for invalid input.
   *
   * @return A valid, parsed, and validated value of type {@code T}.
   */
  private <T> T readWithValidation(String prompt, String errorMessage, Function<String, T> parser) {
    T result = null;
    boolean isValid = false;
    do {
      System.out.print(prompt);
      try {
        result = parser.apply(scanner.nextLine().trim());
        isValid = true;
      } catch (Exception e) {
        System.out.println("\nError: " + errorMessage);
      }
    } while (!isValid);
    return result;
  }
}
