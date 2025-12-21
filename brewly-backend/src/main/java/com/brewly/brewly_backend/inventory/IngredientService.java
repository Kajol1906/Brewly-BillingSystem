package com.brewly.brewly_backend.inventory;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    public Ingredient addIngredient(Ingredient ingredient) {

        //prevent duplicate ingredients
       ingredientRepository.findByNameIgnoreCase(ingredient.getName())
               .ifPresent(i -> {
                   throw new RuntimeException("Ingredient already exists");
               });

       return ingredientRepository.save(ingredient);
    }

    public List<Ingredient> getAllIngredients(){
        return ingredientRepository.findAll();
    }

    public Ingredient updateStock(Long id , Double newQuantity){

        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));
        ingredient.setQuantity(newQuantity);
        return ingredientRepository.save(ingredient);
    }
}
