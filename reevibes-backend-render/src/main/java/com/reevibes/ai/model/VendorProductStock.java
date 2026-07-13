package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "vendor_product_stock")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorProductStock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", length = 50, nullable = false)
    private String productId;

    @Column(name = "size_name", length = 20, nullable = false)
    private String sizeName;

    @Column(name = "available_stock")
    private Integer availableStock = 0;

    @Column(name = "reserved_stock")
    private Integer reservedStock = 0;

    @Column(name = "sold_stock")
    private Integer soldStock = 0;
}
