package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "vendor_product_videos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorProductVideo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", length = 50, nullable = false)
    private String productId;

    @Column(name = "video_url", nullable = false, columnDefinition = "TEXT")
    private String videoUrl;
}
