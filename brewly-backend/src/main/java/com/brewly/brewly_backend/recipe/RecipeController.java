package com.brewly.brewly_backend.recipe;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@CrossOrigin
public class RecipeController {

    private final RecipeService recipeService;

    //add recipe for menu item
    @PostMapping
    public Recipe addRecipe(@RequestBody Recipe recipe){
        return recipeService.addRecipe(recipe);
    }
}
