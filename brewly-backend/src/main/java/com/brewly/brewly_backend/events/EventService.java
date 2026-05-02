package com.brewly.brewly_backend.events;

import com.brewly.brewly_backend.security.UserContextHelper;
import com.brewly.brewly_backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository repository;
    private final com.brewly.brewly_backend.pos.TableRepository tableRepository;
    private final UserContextHelper userContextHelper;

    public List<Event> getAllEvents() {
        User user = userContextHelper.getCurrentUser();
        return repository.findByUser(user);
    }

    public Event createEvent(EventRequest request) {
        User user = userContextHelper.getCurrentUser();
        // Check table conflict: only block if requested tables overlap with existing
        // event tables at same date+time
        if (request.getTableIds() != null && !request.getTableIds().isEmpty()) {
            List<Event> sameSlot = repository.findByUserAndDateAndTime(user, request.getDate(), request.getTime());
            Set<Long> requestedTables = new HashSet<>(request.getTableIds());
            for (Event existing : sameSlot) {
                if (existing.getTables() != null) {
                    Set<Long> existingTableIds = existing.getTables().stream()
                            .map(com.brewly.brewly_backend.pos.Table::getId)
                            .collect(Collectors.toSet());
                    existingTableIds.retainAll(requestedTables);
                    if (!existingTableIds.isEmpty()) {
                        throw new RuntimeException(
                                "Some selected tables are already booked at " + request.getTime() + " on this date.");
                    }
                }
            }
        }

        Event event = new Event();
        event.setUser(user);
        event.setTitle(request.getTitle());
        event.setDate(request.getDate());
        event.setType(request.getType());
        event.setGuestCount(request.getGuestCount());
        event.setTime(request.getTime());
        event.setPackageType(request.getPackageType());
        event.setStatus("UPCOMING");

        // Link tables (no status change — dynamic reservation handles it)
        if (request.getTableIds() != null && !request.getTableIds().isEmpty()) {
            List<com.brewly.brewly_backend.pos.Table> tables = tableRepository
                    .findAllById(request.getTableIds());
            // Filter to make sure these tables belong to the user
            tables = tables.stream().filter(t -> t.getUser().getId().equals(user.getId())).collect(Collectors.toList());
            event.setTables(tables);
        }

        return repository.save(event);
    }

    public Event updateEvent(Long id, EventRequest request) {
        User user = userContextHelper.getCurrentUser();
        Event event = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        if (!event.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // Check table conflict (exclude the event being edited)
        if (request.getTableIds() != null && !request.getTableIds().isEmpty()) {
            List<Event> sameSlot = repository.findByUserAndDateAndTime(user, request.getDate(), request.getTime());
            sameSlot.removeIf(e -> e.getId().equals(id));
            Set<Long> requestedTables = new HashSet<>(request.getTableIds());
            for (Event existing : sameSlot) {
                if (existing.getTables() != null) {
                    Set<Long> existingTableIds = existing.getTables().stream()
                            .map(com.brewly.brewly_backend.pos.Table::getId)
                            .collect(Collectors.toSet());
                    existingTableIds.retainAll(requestedTables);
                    if (!existingTableIds.isEmpty()) {
                        throw new RuntimeException(
                                "Some selected tables are already booked at " + request.getTime() + " on this date.");
                    }
                }
            }
        }

        event.setTitle(request.getTitle());
        event.setDate(request.getDate());
        event.setType(request.getType());
        event.setGuestCount(request.getGuestCount());
        event.setTime(request.getTime());
        event.setPackageType(request.getPackageType());

        // Link tables (no status change — dynamic reservation handles it)
        if (request.getTableIds() != null && !request.getTableIds().isEmpty()) {
            List<com.brewly.brewly_backend.pos.Table> tables = tableRepository
                    .findAllById(request.getTableIds());
            tables = tables.stream().filter(t -> t.getUser().getId().equals(user.getId())).collect(Collectors.toList());
            event.setTables(tables);
        } else {
            event.setTables(null);
        }

        return repository.save(event);
    }

    public void deleteEvent(Long id) {
        User user = userContextHelper.getCurrentUser();
        Event event = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        if (!event.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        repository.delete(event);
    }
}
