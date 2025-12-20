package com.brewly.brewly_backend.menu;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MenuCategory category;

    private String imageUrl;

    private boolean available;
}
