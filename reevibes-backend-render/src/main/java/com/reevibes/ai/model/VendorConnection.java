package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_connections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorConnection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vendor_id", length = 50, nullable = false)
    private String vendorId;

    @Column(name = "sync_url", nullable = false, length = 255)
    private String syncUrl;

    @Column(name = "sync_frequency", length = 50)
    private String syncFrequency = "MANUAL"; // DAILY, HOURLY, MANUAL

    @Column(name = "connection_status", length = 20)
    private String connectionStatus = "DISCONNECTED"; // CONNECTED, DISCONNECTED, ERROR

    @Column(name = "last_sync_time")
    private LocalDateTime lastSyncTime;

    @Column(name = "api_key", length = 100)
    private String apiKey;
}
