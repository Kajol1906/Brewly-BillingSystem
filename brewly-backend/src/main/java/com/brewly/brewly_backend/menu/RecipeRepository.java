package com.brewly.brewly_backend.menu;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeRepository
        extends JpaRepository<Recipe, Long> {

    List<Recipe> findByMenuItem(MenuItem menuItem);
}
