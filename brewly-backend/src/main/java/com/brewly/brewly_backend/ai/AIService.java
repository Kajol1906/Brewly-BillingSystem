package com.brewly.brewly_backend.ai;

import com.brewly.brewly_backend.inventory.Ingredient;
import com.brewly.brewly_backend.inventory.IngredientRepository;
import com.brewly.brewly_backend.menu.MenuItem;
import com.brewly.brewly_backend.pos.*;
import com.brewly.brewly_backend.recipe.RecipeIngredient;
import com.brewly.brewly_backend.recipe.RecipeIngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIService {

    private final OrderRepository orderRepository;
    private final BillRepository billRepository;
    private final IngredientRepository ingredientRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final TableRepository tableRepository;

    public List<Map<String, Object>> getPeakHours() {
        List<Order> orders = orderRepository.findAll();

        Map<Integer, Long> ordersByHour = orders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getCreatedAt().getHour(),
                        Collectors.counting()));

        List<Map<String, Object>> result = new ArrayList<>();

        for (int i = 8; i <= 22; i += 2) {
            long count = ordersByHour.getOrDefault(i, 0L) + ordersByHour.getOrDefault(i + 1, 0L);

            String label = (i > 12 ? (i - 12) + "PM" : (i == 12 ? "12PM" : i + "AM"));

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("hour", label);
            map.put("traffic", count);
            result.add(map);
        }

        return result;
    }

    public List<Map<String, Object>> getRecommendations() {
        List<Order> orders = orderRepository.findAll();

        // Count total quantity ordered per menu item
        Map<String, Long> itemCounts = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .collect(Collectors.groupingBy(
                        item -> item.getMenuItem().getName(),
                        Collectors.summingLong(OrderItem::getQuantity)));

        if (itemCounts.isEmpty()) {
            return Collections.emptyList();
        }

        long maxCount = itemCounts.values().stream().mapToLong(Long::longValue).max().orElse(1);

        // Sort by quantity descending, take top 5
        List<Map.Entry<String, Long>> topItems = itemCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toList());

        List<Map<String, Object>> result = new ArrayList<>();
        int id = 1;
        for (Map.Entry<String, Long> entry : topItems) {
            int confidence = (int) Math.round((entry.getValue() * 100.0) / maxCount);
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", id++);
            map.put("item", entry.getKey());
            map.put("confidence", Math.min(confidence, 99));
            map.put("trend", "+" + entry.getValue() + " sold");
            result.add(map);
        }

        return result;
    }

    // 1. Revenue Forecast — daily revenue for last 7 days + projected next 7 days
    public Map<String, Object> getRevenueForecast() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fourteenDaysAgo = now.minusDays(14);

        List<Bill> allBills = billRepository.findAll();

        // Group bills by date for last 14 days
        Map<LocalDate, Double> dailyRevenue = allBills.stream()
                .filter(b -> b.getCreatedAt().isAfter(fourteenDaysAgo))
                .collect(Collectors.groupingBy(
                        b -> b.getCreatedAt().toLocalDate(),
                        Collectors.summingDouble(Bill::getTotalAmount)));

        // Build last 7 days actual data
        List<Map<String, Object>> history = new ArrayList<>();
        double totalLast7 = 0;
        int daysWithData = 0;
        for (int i = 6; i >= 0; i--) {
            LocalDate date = now.toLocalDate().minusDays(i);
            double revenue = dailyRevenue.getOrDefault(date, 0.0);
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", date.toString());
            entry.put("revenue", Math.round(revenue));
            entry.put("type", "actual");
            history.add(entry);
            totalLast7 += revenue;
            if (revenue > 0) daysWithData++;
        }

        // Calculate average daily revenue for projection
        double avgDaily = daysWithData > 0 ? totalLast7 / daysWithData : 0;

        // Previous 7 days for comparison
        double totalPrev7 = 0;
        for (int i = 13; i >= 7; i--) {
            LocalDate date = now.toLocalDate().minusDays(i);
            totalPrev7 += dailyRevenue.getOrDefault(date, 0.0);
        }

        // Build next 7 days forecast
        List<Map<String, Object>> forecast = new ArrayList<>();
        for (int i = 1; i <= 7; i++) {
            LocalDate date = now.toLocalDate().plusDays(i);
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", date.toString());
            entry.put("revenue", Math.round(avgDaily));
            entry.put("type", "forecast");
            forecast.add(entry);
        }

        double changePercent = totalPrev7 > 0 ? ((totalLast7 - totalPrev7) / totalPrev7) * 100 : 0;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("history", history);
        result.put("forecast", forecast);
        result.put("weeklyRevenue", Math.round(totalLast7));
        result.put("projectedWeekly", Math.round(avgDaily * 7));
        result.put("changePercent", Math.round(changePercent * 10.0) / 10.0);
        result.put("avgDaily", Math.round(avgDaily));
        return result;
    }

    // 2. Category Sales Breakdown — revenue by menu category
    public List<Map<String, Object>> getCategorySales() {
        List<Order> orders = orderRepository.findAll();

        Map<String, Double> categoryRevenue = orders.stream()
                .filter(o -> "BILLED".equals(o.getStatus()))
                .flatMap(o -> o.getItems().stream())
                .collect(Collectors.groupingBy(
                        item -> item.getMenuItem().getCategory(),
                        Collectors.summingDouble(item -> item.getMenuItem().getPrice() * item.getQuantity())));

        double total = categoryRevenue.values().stream().mapToDouble(Double::doubleValue).sum();

        return categoryRevenue.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .map(e -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("category", e.getKey());
                    map.put("revenue", Math.round(e.getValue()));
                    map.put("percent", total > 0 ? Math.round(e.getValue() / total * 1000.0) / 10.0 : 0);
                    return map;
                })
                .collect(Collectors.toList());
    }

    // 3. Slow-Moving Items — least ordered items
    public List<Map<String, Object>> getSlowMovingItems() {
        List<Order> orders = orderRepository.findAll();

        // Get all item order counts (from billed orders only for accuracy)
        Map<String, Long> itemCounts = orders.stream()
                .filter(o -> "BILLED".equals(o.getStatus()))
                .flatMap(o -> o.getItems().stream())
                .collect(Collectors.groupingBy(
                        item -> item.getMenuItem().getName(),
                        Collectors.summingLong(OrderItem::getQuantity)));

        // Also track category and price
        Map<String, String> itemCategory = orders.stream()
                .flatMap(o -> o.getItems().stream())
                .collect(Collectors.toMap(
                        item -> item.getMenuItem().getName(),
                        item -> item.getMenuItem().getCategory(),
                        (a, b) -> a));

        Map<String, Double> itemPrice = orders.stream()
                .flatMap(o -> o.getItems().stream())
                .collect(Collectors.toMap(
                        item -> item.getMenuItem().getName(),
                        item -> item.getMenuItem().getPrice(),
                        (a, b) -> a));

        if (itemCounts.isEmpty()) return Collections.emptyList();

        long maxCount = itemCounts.values().stream().mapToLong(Long::longValue).max().orElse(1);

        // Bottom 5 by quantity
        return itemCounts.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .limit(5)
                .map(e -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("item", e.getKey());
                    map.put("totalSold", e.getValue());
                    map.put("category", itemCategory.getOrDefault(e.getKey(), "Unknown"));
                    map.put("price", itemPrice.getOrDefault(e.getKey(), 0.0));
                    map.put("demandPercent", Math.round(e.getValue() * 100.0 / maxCount));
                    return map;
                })
                .collect(Collectors.toList());
    }

    // 4. Stock Depletion Prediction
    public List<Map<String, Object>> getStockDepletion() {
        List<Ingredient> ingredients = ingredientRepository.findAll();
        List<Order> recentOrders = orderRepository.findAllByCreatedAtAfter(
                LocalDateTime.now().minusDays(7));

        // Calculate daily consumption per ingredient from recent orders
        Map<Long, Double> dailyUsage = new HashMap<>();

        for (Order order : recentOrders) {
            if (!"BILLED".equals(order.getStatus())) continue;
            for (OrderItem oi : order.getItems()) {
                List<RecipeIngredient> recipeIngredients = recipeIngredientRepository
                        .findByRecipe_MenuItem(oi.getMenuItem());
                for (RecipeIngredient ri : recipeIngredients) {
                    dailyUsage.merge(ri.getIngredient().getId(),
                            (ri.getQuantity() != null ? ri.getQuantity() : 0) * oi.getQuantity(),
                            Double::sum);
                }
            }
        }

        // Normalize to daily average (over 7 days)
        dailyUsage.replaceAll((k, v) -> v / 7.0);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Ingredient ing : ingredients) {
            double usage = dailyUsage.getOrDefault(ing.getId(), 0.0);
            double daysLeft = usage > 0 ? ing.getQuantity() / usage : -1; // -1 means no usage data

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("name", ing.getName());
            map.put("currentStock", ing.getQuantity());
            map.put("unit", ing.getUnit());
            map.put("dailyUsage", Math.round(usage * 100.0) / 100.0);
            map.put("daysLeft", daysLeft > 0 ? Math.round(daysLeft * 10.0) / 10.0 : null);
            map.put("status",
                    daysLeft <= 0 ? "no-data" :
                    daysLeft <= 3 ? "critical" :
                    daysLeft <= 7 ? "warning" : "good");
            map.put("minThreshold", ing.getMinThreshold());
            result.add(map);
        }

        // Sort: critical first, then warning, then good, then no-data
        result.sort((a, b) -> {
            Map<String, Integer> priority = Map.of("critical", 0, "warning", 1, "good", 2, "no-data", 3);
            return Integer.compare(
                    priority.getOrDefault(a.get("status"), 3),
                    priority.getOrDefault(b.get("status"), 3));
        });

        return result;
    }

    // 5. Payment Method Insights
    public Map<String, Object> getPaymentInsights() {
        List<Bill> bills = billRepository.findAll();

        Map<String, Long> countByMethod = bills.stream()
                .filter(b -> b.getPaymentMethod() != null)
                .collect(Collectors.groupingBy(Bill::getPaymentMethod, Collectors.counting()));

        Map<String, Double> revenueByMethod = bills.stream()
                .filter(b -> b.getPaymentMethod() != null)
                .collect(Collectors.groupingBy(Bill::getPaymentMethod,
                        Collectors.summingDouble(Bill::getTotalAmount)));

        long totalBills = countByMethod.values().stream().mapToLong(Long::longValue).sum();
        double totalRevenue = revenueByMethod.values().stream().mapToDouble(Double::doubleValue).sum();

        List<Map<String, Object>> methods = new ArrayList<>();
        for (String method : new String[]{"CASH", "UPI", "CARD"}) {
            long count = countByMethod.getOrDefault(method, 0L);
            double revenue = revenueByMethod.getOrDefault(method, 0.0);
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("method", method);
            map.put("count", count);
            map.put("revenue", Math.round(revenue));
            map.put("percent", totalBills > 0 ? Math.round(count * 1000.0 / totalBills) / 10.0 : 0);
            methods.add(map);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("methods", methods);
        result.put("totalBills", totalBills);
        result.put("totalRevenue", Math.round(totalRevenue));
        return result;
    }

    // 6. Table Turnover Rate
    public List<Map<String, Object>> getTableTurnover() {
        List<Bill> bills = billRepository.findAll();
        List<Order> orders = orderRepository.findAll();

        // Group bills and orders by tableId
        Map<Long, List<Bill>> billsByTable = bills.stream()
                .collect(Collectors.groupingBy(Bill::getTableId));

        Map<Long, List<Order>> ordersByTable = orders.stream()
                .filter(o -> "BILLED".equals(o.getStatus()))
                .collect(Collectors.groupingBy(Order::getTableId));

        // Get all tables for table number mapping
        List<com.brewly.brewly_backend.pos.Table> tables = tableRepository.findAll();
        Map<Long, String> tableNumberMap = tables.stream()
                .collect(Collectors.toMap(
                        com.brewly.brewly_backend.pos.Table::getId,
                        com.brewly.brewly_backend.pos.Table::getTableNumber));
        Map<Long, Integer> tableSeatsMap = tables.stream()
                .collect(Collectors.toMap(
                        com.brewly.brewly_backend.pos.Table::getId,
                        com.brewly.brewly_backend.pos.Table::getSeats));

        List<Map<String, Object>> result = new ArrayList<>();
        for (com.brewly.brewly_backend.pos.Table table : tables) {
            List<Bill> tableBills = billsByTable.getOrDefault(table.getId(), Collections.emptyList());
            List<Order> tableOrders = ordersByTable.getOrDefault(table.getId(), Collections.emptyList());

            int totalOrders = tableBills.size();

            // Calculate average session duration (order created → bill created)
            double avgMinutes = 0;
            int sessionCount = 0;
            for (Bill bill : tableBills) {
                // Find the earliest order for this table around the bill time
                Optional<Order> matchingOrder = tableOrders.stream()
                        .filter(o -> o.getTableId().equals(table.getId())
                                && o.getCreatedAt().isBefore(bill.getCreatedAt())
                                && ChronoUnit.HOURS.between(o.getCreatedAt(), bill.getCreatedAt()) < 12)
                        .min(Comparator.comparing(Order::getCreatedAt));

                if (matchingOrder.isPresent()) {
                    long minutes = ChronoUnit.MINUTES.between(
                            matchingOrder.get().getCreatedAt(), bill.getCreatedAt());
                    if (minutes > 0 && minutes < 720) { // reasonable: < 12 hours
                        avgMinutes += minutes;
                        sessionCount++;
                    }
                }
            }
            avgMinutes = sessionCount > 0 ? avgMinutes / sessionCount : 0;

            // Revenue for this table
            double tableRevenue = tableBills.stream()
                    .mapToDouble(Bill::getTotalAmount)
                    .sum();

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("tableNumber", tableNumberMap.getOrDefault(table.getId(), "T" + table.getId()));
            map.put("seats", tableSeatsMap.getOrDefault(table.getId(), 0));
            map.put("totalOrders", totalOrders);
            map.put("avgSessionMinutes", Math.round(avgMinutes));
            map.put("totalRevenue", Math.round(tableRevenue));
            map.put("revenuePerOrder", totalOrders > 0 ? Math.round(tableRevenue / totalOrders) : 0);
            result.add(map);
        }

        // Sort by total orders descending (busiest tables first)
        result.sort((a, b) -> Integer.compare(
                (int) b.get("totalOrders"),
                (int) a.get("totalOrders")));

        return result;
    }
}
