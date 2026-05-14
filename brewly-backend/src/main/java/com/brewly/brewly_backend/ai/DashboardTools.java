package com.brewly.brewly_backend.ai;

import com.brewly.brewly_backend.pos.Order;
import com.brewly.brewly_backend.pos.OrderRepository;
import com.brewly.brewly_backend.pos.TableRepository;
import com.brewly.brewly_backend.inventory.IngredientRepository;
import com.brewly.brewly_backend.events.EventRepository;
import com.brewly.brewly_backend.security.UserContextHelper;
import com.brewly.brewly_backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.function.Function;

@Configuration
@RequiredArgsConstructor
public class DashboardTools {

    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;
    private final IngredientRepository ingredientRepository;
    private final EventRepository eventRepository;
    private final UserContextHelper userContextHelper;

    public record MetricsRequest(String period) {}
    public record MetricsResponse(double revenue, long orderCount, long occupiedTables, long totalTables, long lowStockCount, long upcomingEvents) {}

    @Bean
    @Description("Get dashboard metrics like revenue, order count, occupied tables, low stock count, and upcoming events for a specific period (today, yesterday, week, month)")
    public Function<MetricsRequest, MetricsResponse> getDashboardMetrics() {
        return request -> {
            User user = userContextHelper.getCurrentUser();
            String period = request.period() != null ? request.period() : "today";
            
            LocalDateTime start, end;
            LocalDate today = LocalDate.now();

            switch (period) {
                case "yesterday":
                    start = today.minusDays(1).atStartOfDay();
                    end = today.atStartOfDay();
                    break;
                case "week":
                    start = today.minusDays(6).atStartOfDay();
                    end = today.plusDays(1).atStartOfDay();
                    break;
                case "month":
                    start = today.withDayOfMonth(1).atStartOfDay();
                    end = today.plusDays(1).atStartOfDay();
                    break;
                default:
                    start = today.atStartOfDay();
                    end = today.plusDays(1).atStartOfDay();
                    break;
            }

            List<Order> orders = orderRepository.findAllByUserAndCreatedAtBetweenAndStatus(user, start, end, "BILLED");
            
            double revenue = orders.stream()
                    .flatMap(o -> o.getItems().stream())
                    .mapToDouble(item -> item.getQuantity() * item.getMenuItem().getPrice())
                    .sum();
            
            long orderCount = orders.size();
            long occupiedTables = tableRepository.countByUserAndStatus(user, com.brewly.brewly_backend.pos.Table.TableStatus.OCCUPIED);
            long totalTables = tableRepository.findByUser(user).size();
            long lowStockCount = ingredientRepository.countLowStockIngredientsByUser(user);
            long upcomingEventsCount = eventRepository.countByUserAndDateGreaterThanEqual(user, LocalDate.now());

            return new MetricsResponse(revenue, orderCount, occupiedTables, totalTables, lowStockCount, upcomingEventsCount);
        };
    }
}
