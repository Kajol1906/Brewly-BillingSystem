package com.brewly.brewly_backend.recipe;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class RecipeController {

    private final RecipeService recipeService;

    // Get recipe ingredients for a specific menu item
    @GetMapping("/menu/{menuItemId}")
    public List<RecipeIngredient> getRecipeByMenuItem(@PathVariable Long menuItemId) {
        return recipeService.getRecipeIngredientsByMenuItemId(menuItemId);
    }

    // Add (or update) recipe ingredient using DTO {menuItemId, ingredientId, quantity}
    @PostMapping
    public RecipeIngredient addRecipeIngredient(@RequestBody RecipeRequest request) {
        return recipeService.addRecipeIngredient(request);
    }

    // Delete a specific recipe ingredient by its ID
    @DeleteMapping("/{id}")
    public void deleteRecipeIngredient(@PathVariable Long id) {
        recipeService.deleteRecipeIngredient(id);
    }
}
