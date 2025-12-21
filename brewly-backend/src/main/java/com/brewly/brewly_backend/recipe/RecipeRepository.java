package com.brewly.brewly_backend.recipe;

import com.brewly.brewly_backend.menu.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecipeRepository
        extends JpaRepository<Recipe, Long> {

    Optional<Recipe> findByMenuItem(MenuItem menuItem);
}
