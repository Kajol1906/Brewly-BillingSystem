package com.brewly.brewly_backend.menu;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByCategory(String category);

    List<MenuItem> findByNameContainingIgnoreCase(String name);

    List<MenuItem> findByAvailableTrue(); // POS

    @Query("SELECT DISTINCT m.category FROM MenuItem m ORDER BY m.category")
    List<String> findDistinctCategories();

    long countByCategory(String category);

    void deleteByCategory(String category);
}
