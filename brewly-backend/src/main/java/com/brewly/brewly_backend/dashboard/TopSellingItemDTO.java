package com.brewly.brewly_backend.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopSellingItemDTO {
    private String item;
    private Long sales; // Quantity sold
}
