package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_sync_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorSyncHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vendor_id", length = 50, nullable = false)
    private String vendorId;

    @Column(name = "run_time")
    private LocalDateTime runTime = LocalDateTime.now();

    @Column(nullable = false, length = 20)
    private String status; // SUCCESS, FAILED, RUNNING

    @Column(name = "duration_ms")
    private Long durationMs;

    @Column(name = "products_added")
    private Integer productsAdded = 0;

    @Column(name = "products_updated")
    private Integer productsUpdated = 0;

    @Column(name = "products_removed")
    private Integer productsRemoved = 0;

    @Column(name = "products_failed")
    private Integer productsFailed = 0;

    @Column(name = "log_message", columnDefinition = "TEXT")
    private String logMessage;
}
