package com.brewly.brewly_backend.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class UpcomingEventDTO {
    private Long id;
    private String title;
    private LocalDate date;
    private String time;
    private String type;
    private Integer guestCount;
    private String packageType;
}
