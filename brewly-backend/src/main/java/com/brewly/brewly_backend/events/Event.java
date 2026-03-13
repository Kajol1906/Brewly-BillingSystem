package com.brewly.brewly_backend.events;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private LocalDate date;
    private String type; // birthday, corporate, etc.
    private Integer guestCount;
    private String time;
    private String packageType; // Gold, Silver, Platinum
    private String status; // UPCOMING, COMPLETED

    @ManyToMany
    @JoinTable(name = "event_vendors", joinColumns = @JoinColumn(name = "event_id"), inverseJoinColumns = @JoinColumn(name = "vendor_id"))
    private List<com.brewly.brewly_backend.vendors.Vendor> vendors;

    @ManyToMany
    @JoinTable(name = "event_tables", joinColumns = @JoinColumn(name = "event_id"), inverseJoinColumns = @JoinColumn(name = "table_id"))
    private List<com.brewly.brewly_backend.pos.Table> tables;
}
