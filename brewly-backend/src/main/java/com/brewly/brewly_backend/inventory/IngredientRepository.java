package com.brewly.brewly_backend.inventory;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

    Optional<Ingredient> findByNameIgnoreCase(String name);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(i) FROM Ingredient i WHERE i.quantity < i.minThreshold")
    long countLowStockIngredients();
}
