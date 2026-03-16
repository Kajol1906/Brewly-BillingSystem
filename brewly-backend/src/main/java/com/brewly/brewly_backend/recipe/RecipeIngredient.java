package com.brewly.brewly_backend.recipe;

import com.brewly.brewly_backend.inventory.Ingredient;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecipeIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //many ingredient belong to one recipe
    @ManyToOne
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    @ManyToOne
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    // Quantity required for ONE menu item
//    @Column(nullable = false)
    private Double quantity;
}