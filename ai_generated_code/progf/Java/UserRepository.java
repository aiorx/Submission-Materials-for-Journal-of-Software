package com.ai.usage.data.retrieval.repository;


import com.ai.usage.data.retrieval.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Aided with basic GitHub coding tools
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email
    Optional<User> findByEmail(String email);

    // Find user by username
    Optional<User> findByUsername(String username);

    // Find users by their name (contains)
    List<User> findByFullNameContainingIgnoreCase(String name);

    /**
     * Finds users who have placed orders with a total price exceeding the specified amount.
     * The query joins Users with Payments and Orders tables to filter users by their order values.
     * 
     * @param minPrice The minimum order total price threshold
     * @return List of users who have placed orders exceeding the specified price threshold
     * Aided with basic GitHub coding tools
     */
    @Query(value = "SELECT DISTINCT u.* FROM Users u " +
            "JOIN Payments p ON u.user_id = p.user_id " +
            "JOIN Orders o ON p.payment_id = o.payment_id " +
            "WHERE o.total_price > :minPrice " +
            "ORDER BY u.user_id", 
            nativeQuery = true)
    List<User> findUsersWithOrdersPricedOver(double minPrice);
}