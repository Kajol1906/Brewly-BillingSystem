package com.brewly.brewly_backend.inventory;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin
public class IngredientController {

    private final IngredientService ingredientService;

    //add new ingredient
    @PostMapping
    public Ingredient addIngredient(@RequestBody Ingredient ingredient){
        return ingredientService.addIngredient(ingredient);
    }

    //get all ingredients
    @GetMapping
    public List<Ingredient> getAllIngredients() {
        return ingredientService.getAllIngredients();
    }

    // Update stock
    @PutMapping("/{id}/stock")
    public Ingredient updateStock(
            @PathVariable Long id,
            @RequestParam Double quantity
    ) {
        return ingredientService.updateStock(id, quantity);
    }
}
