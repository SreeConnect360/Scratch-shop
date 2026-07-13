package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "product_buckets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductBucket {
    @Id
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "product_ids", nullable = false, columnDefinition = "TEXT")
    private String productIds;

    @Column(name = "star_product_id", length = 50)
    private String starProductId;

    @Column(nullable = false)
    private Boolean hidden = false;
}
