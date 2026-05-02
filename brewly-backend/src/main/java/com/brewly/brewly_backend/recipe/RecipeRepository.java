package com.brewly.brewly_backend.recipe;

import com.brewly.brewly_backend.inventory.Ingredient;
import com.brewly.brewly_backend.menu.MenuItem;
import com.brewly.brewly_backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecipeRepository
        extends JpaRepository<Recipe, Long> {

    List<Recipe> findByUserAndMenuItem(User user, MenuItem menuItem);
    List<Recipe> findByUser(User user);
}
