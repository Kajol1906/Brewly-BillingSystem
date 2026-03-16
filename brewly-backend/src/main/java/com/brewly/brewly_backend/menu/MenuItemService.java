package com.brewly.brewly_backend.menu;

import com.brewly.brewly_backend.recipe.Recipe;
import com.brewly.brewly_backend.recipe.RecipeIngredient;
import com.brewly.brewly_backend.recipe.RecipeRepository;
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

    public List<MenuItem> getAllItems() {
        return repository.findAll();
    }

    public List<MenuItem> getAvailableItems() {
        return repository.findByAvailableTrue();                      
    }

    public List<MenuItem> getByCategory(String category) {
        return repository.findByCategory(category.toUpperCase());
    }

    public List<MenuItem> searchItems(String keyword) {
        return repository.findByNameContainingIgnoreCase(keyword);
    }

    public List<String> getAllCategories() {
        return repository.findDistinctCategories();
    }

    public Map<String, Long> getCategoryItemCounts() {
        Map<String, Long> counts = new LinkedHashMap<>();
        for (String cat : repository.findDistinctCategories()) {
            counts.put(cat, repository.countByCategory(cat));
        }
        return counts;
    }

    @Transactional
    public void deleteCategory(String category) {
        List<MenuItem> items = repository.findByCategory(category.toUpperCase());
        for (MenuItem item : items) {
            List<Recipe> recipes = recipeRepository.findByMenuItem(item);
            recipeRepository.deleteAll(recipes);
        }
        repository.deleteByCategory(category.toUpperCase());
    }

    @Transactional
    public void reassignCategory(String oldCategory, String newCategory) {
        List<MenuItem> items = repository.findByCategory(oldCategory.toUpperCase());
        for (MenuItem item : items) {
            item.setCategory(newCategory.toUpperCase());
        }
        repository.saveAll(items);
    }

    public MenuItem addItem(MenuItem item) {
        item.setAvailable(true);
        return repository.save(item);
    }

    public MenuItem updateItem(Long id, MenuItem updated) {
        MenuItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
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
        MenuItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        boolean current = Boolean.TRUE.equals(item.getAvailable());
        item.setAvailable(!current);

        return repository.save(item);
    }

    @Transactional
    public Map<String, Object> bulkImport(List<MenuItem> items) {
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

        List<Recipe> recipes = recipeRepository.findByMenuItem(item);

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

            if (!available)
                break;
        }

        item.setAvailable(available);
        repository.save(item);
    }

}
