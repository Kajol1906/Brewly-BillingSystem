package com.brewly.brewly_backend.pos;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@jakarta.persistence.Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tableId;

    private Double totalAmount;

    private String paymentMethod; // CASH, UPI, CARD

    private LocalDateTime createdAt = LocalDateTime.now();
}
