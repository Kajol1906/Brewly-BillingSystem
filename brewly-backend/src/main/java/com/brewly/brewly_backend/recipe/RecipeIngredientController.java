package com.brewly.brewly_backend.recipe;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recipe-ingredients")
@RequiredArgsConstructor
@CrossOrigin
public class RecipeIngredientController {

    private final RecipeIngredientRepository recipeIngredientRepository;

    // 🔹 Add ingredient to recipe
    @PostMapping
    public RecipeIngredient addIngredientToRecipe(
            @RequestBody RecipeIngredient recipeIngredient
    ) {
        return recipeIngredientRepository.save(recipeIngredient);
    }
}
