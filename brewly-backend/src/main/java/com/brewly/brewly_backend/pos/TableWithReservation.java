package com.brewly.brewly_backend.pos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TableWithReservation {
    private Long id;
    private String tableNumber;
    private int seats;
    private Table.TableStatus status;
    private Double currentBill;
    private String reservedForEvent;
    private String reservedForDate;
}
