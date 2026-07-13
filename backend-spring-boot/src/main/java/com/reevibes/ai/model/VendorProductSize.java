package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "vendor_product_sizes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorProductSize {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", length = 50, nullable = false)
    private String productId;

    @Column(name = "size_name", length = 20, nullable = false)
    private String sizeName;
}
