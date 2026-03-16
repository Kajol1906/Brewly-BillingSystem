package com.brewly.brewly_backend.events;

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
    private final com.brewly.brewly_backend.vendors.VendorRepository vendorRepository;
    private final com.brewly.brewly_backend.pos.TableRepository tableRepository;

    public List<Event> getAllEvents() {
        return repository.findAll();
    }

    public Event createEvent(EventRequest request) {
        // Check table conflict: only block if requested tables overlap with existing
        // event tables at same date+time
        if (request.getTableIds() != null && !request.getTableIds().isEmpty()) {
            List<Event> sameSlot = repository.findByDateAndTime(request.getDate(), request.getTime());
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
        event.setTitle(request.getTitle());
        event.setDate(request.getDate());
        event.setType(request.getType());
        event.setGuestCount(request.getGuestCount());
        event.setTime(request.getTime());
        event.setPackageType(request.getPackageType());
        event.setStatus("UPCOMING");

        // Handle Vendors
        if (request.getVendorIds() != null && !request.getVendorIds().isEmpty()) {
            List<com.brewly.brewly_backend.vendors.Vendor> vendors = vendorRepository
                    .findAllById(request.getVendorIds());
            event.setVendors(vendors);

            for (com.brewly.brewly_backend.vendors.Vendor vendor : vendors) {
                vendor.setAvailability("booked");
                vendorRepository.save(vendor);
            }
        }

        // Link tables (no status change — dynamic reservation handles it)
        if (request.getTableIds() != null && !request.getTableIds().isEmpty()) {
            List<com.brewly.brewly_backend.pos.Table> tables = tableRepository
                    .findAllById(request.getTableIds());
            event.setTables(tables);
        }

        return repository.save(event);
    }

    public Event updateEvent(Long id, EventRequest request) {
        Event event = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check table conflict (exclude the event being edited)
        if (request.getTableIds() != null && !request.getTableIds().isEmpty()) {
            List<Event> sameSlot = repository.findByDateAndTime(request.getDate(), request.getTime());
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

        // Free old vendors
        if (event.getVendors() != null) {
            for (com.brewly.brewly_backend.vendors.Vendor vendor : event.getVendors()) {
                vendor.setAvailability("available");
                vendorRepository.save(vendor);
            }
        }

        event.setTitle(request.getTitle());
        event.setDate(request.getDate());
        event.setType(request.getType());
        event.setGuestCount(request.getGuestCount());
        event.setTime(request.getTime());
        event.setPackageType(request.getPackageType());

        // Handle new Vendors
        if (request.getVendorIds() != null && !request.getVendorIds().isEmpty()) {
            List<com.brewly.brewly_backend.vendors.Vendor> vendors = vendorRepository
                    .findAllById(request.getVendorIds());
            event.setVendors(vendors);
            for (com.brewly.brewly_backend.vendors.Vendor vendor : vendors) {
                vendor.setAvailability("booked");
                vendorRepository.save(vendor);
            }
        } else {
            event.setVendors(null);
        }

        // Link tables (no status change — dynamic reservation handles it)
        if (request.getTableIds() != null && !request.getTableIds().isEmpty()) {
            List<com.brewly.brewly_backend.pos.Table> tables = tableRepository
                    .findAllById(request.getTableIds());
            event.setTables(tables);
        } else {
            event.setTables(null);
        }

        return repository.save(event);
    }

    public void deleteEvent(Long id) {
        Event event = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Free booked vendors
        if (event.getVendors() != null) {
            for (com.brewly.brewly_backend.vendors.Vendor vendor : event.getVendors()) {
                vendor.setAvailability("available");
                vendorRepository.save(vendor);
            }
        }

        repository.delete(event);
    }
}
