package com.brewly.brewly_backend.pos;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BillController {

    private final BillRepository billRepository;
    private final TableRepository tableRepository;
    private final OrderRepository orderRepository;
    private final com.brewly.brewly_backend.events.EventRepository eventRepository;

    @PostMapping("/generate")
    public Bill generateBill(@RequestBody BillRequest request) {
        // 1. Fetch Table to get secure total amount
        Table table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new RuntimeException("Table not found"));

        Double secureTotalAmount = table.getCurrentBill() != null ? table.getCurrentBill() : 0.0;

        // 2. Create and Save Bill
        Bill bill = new Bill();
        bill.setTableId(request.getTableId());
        bill.setTotalAmount(secureTotalAmount); // Use secure total
        bill.setPaymentMethod(request.getPaymentMethod());

        Bill savedBill = billRepository.save(bill);

        // 3. Clear Table (Set to FREE)
        table.setStatus(Table.TableStatus.FREE);
        table.setCurrentBill(0.0);
        tableRepository.save(table);

        // 4. Mark orders as BILLED
        java.util.List<Order> activeOrders = orderRepository.findByTableIdAndStatus(request.getTableId(), "ACTIVE");
        for (Order order : activeOrders) {
            order.setStatus("BILLED");
        }
        orderRepository.saveAll(activeOrders);

        // 5. Mark associated events as COMPLETED
        java.util.List<com.brewly.brewly_backend.events.Event> todayEvents = eventRepository
                .findByTablesIdAndDate(request.getTableId(), java.time.LocalDate.now());
        for (com.brewly.brewly_backend.events.Event ev : todayEvents) {
            if (!"COMPLETED".equals(ev.getStatus())) {
                ev.setStatus("COMPLETED");
            }
        }
        eventRepository.saveAll(todayEvents);

        return savedBill;
    }
}
