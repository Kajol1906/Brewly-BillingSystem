package com.brewly.brewly_backend.pos;

import com.brewly.brewly_backend.inventory.Ingredient;
import com.brewly.brewly_backend.inventory.IngredientRepository;
import com.brewly.brewly_backend.menu.MenuItem;
import com.brewly.brewly_backend.menu.MenuItemRepository;
import com.brewly.brewly_backend.menu.MenuItemService;
import com.brewly.brewly_backend.recipe.RecipeIngredient;
import com.brewly.brewly_backend.recipe.RecipeIngredientRepository;
import com.brewly.brewly_backend.security.UserContextHelper;
import com.brewly.brewly_backend.user.User;
// These imports are in fact used at the bottom of the file inside placeOrder()
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final MenuItemRepository menuItemRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final IngredientRepository ingredientRepository;
    private final MenuItemService menuItemService;
    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;
    private final UserContextHelper userContextHelper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void placeOrder(OrderRequest request) {
        User user = userContextHelper.getCurrentUser();

        // 1️⃣ Fetch menu item
        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        if (!menuItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (menuItem.getAvailable() != null && !menuItem.getAvailable()) {
            throw new RuntimeException(menuItem.getName() + " is out of stock");
        }

        // 2️⃣ Fetch recipe ingredients
        List<RecipeIngredient> recipeIngredients = recipeIngredientRepository.findByRecipe_MenuItem(menuItem);

        if (!recipeIngredients.isEmpty()) {
            // 3️⃣ Validate stock — ensure enough for the full requested quantity
            for (RecipeIngredient ri : recipeIngredients) {
                Ingredient ingredient = ri.getIngredient();
                double requiredQty = ri.getQuantity() * request.getQuantity();

                if (ingredient.getQuantity() < requiredQty) {
                    throw new RuntimeException(
                             ingredient.getName() + " is out of stock");
                }
            }

            // 4️⃣ Deduct stock
            for (RecipeIngredient ri : recipeIngredients) {
                Ingredient ingredient = ri.getIngredient();
                double requiredQty = ri.getQuantity() * request.getQuantity();

                ingredient.setQuantity(
                        ingredient.getQuantity() - requiredQty);

                ingredientRepository.save(ingredient);
            }

            // 5️⃣ Recalculate availability for THIS menu item
            menuItemService.updateAvailabilityBasedOnStock(menuItem);

            // 5b️⃣ Also recalculate availability for ALL other menu items
            //      that share any of the same ingredients (they may also go out of stock)
            java.util.Set<Long> updatedMenuItemIds = new java.util.HashSet<>();
            updatedMenuItemIds.add(menuItem.getId());

            for (RecipeIngredient ri : recipeIngredients) {
                List<com.brewly.brewly_backend.recipe.RecipeIngredient> sharedMappings =
                        recipeIngredientRepository.findByIngredient(ri.getIngredient());
                for (com.brewly.brewly_backend.recipe.RecipeIngredient shared : sharedMappings) {
                    MenuItem affectedItem = shared.getRecipe().getMenuItem();
                    if (updatedMenuItemIds.add(affectedItem.getId())) {
                        menuItemService.updateAvailabilityBasedOnStock(affectedItem);
                    }
                }
            }
        }

        // 6️⃣ SAVE ORDER TO DB
        Order order = new Order();
        order.setUser(user);
        OrderItem orderItem = new OrderItem();
        orderItem.setMenuItem(menuItem);
        orderItem.setQuantity(request.getQuantity());
        orderItem.setPriceAtOrder(menuItem.getPrice());
        orderItem.setOrder(order);

        order.setItems(List.of(orderItem));

        if (request.getTableId() != null) {
            order.setTableId(request.getTableId());
        }
        if (request.getTakeawayName() != null) {
            order.setTakeawayName(request.getTakeawayName());
        }
        // Both dine-in and takeaway start as ACTIVE so they appear on KDS
        order.setStatus("ACTIVE");

        orderRepository.save(order);

        // 7️⃣ Update Table status to OCCUPIED
        if (request.getTableId() != null) {
            Table table = tableRepository.findById(request.getTableId())
                    .orElseThrow(() -> new RuntimeException("Table not found"));
            if (!table.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized");
            }
            table.setStatus(Table.TableStatus.OCCUPIED);
            double itemTotal = menuItem.getPrice() * request.getQuantity();
            table.setCurrentBill((table.getCurrentBill() == null ? 0.0 : table.getCurrentBill()) + itemTotal);
            tableRepository.save(table);
        }

        // 8️⃣ Broadcast socket update to client
        try {
            simpMessagingTemplate.convertAndSend("/topic/orders", "updated");
            simpMessagingTemplate.convertAndSend("/topic/tables", "updated");
            simpMessagingTemplate.convertAndSend("/topic/menu", "updated");
        } catch (Exception ignored) {}
    }

    public List<OrderItemDTO> getActiveOrdersForTable(Long tableId) {
        User user = userContextHelper.getCurrentUser();
        List<Order> activeOrders = orderRepository.findByUserAndTableIdAndStatus(user, tableId, "ACTIVE");
        List<Order> preparedOrders = orderRepository.findByUserAndTableIdAndStatus(user, tableId, "PREPARED");

        List<Order> allOrders = new java.util.ArrayList<>();
        allOrders.addAll(activeOrders);
        allOrders.addAll(preparedOrders);

        // Aggregate items by menu item ID AND price to combine quantities of identical items
        // placed in separate orders, but keep them separate if price changed.
        java.util.Map<String, OrderItemDTO> aggregatedItems = new java.util.HashMap<>();

        for (Order order : allOrders) {
            for (OrderItem item : order.getItems()) {
                Long menuId = item.getMenuItem().getId();
                Double priceAtOrder = item.getPriceAtOrder() != null ? item.getPriceAtOrder() : item.getMenuItem().getPrice();
                String key = menuId + "_" + priceAtOrder;
                
                if (aggregatedItems.containsKey(key)) {
                    OrderItemDTO existingDto = aggregatedItems.get(key);
                    existingDto.setQuantity(existingDto.getQuantity() + item.getQuantity());
                } else {
                    aggregatedItems.put(key, new OrderItemDTO(
                            item.getId() != null ? item.getId() : menuId, // Use OrderItem ID for unique React key
                            item.getMenuItem().getName(),
                            priceAtOrder,
                            item.getQuantity()));
                }
            }
        }

        return new java.util.ArrayList<>(aggregatedItems.values());
    }

    public List<Order> getAllActiveOrders() {
        User user = userContextHelper.getCurrentUser();
        java.time.LocalDateTime todayStart = java.time.LocalDate.now().atStartOfDay();
        return orderRepository.findAllByUserAndCreatedAtAfterAndStatus(user, todayStart, "ACTIVE");
    }

    public void markOrderAsPrepared(Long orderId) {
        User user = userContextHelper.getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        order.setStatus("PREPARED");
        orderRepository.save(order);

        // Broadcast updates
        try {
            simpMessagingTemplate.convertAndSend("/topic/orders", "updated");
        } catch (Exception ignored) {}
    }
}
