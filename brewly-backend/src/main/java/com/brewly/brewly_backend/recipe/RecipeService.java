package com.brewly.brewly_backend.recipe;


import com.brewly.brewly_backend.menu.MenuItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;

    public Optional<Recipe> getRecipeForMenuItem(MenuItem menuItem){
        return recipeRepository.findByMenuItem(menuItem);
    }

    public Recipe addRecipe(Recipe recipe){
        return recipeRepository.save(recipe);
    }
}
