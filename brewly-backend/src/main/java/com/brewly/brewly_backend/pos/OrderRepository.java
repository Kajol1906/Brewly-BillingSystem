package com.brewly.brewly_backend.pos;

import com.brewly.brewly_backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByUserAndCreatedAtAfter(User user, LocalDateTime date);

    List<Order> findAllByUserAndCreatedAtAfterAndStatus(User user, LocalDateTime date, String status);

    List<Order> findAllByUserAndCreatedAtBetweenAndStatus(User user, LocalDateTime start, LocalDateTime end, String status);

    List<Order> findByUserAndTableIdAndStatus(User user, Long tableId, String status);

    List<Order> findByUser(User user);
}
