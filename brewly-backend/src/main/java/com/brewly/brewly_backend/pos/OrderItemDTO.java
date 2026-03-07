package com.brewly.brewly_backend.pos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Long id; // menuItemId
    private String name;
    private double price;
    private int quantity;
}
