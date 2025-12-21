package com.brewly.brewly_backend.pos;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/order")
    public void placeOrder(@RequestBody OrderRequest request) {
        orderService.placeOrder(request);
    }
}
