package edu.ntnu.idi.idatt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import edu.ntnu.idi.idatt.domain.Fridge;
import edu.ntnu.idi.idatt.domain.Ingredient;
import edu.ntnu.idi.idatt.domain.Unit;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/**
 * Unit tests for the {@link Fridge} class.
 *
 * <br><b>Positive Tests:</b>
 * <ul>
 *   <li>Adds a valid ingredient to the fridge.</li>
 *   <li>Adds a duplicate ingredient and ensures that the
 *       existing ingredient's quantity is increased instead.</li>
 *   <li>Finds an ingredient by name regardless of case or surrounding whitespace.</li>
 *   <li>Decreases an ingredient's quantity by valid amounts and
 *       removes ingredients if their quantity becomes zero.</li>
 *   <li>Finds the ingredients expiring before a specified date.</li>
 *   <li>Sorts the ingredients alphabetically.</li>
 *   <li>Calculates the correct total price of all ingredients.</li>
 * </ul>
 *
 * <br><b>Negative Tests:</b>
 * <ul>
 *   <li>Adds a {@code null} ingredient.</li>
 *   <li>Decreases the quantity of a non-existent ingredient.</li>
 *   <li>Decreases the quantity with an amount that
 *       results in a negative quantity for the ingredient.</li>
 *   <li>Decreases an ingredient's quantity with a negative amount.</li>
 *   <li>Decreases an ingredient's quantity with a {@code null} unit.</li>
 *   <li>Finds a non-existent ingredient by name.</li>
 *   <li>Sorts ingredients when the fridge is empty.</li>
 *   <li>Calculates the total price of ingredients when the fridge is empty.</li>
 * </ul>
 *
 * <strong>This class-level documentation was Assisted with basic coding tools.</strong>
 */
public class FridgeTest {
  private Fridge fridge;
  private Ingredient egg;
  private Ingredient solidButter;

  /**
   * Set up the fridge and ingredients before each test.
   */
  @BeforeEach
  void setUp() {
    fridge = new Fridge();
    solidButter = new Ingredient(
        "Butter", 0.5, 10, Unit.KILOGRAM, LocalDate.now().plusDays(5)
    );
    egg = new Ingredient(
        "Egg", 12, 3, Unit.PIECE, LocalDate.now().plusDays(20)
    );
    fridge.addIngredient(egg);
    fridge.addIngredient(solidButter);
  }

  // --------------------------- POSITIVE TESTS ----------------------------------

  /**
   * Test adding new ingredients with valid fields to the fridge.
   *
   * <p>Expected outcome: The ingredients should be added as new objects as they do not match
   * any existing ingredients in the fridge.</p>
   */
  @Test
  void testAddNewValidIngredient() {
    // New ingredient - same name, different unit type
    Ingredient meltedButter = new Ingredient(
        "Butter", 0.3, 10, Unit.LITRE, LocalDate.now().plusDays(5)
    );
    fridge.addIngredient(meltedButter);
    assertTrue(fridge.getIngredients().contains(meltedButter));

    // New ingredient, same name, different expiry date
    Ingredient solidButterWithDiffExpiry = new Ingredient(
        "Butter", 0.3, 10, Unit.KILOGRAM, LocalDate.now().plusDays(22)
    );
    fridge.addIngredient(solidButterWithDiffExpiry);
    assertTrue(fridge.getIngredients().contains(solidButterWithDiffExpiry));
  }

  /**
   * Test adding ingredients that matches an existing ingredient in the fridge.
   * Ingredients matching means they have the same name, price per unit, expiry date
   * and the units are compatible.
   *
   * <p>Expected outcome: The existing ingredient's quantity should be
   * increased by the quantities of the new ingredients.</p>
   */
  @Test
  void testAddDuplicateIngredient() {
    Ingredient solidButter2 = new Ingredient(
        "BUTTER", 0.5, 10, Unit.KILOGRAM, LocalDate.now().plusDays(5)
    );
    fridge.addIngredient(solidButter2);
    assertFalse(fridge.getIngredients().contains(solidButter2));

    Ingredient solidButter3 = new Ingredient(
        "Butter   ", 500, 0.01, Unit.GRAM, LocalDate.now().plusDays(5)
    );
    fridge.addIngredient(solidButter3);
    assertFalse(fridge.getIngredients().contains(solidButter3));

    assertEquals(1.5, solidButter.getQuantity());
  }

  /**
   * Test removing a valid amount of an ingredient from the fridge.
   * Expected outcome: The ingredient's quantity should be decreased by the specified amount.
   */
  @Test
  void testRemoveValidQuantityOfIngredient() {
    // Add another ingredient called "Butter" to the fridge
    Ingredient meltedButter = new Ingredient(
        "Butter", 0.3, 10, Unit.LITRE, LocalDate.now().plusDays(5)
    );
    fridge.addIngredient(meltedButter);

    // Remove quantities of solid butter from the fridge
    fridge.removeIngredient("Butter", 100, Unit.GRAM, LocalDate.now().plusDays(5));
    assertEquals(0.4, solidButter.getQuantity());
    fridge.removeIngredient("Butter", 0.2, Unit.KILOGRAM, LocalDate.now().plusDays(5));
    assertEquals(0.2, solidButter.getQuantity());

    assertEquals(0.3, meltedButter.getQuantity()); // Unchanged
  }

  /**
   * Test removing all of an ingredient from the fridge.
   * Expected outcome: The ingredient should be removed from the fridge's list of ingredients.
   */
  @Test
  void testRemoveAllQuantityOfIngredient() {
    fridge.removeIngredient("Butter", 500, Unit.GRAM, LocalDate.now().plusDays(5));
    assertEquals(0, solidButter.getQuantity());
    assertFalse(fridge.getIngredients().contains(solidButter));
  }

  /**
   * Test finding ingredients by name regardless of case or surrounding whitespace.
   *
   * <p>Expected outcome: The search should return all ingredients that match the name
   * regardless of case or surrounding whitespace.</p>
   */
  @Test
  void testFindExistingIngredientsByName() {
    Ingredient meltedButter = new Ingredient(
        "Butter", 0.3, 10, Unit.LITRE, LocalDate.now().plusDays(5)
    );
    fridge.addIngredient(meltedButter);

    List<Ingredient> searchWithCaps = fridge.findIngredientsByName("BUTTeR");
    assertTrue(searchWithCaps.contains(solidButter));
    assertTrue(searchWithCaps.contains(meltedButter));

    List<Ingredient> searchWithWhitespace = fridge.findIngredientsByName("  Butter  ");
    assertTrue(searchWithWhitespace.contains(solidButter));
    assertTrue(searchWithWhitespace.contains(meltedButter));
  }

  /**
   * Test retrieving ingredients that expire before a specified date.
   * Expected outcome: The ingredients should be retrieved if they expire before the specified date.
   */
  @Test
  void testFindExpiringIngredientsBeforeDate() {
    // Ingredients expiring 10 months from now (expected: all ingredients)
    List<Ingredient> foundIngredients = fridge.findExpiringIngredientsBeforeDate(
        LocalDate.now().plusMonths(10)
    );
    assertEquals(2, foundIngredients.size());
    assertTrue(foundIngredients.contains(egg));
    assertTrue(foundIngredients.contains(solidButter));

    // Ingredients expiring 6 days from now (expected: butter)
    foundIngredients = fridge.findExpiringIngredientsBeforeDate(
        LocalDate.now().plusDays(6)
    );
    assertEquals(1, foundIngredients.size());
    assertTrue(foundIngredients.contains(solidButter));

    // Ingredients expiring 1 day from now (expected: none)
    foundIngredients = fridge.findExpiringIngredientsBeforeDate(
        LocalDate.now().plusDays(1)
    );
    assertTrue(foundIngredients.isEmpty());
  }

  /**
   * Test sorting the ingredients in the fridge alphabetically.
   *
   * <p>Expected outcome: The ingredients should be sorted in ascending order by name.</p>
   */
  @Test
  void testFindSortedIngredients() {
    Ingredient apple = new Ingredient(
        "Apple", 1, 20, Unit.KILOGRAM, LocalDate.now().plusDays(10)
    );
    fridge.addIngredient(apple);

    List<Ingredient> sortedIngredients = fridge.findSortedIngredients();
    assertEquals(apple, sortedIngredients.get(0));
    assertEquals(solidButter, sortedIngredients.get(1)); // stored with name "Butter"
    assertEquals(egg, sortedIngredients.get(2));
  }

  /**
   * Test calculating the total price of all the ingredients in the fridge.
   *
   * <p>Expected outcome: The total price of all the ingredients should be calculated correctly.</p>
   */
  @Test
  void testCalculateTotalPrice() {
    double eggPrice = egg.getPrice();
    double butterPrice = solidButter.getPrice();
    assertEquals(eggPrice + butterPrice, fridge.calculateTotalValue());
  }

  /**
   * Test calculating the total price of all the ingredients in the
   * fridge that expire before a specified date.
   *
   * <p>Expected outcome: The total price of all the expiring
   * ingredients should be calculated correctly.</p>
   */
  @Test
  void testCalculateExpiringValueByDate() {
    double eggPrice = egg.getPrice();
    double butterPrice = solidButter.getPrice();
    assertEquals(
        eggPrice + butterPrice, fridge.calculateExpiringValueByDate(LocalDate.now().plusMonths(10))
    );
    assertEquals(
        butterPrice, fridge.calculateExpiringValueByDate(LocalDate.now().plusDays(6))
    );
    assertEquals(
        0, fridge.calculateExpiringValueByDate(LocalDate.now().plusDays(1))
    );
  }

  // --------------------------- NEGATIVE TESTS ----------------------------------
  /**
   * Test adding a {@code null} ingredient to the fridge.
   * Expected outcome: An IllegalArgumentException should be thrown.
   */
  @Test
  void testAddNullIngredient() {
    assertThrows(IllegalArgumentException.class, () -> fridge.addIngredient(null));
  }

  /**
   * Test removing a non-existent ingredient from the fridge.
   * Expected outcome: An IllegalArgumentException should be thrown,
   * and the fridge should not be updated.
   */
  @Test
  void testRemoveNonExistentIngredient() {
    assertThrows(IllegalArgumentException.class, () ->
        fridge.removeIngredient("NON-EXISTENT", 1, Unit.KILOGRAM, LocalDate.now().plusDays(10))
    );
  }

  /**
   * Test removing an invalid quantity of an ingredient from the fridge.
   * Expected outcome: An IllegalArgumentException should be thrown,
   * and the fridge should not be updated.
   */
  @Test
  void testRemoveInvalidQuantityOfIngredient() {
    // Null unit
    assertThrows(IllegalArgumentException.class, () ->
        fridge.removeIngredient("Butter", 0.5, null, LocalDate.now().plusDays(5))
    );
    // Negative quantity
    assertThrows(IllegalArgumentException.class, () ->
        fridge.removeIngredient("Butter", -1, Unit.KILOGRAM, LocalDate.now().plusDays(5))
    );
    // Would result in negative quantity
    assertThrows(IllegalArgumentException.class, () ->
        fridge.removeIngredient("Butter", 1, Unit.KILOGRAM, LocalDate.now().plusDays(5))
    );
    // Wrong expiry date
    assertThrows(IllegalArgumentException.class, () ->
        fridge.removeIngredient("Butter", 0.5, Unit.KILOGRAM, LocalDate.now().minusDays(10))
    );

    assertEquals(0.5, solidButter.getQuantity());
  }

  @Test
  void testRemoveQuantityOfNonExistentIngredient() {
    assertThrows(IllegalArgumentException.class, () ->
        fridge.removeIngredient("NON-EXISTENT", 1, Unit.KILOGRAM, LocalDate.now().plusDays(10))
    );
  }

  /**
   * Test finding a non-existent ingredient by name.
   * Expected outcome: The search should return an empty {@code Optional}.
   */
  @Test
  void testFindNonExistentIngredientByName() {
    assertTrue(fridge.findIngredientsByName("NON-EXISTENT").isEmpty());
  }
}
