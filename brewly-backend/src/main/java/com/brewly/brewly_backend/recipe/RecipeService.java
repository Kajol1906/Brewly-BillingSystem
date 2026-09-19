package com.brewly.brewly_backend.recipe;

import com.brewly.brewly_backend.inventory.Ingredient;
import com.brewly.brewly_backend.inventory.IngredientRepository;
import com.brewly.brewly_backend.menu.MenuItem;
import com.brewly.brewly_backend.menu.MenuItemRepository;
import com.brewly.brewly_backend.menu.MenuItemService;
import com.brewly.brewly_backend.security.UserContextHelper;
import com.brewly.brewly_backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final MenuItemRepository menuItemRepository;
    private final IngredientRepository ingredientRepository;
    private final UserContextHelper userContextHelper;
    private final MenuItemService menuItemService;
    private final SimpMessagingTemplate simpMessagingTemplate;

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

    /**
     * Get all recipe ingredients for a given menu item ID.
     * Returns the RecipeIngredient list from the first matching Recipe.
     */
    public List<RecipeIngredient> getRecipeIngredientsByMenuItemId(Long menuItemId) {
        User user = userContextHelper.getCurrentUser();
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        if (!menuItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        return recipeIngredientRepository.findByRecipe_MenuItem(menuItem);
    }

    /**
     * Add an ingredient to a recipe for a menu item.
     * Creates the Recipe entity if it doesn't exist yet.
     * If the same ingredient is already in the recipe, updates the quantity (upsert).
     */
    public RecipeIngredient addRecipeIngredient(RecipeRequest request) {
        User user = userContextHelper.getCurrentUser();

        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        if (!menuItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        Ingredient ingredient = ingredientRepository.findById(request.getIngredientId())
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

        // Find or create Recipe for this menu item
        List<Recipe> recipes = recipeRepository.findByUserAndMenuItem(user, menuItem);
        Recipe recipe;
        if (recipes.isEmpty()) {
            recipe = new Recipe();
            recipe.setUser(user);
            recipe.setMenuItem(menuItem);
            recipe = recipeRepository.save(recipe);
        } else {
            recipe = recipes.get(0);
        }

        final Recipe finalRecipe = recipe;
        // Upsert: if this ingredient already exists in the recipe, update quantity instead of duplicating
        RecipeIngredient ri = recipeIngredientRepository
                .findByRecipeAndIngredient(finalRecipe, ingredient)
                .orElseGet(() -> {
                    RecipeIngredient newRi = new RecipeIngredient();
                    newRi.setRecipe(finalRecipe);
                    newRi.setIngredient(ingredient);
                    return newRi;
                });

        ri.setQuantity(request.getQuantity());
        RecipeIngredient savedRi = recipeIngredientRepository.save(ri);

        // Recalculate availability for this menu item
        menuItemService.updateAvailabilityBasedOnStock(menuItem);

        // Broadcast updates
        try {
            simpMessagingTemplate.convertAndSend("/topic/menu", "updated");
        } catch (Exception ignored) {}

        return savedRi;
    }

    /**
     * Delete a single recipe ingredient by its ID.
     * Validates ownership before deleting, then recalculates menu item availability.
     */
    public void deleteRecipeIngredient(Long recipeIngredientId) {
        User user = userContextHelper.getCurrentUser();

        RecipeIngredient ri = recipeIngredientRepository.findById(recipeIngredientId)
                .orElseThrow(() -> new RuntimeException("Recipe ingredient not found"));

        MenuItem menuItem = ri.getRecipe().getMenuItem();
        if (!menuItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        recipeIngredientRepository.delete(ri);

        // Recalculate availability after removal
        menuItemService.updateAvailabilityBasedOnStock(menuItem);

        // Broadcast updates
        try {
            simpMessagingTemplate.convertAndSend("/topic/menu", "updated");
        } catch (Exception ignored) {}
    }
}
