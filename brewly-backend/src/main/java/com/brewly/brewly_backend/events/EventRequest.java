package com.brewly.brewly_backend.events;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class EventRequest {
    private String title;
    private LocalDate date;
    private String type;
    private Integer guestCount;
    private String time;
    private String packageType;
    private List<Long> vendorIds;
    private List<Long> tableIds;
}
