package com.brewly.brewly_backend.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailySalesDTO {
    private String day; // Day name (Mon, Tue) or Date
    private Double sales;
}
