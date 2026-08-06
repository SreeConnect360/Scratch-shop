package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vendor_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VendorProduct {
    @Id
    private String id;

    private String name;
    private String house;
    private String price;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(columnDefinition = "TEXT")
    private String imagesJson;

    private String category;
    private String gender;
    private String tag;
    private String sku;
    private String originalPrice;
    private Integer discount = 0;
    private String status = "PUBLISHED";
    private String visibility = "VISIBLE";
    private String material;
    private String fabric;
    private String color;
    private String collections;
    private String overviewTitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(columnDefinition = "TEXT")
    private String sizesJson;

    @Column(columnDefinition = "TEXT")
    private String tagsJson;

    @Column(columnDefinition = "TEXT")
    private String stockPerSizeJson;

    @Column(columnDefinition = "TEXT")
    private String productInfo;

    @Column(columnDefinition = "TEXT")
    private String productSectionsJson;

    @Column(columnDefinition = "TEXT")
    private String fullJson;

    private Boolean inStock = true;
    private Boolean isNew = false;
    private Boolean isNewArrival = false;
    private Boolean isTrending = false;
    private Boolean isBestSeller = false;
    private Boolean isFeatured = false;
    private Boolean isRecommended = false;

    private String vendorId;
    private Double customRating = 4.8;
    private Integer customReviewCount = 14;
    private Double rating = 5.0;
    private Integer reviewCount = 0;
    private Integer stockQuantity = 100;

    private String seoTitle;

    @Column(columnDefinition = "TEXT")
    private String seoDescription;

    private String seoKeywords;
}
