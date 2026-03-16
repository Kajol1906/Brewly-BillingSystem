package com.brewly.brewly_backend.pos;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@jakarta.persistence.Table(name = "restaurant_tables") // "Table" is a reserved keyword in SQL
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Table {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tableNumber;

    private int seats;

    @Enumerated(EnumType.STRING)
    private TableStatus status;

    private Double currentBill = 0.0;

    public enum TableStatus {
        FREE,
        OCCUPIED,
        RESERVED
    }
}
