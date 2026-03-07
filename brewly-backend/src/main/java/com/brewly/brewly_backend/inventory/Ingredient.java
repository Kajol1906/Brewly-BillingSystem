package com.brewly.brewly_backend.inventory;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ingredients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //milk, coffee Beans , Sugar
    @Column(nullable = false,unique = true)
    private String name;

    //quantity available
    @Column(nullable = false)
    private Double quantity;

    //unit: ml,kg,pcs
    @Column(nullable = false)
    private String unit;

    //minimum stock warning
    private Double minThreshold;

}
