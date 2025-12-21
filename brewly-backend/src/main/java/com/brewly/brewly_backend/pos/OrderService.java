package com.brewly.brewly_backend.pos;

import com.brewly.brewly_backend.menu.MenuItem;
import com.brewly.brewly_backend.menu.MenuItemRepository;
import com.brewly.brewly_backend.menu.MenuItemService;
import com.brewly.brewly_backend.recipe.Recipe;
import com.brewly.brewly_backend.recipe.RecipeRepository;
import com.brewly.brewly_backend.inventory.Ingredient;
import com.brewly.brewly_backend.inventory.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final MenuItemRepository menuItemRepository;
    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final MenuItemService menuItemService;

    public void placeOrder(OrderRequest request) {

        // 1️⃣ Fetch menu item
        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        // 2️⃣ Fetch recipe
        Recipe recipe = recipeRepository.findByMenuItem(menuItem)
                .orElseThrow(() -> new RuntimeException("Recipe not defined"));

        // 3️⃣ Validate ingredient stock
        recipe.getIngredients().forEach(recipeIngredient -> {
            Ingredient ingredient = recipeIngredient.getIngredient();

            double requiredQty =
                    recipeIngredient.getQuantity() * request.getQuantity();

            if (ingredient.getQuantity() < requiredQty) {
                throw new RuntimeException(
                        ingredient.getName() + " out of stock"
                );
            }
        });

        // 4️⃣ Deduct stock
        recipe.getIngredients().forEach(recipeIngredient -> {
            Ingredient ingredient = recipeIngredient.getIngredient();

            double requiredQty =
                    recipeIngredient.getQuantity() * request.getQuantity();

            ingredient.setQuantity(
                    ingredient.getQuantity() - requiredQty
            );

            ingredientRepository.save(ingredient);
        });

        // 5️⃣ Update menu availability
        menuItemService.updateAvailabilityBasedOnStock(menuItem);
    }
}
