package edu.ntnu.idi.idatt.presentation;

import edu.ntnu.idi.idatt.domain.Recipe;
import edu.ntnu.idi.idatt.domain.Unit;
import edu.ntnu.idi.idatt.service.FoodManagementService;
import edu.ntnu.idi.idatt.utils.InputHandler;
import edu.ntnu.idi.idatt.utils.Result;
import java.time.LocalDate;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Represents the user interface of the application, allowing the user to
 * manage ingredients in the fridge and recipes in the cookbook.
 *
 * <p>Provides methods to display the main menu, handle user input, and execute
 * operations based on the user's choice.</p>
 *
 * @author Gilianne Reyes
 * @version 1.3
 * @since 1.0
 */
public class UserInterface {
  // ingredientHeader was Assisted with basic coding tools.
  private final String ingredientHeader = String.format(
      "+--------------------+-----------------+-----------------+"
          + "--------------------+--------------------+-----------------+%n"
          + "| %-18s | %-15s | %-15s | %-18s | %-18s | %-15s |%n"
          + "+--------------------+-----------------+-----------------+"
          + "--------------------+--------------------+-----------------+%n",
      "Name", "Quantity", "Unit", "Expiry Date ", "Price/Unit", "Total Price"
  );
  private final LinkedHashMap<Integer, Map<String, Runnable>> menu = new LinkedHashMap<>();
  private InputHandler inputHandler;
  private FoodManagementService foodManagementService;

  {
    menu.put(1, Map.of("Add ingredient", this::handleAddIngredientToFridge));
    menu.put(2, Map.of("Remove ingredient", this::handleRemoveIngredientFromFridge));
    menu.put(3, Map.of("Find ingredient", this::handleFindIngredient));
    menu.put(4, Map.of("Show expiring ingredients", this::handleExpiringIngredients));
    menu.put(5, Map.of("Show value of ingredients in fridge", this::displayFridgeValue));
    menu.put(6, Map.of("Show all ingredients", this::handleDisplaySortedIngredients));
    menu.put(7, Map.of("Add recipe", this::handleAddRecipeToCookbook));
    menu.put(8, Map.of("Show suggested recipes", this::handleDisplaySuggestedRecipes));
    menu.put(9, Map.of("Check recipe availability", this::handleRecipeAvailability));
    menu.put(10, Map.of("Show all recipes", this::displayAllRecipes));
  }

  /**
   * Starts the application by displaying the main menu and handling user input
   * until the user chooses to exit the application.
   */
  public void start() {
    init();
    System.out.println("Welcome to the Food Management Application!");
    boolean exit = false;
    while (!exit) {
      displayMenu();
      int choice = inputHandler.readInt("\nPlease choose an option: ");
      if (choice == menu.size() + 1) {
        System.out.println("Exiting the application...");
        inputHandler.close();
        exit = true;
      } else {
        handleMenuChoice(choice);
      }
    }
  }

  /**
   * Initializes the application by instantiating {@link InputHandler}
   * and {@link FoodManagementService}, and populating the fridge and cookbook with initial data.
   */
  private void init() {
    try {
      inputHandler = new InputHandler();
      foodManagementService = new FoodManagementService();
      foodManagementService.populateFridgeAndCookbook();
    } catch (Exception e) {
      System.out.println("Failed to initialize the application: " + e.getMessage());
    }
  }

  /**
   * Displays the main menu with options for managing ingredients and recipes.
   * <strong>This method was Assisted with basic coding tools.</strong>
   */
  private void displayMenu() {
    Iterator<Map.Entry<Integer, Map<String, Runnable>>> iterator = menu.entrySet().iterator();
    System.out.println("\n------------------------------- MENU ---------------------------------");

    while (iterator.hasNext()) {
      Map.Entry<Integer, Map<String, Runnable>> currentEntry = iterator.next();
      Integer currentNumber = currentEntry.getKey();
      String currentOptionName = currentEntry.getValue().keySet().iterator().next();

      if (iterator.hasNext()) {
        Map.Entry<Integer, Map<String, Runnable>> nextEntry = iterator.next();
        Integer nextNumber = nextEntry.getKey();
        String nextOptionName = nextEntry.getValue().keySet().iterator().next();
        System.out.printf("[%d] %-40s [%d] %-40s\n",
            currentNumber, currentOptionName, nextNumber, nextOptionName);
      } else {
        System.out.printf("[%d] %-40s\n", currentNumber, currentOptionName);
      }
    }

    System.out.printf("[%d] %-40s\n", menu.size() + 1, "Exit");
    System.out.println("______________________________________________________________________");
  }

  /**
   * Handles the user's choice from the menu by
   * executing the corresponding operation.
   *
   * @param choice is the user's choice from the menu.
   */
  private void handleMenuChoice(int choice) {
    boolean isValidChoice = choice >= 1 && choice <= menu.size();
    if (!isValidChoice) {
      System.out.printf("Invalid choice. Please enter a number from 1 to %d.%n", menu.size());
    } else {
      menu.get(choice).values().iterator().next().run();
      inputHandler.readEnter("\nPress enter to go back to menu...");
    }
  }

  /**
   * Prompts the user for name, quantity, unit, price per unit, and expiry date of an ingredient,
   * and attempts to add it to the fridge. Displays the result of the operation.
   */
  private void handleAddIngredientToFridge() {
    System.out.println("\nYou are now adding an ingredient to the fridge.");
    String name = inputHandler.readString("\nEnter ingredient name: ");
    double quantity = inputHandler.readDouble("\nEnter ingredient quantity: ");
    Unit unit = inputHandler.readUnit("\nEnter the number to the ingredient's unit: ");
    double pricePerUnit = inputHandler.readDouble("\nEnter ingredient's price per unit: ");
    LocalDate expiryDate = inputHandler.readDate(
        "\nEnter the expiry date in this format 'yyyy/MM/dd': "
    );
    displayResult(foodManagementService.addIngredientToFridge(
        name, quantity, pricePerUnit, unit, expiryDate)
    );
  }

  /**
   * Prompts the user for name, quantity, unit and expiry date of
   * an ingredient to remove from the fridge, and attempts to remove it.
   * Displays the result of the operation.
   */
  private void handleRemoveIngredientFromFridge() {
    System.out.println("\nYou are now removing an ingredient from the fridge.");
    String name = inputHandler.readString("\nEnter ingredient name: ");
    displayResult(foodManagementService.findIngredient(name), ingredientHeader);
    if (foodManagementService.findIngredient(name).isSuccess()) {
      double quantity = inputHandler.readDouble("\nEnter quantity to remove: ");
      Unit unit = inputHandler.readUnit("\nEnter the number of the unit to remove: ");
      LocalDate expiryDate = inputHandler.readDate(
          "\nEnter the expiry date of the ingredient in this format 'yyyy/MM/dd': "
      );
      displayResult(foodManagementService.removeIngredientFromFridge(
          name, unit, quantity, expiryDate)
      );
    }
  }

  /**
   * Prompts the user for an ingredient name to search for in the fridge.
   * Displays the result of the search operation.
   */
  private void handleFindIngredient() {
    System.out.println("\nYou chose to search for an ingredient.");
    String name = inputHandler.readString("\nEnter ingredient name: ");
    displayResult(foodManagementService.findIngredient(name), ingredientHeader);
  }

  /**
   * Prompts the user for a date and displays all ingredients expiring before that date.
   * Also displays the total value of all expiring ingredients.
   */
  private void handleExpiringIngredients() {
    System.out.println("\nYou chose to view expiring ingredients.");
    System.out.println(
        "Ingredients expiring before the date (e.g. '2024/10/28') you enter will be shown."
    );
    LocalDate expiryDate = inputHandler.readDate("\nEnter the date in this format 'yyyy/MM/dd': ");
    displayResult(
        foodManagementService.findIngredientsExpiringBefore(expiryDate), ingredientHeader
    );
    displayResult(foodManagementService.calculateExpiringValueByDate(expiryDate));
  }

  /**
   * Displays the total value of ingredients in the fridge.
   */
  private void displayFridgeValue() {
    displayResult(foodManagementService.calculateFridgeValue());
  }

  /**
   * Displays all ingredients in the fridge sorted alphabetically by name.
   * Also displays the total value of ingredients in the fridge.
   */
  private void handleDisplaySortedIngredients() {
    displayResult(foodManagementService.findSortedIngredients(), ingredientHeader);
    displayFridgeValue();
  }

  /**
   * Prompts the user for a recipe name, description, instruction and ingredients,
   * and attempts to add the recipe to the cookbook. Displays the result of the operation.
   */
  private void handleAddRecipeToCookbook() {
    System.out.println("\nYou chose to add a recipe to the cookbook.");
    String name = inputHandler.readString("\nEnter recipe name: ");
    String description = inputHandler.readString("\nEnter recipe description: ");
    String instruction = inputHandler.readString("\nEnter recipe instruction: ");

    Result<Recipe> result = foodManagementService.createRecipe(name, description, instruction);

    if (result.isSuccess()) {
      result.getData().ifPresent(recipe -> {
        handleRecipeIngredientAddition(recipe);
        displayResult(foodManagementService.addRecipe(recipe));
      });
    } else {
      displayResult(result);
    }
  }

  /**
   * Prompts the user to add ingredients to a recipe continuously until the user chooses to stop.
   *
   * @param recipe is the recipe to add ingredients to.
   */
  private void handleRecipeIngredientAddition(Recipe recipe) {
    System.out.printf(
        "\nAdding ingredients to recipe '%s'. Continue until done.%n", recipe.getName()
    );
    do {
      addIngredientToRecipe(recipe);
    } while (inputHandler.readYes("Continue adding ingredients?"));
  }

  /**
   * Prompts the user for an ingredient name, quantity, and unit to add to a recipe.
   * Displays the result of the operation.
   *
   * @param recipe is the recipe to add the ingredient to.
   */
  private void addIngredientToRecipe(Recipe recipe) {
    String name = inputHandler.readString("\nEnter the ingredient's name: ");
    double quantity = inputHandler.readDouble("\nEnter the ingredient's quantity: ");
    Unit unit = inputHandler.readUnit("\nEnter the number of the ingredient's unit: ");
    displayResult(foodManagementService.addIngredientToRecipe(recipe, name, quantity, unit));
  }

  /**
   * Displays the suggested recipes based on the ingredients in the fridge.
   */
  private void handleDisplaySuggestedRecipes() {
    displayResult(foodManagementService.findSuggestedRecipes());
  }

  /**
   * Prompts the user for a recipe name and checks if the recipe is available.
   * Displays the result of the operation.
   */
  private void handleRecipeAvailability() {
    System.out.println("\nYou chose to check if a recipe is available.");
    String name = inputHandler.readString("\nEnter the recipe's name: ");
    displayResult(foodManagementService.verifyRecipeAvailability(name));
  }

  /**
   * Displays all recipes in the cookbook.
   */
  private void displayAllRecipes() {
    displayResult(foodManagementService.findAllRecipes());
  }

  /**
   * Displays the result in the console in a string representation.
   *
   * @param result is the result object that contains the operation's result.
   * @param <T>    is the type of the data in the result.
   */
  private <T> void displayResult(Result<T> result) {
    displayResult(result, "");
  }

  /**
   * Displays the result in the console in a string representation, including a header.
   *
   * @param result is the result object that contains the operation's result.
   * @param header is the header to display.
   * @param <T> is the type of the data in the result.
   */
  private <T> void displayResult(Result<T> result, String header) {
    System.out.println("\n" + result.getMessage() + "\n");
    if (result.isSuccess() && !header.isBlank()) {
      System.out.print(header);
    }
    result.getData().ifPresent(this::displayData);
  }

  /**
   * Displays the data in the console. If the data is an iterable,
   * it will display each element on a new line.
   * <strong>This method was Assisted with basic coding tools.</strong>
   *
   * @param data is the data to display.
   * @param <T> is the type of the data.
   */
  private <T> void displayData(T data) {
    if (data instanceof Iterable<?> iterable) {
      iterable.forEach(System.out::println);
    } else {
      System.out.println(data);
    }
  }
}

