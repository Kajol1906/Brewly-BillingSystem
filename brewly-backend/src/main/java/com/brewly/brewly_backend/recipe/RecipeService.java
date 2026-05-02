package com.brewly.brewly_backend.recipe;

import com.brewly.brewly_backend.menu.MenuItem;
import com.brewly.brewly_backend.security.UserContextHelper;
import com.brewly.brewly_backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserContextHelper userContextHelper;

    public List<Recipe> getRecipeForMenuItem(MenuItem menuItem)
    {
        User user = userContextHelper.getCurrentUser();
        return recipeRepository.findByUserAndMenuItem(user, menuItem);
    }

    public Recipe addRecipe(Recipe recipe){
        User user = userContextHelper.getCurrentUser();
        recipe.setUser(user);
        return recipeRepository.save(recipe);
    }
}
