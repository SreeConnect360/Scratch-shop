package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorProduct {
    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "vendor_id", length = 50, nullable = false)
    private String vendorId;

    @Column(name = "external_id", length = 50)
    private String externalId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String category;

    @Column(length = 100)
    private String brand;

    @Column(length = 100)
    private String material;

    @Column(length = 100)
    private String fabric;

    @Column(length = 20)
    private String gender = "Unisex";

    @Column(length = 50)
    private String type;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 5, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(length = 100)
    private String sku;

    @Column(length = 20, nullable = false)
    private String status = "DRAFT"; // DRAFT, PUBLISHED, HIDDEN, ARCHIVED

    @Column(length = 20, nullable = false)
    private String visibility = "VISIBLE"; // VISIBLE, HIDDEN

    @Column(name = "last_sync")
    private LocalDateTime lastSync;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "is_new_arrival")
    private Boolean isNewArrival = false;

    @Column(name = "is_trending")
    private Boolean isTrending = false;

    @Column(name = "is_recommended")
    private Boolean isRecommended = false;

    @Column(name = "seo_title", length = 255)
    private String seoTitle;

    @Column(name = "seo_description", columnDefinition = "TEXT")
    private String seoDescription;

    @Column(name = "seo_keywords", length = 255)
    private String seoKeywords;

    @Column(name = "in_catalog")
    private Boolean inCatalog = false;

    @Column(length = 50)
    private String tag;

    @Column(length = 255)
    private String tags;

    @Column(length = 255)
    private String collections;
}
