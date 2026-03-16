package com.brewly.brewly_backend.pos;

import com.brewly.brewly_backend.inventory.Ingredient;
import com.brewly.brewly_backend.inventory.IngredientRepository;
import com.brewly.brewly_backend.menu.MenuItem;
import com.brewly.brewly_backend.menu.MenuItemRepository;
import com.brewly.brewly_backend.menu.MenuItemService;
import com.brewly.brewly_backend.recipe.RecipeIngredient;
import com.brewly.brewly_backend.recipe.RecipeIngredientRepository;
// These imports are in fact used at the bottom of the file inside placeOrder()
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    public void placeOrder(OrderRequest request) {

        // 1️⃣ Fetch menu item
        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        // 2️⃣ Fetch recipe ingredients
        List<RecipeIngredient> recipeIngredients = recipeIngredientRepository.findByRecipe_MenuItem(menuItem);

        if (!recipeIngredients.isEmpty()) {
            // 3️⃣ Validate stock
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

            // 5️⃣ Auto update availability
            menuItemService.updateAvailabilityBasedOnStock(menuItem);
        }

        // 6️⃣ SAVE ORDER TO DB
        Order order = new Order();
        OrderItem orderItem = new OrderItem();
        orderItem.setMenuItem(menuItem);
        orderItem.setQuantity(request.getQuantity());
        orderItem.setOrder(order);

        order.setItems(List.of(orderItem));

        if (request.getTableId() != null) {
            order.setTableId(request.getTableId());
            order.setStatus("ACTIVE");
        }

        orderRepository.save(order);

        // 7️⃣ Update Table status to OCCUPIED
        if (request.getTableId() != null) {
            Table table = tableRepository.findById(request.getTableId())
                    .orElseThrow(() -> new RuntimeException("Table not found"));
            table.setStatus(Table.TableStatus.OCCUPIED);
            double itemTotal = menuItem.getPrice() * request.getQuantity();
            table.setCurrentBill((table.getCurrentBill() == null ? 0.0 : table.getCurrentBill()) + itemTotal);
            tableRepository.save(table);
        }
    }

    public List<OrderItemDTO> getActiveOrdersForTable(Long tableId) {
        List<Order> activeOrders = orderRepository.findByTableIdAndStatus(tableId, "ACTIVE");

        // Aggregate items by menu item ID to combine quantities of identical items
        // placed in separate orders
        java.util.Map<Long, OrderItemDTO> aggregatedItems = new java.util.HashMap<>();

        for (Order order : activeOrders) {
            for (OrderItem item : order.getItems()) {
                Long menuId = item.getMenuItem().getId();
                if (aggregatedItems.containsKey(menuId)) {
                    OrderItemDTO existingDto = aggregatedItems.get(menuId);
                    existingDto.setQuantity(existingDto.getQuantity() + item.getQuantity());
                } else {
                    aggregatedItems.put(menuId, new OrderItemDTO(
                            menuId,
                            item.getMenuItem().getName(),
                            item.getMenuItem().getPrice(),
                            item.getQuantity()));
                }
            }
        }

        return new java.util.ArrayList<>(aggregatedItems.values());
    }
}
