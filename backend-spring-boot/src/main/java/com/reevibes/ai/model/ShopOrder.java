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

    @Column(name = "razorpay_payment_id", length = 100)
    private String razorpayPaymentId;

    @Column(name = "razorpay_order_id", length = 100)
    private String razorpayOrderId;

    @Column(name = "razorpay_signature", length = 200)
    private String razorpaySignature;

    @Column(length = 20)
    private String currency = "INR";

    @Column(name = "payment_method", length = 50)
    private String paymentMethod = "Razorpay Gateway";

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    @Column(name = "courier_partner", length = 100)
    private String courierPartner;

    @Column(name = "estimated_delivery_date", length = 50)
    private String estimatedDeliveryDate;

    @Column(name = "scans_json", columnDefinition = "TEXT")
    private String scansJson;

    @Column(name = "delivery_date")
    private LocalDateTime deliveryDate;

    @Column(name = "shiprocket_order_id", length = 100)
    private String shiprocketOrderId;

    @Column(name = "shiprocket_shipment_id", length = 100)
    private String shiprocketShipmentId;
}
