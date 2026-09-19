package com.brewly.brewly_backend.menu;

import com.brewly.brewly_backend.recipe.Recipe;
import com.brewly.brewly_backend.recipe.RecipeIngredient;
import com.brewly.brewly_backend.recipe.RecipeRepository;
import com.brewly.brewly_backend.recipe.RecipeIngredientRepository;
import com.brewly.brewly_backend.security.UserContextHelper;
import com.brewly.brewly_backend.user.User;
import com.brewly.brewly_backend.user.UserRepository;
import com.brewly.brewly_backend.inventory.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository repository;
    private final RecipeRepository recipeRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final UserContextHelper userContextHelper;
    private final UserRepository userRepository;
    private final IngredientRepository ingredientRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    private void broadcastMenuUpdate() {
        try {
            simpMessagingTemplate.convertAndSend("/topic/menu", "updated");
        } catch (Exception ignored) {}
    }

    public List<MenuItem> getAllItems() {
        User user = userContextHelper.getCurrentUser();
        return repository.findByUser(user).stream()
                .filter(item -> !item.getCategory().equalsIgnoreCase("DELETED"))
                .collect(java.util.stream.Collectors.toList());
    }

    public List<MenuItem> getAvailableItems() {
        User user = userContextHelper.getCurrentUser();
        List<MenuItem> allItems = repository.findByUser(user).stream()
                .filter(item -> !item.getCategory().equalsIgnoreCase("DELETED"))
                .collect(java.util.stream.Collectors.toList());

        for (MenuItem item : allItems) {
            updateAvailabilityBasedOnStock(item);
        }

        return allItems;
    }

    public List<MenuItem> getByCategory(String category) {
        User user = userContextHelper.getCurrentUser();
        return repository.findByUserAndCategory(user, category.toUpperCase());
    }

    public List<MenuItem> searchItems(String keyword) {
        User user = userContextHelper.getCurrentUser();
        return repository.findByUserAndNameContainingIgnoreCase(user, keyword);
    }

    public List<String> getAllCategories() {
        User user = userContextHelper.getCurrentUser();
        return repository.findDistinctCategoriesByUser(user).stream()
                .filter(cat -> !cat.equalsIgnoreCase("DELETED"))
                .collect(java.util.stream.Collectors.toList());
    }

    public Map<String, Long> getCategoryItemCounts() {
        User user = userContextHelper.getCurrentUser();
        Map<String, Long> counts = new LinkedHashMap<>();
        for (String cat : repository.findDistinctCategoriesByUser(user)) {
            if (cat.equalsIgnoreCase("DELETED"))
                continue;
            counts.put(cat, repository.countByUserAndCategory(user, cat));
        }
        return counts;
    }

    @Transactional
    public void deleteCategory(String category) {
        User user = userContextHelper.getCurrentUser();
        List<MenuItem> items = repository.findByUserAndCategory(user, category.toUpperCase());
        for (MenuItem item : items) {
            List<Recipe> recipes = recipeRepository.findByUserAndMenuItem(user, item);
            recipeRepository.deleteAll(recipes);
        }
        repository.deleteByUserAndCategory(user, category.toUpperCase());
        broadcastMenuUpdate();
    }

    @Transactional
    public void reassignCategory(String oldCategory, String newCategory) {
        User user = userContextHelper.getCurrentUser();
        List<MenuItem> items = repository.findByUserAndCategory(user, oldCategory.toUpperCase());
        for (MenuItem item : items) {
            item.setCategory(newCategory.toUpperCase());
        }
        repository.saveAll(items);
        broadcastMenuUpdate();
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        User user = userContextHelper.getCurrentUser();
        MenuItem item = repository.findById(id).orElseThrow(() -> new RuntimeException("Item not found"));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        List<Recipe> recipes = recipeRepository.findByUserAndMenuItem(user, item);
        recipeRepository.deleteAll(recipes);

        long orderCount = repository.countOrderItemsByMenuItemId(id);

        if (orderCount > 0) {
            // "Smart" soft-delete for items with order history
            item.setAvailable(false);
            item.setCategory("DELETED");
            repository.save(item);
        } else {
            repository.delete(item);
        }
        broadcastMenuUpdate();
    }

    @Transactional
    public void bulkUpdateCategory(List<Long> ids, String newCategory) {
        User user = userContextHelper.getCurrentUser();
        List<MenuItem> items = repository.findAllById(ids);
        for (MenuItem item : items) {
            if (item.getUser().getId().equals(user.getId())) {
                item.setCategory(newCategory.toUpperCase());
            }
        }
        repository.saveAll(items);
        broadcastMenuUpdate();
    }

    public MenuItem addItem(MenuItem item) {
        User user = userContextHelper.getCurrentUser();
        item.setUser(user);
        item.setAvailable(true);
        item.setManuallyUnavailable(false);
        MenuItem saved = repository.save(item);
        broadcastMenuUpdate();
        return saved;
    }

    public MenuItem updateItem(Long id, MenuItem updated) {
        User user = userContextHelper.getCurrentUser();
        MenuItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        item.setName(updated.getName());
        item.setPrice(updated.getPrice());
        item.setCategory(updated.getCategory().toUpperCase());
        if (updated.getImageUrl() != null) {
            item.setImageUrl(updated.getImageUrl());
        }
        MenuItem saved = repository.save(item);
        broadcastMenuUpdate();
        return saved;
    }

    // toggle logic
    public MenuItem toggleAvailability(Long id) {
        User user = userContextHelper.getCurrentUser();
        MenuItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        boolean currentManuallyUnavailable = Boolean.TRUE.equals(item.getManuallyUnavailable());
        item.setManuallyUnavailable(!currentManuallyUnavailable);

        if (!currentManuallyUnavailable) {
            item.setAvailable(false);
        } else {
            updateAvailabilityBasedOnStock(item);
        }

        MenuItem saved = repository.save(item);
        broadcastMenuUpdate();
        return saved;
    }

    @Transactional
    public Map<String, Object> bulkImport(List<MenuItem> items) {
        User user = userContextHelper.getCurrentUser();
        int imported = 0;
        int skipped = 0;
        for (MenuItem item : items) {
            if (item.getName() == null || item.getName().trim().isEmpty()) {
                skipped++;
                continue;
            }
            if (item.getPrice() == null || item.getPrice() <= 0) {
                skipped++;
                continue;
            }
            item.setUser(user);
            item.setName(item.getName().trim());
            item.setCategory(item.getCategory() != null && !item.getCategory().trim().isEmpty()
                    ? item.getCategory().trim().toUpperCase()
                    : "UNCATEGORIZED");
            item.setAvailable(true);
            item.setManuallyUnavailable(false);
            item.setId(null);
            repository.save(item);
            imported++;
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("imported", imported);
        result.put("skipped", skipped);
        result.put("total", items.size());
        if (imported > 0) {
            broadcastMenuUpdate();
        }
        return result;
    }

    // Check availability: item is available only if every ingredient has
    // enough stock (above minThreshold) to make at least one serving.
    public void updateAvailabilityBasedOnStock(MenuItem item) {
        if (Boolean.TRUE.equals(item.getManuallyUnavailable())) {
            item.setAvailable(false);
            repository.save(item);
            return;
        }

        List<RecipeIngredient> recipeIngredients = recipeIngredientRepository.findByRecipe_MenuItem(item);

        // If no recipe is linked, item is always available (no stock tracking)
        if (recipeIngredients.isEmpty()) {
            item.setAvailable(true);
            repository.save(item);
            return;
        }

        boolean available = true;

        for (RecipeIngredient ri : recipeIngredients) {
            double requiredQty = ri.getQuantity();
            double currentStock = ri.getIngredient().getQuantity();
            double minThreshold = ri.getIngredient().getMinThreshold() != null
                    ? ri.getIngredient().getMinThreshold()
                    : 0.0;

            // Unavailable if current stock is not enough for one serving,
            // OR if after deducting one serving, stock would fall below minThreshold
            if (currentStock < requiredQty || (currentStock - requiredQty) < minThreshold) {
                available = false;
                break;
            }
        }

        item.setAvailable(available);
        repository.save(item);
    }

}
