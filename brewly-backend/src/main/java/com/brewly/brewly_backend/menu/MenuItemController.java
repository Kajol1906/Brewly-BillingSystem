package com.brewly.brewly_backend.menu;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MenuItemController {

    private final MenuItemService service;

    //get all menu items
    @GetMapping
    public List<MenuItem> getAllItems(){
        return service.getAllItems();
    }

    //pos view
    @GetMapping("/available")
    public List<MenuItem> getAvailableItems(){
        return service.getAvailableItems();
    }


    //filter by category
    @GetMapping("/category/{category}")
    public List<MenuItem> getByCategory(@PathVariable String category){
        return service.getByCategory(category);
    }

    //search menu items
    @GetMapping("/search")
    public List<MenuItem> search(@RequestParam String q){
        return service.searchItems(q);
    }

    //Add new menu item
    @PostMapping
    public MenuItem addItem(@RequestBody MenuItem item){
        return service.addItem(item);
    }

    //get all categories
    @GetMapping("/categories")
    public List<String> getCategories(){
        return service.getAllCategories();
    }

    //get category item counts
    @GetMapping("/categories/counts")
    public Map<String, Long> getCategoryCounts(){
        return service.getCategoryItemCounts();
    }

    //delete a category and all its items
    @DeleteMapping("/category/{category}")
    public void deleteCategory(@PathVariable String category){
        service.deleteCategory(category);
    }

    //reassign items from one category to another
    @PutMapping("/category/{oldCategory}/reassign/{newCategory}")
    public void reassignCategory(@PathVariable String oldCategory, @PathVariable String newCategory){
        service.reassignCategory(oldCategory, newCategory);
    }

    //update menu item
    @PutMapping("/{id}")
    public MenuItem updateItem(@PathVariable Long id, @RequestBody MenuItem item){
        return service.updateItem(id, item);
    }

    //toggle availability
    @PatchMapping("/{id}/toggle")
    public MenuItem toggle(@PathVariable Long id){
        return service.toggleAvailability(id);
    }

    //bulk import menu items
    @PostMapping("/bulk")
    public Map<String, Object> bulkImport(@RequestBody List<MenuItem> items){
        return service.bulkImport(items);
    }
}
