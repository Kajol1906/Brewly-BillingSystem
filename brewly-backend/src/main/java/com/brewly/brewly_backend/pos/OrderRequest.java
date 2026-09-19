package com.brewly.brewly_backend.pos;

import lombok.Data;

@Data
public class OrderRequest {
    private Long tableId;
    private String takeawayName;
    private Long menuItemId;
    private int quantity;
}
