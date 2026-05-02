package com.brewly.brewly_backend.pos;

import com.brewly.brewly_backend.security.UserContextHelper;
import com.brewly.brewly_backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BillController {

    private final BillRepository billRepository;
    private final TableRepository tableRepository;
    private final OrderRepository orderRepository;
    private final com.brewly.brewly_backend.events.EventRepository eventRepository;
    private final UserContextHelper userContextHelper;

    @PostMapping("/generate")
    @Transactional
    public Bill generateBill(@RequestBody BillRequest request) {
        User user = userContextHelper.getCurrentUser();
        Bill bill = new Bill();
        bill.setUser(user);
        bill.setPaymentMethod(request.getPaymentMethod());

        if (request.getTableId() != null) {
            // === DINE-IN BILLING ===

            // 1. Fetch Table to get secure total amount
            Table table = tableRepository.findById(request.getTableId())
                    .orElseThrow(() -> new RuntimeException("Table not found"));
            if (!table.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized");
            }

            Double secureTotalAmount = table.getCurrentBill() != null ? table.getCurrentBill() : 0.0;

            bill.setTableId(request.getTableId());
            bill.setTotalAmount(secureTotalAmount);

            // 2. Clear Table (Set to FREE)
            table.setStatus(Table.TableStatus.FREE);
            table.setCurrentBill(0.0);
            tableRepository.save(table);

            // 3. Mark orders as BILLED
            java.util.List<Order> activeOrders = orderRepository.findByUserAndTableIdAndStatus(user, request.getTableId(), "ACTIVE");
            for (Order order : activeOrders) {
                order.setStatus("BILLED");
            }
            orderRepository.saveAll(activeOrders);

            // 4. Mark associated events as COMPLETED
            java.util.List<com.brewly.brewly_backend.events.Event> todayEvents = eventRepository
                    .findByUserAndTablesIdAndDate(user, request.getTableId(), java.time.LocalDate.now());
            for (com.brewly.brewly_backend.events.Event ev : todayEvents) {
                if (!"COMPLETED".equals(ev.getStatus())) {
                    ev.setStatus("COMPLETED");
                }
            }
            eventRepository.saveAll(todayEvents);
        } else {
            // === TAKEAWAY BILLING ===
            // Orders already marked as BILLED by OrderService, just create receipt
            bill.setTotalAmount(request.getTotalAmount());
        }

        return billRepository.save(bill);
    }
}
