package com.brewly.brewly_backend.pos;

import com.brewly.brewly_backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<Table, Long> {
    long countByUserAndStatus(User user, Table.TableStatus status);
    List<Table> findByUserAndStatus(User user, Table.TableStatus status);
    List<Table> findByUser(User user);
}
