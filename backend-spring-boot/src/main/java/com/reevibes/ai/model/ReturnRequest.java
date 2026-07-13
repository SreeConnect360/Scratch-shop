package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "return_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReturnRequest {
    @Id
    private String id;

    @Column(name = "order_id", nullable = false, length = 50)
    private String orderId;

    @Column(name = "product_id", nullable = false, length = 50)
    private String productId;

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @Column(name = "customer_id", nullable = false, length = 50)
    private String customerId;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(columnDefinition = "TEXT")
    private String images; // comma-separated

    @Column(columnDefinition = "TEXT")
    private String videos; // comma-separated

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "refund_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal refundAmount;

    @Column(name = "refund_transaction_id", length = 100)
    private String refundTransactionId;

    @Column(name = "refund_date", length = 20)
    private String refundDate;

    @Column(name = "selected_size", length = 10)
    private String selectedSize;

    private Integer qty;

    @Column(name = "refund_method", length = 50)
    private String refundMethod;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "expected_credit_date", length = 20)
    private String expectedCreditDate;

    @Column(name = "pickup_date", length = 20)
    private String pickupDate;
}
