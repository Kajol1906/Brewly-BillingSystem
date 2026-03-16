package com.brewly.brewly_backend.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AIController {

    private final AIService service;

    @GetMapping("/peak-hours")
    public List<Map<String, Object>> getPeakHours() {
        return service.getPeakHours();
    }

    @GetMapping("/recommendations")
    public List<Map<String, Object>> getRecommendations() {
        return service.getRecommendations();
    }

    @GetMapping("/revenue-forecast")
    public Map<String, Object> getRevenueForecast() {
        return service.getRevenueForecast();
    }

    @GetMapping("/category-sales")
    public List<Map<String, Object>> getCategorySales() {
        return service.getCategorySales();
    }

    @GetMapping("/slow-moving")
    public List<Map<String, Object>> getSlowMovingItems() {
        return service.getSlowMovingItems();
    }

    @GetMapping("/stock-depletion")
    public List<Map<String, Object>> getStockDepletion() {
        return service.getStockDepletion();
    }

    @GetMapping("/payment-insights")
    public Map<String, Object> getPaymentInsights() {
        return service.getPaymentInsights();
    }

    @GetMapping("/table-turnover")
    public List<Map<String, Object>> getTableTurnover() {
        return service.getTableTurnover();
    }
}
