package com.brewly.brewly_backend.recipe;

import com.brewly.brewly_backend.inventory.Ingredient;
import com.brewly.brewly_backend.menu.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecipeIngredientRepository
           extends JpaRepository<RecipeIngredient, Long> {
    List<RecipeIngredient> findByIngredient(Ingredient ingredient);
    List<RecipeIngredient> findByRecipe_MenuItem(MenuItem recipe);
    Optional<RecipeIngredient> findByRecipeAndIngredient(Recipe recipe, Ingredient ingredient);
    List<RecipeIngredient> findByRecipe(Recipe recipe);
}
