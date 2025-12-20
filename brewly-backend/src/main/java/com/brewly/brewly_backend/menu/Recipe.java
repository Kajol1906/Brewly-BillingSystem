package com.brewly.brewly_backend.menu;

import com.brewly.brewly_backend.inventory.Ingredient;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recipes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Cappuccino
    @ManyToOne
    private MenuItem menuItem;

    // Milk / Coffee Beans
    @ManyToOne
    private Ingredient ingredient;

    // Required quantity for ONE item
    private Double requiredQuantity;
}
