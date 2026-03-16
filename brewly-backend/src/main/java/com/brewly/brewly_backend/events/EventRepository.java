package com.brewly.brewly_backend.events;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    long countByDateAfter(java.time.LocalDate date);
    long countByDateGreaterThanEqual(java.time.LocalDate date);
    List<Event> findByDateAndTime(LocalDate date, String time);
    List<Event> findByTablesId(Long tableId);
    List<Event> findByTablesIdAndDate(Long tableId, LocalDate date);
    List<Event> findByDate(LocalDate date);
    List<Event> findByDateGreaterThanEqualOrderByDateAsc(LocalDate date);
}
