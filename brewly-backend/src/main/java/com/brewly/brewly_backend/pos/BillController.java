package com.brewly.brewly_backend.pos;

import com.brewly.brewly_backend.security.UserContextHelper;
import com.brewly.brewly_backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.messaging.simp.SimpMessagingTemplate;

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
    private final SimpMessagingTemplate simpMessagingTemplate;

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

            // 3. Mark active and prepared orders as BILLED
            java.util.List<Order> activeOrders = orderRepository.findByUserAndTableIdAndStatus(user, request.getTableId(), "ACTIVE");
            java.util.List<Order> preparedOrders = orderRepository.findByUserAndTableIdAndStatus(user, request.getTableId(), "PREPARED");
            
            java.util.List<Order> allOrders = new java.util.ArrayList<>();
            allOrders.addAll(activeOrders);
            allOrders.addAll(preparedOrders);
            
            for (Order order : allOrders) {
                order.setStatus("BILLED");
            }
            orderRepository.saveAll(allOrders);

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
            if (request.getTakeawayName() != null) {
                java.util.List<Order> activeOrders = orderRepository.findByUserAndTakeawayNameAndStatus(user, request.getTakeawayName(), "ACTIVE");
                java.util.List<Order> preparedOrders = orderRepository.findByUserAndTakeawayNameAndStatus(user, request.getTakeawayName(), "PREPARED");

                java.util.List<Order> allOrders = new java.util.ArrayList<>();
                allOrders.addAll(activeOrders);
                allOrders.addAll(preparedOrders);

                for (Order order : allOrders) {
                    order.setStatus("BILLED");
                }
                orderRepository.saveAll(allOrders);
            }
            bill.setTotalAmount(request.getTotalAmount());
        }

        Bill savedBill = billRepository.save(bill);

        // Broadcast socket update to client
        try {
            simpMessagingTemplate.convertAndSend("/topic/orders", "updated");
            simpMessagingTemplate.convertAndSend("/topic/tables", "updated");
        } catch (Exception ignored) {}

        return savedBill;
    }
}
