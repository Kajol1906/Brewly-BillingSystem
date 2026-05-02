package com.brewly.brewly_backend.events;

import com.brewly.brewly_backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    long countByUserAndDateAfter(User user, java.time.LocalDate date);
    long countByUserAndDateGreaterThanEqual(User user, java.time.LocalDate date);
    List<Event> findByUserAndDateAndTime(User user, LocalDate date, String time);
    List<Event> findByUserAndTablesId(User user, Long tableId);
    List<Event> findByUserAndTablesIdAndDate(User user, Long tableId, LocalDate date);
    List<Event> findByUserAndDate(User user, LocalDate date);
    List<Event> findByUserAndDateGreaterThanEqualOrderByDateAsc(User user, LocalDate date);
    List<Event> findByUser(User user);
}
