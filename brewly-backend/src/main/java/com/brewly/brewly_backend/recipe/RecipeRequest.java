package com.brewly.brewly_backend.recipe;

import lombok.Data;

@Data
public class RecipeRequest {
    private Long menuItemId;
    private Long ingredientId;
    private Double quantity;
}
