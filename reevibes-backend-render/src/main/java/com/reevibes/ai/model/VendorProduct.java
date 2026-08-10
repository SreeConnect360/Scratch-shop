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

    @Column(columnDefinition = "TEXT")
    private String name;

    @Column(columnDefinition = "TEXT")
    private String house;

    @Column(columnDefinition = "TEXT")
    private String price;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(columnDefinition = "TEXT")
    private String imagesJson;

    @Column(columnDefinition = "TEXT")
    private String category;

    @Column(columnDefinition = "TEXT")
    private String gender;

    @Column(columnDefinition = "TEXT")
    private String tag;

    @Column(columnDefinition = "TEXT")
    private String sku;

    @Column(columnDefinition = "TEXT")
    private String originalPrice;

    private Integer discount = 0;

    @Column(columnDefinition = "TEXT")
    private String status = "PUBLISHED";

    @Column(columnDefinition = "TEXT")
    private String visibility = "VISIBLE";

    @Column(columnDefinition = "TEXT")
    private String material;

    @Column(columnDefinition = "TEXT")
    private String fabric;

    @Column(columnDefinition = "TEXT")
    private String color;

    @Column(columnDefinition = "TEXT")
    private String collections;

    @Column(columnDefinition = "TEXT")
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

    @Column(columnDefinition = "TEXT")
    private String vendorId;
    private Double customRating = 4.8;
    private Integer customReviewCount = 14;
    private Double rating = 5.0;
    private Integer reviewCount = 0;
    private Integer stockQuantity = 100;

    public Integer getUnits() {
        return stockQuantity != null ? stockQuantity : 100;
    }

    public void setUnits(Integer units) {
        this.stockQuantity = units;
    }

    @Column(columnDefinition = "TEXT")
    private String seoTitle;

    @Column(columnDefinition = "TEXT")
    private String seoDescription;

    @Column(columnDefinition = "TEXT")
    private String seoKeywords;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getHouse() { return house; }
    public void setHouse(String house) { this.house = house; }

    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getImagesJson() { return imagesJson; }
    public void setImagesJson(String imagesJson) { this.imagesJson = imagesJson; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(String originalPrice) { this.originalPrice = originalPrice; }

    public Integer getDiscount() { return discount; }
    public void setDiscount(Integer discount) { this.discount = discount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }

    public String getFabric() { return fabric; }
    public void setFabric(String fabric) { this.fabric = fabric; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getCollections() { return collections; }
    public void setCollections(String collections) { this.collections = collections; }

    public String getOverviewTitle() { return overviewTitle; }
    public void setOverviewTitle(String overviewTitle) { this.overviewTitle = overviewTitle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getSizesJson() { return sizesJson; }
    public void setSizesJson(String sizesJson) { this.sizesJson = sizesJson; }

    public String getTagsJson() { return tagsJson; }
    public void setTagsJson(String tagsJson) { this.tagsJson = tagsJson; }

    public String getStockPerSizeJson() { return stockPerSizeJson; }
    public void setStockPerSizeJson(String stockPerSizeJson) { this.stockPerSizeJson = stockPerSizeJson; }

    public String getProductInfo() { return productInfo; }
    public void setProductInfo(String productInfo) { this.productInfo = productInfo; }

    public String getProductSectionsJson() { return productSectionsJson; }
    public void setProductSectionsJson(String productSectionsJson) { this.productSectionsJson = productSectionsJson; }

    public String getFullJson() { return fullJson; }
    public void setFullJson(String fullJson) { this.fullJson = fullJson; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public Boolean getIsNew() { return isNew; }
    public void setIsNew(Boolean isNew) { this.isNew = isNew; }

    public Boolean getIsNewArrival() { return isNewArrival; }
    public void setIsNewArrival(Boolean isNewArrival) { this.isNewArrival = isNewArrival; }

    public Boolean getIsTrending() { return isTrending; }
    public void setIsTrending(Boolean isTrending) { this.isTrending = isTrending; }

    public Boolean getIsBestSeller() { return isBestSeller; }
    public void setIsBestSeller(Boolean isBestSeller) { this.isBestSeller = isBestSeller; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getIsRecommended() { return isRecommended; }
    public void setIsRecommended(Boolean isRecommended) { this.isRecommended = isRecommended; }

    public String getVendorId() { return vendorId; }
    public void setVendorId(String vendorId) { this.vendorId = vendorId; }

    public Double getCustomRating() { return customRating; }
    public void setCustomRating(Double customRating) { this.customRating = customRating; }

    public Integer getCustomReviewCount() { return customReviewCount; }
    public void setCustomReviewCount(Integer customReviewCount) { this.customReviewCount = customReviewCount; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getSeoTitle() { return seoTitle; }
    public void setSeoTitle(String seoTitle) { this.seoTitle = seoTitle; }

    public String getSeoDescription() { return seoDescription; }
    public void setSeoDescription(String seoDescription) { this.seoDescription = seoDescription; }

    public String getSeoKeywords() { return seoKeywords; }
    public void setSeoKeywords(String seoKeywords) { this.seoKeywords = seoKeywords; }
}
