package edu.ntnu.idi.idatt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import edu.ntnu.idi.idatt.domain.Ingredient;
import edu.ntnu.idi.idatt.domain.Unit;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/**
 * Unit tests for the {@link Ingredient} class.
 *
 * <br><b>Positive Tests:</b>
 * <ul>
 *   <li>Creates an Ingredient instance with valid fields</li>
 *   <li>Calculates the correct total price based on price per unit and quantity</li>
 *   <li>Correctly decreases the ingredient's quantity with valid amounts</li>
 *   <li>Correctly increases the ingredient's quantity with valid amounts</li>
 *   <li>Correctly identifies expired and non-expired ingredients</li>
 *   <li>Correctly matches compatible ingredients</li>
 * </ul>
 *
 * <br><b>Negative Tests:</b>
 * <ul>
 *   <li>Throws an exception for invalid names (e.g., blank, empty, or null)</li>
 *   <li>Throws an exception for invalid quantities (e.g., negative values)</li>
 *   <li>Throws an exception for invalid price per unit (e.g., negative values)</li>
 *   <li>Throws an exception for invalid units (e.g., null)</li>
 *   <li>Throws an exception for invalid expiry dates (e.g., null)</li>
 *   <li>Throws an exception for invalid decrease operations:
 *       <ul>
 *         <li>Negative amounts</li>
 *         <li>Amounts exceeding available quantity</li>
 *         <li>Incompatible units</li>
 *       </ul>
 *   </li>
 *   <li>Throws an exception for invalid increase operations (e.g., negative amounts)</li>
 *   <li>Throws an exception when matching an ingredient with a {@code null} value</li>
 * </ul>
 *
 * <strong> This class-level documentation was Supported via standard programming aids. </strong>
 */
public class IngredientTest {
  private Ingredient meat;
  private Ingredient flour;

  /**
   * Set up the ingredients before each test.
   */
  @BeforeEach
  public void setUp() {
    meat = new Ingredient("Meat", 5, 50, Unit.KILOGRAM, LocalDate.now().plusDays(10));
    flour = new Ingredient("Flour", 5, Unit.KILOGRAM);
  }

  // --------------------------- POSITIVE TESTS ----------------------------------

  /**
   * Test creating an ingredient with a valid name, quantity, price per unit, unit and expiry date.
   *
   * <p>Expected outcome: The ingredient is created successfully.</p>
   */
  @Test
  void testValidConstructorWithAllFields() {
    assertEquals("Meat", meat.getName());
    assertEquals(5, meat.getQuantity());
    assertEquals(50, meat.getPricePerUnit());
    assertEquals(Unit.KILOGRAM, meat.getUnit());
    assertEquals(LocalDate.now().plusDays(10), meat.getExpiryDate());
  }

  /**
   * Test decreasing the ingredient's quantity with a valid amount - a positive amount
   * that is less than the current quantity and has a compatible unit.
   *
   * <p>Expected outcome: The quantity is decreased by the specified amount.</p>
   */
  @Test
  void testDecreaseQuantityWithValidAmount() {
    // Decrease quantity with a valid amount of same unit
    meat.decreaseQuantity(0.5, Unit.KILOGRAM);
    assertEquals(4.5, meat.getQuantity());

    // Decrease quantity with a valid amount of different unit
    meat.decreaseQuantity(100, Unit.GRAM);
    assertEquals(4.4, meat.getQuantity());

    // Decrease quantity with all available quantity
    meat.decreaseQuantity(4.4, Unit.KILOGRAM);
    assertEquals(0, meat.getQuantity());
  }

  /**
   * Test increasing the ingredient's quantity with a valid amount - a positive amount
   * that has a compatible unit.
   *
   * <p>Expected outcome: The quantity is increased by the specified amount.</p>
   */
  @Test
  void testIncreaseQuantityWithValidAmount() {
    // Increase quantity with a valid amount of same unit
    meat.increaseQuantity(0.5, Unit.KILOGRAM);
    assertEquals(5.5, meat.getQuantity());

    // Increase quantity with a valid amount of different unit
    meat.increaseQuantity(100, Unit.GRAM);
    assertEquals(5.6, meat.getQuantity());
  }

  /**
   * Test isExpired with an ingredient that is expired.
   *
   * <p>Expected outcome: The method returns {@code true}.</p>
   */
  @Test
  void testIsExpiredWithExpiredIngredient() {
    Ingredient milk = new Ingredient("Milk", 2, 15, Unit.LITRE, LocalDate.now().minusDays(10));
    assertTrue(milk.isExpired());
  }

  /**
   * Test isExpired() with an ingredient that is not expired.
   *
   * <p>Expected outcome: The method returns {@code false}.</p>
   */
  @Test
  void testIsExpiredWithNotExpiredIngredient() {
    assertFalse(meat.isExpired());
  }

  /**
   * Test matching an ingredient with the same ingredient - same name, price per unit,
   * expiry date and compatible unit.
   *
   *<p>Expected outcome: The method returns {@code true}.</p>
   */
  @Test
  void testMatchesIngredientWithSameIngredient() {
    // Same ingredient, different quantity
    Ingredient meat2 = new Ingredient("Meat", 5, 50, Unit.KILOGRAM, LocalDate.now().plusDays(10));
    assertTrue(meat.matchesIngredient(meat2));

    // Same ingredient, different unit, quantity and price per unit
    Ingredient meat3 = new Ingredient("Meat", 200, 0.05, Unit.GRAM, LocalDate.now().plusDays(10));
    assertTrue(meat.matchesIngredient(meat3));
  }

  /**
   * Test matching an ingredient with a different ingredient - different name, price per unit,
   * expiry date and incompatible unit.
   *
   * <p>Expected outcome: The method returns {@code false}.</p>
   */
  @Test
  void testMatchesIngredientWithDifferentIngredient() {
    // Different name
    Ingredient milk = new Ingredient("Milk", 5, 50, Unit.KILOGRAM, LocalDate.now().plusDays(10));
    assertFalse(meat.matchesIngredient(milk));

    // Incompatible unit type
    Ingredient meat2 = new Ingredient("Meat", 2, 15, Unit.LITRE, LocalDate.now().plusDays(10));
    assertFalse(meat.matchesIngredient(meat2));

    // Different price per unit
    Ingredient meat3 = new Ingredient("Meat", 5, 100, Unit.KILOGRAM, LocalDate.now().plusDays(10));
    assertFalse(meat.matchesIngredient(meat3));

    // Different expiry date
    Ingredient meat4 = new Ingredient("Meat", 5, 50, Unit.KILOGRAM, LocalDate.now().plusDays(5));
    assertFalse(meat.matchesIngredient(meat4));
  }

  /**
   * Test creating an ingredient with a valid name, quantity and unit.
   *
   *<p>Expected outcome: The ingredient is created successfully.</p>
   */
  @Test
  void testValidConstructorWithoutPriceAndExpiryDate() {
    assertEquals("Flour", flour.getName());
    assertEquals(5, flour.getQuantity());
    assertEquals(Unit.KILOGRAM, flour.getUnit());
  }

  /**
   * Test calculating the total price of an ingredient - price per unit multiplied by quantity.
   *
   * <p>Expected outcome: The total price is calculated correctly.</p>
   */
  @Test
  void testCalculateTotalPrice() {
    assertEquals(250, meat.getPrice());
  }

  // --------------------------- NEGATIVE TESTS ----------------------------------

  /**
   * Test creating an ingredient with an invalid name, which is blank, empty or null.
   *
   *<p>Expected outcome: An {@link IllegalArgumentException} is thrown.</p>
   */
  @Test
  void testConstructorWithInvalidName() {
    assertThrows(IllegalArgumentException.class, ()
        -> new Ingredient("    ", 5, 50, Unit.KILOGRAM, LocalDate.now().plusDays(10)));
    assertThrows(IllegalArgumentException.class, ()
        -> new Ingredient("", 5, 50, Unit.KILOGRAM, LocalDate.now().plusDays(10)));
    assertThrows(IllegalArgumentException.class, ()
        -> new Ingredient(null, 5, 50, Unit.KILOGRAM, LocalDate.now().plusDays(10)));
  }

  /**
   * Test creating an ingredient with an invalid quantity, which is negative.
   *
   * <p>Expected outcome: An {@link IllegalArgumentException} is thrown.</p>
   */
  @Test
  void testConstructorWithInvalidQuantity() {
    assertThrows(IllegalArgumentException.class, ()
        -> new Ingredient("Sugar", -5, 50, Unit.KILOGRAM, LocalDate.now().plusDays(10)));
  }

  /**
   * Test creating an ingredient with an invalid price per unit, which is negative.
   *
   * <p>Expected outcome: An {@link IllegalArgumentException} is thrown.</p>
   */
  @Test
  void testConstructorWithInvalidPricePerUnit() {
    assertThrows(IllegalArgumentException.class, ()
        -> new Ingredient("Sugar", 5, -50, Unit.KILOGRAM, LocalDate.now().plusDays(10)));
    assertThrows(IllegalArgumentException.class, ()
        -> new Ingredient("Sugar", 5, 0, Unit.KILOGRAM, LocalDate.now().plusDays(10)));
  }

  /**
   * Test creating an ingredient with an invalid unit, which is null.
   *
   * <p>Expected outcome: An {@link IllegalArgumentException} is thrown.</p>
   */
  @Test
  void testConstructorWithInvalidUnit() {
    assertThrows(IllegalArgumentException.class, ()
        -> new Ingredient("Sugar", 5, 50, null, LocalDate.now().plusDays(10)));
  }

  /**
   * Test creating an ingredient with an invalid expiry date, which is null.
   *
   * <p>Expected outcome: An {@link IllegalArgumentException} is thrown.</p>
   */
  @Test
  void testConstructorWithInvalidExpiryDate() {
    assertThrows(IllegalArgumentException.class, ()
        -> new Ingredient("Sugar", 5, 50, Unit.KILOGRAM, null));
  }

  /**
   * Test removing a specific invalid amounts from an ingredient's quantity,
   * and verify that the quantity remains unchanged.
   * Invalid amounts: negative amounts, amounts that are larger than the quantity available
   * and amounts with incompatible units.
   *
   * <p>Expected outcome: An {@link IllegalArgumentException} is thrown
   * and the quantity remains unchanged.</p>
   */
  @Test
  void testDecreaseQuantityWithInvalidAmount() {
    assertThrows(IllegalArgumentException.class, ()
        -> meat.decreaseQuantity(-10, Unit.KILOGRAM));
    assertThrows(IllegalArgumentException.class, ()
        -> meat.decreaseQuantity(100, Unit.KILOGRAM));
    assertThrows(IllegalArgumentException.class, ()
        -> meat.decreaseQuantity(1, Unit.LITRE));

    assertEquals(5, meat.getQuantity());
  }

  /**
   * Test increasing the ingredient's quantity with invalid amount, and
   * verify that the quantity remains unchanged.
   * Invalid amounts: negative amounts.
   *
   * <p>Expected outcome: An {@link IllegalArgumentException} is thrown
   * and the quantity remains unchanged.</p>
   */
  @Test
  void testIncreaseQuantityWithInvalidAmount() {
    assertThrows(IllegalArgumentException.class, ()
        -> meat.increaseQuantity(-10, Unit.KILOGRAM));

    assertEquals(5, meat.getQuantity());
  }

  /**
   * Test matching an ingredient with a null ingredient.
   *
   * <p>Expected outcome: An {@link IllegalArgumentException} is thrown.</p>
   */
  @Test
  void testMatchesIngredientWithNull() {
    assertThrows(IllegalArgumentException.class, ()
        -> meat.matchesIngredient(null));
  }
}





