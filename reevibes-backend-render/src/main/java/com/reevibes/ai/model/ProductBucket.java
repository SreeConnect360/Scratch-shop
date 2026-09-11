package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

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

    @Column(name = "thumbnail", columnDefinition = "TEXT")
    private String thumbnail;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(nullable = false)
    private Boolean hidden = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (displayOrder == null) {
            displayOrder = 0;
        }
        if (hidden == null) {
            hidden = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getProductIds() { return productIds; }
    public void setProductIds(String productIds) { this.productIds = productIds; }
    public String getStarProductId() { return starProductId; }
    public void setStarProductId(String starProductId) { this.starProductId = starProductId; }
    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }
    public Integer getDisplayOrder() { return displayOrder != null ? displayOrder : 0; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public Boolean getHidden() { return hidden; }
    public void setHidden(Boolean hidden) { this.hidden = hidden; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
