package com.brewly.brewly_backend.menu;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByCategory(String category);

    List<MenuItem> findByNameContainingIgnoreCase(String name);

    List<MenuItem> findByAvailableTrue(); // POS
}
