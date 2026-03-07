package com.brewly.brewly_backend.pos;

import lombok.Data;

@Data
public class BillRequest {
    private Long tableId;
    private Double totalAmount;
    private String paymentMethod;
}
