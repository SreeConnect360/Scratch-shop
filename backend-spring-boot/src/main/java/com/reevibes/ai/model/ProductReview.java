package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "product_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductReview {
    @Id
    private String id;

    @Column(name = "product_id", nullable = false, length = 50)
    private String productId;

    @Column(name = "user_name", nullable = false, length = 100)
    private String userName;

    @Column(nullable = false)
    private Integer rating;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(columnDefinition = "TEXT")
    private String images; // comma-separated

    @Column(columnDefinition = "TEXT")
    private String videos; // comma-separated

    @Column(name = "review_date", nullable = false, length = 20)
    private String reviewDate;

    @Column(nullable = false, length = 20)
    private String status = "Approved";
}
