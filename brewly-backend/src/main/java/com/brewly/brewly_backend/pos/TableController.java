package com.brewly.brewly_backend.pos;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class TableController {

    private final TableService tableService;
    private final com.brewly.brewly_backend.events.EventRepository eventRepository;

    @GetMapping
    public List<Table> getAllTables() {
        return tableService.getAllTables();
    }

    @GetMapping("/with-reservations")
    public List<TableWithReservation> getTablesWithReservations() {
        return tableService.getTablesWithReservationInfo(eventRepository);
    }

    @GetMapping("/for-date/{date}")
    public List<TableWithReservation> getTablesForDate(
            @PathVariable String date,
            @RequestParam(required = false) String time) {
        LocalDate localDate = LocalDate.parse(date);
        return tableService.getTablesForDate(eventRepository, localDate, time);
    }

    @GetMapping("/free")
    public List<Table> getFreeTables() {
        return tableService.getFreeTables();
    }

    @PostMapping
    public Table createTable(@RequestBody Table table) {
        return tableService.createTable(table);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Table> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String statusStr = payload.get("status");
        try {
            Table.TableStatus status = Table.TableStatus.valueOf(statusStr.toUpperCase());
            Table updatedTable = tableService.updateTableStatus(id, status);
            return ResponseEntity.ok(updatedTable);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        try {
            tableService.deleteTable(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/renumber")
    public ResponseEntity<Void> renumberTables() {
        tableService.renumberTables();
        return ResponseEntity.ok().build();
    }
}
