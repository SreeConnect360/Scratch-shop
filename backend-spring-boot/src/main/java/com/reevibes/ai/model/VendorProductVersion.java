package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_product_versions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorProductVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", length = 50, nullable = false)
    private String productId;

    @Column(name = "version_timestamp")
    private LocalDateTime versionTimestamp = LocalDateTime.now();

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "stock_summary", length = 255)
    private String stockSummary; // e.g. "S:10,M:12,L:8"

    @Column(name = "sizes_summary", length = 255)
    private String sizesSummary; // e.g. "S,M,L"

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl; // thumbnail or cover image URL

    @Column(length = 100)
    private String category;

    @Column(length = 100)
    private String brand;

    @Column(name = "restored_from_version_id")
    private Integer restoredFromVersionId;
}
