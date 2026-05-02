package com.brewly.brewly_backend.inventory;

import com.brewly.brewly_backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

    Optional<Ingredient> findByUserAndNameIgnoreCase(User user, String name);

    @Query("SELECT COUNT(i) FROM Ingredient i WHERE i.user = :user AND i.quantity < i.minThreshold")
    long countLowStockIngredientsByUser(@Param("user") User user);

    List<Ingredient> findByUser(User user);
}
