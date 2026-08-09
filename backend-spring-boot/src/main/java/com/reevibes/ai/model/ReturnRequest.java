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

    @Column(name = "shiprocket_return_order_id", length = 100)
    private String shiprocketReturnOrderId;

    @Column(name = "shiprocket_return_shipment_id", length = 100)
    private String shiprocketReturnShipmentId;

    @Column(name = "return_awb", length = 100)
    private String returnAwb;

    @Column(name = "return_courier", length = 100)
    private String returnCourier;

    @Column(name = "wallet_refund_amount", precision = 12, scale = 2)
    private BigDecimal walletRefundAmount;

    @Column(name = "razorpay_refund_amount", precision = 12, scale = 2)
    private BigDecimal razorpayRefundAmount;

    @Column(name = "razorpay_refund_id", length = 100)
    private String razorpayRefundId;

    @Column(name = "wallet_transaction_id", length = 100)
    private String walletTransactionId;

    @Column(name = "return_label_url", columnDefinition = "TEXT")
    private String returnLabelUrl;

    @Column(name = "return_scans_json", columnDefinition = "TEXT")
    private String returnScansJson;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }

    public String getVideos() { return videos; }
    public void setVideos(String videos) { this.videos = videos; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getRefundAmount() { return refundAmount; }
    public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }

    public String getRefundTransactionId() { return refundTransactionId; }
    public void setRefundTransactionId(String refundTransactionId) { this.refundTransactionId = refundTransactionId; }

    public String getRefundDate() { return refundDate; }
    public void setRefundDate(String refundDate) { this.refundDate = refundDate; }

    public String getSelectedSize() { return selectedSize; }
    public void setSelectedSize(String selectedSize) { this.selectedSize = selectedSize; }

    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }

    public String getRefundMethod() { return refundMethod; }
    public void setRefundMethod(String refundMethod) { this.refundMethod = refundMethod; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getExpectedCreditDate() { return expectedCreditDate; }
    public void setExpectedCreditDate(String expectedCreditDate) { this.expectedCreditDate = expectedCreditDate; }

    public String getPickupDate() { return pickupDate; }
    public void setPickupDate(String pickupDate) { this.pickupDate = pickupDate; }

    public String getShiprocketReturnOrderId() { return shiprocketReturnOrderId; }
    public void setShiprocketReturnOrderId(String shiprocketReturnOrderId) { this.shiprocketReturnOrderId = shiprocketReturnOrderId; }

    public String getShiprocketReturnShipmentId() { return shiprocketReturnShipmentId; }
    public void setShiprocketReturnShipmentId(String shiprocketReturnShipmentId) { this.shiprocketReturnShipmentId = shiprocketReturnShipmentId; }

    public String getReturnAwb() { return returnAwb; }
    public void setReturnAwb(String returnAwb) { this.returnAwb = returnAwb; }

    public String getReturnCourier() { return returnCourier; }
    public void setReturnCourier(String returnCourier) { this.returnCourier = returnCourier; }

    public BigDecimal getWalletRefundAmount() { return walletRefundAmount; }
    public void setWalletRefundAmount(BigDecimal walletRefundAmount) { this.walletRefundAmount = walletRefundAmount; }

    public BigDecimal getRazorpayRefundAmount() { return razorpayRefundAmount; }
    public void setRazorpayRefundAmount(BigDecimal razorpayRefundAmount) { this.razorpayRefundAmount = razorpayRefundAmount; }

    public String getRazorpayRefundId() { return razorpayRefundId; }
    public void setRazorpayRefundId(String razorpayRefundId) { this.razorpayRefundId = razorpayRefundId; }

    public String getWalletTransactionId() { return walletTransactionId; }
    public void setWalletTransactionId(String walletTransactionId) { this.walletTransactionId = walletTransactionId; }

    public String getReturnLabelUrl() { return returnLabelUrl; }
    public void setReturnLabelUrl(String returnLabelUrl) { this.returnLabelUrl = returnLabelUrl; }

    public String getReturnScansJson() { return returnScansJson; }
    public void setReturnScansJson(String returnScansJson) { this.returnScansJson = returnScansJson; }

    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
}
