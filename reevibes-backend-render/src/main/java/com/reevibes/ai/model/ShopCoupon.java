package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "shop_coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopCoupon {
    @Id
    private String code;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discount;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(name = "expiry_date", nullable = false, length = 20)
    private String expiryDate;

    @Column(name = "usage_limit", nullable = false)
    private Integer usageLimit;

    @Column(name = "user_eligibility", nullable = false, length = 50)
    private String userEligibility;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "used_count")
    private Integer usedCount = 0;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public String getUserEligibility() { return userEligibility; }
    public void setUserEligibility(String userEligibility) { this.userEligibility = userEligibility; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Integer getUsedCount() { return usedCount; }
    public void setUsedCount(Integer usedCount) { this.usedCount = usedCount; }
}
