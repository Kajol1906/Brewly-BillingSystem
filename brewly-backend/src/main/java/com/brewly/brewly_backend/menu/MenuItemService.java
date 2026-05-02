package com.brewly.brewly_backend.menu;

import com.brewly.brewly_backend.recipe.Recipe;
import com.brewly.brewly_backend.recipe.RecipeIngredient;
import com.brewly.brewly_backend.recipe.RecipeRepository;
import com.brewly.brewly_backend.security.UserContextHelper;
import com.brewly.brewly_backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository repository;
    private final RecipeRepository recipeRepository;
    private final UserContextHelper userContextHelper;

    public List<MenuItem> getAllItems() {
        User user = userContextHelper.getCurrentUser();
        return repository.findByUser(user).stream()
                .filter(item -> !item.getCategory().equalsIgnoreCase("DELETED"))
                .collect(java.util.stream.Collectors.toList());
    }

    public List<MenuItem> getAvailableItems() {
        User user = userContextHelper.getCurrentUser();
        return repository.findByUserAndAvailableTrue(user);                      
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
            if (cat.equalsIgnoreCase("DELETED")) continue;
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
    }

    @Transactional
    public void reassignCategory(String oldCategory, String newCategory) {
        User user = userContextHelper.getCurrentUser();
        List<MenuItem> items = repository.findByUserAndCategory(user, oldCategory.toUpperCase());
        for (MenuItem item : items) {
            item.setCategory(newCategory.toUpperCase());
        }
        repository.saveAll(items);
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
    }

    @Transactional
    public void bulkUpdateCategory(List<Long> ids, String newCategory) {
        User user = userContextHelper.getCurrentUser();
        List<MenuItem> items = repository.findAllById(ids);
        for(MenuItem item : items){
            if (item.getUser().getId().equals(user.getId())) {
                item.setCategory(newCategory.toUpperCase());
            }
        }
        repository.saveAll(items);
    }

    public MenuItem addItem(MenuItem item) {
        User user = userContextHelper.getCurrentUser();
        item.setUser(user);
        item.setAvailable(true);
        return repository.save(item);
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
        return repository.save(item);
    }

    // toggle logic
    public MenuItem toggleAvailability(Long id) {
        User user = userContextHelper.getCurrentUser();
        MenuItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        boolean current = Boolean.TRUE.equals(item.getAvailable());
        item.setAvailable(!current);

        return repository.save(item);
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
                    ? item.getCategory().trim().toUpperCase() : "UNCATEGORIZED");
            item.setAvailable(true);
            item.setId(null);
            repository.save(item);
            imported++;
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("imported", imported);
        result.put("skipped", skipped);
        result.put("total", items.size());
        return result;
    }

    // fixed availability check
    public void updateAvailabilityBasedOnStock(MenuItem item) {
        User user = userContextHelper.getCurrentUser();
        List<Recipe> recipes = recipeRepository.findByUserAndMenuItem(user, item);

        boolean available = true;

        for (Recipe recipe : recipes) {
            for (RecipeIngredient ri : recipe.getRecipeIngredients()) {
                double requiredQty = ri.getQuantity();
                double availableQty = ri.getIngredient().getQuantity();

                if (availableQty < requiredQty) {
                    available = false;
                    break;
                }
            }
            if (!available) break;
        }

        item.setAvailable(available);
        repository.save(item);
    }

}
