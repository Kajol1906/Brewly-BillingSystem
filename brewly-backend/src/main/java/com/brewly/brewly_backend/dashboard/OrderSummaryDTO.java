package com.brewly.brewly_backend.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryDTO {
    private Long orderId;
    private Long tableId;
    private String time;
    private double total;
    private List<OrderItemSummary> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemSummary {
        private String name;
        private int quantity;
        private double price;
        private double subtotal;
    }
}
