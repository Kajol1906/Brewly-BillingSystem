package com.brewly.brewly_backend.inventory;

import com.brewly.brewly_backend.menu.MenuItem;
import com.brewly.brewly_backend.menu.MenuItemRepository;
import com.brewly.brewly_backend.menu.MenuItemService;
import com.brewly.brewly_backend.recipe.Recipe;
import com.brewly.brewly_backend.recipe.RecipeIngredient;
import com.brewly.brewly_backend.recipe.RecipeIngredientRepository;
import com.brewly.brewly_backend.recipe.RecipeRepository;
import com.brewly.brewly_backend.security.UserContextHelper;
import com.brewly.brewly_backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.brewly.brewly_backend.exception.DuplicateResourceException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IngredientService {

    private final IngredientRepository ingredientRepository;
    private final RecipeRepository recipeRepository;
    private final MenuItemService menuItemService;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final UserContextHelper userContextHelper;

    public Ingredient addIngredient(Ingredient ingredient) {
        User user = userContextHelper.getCurrentUser();
        //prevent duplicate ingredients
       ingredientRepository.findByUserAndNameIgnoreCase(user, ingredient.getName())
               .ifPresent(i -> {
                   throw new DuplicateResourceException("Ingredient already exists");
               });

       ingredient.setUser(user);
       return ingredientRepository.save(ingredient);
    }

    public List<Ingredient> getAllIngredients(){
        User user = userContextHelper.getCurrentUser();
        return ingredientRepository.findByUser(user);
    }

    public Ingredient updateStock(Long id, Double newQuantity) {
        User user = userContextHelper.getCurrentUser();
        // 1️⃣ Find ingredient
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));
        if (!ingredient.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // 2️⃣ Add to existing stock
        ingredient.setQuantity(ingredient.getQuantity() + newQuantity);
        Ingredient updatedIngredient = ingredientRepository.save(ingredient);

        // 3️⃣ Find all recipe-ingredient mappings using this ingredient
        List<RecipeIngredient> recipeIngredients =
                recipeIngredientRepository.findByIngredient(updatedIngredient);

        // 4️⃣ Recalculate availability for affected menu items
        for (RecipeIngredient ri : recipeIngredients) {
            MenuItem menuItem = ri.getRecipe().getMenuItem();
            menuItemService.updateAvailabilityBasedOnStock(menuItem);
        }

        return updatedIngredient;
    }

    public Ingredient editIngredient(Long id, Ingredient updated) {
        User user = userContextHelper.getCurrentUser();
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));
        if (!ingredient.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        ingredient.setName(updated.getName());
        ingredient.setUnit(updated.getUnit());
        ingredient.setQuantity(updated.getQuantity());
        ingredient.setMinThreshold(updated.getMinThreshold());
        Ingredient saved = ingredientRepository.save(ingredient);

        // Recalculate availability for all menu items using this ingredient
        List<RecipeIngredient> recipeIngredients =
                recipeIngredientRepository.findByIngredient(saved);
        for (RecipeIngredient ri : recipeIngredients) {
            MenuItem menuItem = ri.getRecipe().getMenuItem();
            menuItemService.updateAvailabilityBasedOnStock(menuItem);
        }

        return saved;
    }
}
