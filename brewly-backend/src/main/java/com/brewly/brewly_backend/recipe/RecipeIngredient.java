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

    @ManyToOne
    private Ingredient ingredient;

    // Quantity required for ONE menu item
    @Column(nullable = false)
    private double quantity;
}