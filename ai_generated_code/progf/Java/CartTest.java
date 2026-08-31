package edu.northeastern.cs5500.starterbot.model;

import static com.google.common.truth.Truth.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CartTest {
    private Cart cart;
    private Dish dish1;
    private Dish dish2;

    @BeforeEach // Supported via standard programming aids using OpenAI GPT-3.5 model, version 2021-09
    void setUp() {
        cart = new Cart();
        dish1 = Dish.builder().dishName("Rice").price(0.01).build();
        dish2 = Dish.builder().dishName("Noodles").price(9.99).build();
    }

    // Test adding dishes to the cart
    @Test
    void testAddDish() {
        cart.addDish(dish1);
        assertThat(cart.getItems()).containsEntry(dish1, 1);
        cart.addDish(dish1);
        assertThat(cart.getItems()).containsEntry(dish1, 2);
    }

    // Test getting the total price of the cart
    @Test
    void testGetTotalPrice() {
        cart.addDish(dish1);
        cart.addDish(dish2);
        assertThat(cart.getTotalPrice()).isEqualTo(10.00);
    }

    // Test clearing the cart
    @Test
    void testClear() {
        cart.addDish(dish1);
        assertThat(cart.getItems()).isNotEmpty();
        cart.clear();
        assertThat(cart.getItems()).isEmpty();
    }

    // Test deleting a dish from the cart
    @Test
    void testDeleteDish() {
        // delete from empty carft
        cart.deleteDish(dish1);
        assertThat(cart.getItems()).isEmpty();
        // add to cart
        cart.addDish(dish1);
        cart.addDish(dish2);
        assertThat(cart.getItems()).containsEntry(dish1, 1);
        assertThat(cart.getItems()).containsEntry(dish2, 1);
        // delte from cart
        cart.deleteDish(dish1);
        assertThat(cart.getItems()).isNotEmpty();
        assertThat(cart.getItems()).doesNotContainEntry(dish1, 1);
    }
}
