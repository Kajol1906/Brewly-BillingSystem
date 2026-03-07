package com.brewly.brewly_backend.pos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByCreatedAtAfter(LocalDateTime date);

    List<Order> findAllByCreatedAtAfterAndStatus(LocalDateTime date, String status);

    List<Order> findAllByCreatedAtBetweenAndStatus(LocalDateTime start, LocalDateTime end, String status);

    List<Order> findByTableIdAndStatus(Long tableId, String status);
}
