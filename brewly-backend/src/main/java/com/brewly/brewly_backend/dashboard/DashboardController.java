package com.brewly.brewly_backend.dashboard;

import com.brewly.brewly_backend.pos.Order;
import com.brewly.brewly_backend.pos.OrderItem;
import com.brewly.brewly_backend.pos.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    private final OrderRepository orderRepository;
    private final com.brewly.brewly_backend.pos.TableRepository tableRepository;
    private final com.brewly.brewly_backend.inventory.IngredientRepository ingredientRepository;
    private final com.brewly.brewly_backend.events.EventRepository eventRepository;

    // Returns [periodStart, periodEnd, prevStart, prevEnd]
    private LocalDateTime[] resolvePeriod(String period) {
        LocalDate today = LocalDate.now();
        LocalDateTime periodStart, periodEnd, prevStart, prevEnd;

        switch (period != null ? period : "today") {
            case "yesterday":
                periodStart = today.minusDays(1).atStartOfDay();
                periodEnd = today.atStartOfDay();
                prevStart = today.minusDays(2).atStartOfDay();
                prevEnd = today.minusDays(1).atStartOfDay();
                break;
            case "week":
                periodStart = today.minusDays(6).atStartOfDay();
                periodEnd = today.plusDays(1).atStartOfDay();
                prevStart = today.minusDays(13).atStartOfDay();
                prevEnd = today.minusDays(6).atStartOfDay();
                break;
            case "month":
                periodStart = today.withDayOfMonth(1).atStartOfDay();
                periodEnd = today.plusDays(1).atStartOfDay();
                LocalDate prevMonthStart = today.minusMonths(1).withDayOfMonth(1);
                prevStart = prevMonthStart.atStartOfDay();
                prevEnd = today.withDayOfMonth(1).atStartOfDay();
                break;
            default: // "today"
                periodStart = today.atStartOfDay();
                periodEnd = today.plusDays(1).atStartOfDay();
                prevStart = today.minusDays(1).atStartOfDay();
                prevEnd = today.atStartOfDay();
                break;
        }
        return new LocalDateTime[]{periodStart, periodEnd, prevStart, prevEnd};
    }

    private double calcRevenue(List<Order> orders) {
        return orders.stream()
                .flatMap(o -> o.getItems().stream())
                .mapToDouble(item -> item.getQuantity() * item.getMenuItem().getPrice())
                .sum();
    }

    private double changePercent(double current, double previous) {
        if (previous == 0) return current > 0 ? 100.0 : 0.0;
        return Math.round(((current - previous) / previous) * 1000.0) / 10.0;
    }

    @GetMapping("/metrics")
    public DashboardMetricsDTO getMetrics(@RequestParam(defaultValue = "today") String period) {
        LocalDateTime[] p = resolvePeriod(period);

        List<Order> currentOrders = orderRepository.findAllByCreatedAtBetweenAndStatus(p[0], p[1], "BILLED");
        List<Order> previousOrders = orderRepository.findAllByCreatedAtBetweenAndStatus(p[2], p[3], "BILLED");

        double revenue = calcRevenue(currentOrders);
        double prevRevenue = calcRevenue(previousOrders);
        long orderCount = currentOrders.size();
        long prevOrderCount = previousOrders.size();

        long occupiedTables = tableRepository.countByStatus(com.brewly.brewly_backend.pos.Table.TableStatus.OCCUPIED);
        long totalTables = tableRepository.count();
        long lowStockCount = ingredientRepository.countLowStockIngredients();
        long upcomingEvents = eventRepository.countByDateGreaterThanEqual(LocalDate.now());

        return new DashboardMetricsDTO(
                revenue, orderCount,
                occupiedTables, totalTables,
                lowStockCount, upcomingEvents,
                prevRevenue, prevOrderCount,
                changePercent(revenue, prevRevenue),
                changePercent(orderCount, prevOrderCount));
    }

    @GetMapping("/daily-sales")
    public List<DailySalesDTO> getDailySales(@RequestParam(defaultValue = "week") String period) {
        LocalDateTime[] p = resolvePeriod(period);
        List<Order> orders = orderRepository.findAllByCreatedAtBetweenAndStatus(p[0], p[1], "BILLED");

        Map<String, Double> salesByDay = new LinkedHashMap<>();

        if ("today".equals(period) || "yesterday".equals(period)) {
            // Hourly breakdown
            for (int h = 8; h <= 22; h++) {
                salesByDay.put(String.format("%02d:00", h), 0.0);
            }
            for (Order order : orders) {
                int hour = order.getCreatedAt().getHour();
                String key = String.format("%02d:00", hour);
                if (salesByDay.containsKey(key)) {
                    double orderTotal = order.getItems().stream()
                            .mapToDouble(item -> item.getQuantity() * item.getMenuItem().getPrice())
                            .sum();
                    salesByDay.merge(key, orderTotal, Double::sum);
                }
            }
        } else if ("month".equals(period)) {
            // Daily breakdown for the month
            LocalDate start = p[0].toLocalDate();
            LocalDate end = p[1].toLocalDate().minusDays(1);
            for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
                salesByDay.put(d.getDayOfMonth() + " " + d.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH), 0.0);
            }
            for (Order order : orders) {
                LocalDate od = order.getCreatedAt().toLocalDate();
                String key = od.getDayOfMonth() + " " + od.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
                if (salesByDay.containsKey(key)) {
                    double orderTotal = order.getItems().stream()
                            .mapToDouble(item -> item.getQuantity() * item.getMenuItem().getPrice())
                            .sum();
                    salesByDay.merge(key, orderTotal, Double::sum);
                }
            }
        } else {
            // Week: daily breakdown (last 7 days)
            for (int i = 6; i >= 0; i--) {
                LocalDateTime d = LocalDateTime.now().minusDays(i);
                String dayName = d.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
                salesByDay.put(dayName, 0.0);
            }
            for (Order order : orders) {
                String dayName = order.getCreatedAt().getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
                double orderTotal = order.getItems().stream()
                        .mapToDouble(item -> item.getQuantity() * item.getMenuItem().getPrice())
                        .sum();
                salesByDay.merge(dayName, orderTotal, Double::sum);
            }
        }

        return salesByDay.entrySet().stream()
                .map(e -> new DailySalesDTO(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    @GetMapping("/orders")
    public List<OrderSummaryDTO> getOrders(@RequestParam(defaultValue = "today") String period) {
        LocalDateTime[] p = resolvePeriod(period);
        List<Order> orders = orderRepository.findAllByCreatedAtBetweenAndStatus(p[0], p[1], "BILLED");

        return orders.stream().map(order -> {
            List<OrderSummaryDTO.OrderItemSummary> items = order.getItems().stream()
                    .map(item -> new OrderSummaryDTO.OrderItemSummary(
                            item.getMenuItem().getName(),
                            item.getQuantity(),
                            item.getMenuItem().getPrice(),
                            item.getQuantity() * item.getMenuItem().getPrice()))
                    .collect(Collectors.toList());

            double total = items.stream().mapToDouble(OrderSummaryDTO.OrderItemSummary::getSubtotal).sum();
            String time = order.getCreatedAt().toLocalTime().withSecond(0).withNano(0).toString();

            return new OrderSummaryDTO(order.getId(), order.getTableId(), time, total, items);
        }).sorted(Comparator.comparing(OrderSummaryDTO::getOrderId).reversed())
                .collect(Collectors.toList());
    }

    @GetMapping("/upcoming-events")
    public List<UpcomingEventDTO> getUpcomingEvents() {
        List<com.brewly.brewly_backend.events.Event> events =
                eventRepository.findByDateGreaterThanEqualOrderByDateAsc(LocalDate.now());
        return events.stream().map(e -> new UpcomingEventDTO(
                e.getId(), e.getTitle(), e.getDate(), e.getTime(),
                e.getType(), e.getGuestCount(), e.getPackageType()
        )).collect(Collectors.toList());
    }

    @GetMapping("/top-selling")
    public List<TopSellingItemDTO> getTopSelling(@RequestParam(defaultValue = "week") String period) {
        LocalDateTime[] p = resolvePeriod(period);
        List<Order> orders = orderRepository.findAllByCreatedAtBetweenAndStatus(p[0], p[1], "BILLED");

        Map<String, Long> qtyByItem = new HashMap<>();
        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                String itemName = item.getMenuItem().getName();
                qtyByItem.merge(itemName, (long) item.getQuantity(), Long::sum);
            }
        }

        return qtyByItem.entrySet().stream()
                .map(e -> new TopSellingItemDTO(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(TopSellingItemDTO::getSales).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }
}
