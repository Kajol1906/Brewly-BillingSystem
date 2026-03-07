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

    @PostMapping("/generate")
    public Bill generateBill(@RequestBody BillRequest request) {
        // 1. Create and Save Bill
        Bill bill = new Bill();
        bill.setTableId(request.getTableId());
        bill.setTotalAmount(request.getTotalAmount());
        bill.setPaymentMethod(request.getPaymentMethod());

        Bill savedBill = billRepository.save(bill);

        // 2. Clear Table (Set to FREE)
        Table table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new RuntimeException("Table not found"));

        table.setStatus(Table.TableStatus.FREE);
        table.setCurrentBill(0.0);
        tableRepository.save(table);

        // 3. Mark orders as BILLED
        java.util.List<Order> activeOrders = orderRepository.findByTableIdAndStatus(request.getTableId(), "ACTIVE");
        for (Order order : activeOrders) {
            order.setStatus("BILLED");
        }
        orderRepository.saveAll(activeOrders);

        return savedBill;
    }
}
