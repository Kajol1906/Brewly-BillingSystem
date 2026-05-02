package com.brewly.brewly_backend.menu;

import com.brewly.brewly_backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByUserAndCategory(User user, String category);

    List<MenuItem> findByUserAndNameContainingIgnoreCase(User user, String name);

    @Query("SELECT m FROM MenuItem m WHERE m.user = :user AND m.available = true AND m.category <> 'DELETED'")
    List<MenuItem> findByUserAndAvailableTrue(@Param("user") User user);

    @Query("SELECT DISTINCT m.category FROM MenuItem m WHERE m.user = :user AND m.category <> 'DELETED' ORDER BY m.category")
    List<String> findDistinctCategoriesByUser(@Param("user") User user);

    long countByUserAndCategory(User user, String category);

    void deleteByUserAndCategory(User user, String category);

    @Query("SELECT COUNT(o) FROM OrderItem o WHERE o.menuItem.id = :id")
    long countOrderItemsByMenuItemId(@Param("id") Long id);

    List<MenuItem> findByUser(User user);
}
