package com.brewly.brewly_backend.pos;

import com.brewly.brewly_backend.menu.MenuItem;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    private MenuItem menuItem;

    private int quantity;
}
