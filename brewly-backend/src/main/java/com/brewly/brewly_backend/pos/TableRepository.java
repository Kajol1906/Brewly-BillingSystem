package com.brewly.brewly_backend.pos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<Table, Long> {
    long countByStatus(Table.TableStatus status);
    List<Table> findByStatus(Table.TableStatus status);
}
