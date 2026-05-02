package com.brewly.brewly_backend.inventory;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.brewly.brewly_backend.user.User;

@Entity
@Table(name = "ingredients", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"name", "user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //milk, coffee Beans , Sugar
    @Column(nullable = false)
    private String name;

    //quantity available
    @Column(nullable = false)
    private Double quantity;

    //unit: ml,kg,pcs
    @Column(nullable = false)
    private String unit;

    //minimum stock warning
    private Double minThreshold;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
