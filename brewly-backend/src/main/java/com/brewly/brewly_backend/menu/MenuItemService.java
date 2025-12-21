package com.brewly.brewly_backend.menu;


import com.brewly.brewly_backend.recipe.Recipe;
import com.brewly.brewly_backend.recipe.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public List<MenuItem> getByCategory(String category){
        return repository.findByCategory(category);
    }

    public List<MenuItem> searchItems(String keyword){
        return repository.findByNameContainingIgnoreCase(keyword);
    }

    public MenuItem addItem(MenuItem item){
        item.setAvailable(true);
        return repository.save(item);
    }

    public MenuItem toggleAvailability(Long id){
        MenuItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setAvailable(!item.isAvailable());
        return repository.save(item);
    }
    public void updateAvailabilityBasedOnStock(MenuItem item) {
        // 1️⃣ Get all ingredients required for this menu item
        List<Recipe> recipes = recipeRepository.findByMenuItem(item);

        boolean available = true;

        // 2️⃣ Check ingredient stock
        for (Recipe recipe : recipes) {

            double requiredQty = recipe.getRequiredQuantity();
            double availableQty = recipe.getIngredient().getQuantity();

            // ❌ If any ingredient is insufficient
            if (availableQty < requiredQty) {
                available = false;
                break;
            }
        }

        // 3️⃣ Update availability
        item.setAvailable(available);
        repository.save(item);
    }
}
