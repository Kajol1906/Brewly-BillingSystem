package com.brewly.brewly_backend.events;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    private final EventService service;

    @GetMapping
    public List<Event> getAllEvents() {
        return service.getAllEvents();
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody EventRequest request) {
        try {
            return ResponseEntity.ok(service.createEvent(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody EventRequest request) {
        try {
            return ResponseEntity.ok(service.updateEvent(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        try {
            service.deleteEvent(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
