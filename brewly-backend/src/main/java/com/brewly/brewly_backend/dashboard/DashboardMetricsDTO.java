package com.brewly.brewly_backend.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetricsDTO {
    private Double todayRevenue;
    private Long totalOrders;
    private Long occupiedTables;
    private Long totalTables;
    private Long lowStockItems;
    private Long upcomingEvents;
    private Double previousRevenue;
    private Long previousOrders;
    private Double revenueChangePercent;
    private Double ordersChangePercent;
}
