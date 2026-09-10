package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "admin_product_catalog")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminProductCatalog {
    @Id
    private String id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String name;

    @Column(columnDefinition = "TEXT")
    private String house;

    @Column(columnDefinition = "TEXT")
    private String brand;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String price;

    @Column(columnDefinition = "TEXT")
    private String originalPrice;

    private Integer discount = 0;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(columnDefinition = "TEXT")
    private String imagesJson;

    @Column(columnDefinition = "TEXT")
    private String videosJson;

    @Column(columnDefinition = "TEXT")
    private String category;

    @Column(columnDefinition = "TEXT")
    private String categoriesList;

    @Column(columnDefinition = "TEXT")
    private String gender;

    @Column(columnDefinition = "TEXT")
    private String tag;

    @Column(columnDefinition = "TEXT")
    private String tagsJson;

    @Column(columnDefinition = "TEXT")
    private String sku;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String overviewTitle;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(columnDefinition = "TEXT")
    private String material;

    @Column(columnDefinition = "TEXT")
    private String fabric;

    @Column(columnDefinition = "TEXT")
    private String color;

    @Column(columnDefinition = "TEXT")
    private String collections;

    @Column(columnDefinition = "TEXT")
    private String type;

    @Column(columnDefinition = "TEXT")
    private String productInfo;

    @Column(columnDefinition = "TEXT")
    private String productSectionsJson;

    @Column(columnDefinition = "TEXT")
    private String sizesJson;

    @Column(columnDefinition = "TEXT")
    private String stockPerSizeJson;

    private Integer stockQuantity = 100;
    private Boolean inStock = true;

    @Column(columnDefinition = "TEXT")
    private String status = "PUBLISHED";

    @Column(columnDefinition = "TEXT")
    private String visibility = "VISIBLE";

    private Boolean isFeatured = false;
    private Boolean isNew = false;
    private Boolean isNewArrival = false;
    private Boolean isTrending = false;
    private Boolean isBestSeller = false;
    private Boolean isRecommended = false;

    private Double customRating = 4.8;
    private Integer customReviewCount = 14;
    private Double rating = 5.0;
    private Integer reviewCount = 0;

    private Integer discountLimitBuyers;
    private String discountExpiryDate;
    private Integer discountBuyersCount = 0;

    @Column(columnDefinition = "TEXT")
    private String seoTitle;

    @Column(columnDefinition = "TEXT")
    private String seoDescription;

    @Column(columnDefinition = "TEXT")
    private String seoKeywords;

    @Column(columnDefinition = "TEXT")
    private String rawJson;

    @Column(columnDefinition = "TIMESTAMPTZ")
    private OffsetDateTime createdAt;

    @Column(columnDefinition = "TIMESTAMPTZ")
    private OffsetDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = OffsetDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
