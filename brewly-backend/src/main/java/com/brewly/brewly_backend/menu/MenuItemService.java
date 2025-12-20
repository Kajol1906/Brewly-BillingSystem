package com.brewly.brewly_backend.menu;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository repository;

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
        // TODO (Phase 2):
        // 1. Fetch recipe by menu item
        // 2. Check ingredient stock
        // 3. If any ingredient insufficient → setAvailable(false)
        // 4. Else → setAvailable(true)
    }
}
