package com.brewly.brewly_backend.inventory;

import com.brewly.brewly_backend.menu.MenuItem;
import com.brewly.brewly_backend.menu.MenuItemRepository;
import com.brewly.brewly_backend.menu.MenuItemService;
import com.brewly.brewly_backend.recipe.Recipe;
import com.brewly.brewly_backend.recipe.RecipeIngredient;
import com.brewly.brewly_backend.recipe.RecipeIngredientRepository;
import com.brewly.brewly_backend.recipe.RecipeRepository;
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

    public Ingredient addIngredient(Ingredient ingredient) {

        //prevent duplicate ingredients
       ingredientRepository.findByNameIgnoreCase(ingredient.getName())
               .ifPresent(i -> {
                   throw new DuplicateResourceException("Ingredient already exists");
               });

       return ingredientRepository.save(ingredient);
    }

    public List<Ingredient> getAllIngredients(){
        return ingredientRepository.findAll();
    }


    public Ingredient updateStock(Long id, Double newQuantity) {

        // 1️⃣ Find ingredient
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

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
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));
        ingredient.setName(updated.getName());
        ingredient.setUnit(updated.getUnit());
        ingredient.setQuantity(updated.getQuantity());
        ingredient.setMinThreshold(updated.getMinThreshold());
        return ingredientRepository.save(ingredient);
    }
}
