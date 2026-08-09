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

    @Column(name = "wallet_amount_used", precision = 12, scale = 2)
    private BigDecimal walletAmountUsed;

    @Column(name = "razorpay_amount_paid", precision = 12, scale = 2)
    private BigDecimal razorpayAmountPaid;

    @Column(name = "label_url", columnDefinition = "TEXT")
    private String labelUrl;

    @Column(name = "invoice_url", columnDefinition = "TEXT")
    private String invoiceUrl;

    @Column(name = "pickup_location", length = 100)
    private String pickupLocation = "Primary";

    @Column(name = "status_history_json", columnDefinition = "TEXT")
    private String statusHistoryJson;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public String getItemsJson() { return itemsJson; }
    public void setItemsJson(String itemsJson) { this.itemsJson = itemsJson; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getRefundDetailsJson() { return refundDetailsJson; }
    public void setRefundDetailsJson(String refundDetailsJson) { this.refundDetailsJson = refundDetailsJson; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getRazorpaySignature() { return razorpaySignature; }
    public void setRazorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getCourierPartner() { return courierPartner; }
    public void setCourierPartner(String courierPartner) { this.courierPartner = courierPartner; }

    public String getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(String estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }

    public String getScansJson() { return scansJson; }
    public void setScansJson(String scansJson) { this.scansJson = scansJson; }

    public LocalDateTime getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDateTime deliveryDate) { this.deliveryDate = deliveryDate; }

    public String getShiprocketOrderId() { return shiprocketOrderId; }
    public void setShiprocketOrderId(String shiprocketOrderId) { this.shiprocketOrderId = shiprocketOrderId; }

    public String getShiprocketShipmentId() { return shiprocketShipmentId; }
    public void setShiprocketShipmentId(String shiprocketShipmentId) { this.shiprocketShipmentId = shiprocketShipmentId; }

    public BigDecimal getWalletAmountUsed() { return walletAmountUsed; }
    public void setWalletAmountUsed(BigDecimal walletAmountUsed) { this.walletAmountUsed = walletAmountUsed; }

    public BigDecimal getRazorpayAmountPaid() { return razorpayAmountPaid; }
    public void setRazorpayAmountPaid(BigDecimal razorpayAmountPaid) { this.razorpayAmountPaid = razorpayAmountPaid; }

    public String getLabelUrl() { return labelUrl; }
    public void setLabelUrl(String labelUrl) { this.labelUrl = labelUrl; }

    public String getInvoiceUrl() { return invoiceUrl; }
    public void setInvoiceUrl(String invoiceUrl) { this.invoiceUrl = invoiceUrl; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getStatusHistoryJson() { return statusHistoryJson; }
    public void setStatusHistoryJson(String statusHistoryJson) { this.statusHistoryJson = statusHistoryJson; }
}
