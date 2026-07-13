package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shop_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopOrder {
    @Id
    private String id;

    @Column(name = "user_id", nullable = false, length = 50)
    private String userId;

    @Column(name = "order_date")
    private LocalDateTime orderDate = LocalDateTime.now();

    @Column(name = "items_json", nullable = false, columnDefinition = "TEXT")
    private String itemsJson; // serialized CartItem[]

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(name = "payment_status", nullable = false, length = 50)
    private String paymentStatus;

    @Column(name = "refund_details_json", columnDefinition = "TEXT")
    private String refundDetailsJson; // serialized refund details
}
