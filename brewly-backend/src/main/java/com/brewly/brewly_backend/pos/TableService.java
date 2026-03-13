package com.brewly.brewly_backend.pos;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TableService {

    private final TableRepository tableRepository;

    public List<Table> getAllTables() {
        return tableRepository.findAll();
    }

    public List<Table> getFreeTables() {
        return tableRepository.findByStatus(Table.TableStatus.FREE);
    }

    /**
     * Returns all tables with dynamic reservation status.
     * A table is shown as RESERVED if it's linked to an event today
     * and current time is within [event_time - 10 min, event_time + 2 hours].
     * Outside that window, the table shows its actual DB status.
     */
    public List<TableWithReservation> getTablesWithReservationInfo(
            com.brewly.brewly_backend.events.EventRepository eventRepository) {
        List<Table> all = tableRepository.findAll();
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        return all.stream().map(t -> {
            String eventName = null;
            String eventDate = null;
            Table.TableStatus effectiveStatus = t.getStatus();

            // Check if this table is linked to any event today
            List<com.brewly.brewly_backend.events.Event> todayEvents = eventRepository.findByTablesIdAndDate(t.getId(),
                    today);

            for (com.brewly.brewly_backend.events.Event ev : todayEvents) {
                if ("COMPLETED".equals(ev.getStatus())) {
                    continue;
                }

                try {
                    LocalTime eventTime = LocalTime.parse(ev.getTime());

                    // Start reserving exactly at the event time. Reserving ends when bill is
                    // generated (status=COMPLETED).
                    if (!now.isBefore(eventTime)) {
                        // Only show RESERVED if they haven't started ordering yet
                        if (effectiveStatus != Table.TableStatus.OCCUPIED) {
                            effectiveStatus = Table.TableStatus.RESERVED;
                        }
                        eventName = ev.getTitle();
                        eventDate = ev.getDate() + " " + ev.getTime();
                        break;
                    }
                } catch (Exception ignored) {
                }
            }

            return new TableWithReservation(
                    t.getId(), t.getTableNumber(), t.getSeats(),
                    effectiveStatus, t.getCurrentBill(), eventName, eventDate);
        }).toList();
    }

    /**
     * Returns all tables with reservation info for a specific date.
     * If time is provided, only marks tables as reserved when their event's
     * 2-hour window overlaps with the requested time's 2-hour window.
     * If time is null, marks all tables linked to any event on that date.
     */
    public List<TableWithReservation> getTablesForDate(
            com.brewly.brewly_backend.events.EventRepository eventRepository,
            LocalDate date, String time) {
        List<Table> all = tableRepository.findAll();

        LocalTime requestedTime = null;
        if (time != null && !time.isBlank()) {
            try {
                requestedTime = LocalTime.parse(time);
            } catch (Exception ignored) {
            }
        }

        final LocalTime reqTime = requestedTime;

        return all.stream().map(t -> {
            String eventName = null;
            String eventDate = null;
            Table.TableStatus effectiveStatus = t.getStatus();

            List<com.brewly.brewly_backend.events.Event> dateEvents = eventRepository.findByTablesIdAndDate(t.getId(),
                    date);

            for (com.brewly.brewly_backend.events.Event ev : dateEvents) {
                if ("COMPLETED".equals(ev.getStatus())) {
                    continue;
                }

                if (reqTime != null) {
                    try {
                        LocalTime evTime = LocalTime.parse(ev.getTime());
                        // Two 2-hour blocks overlap if one starts before the other ends
                        LocalTime evEnd = evTime.plusHours(2);
                        LocalTime reqEnd = reqTime.plusHours(2);
                        if (reqTime.isBefore(evEnd) && evTime.isBefore(reqEnd)) {
                            effectiveStatus = Table.TableStatus.RESERVED;
                            eventName = ev.getTitle();
                            eventDate = ev.getDate() + " " + ev.getTime();
                            break;
                        }
                    } catch (Exception ignored) {
                    }
                } else {
                    effectiveStatus = Table.TableStatus.RESERVED;
                    eventName = ev.getTitle();
                    eventDate = ev.getDate() + " " + ev.getTime();
                    break;
                }
            }

            return new TableWithReservation(
                    t.getId(), t.getTableNumber(), t.getSeats(),
                    effectiveStatus, t.getCurrentBill(), eventName, eventDate);
        }).toList();
    }

    public Table getTableById(Long id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));
    }

    public Table createTable(Table table) {
        return tableRepository.save(table);
    }

    public Table updateTableStatus(Long id, Table.TableStatus status) {
        Table table = getTableById(id);
        table.setStatus(status);
        return tableRepository.save(table);
    }

    public void deleteTable(Long id) {
        if (!tableRepository.existsById(id)) {
            throw new RuntimeException("Table not found");
        }
        tableRepository.deleteById(id);
    }

    public void renumberTables() {
        List<Table> tables = tableRepository.findAll();
        tables.sort((a, b) -> {
            try {
                return Integer.compare(Integer.parseInt(a.getTableNumber()), Integer.parseInt(b.getTableNumber()));
            } catch (NumberFormatException e) {
                return a.getTableNumber().compareTo(b.getTableNumber());
            }
        });
        for (int i = 0; i < tables.size(); i++) {
            tables.get(i).setTableNumber(String.valueOf(i + 1));
        }
        tableRepository.saveAll(tables);
    }
}
