package com.brewly.brewly_backend.recipe;

import com.brewly.brewly_backend.menu.MenuItem;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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
    @OneToMany(cascade = CascadeType.ALL)
    private List<RecipeIngredient> ingredient;

    // Required quantity for ONE item
    private Double requiredQuantity;
}
