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
}
