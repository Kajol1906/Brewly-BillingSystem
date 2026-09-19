package com.brewly.brewly_backend.pos;

import lombok.Data;

@Data
public class BillRequest {
    private Long tableId;
    private String takeawayName;
    private Double totalAmount;
    private String paymentMethod;
}
