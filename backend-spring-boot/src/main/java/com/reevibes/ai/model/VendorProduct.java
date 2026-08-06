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

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(columnDefinition = "TEXT")
    private String sizes;

    @Column(columnDefinition = "TEXT")
    private String colors;

    private Boolean inStock = true;
    private Boolean isNew = false;
    private Boolean isTrending = false;
    private Boolean isBestSeller = false;

    private String vendorId;
    private Double rating = 5.0;
    private Integer reviewCount = 0;
    private Integer stockQuantity = 100;
}
