package com.brewly.brewly_backend.menu;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    //toggle availability
    @PatchMapping("/{id}/toggle")
    public MenuItem toggle(@PathVariable Long id){
        return service.toggleAvailability(id);
    }
}
