package com.brewly.brewly_backend.menu;

import jakarta.persistence.*;
import lombok.*;


import com.brewly.brewly_backend.user.User;

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
    private Long id;

    private String name;
    private Double price;

    @Column(nullable = false)
    private String category;

    private String imageUrl;

    private Boolean available=true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
