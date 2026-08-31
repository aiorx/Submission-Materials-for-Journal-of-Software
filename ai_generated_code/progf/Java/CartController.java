/** This represents a CartController, which can access and update the user's cart information. */
package edu.northeastern.cs5500.starterbot.controller;

import com.mongodb.lang.Nullable;
import edu.northeastern.cs5500.starterbot.model.Cart;
import edu.northeastern.cs5500.starterbot.model.Dish;
import edu.northeastern.cs5500.starterbot.repository.GenericRepository;
import java.util.Collection;
import java.util.Map;
import javax.annotation.Nonnull;
import javax.inject.Inject;

/**
 * Constructor for CartController class.
 *
 * @param cartRepository GenericRepository object to interact with the database to fetch and store
 *     the cart information
 */
public class CartController {
    GenericRepository<Cart> cartRepository;

    @Inject
    CartController(GenericRepository<Cart> cartRepository) {
        this.cartRepository = cartRepository;
    }

    /**
     * Gets the cart for a given Discord user ID. If a cart for the user is not found, a new cart is
     * created and returned.
     *
     * @param discordMemberId The Discord user ID of the user whose cart is to be fetched
     * @return The Cart object for the user
     */
    @Nonnull
    public Cart getCartForUser(String discordMemberId) {
        Collection<Cart> carts = cartRepository.getAll();
        for (Cart currentCart : carts) {
            if (currentCart.getDiscordUserId().equals(discordMemberId)) {
                return currentCart;
            }
        }
        Cart cart = new Cart();
        cart.setDiscordUserId(discordMemberId);
        cartRepository.add(cart);
        return cart;
    }

    /**
     * Adds the specified dish to given user's cart.
     *
     * @param dish The Dish to add to the cart.
     * @param discordMemberId The Discord member ID of the user.
     */
    public void addToCart(Dish dish, String discordMemberId) {
        Cart cart = getCartForUser(discordMemberId);
        cart.addDish(dish);
        cartRepository.update(cart);
    }

    /**
     * Removes the specified dish from given user's cart. Returns true is deleted sucessfully,
     * otherwise returns false.
     *
     * @param dish The Dish to add to the cart.
     * @param discordMemberId The Discord member ID of the user.
     */
    public boolean deleteNamedDishFromCart(Dish dish, String discordMemberId) {
        Cart cart = getCartForUser(discordMemberId);
        if (cart.deleteDish(dish)) {
            cartRepository.update(cart);
            return true;
        }
        return false;
    }

    /**
     * Gets a Map of dishes and their quantities in a user's cart. It was Aided using common development resources using
     * OpenAI GPT-3.5 model, version 2021-09
     *
     * @param discordMemberId The Discord user ID of the user whose cart is to be fetched
     * @return A Map object with Dish objects as keys and their respective quantities as values, or
     *     null if the user has no items in the cart
     */
    @Nullable
    public Map<Dish, Integer> getDishesForUser(String discordMemberId) {
        return getCartForUser(discordMemberId).getItems();
    }

    @Nullable
    public Dish getNamedDishFromCart(String discordMemberId, String dishName) {
        Map<Dish, Integer> dishes = getDishesForUser(discordMemberId);
        for (Dish dish : dishes.keySet()) {
            if (dish.getDishName().equals(dishName)) {
                return dish;
            }
        }
        return null;
    }

    /**
     * Clears a user's cart.
     *
     * @param discordMemberId The Discord user ID of the user whose cart is to be cleared
     */
    public void clearCart(String discordMemberId) {
        Cart cart = getCartForUser(discordMemberId);
        cart.clear();
        cartRepository.update(cart);
    }
}
