package com.brewly.brewly_backend.vendors;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class VendorController {

    private final VendorRepository vendorRepository;

    @GetMapping
    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    @PostMapping
    public Vendor createVendor(@RequestBody Vendor vendor) {
        // Set default values if missing
        if (vendor.getRating() == null)
            vendor.setRating(0.0);
        if (vendor.getAvailability() == null)
            vendor.setAvailability("available");

        return vendorRepository.save(vendor);
    }

    @PatchMapping("/{id}/status")
    public Vendor updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> statusMap) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        if (statusMap.containsKey("availability")) {
            vendor.setAvailability(statusMap.get("availability"));
        }

        return vendorRepository.save(vendor);
    }
}
