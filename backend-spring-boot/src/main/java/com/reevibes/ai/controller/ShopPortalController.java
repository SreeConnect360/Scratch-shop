package com.reevibes.ai.controller;

import com.reevibes.ai.model.*;
import com.reevibes.ai.repository.*;
import com.reevibes.ai.service.SyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@SuppressWarnings({"null", "unchecked"})
public class ShopPortalController {

    private final ProductBucketRepository bucketRepository;
    private final PlatformUserRepository userRepository;
    private final UserRepository authUserRepository;
    private final HomepageLayoutRepository homepageLayoutRepository;
    private final ShopOrderRepository orderRepository;
    private final ReturnRequestRepository returnRequestRepository;
    private final ShopCouponRepository couponRepository;
    private final ProductReviewRepository reviewRepository;
    private final VendorRepository vendorRepository;
    private final VendorProductRepository vendorProductRepository;
    private final SyncService syncService;
    private final com.reevibes.ai.service.ShiprocketService shiprocketService;

    @org.springframework.beans.factory.annotation.Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @org.springframework.beans.factory.annotation.Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @GetMapping("/sync/version")
    public ResponseEntity<Map<String, Object>> getSyncVersion() {
        return ResponseEntity.ok(Map.of("version", syncService.getVersion()));
    }

    // --- BUCKETS ---
    @GetMapping("/buckets")
    public ResponseEntity<List<ProductBucket>> getBuckets() {
        return ResponseEntity.ok(bucketRepository.findAll());
    }

    @PostMapping("/buckets")
    @Transactional
    public ResponseEntity<ProductBucket> createBucket(@RequestBody ProductBucket bucket) {
        if (bucket.getId() == null || bucket.getId().isEmpty()) {
            bucket.setId("bkt-" + System.currentTimeMillis());
        }
        ProductBucket saved = bucketRepository.save(bucket);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/buckets/{id}")
    @Transactional
    public ResponseEntity<ProductBucket> updateBucket(@PathVariable String id, @RequestBody Map<String, Object> body) {
        ProductBucket bucket = bucketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bucket not found: " + id));

        if (body.containsKey("name")) bucket.setName((String) body.get("name"));
        if (body.containsKey("productIds")) {
            Object pids = body.get("productIds");
            if (pids instanceof List) {
                bucket.setProductIds(String.join(",", (List<String>) pids));
            } else if (pids != null) {
                bucket.setProductIds(pids.toString());
            }
        }
        if (body.containsKey("starProductId")) bucket.setStarProductId((String) body.get("starProductId"));
        if (body.containsKey("hidden")) bucket.setHidden((Boolean) body.get("hidden"));

        ProductBucket saved = bucketRepository.save(bucket);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/buckets/{id}")
    @Transactional
    public ResponseEntity<?> deleteBucket(@PathVariable String id) {
        bucketRepository.deleteById(id);
        syncService.bumpVersion();
        return ResponseEntity.ok(Map.of("message", "Bucket deleted successfully"));
    }

    // --- CUSTOMERS / PLATFORM USERS ---
    @GetMapping("/customers")
    @Transactional
    public ResponseEntity<List<PlatformUser>> getCustomers() {
        List<User> authUsers = authUserRepository.findAll();
        List<PlatformUser> platformUsers = userRepository.findAll();
        
        // Clean up legacy seeder demo accounts (@reevibes.com) from database
        for (PlatformUser pu : platformUsers) {
            if (pu.getEmail() != null && pu.getEmail().toLowerCase().endsWith("@reevibes.com")) {
                userRepository.delete(pu);
            }
        }
        
        // Refresh list after purging demo accounts
        platformUsers = userRepository.findAll();

        // Ensure every registered auth user has a corresponding PlatformUser record
        for (User au : authUsers) {
            if (au.getEmail() == null || au.getEmail().toLowerCase().endsWith("@reevibes.com")) continue;
            
            String email = au.getEmail().toLowerCase();
            boolean exists = platformUsers.stream()
                .anyMatch(pu -> pu.getEmail() != null && pu.getEmail().equalsIgnoreCase(email));
            
            if (!exists) {
                PlatformUser pu = new PlatformUser();
                pu.setId("USR-" + au.getId());
                String fullName = au.getName() != null ? au.getName() : "";
                String[] parts = fullName.split("\\s+", 2);
                pu.setFirstName(parts[0].isEmpty() ? "User" : parts[0]);
                pu.setLastName(parts.length > 1 ? parts[1] : "");
                pu.setEmail(email);
                pu.setPhone("");
                pu.setCountry("");
                pu.setDob("");
                pu.setGender("");
                pu.setStatus("Active");
                pu.setRoles("General");
                userRepository.save(pu);
            }
        }
        
        // Return all real customer accounts
        List<PlatformUser> result = userRepository.findAll().stream()
            .filter(pu -> pu.getEmail() != null && !pu.getEmail().toLowerCase().endsWith("@reevibes.com"))
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(result);
    }

    @PostMapping("/customers")
    @Transactional
    public ResponseEntity<PlatformUser> createCustomer(@RequestBody PlatformUser user) {
        PlatformUser existing = userRepository.findByEmailIgnoreCase(user.getEmail()).orElse(null);
        if (existing != null) {
            return ResponseEntity.ok(existing);
        }
        if (user.getId() == null || user.getId().isEmpty()) {
            user.setId("USR-" + System.currentTimeMillis());
        }
        PlatformUser saved = userRepository.save(user);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/customers/{id}")
    @Transactional
    public ResponseEntity<PlatformUser> updateCustomer(@PathVariable String id, @RequestBody Map<String, Object> body) {
        PlatformUser user = userRepository.findById(id).orElse(null);
        if (user == null && body.containsKey("email")) {
            user = userRepository.findByEmailIgnoreCase((String) body.get("email")).orElse(null);
        }
        if (user == null) {
            throw new IllegalArgumentException("Customer not found: " + id);
        }

        if (body.containsKey("firstName")) user.setFirstName((String) body.get("firstName"));
        if (body.containsKey("lastName")) user.setLastName((String) body.get("lastName"));
        if (body.containsKey("email")) user.setEmail((String) body.get("email"));
        if (body.containsKey("phone")) user.setPhone((String) body.get("phone"));
        if (body.containsKey("country")) user.setCountry((String) body.get("country"));
        if (body.containsKey("dob")) user.setDob((String) body.get("dob"));
        if (body.containsKey("gender")) user.setGender((String) body.get("gender"));
        if (body.containsKey("status")) user.setStatus((String) body.get("status"));
        if (body.containsKey("addresses")) user.setAddresses((String) body.get("addresses"));
        if (body.containsKey("wishlist")) user.setWishlist((String) body.get("wishlist"));
        if (body.containsKey("cart")) user.setCart((String) body.get("cart"));
        if (body.containsKey("lastLogin")) user.setLastLogin((String) body.get("lastLogin"));
        if (body.containsKey("roles")) {
            Object rolesVal = body.get("roles");
            if (rolesVal instanceof List) {
                user.setRoles(String.join(",", (List<String>) rolesVal));
            } else if (rolesVal != null) {
                user.setRoles(rolesVal.toString());
            }
        }

        PlatformUser saved = userRepository.save(user);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/customers/change-email")
    @Transactional
    public ResponseEntity<PlatformUser> changeCustomerEmail(@RequestBody Map<String, String> body) {
        String oldEmail = body.get("oldEmail");
        String newEmail = body.get("newEmail");
        if (oldEmail == null || newEmail == null || oldEmail.isEmpty() || newEmail.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        PlatformUser user = userRepository.findByEmailIgnoreCase(oldEmail).orElse(null);
        if (user == null) {
            user = userRepository.findByEmailIgnoreCase(newEmail).orElse(null);
        }
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setEmail(newEmail.toLowerCase());
        PlatformUser saved = userRepository.save(user);

        // Preserve all past order activities linked to old email
        List<ShopOrder> orders = orderRepository.findAll();
        for (ShopOrder o : orders) {
            if (oldEmail.equalsIgnoreCase(o.getUserId())) {
                o.setUserId(newEmail.toLowerCase());
                orderRepository.save(o);
            }
        }

        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/customers/{id}")
    @Transactional
    public ResponseEntity<?> deleteCustomer(@PathVariable String id) {
        userRepository.deleteById(id);
        syncService.bumpVersion();
        return ResponseEntity.ok(Map.of("message", "Customer deleted successfully"));
    }

    // --- HOMEPAGE LAYOUT ---
    @GetMapping("/homepage-layout")
    public ResponseEntity<List<HomepageLayout>> getHomepageLayouts() {
        return ResponseEntity.ok(homepageLayoutRepository.findAll());
    }

    @PutMapping("/homepage-layout/{id}")
    @Transactional
    public ResponseEntity<HomepageLayout> updateHomepageLayout(@PathVariable String id, @RequestBody Map<String, Object> body) {
        HomepageLayout layout = homepageLayoutRepository.findById(id)
                .orElseGet(() -> {
                    HomepageLayout l = new HomepageLayout();
                    l.setId(id);
                    return l;
                });
        layout.setLayoutJson((String) body.get("layoutJson"));
        HomepageLayout saved = homepageLayoutRepository.save(layout);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    // --- ORDERS TRACKER ---
    @GetMapping("/orders")
    public ResponseEntity<List<ShopOrder>> getOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @PostMapping("/orders")
    @Transactional
    public ResponseEntity<ShopOrder> createOrder(@RequestBody ShopOrder order) {
        if (order.getId() == null || order.getId().isEmpty()) {
            order.setId("ORD-" + (int)(1000 + Math.random() * 9000));
        }
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("Pending Approval");
        ShopOrder saved = orderRepository.save(order);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/orders/{id}/accept")
    @Transactional
    public ResponseEntity<ShopOrder> acceptOrder(@PathVariable String id) {
        ShopOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + id));
        order.setStatus("Accepted");
        
        try {
            Map<String, String> srDetails = shiprocketService.createShiprocketOrder(order);
            if (srDetails != null) {
                if (srDetails.containsKey("order_id")) order.setShiprocketOrderId(srDetails.get("order_id"));
                if (srDetails.containsKey("shipment_id")) order.setShiprocketShipmentId(srDetails.get("shipment_id"));
            }
        } catch (Exception e) {
            System.err.println("Failed to create Shiprocket shipment on accept: " + e.getMessage());
        }

        ShopOrder saved = orderRepository.save(order);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/orders/{id}/serviceability")
    public ResponseEntity<Map<String, Object>> getOrderServiceability(@PathVariable String id) {
        ShopOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + id));
        
        // Find destination pincode from address
        String rawAddress = order.getAddress() != null ? order.getAddress() : "";
        String pincode = "560038"; // fallback
        Pattern pinPattern = Pattern.compile("\\b\\d{6}\\b");
        Matcher matcher = pinPattern.matcher(rawAddress);
        if (matcher.find()) {
            pincode = matcher.group();
        }

        Map<String, Object> quotes = shiprocketService.getCourierQuotes(pincode);
        return ResponseEntity.ok(quotes);
    }

    @PostMapping("/orders/{id}/assign-awb")
    @Transactional
    public ResponseEntity<ShopOrder> assignAWB(@PathVariable String id, @RequestBody Map<String, Object> body) {
        ShopOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + id));
        
        String courierId = String.valueOf(body.get("courier_id"));
        String shipmentId = order.getShiprocketShipmentId();
        if (shipmentId == null || shipmentId.isEmpty()) {
            throw new IllegalStateException("No Shiprocket shipment ID associated with this order");
        }

        Map<String, Object> res = shiprocketService.assignAWB(shipmentId, courierId);
        String awbCode = null;
        String courierName = null;
        try {
            if (res != null && res.containsKey("response")) {
                Map<String, Object> responseMap = (Map<String, Object>) res.get("response");
                if (responseMap != null && responseMap.containsKey("data")) {
                    Map<String, Object> dataMap = (Map<String, Object>) responseMap.get("data");
                    if (dataMap != null) {
                        if (dataMap.containsKey("awb_code")) awbCode = String.valueOf(dataMap.get("awb_code"));
                        if (dataMap.containsKey("courier_name")) courierName = String.valueOf(dataMap.get("courier_name"));
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to parse AWB response: " + e.getMessage());
        }

        if (awbCode != null && !awbCode.isEmpty()) {
            order.setTrackingNumber(awbCode);
        } else {
            // fallback generated tracking number if API fails or mock response
            order.setTrackingNumber("SRT" + (int)(100000 + Math.random() * 900000));
        }

        if (courierName != null && !courierName.isEmpty()) {
            order.setCourierPartner(courierName);
        } else if (body.containsKey("courier_name")) {
            order.setCourierPartner(String.valueOf(body.get("courier_name")));
        }

        order.setStatus("Ready to Ship");
        ShopOrder saved = orderRepository.save(order);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/orders/{id}/schedule-pickup")
    @Transactional
    public ResponseEntity<ShopOrder> schedulePickup(@PathVariable String id, @RequestBody Map<String, Object> body) {
        ShopOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + id));
        
        String pickupDate = String.valueOf(body.getOrDefault("pickup_date", 
                new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date())));
        String shipmentId = order.getShiprocketShipmentId();

        if (shipmentId != null && !shipmentId.isEmpty()) {
            try {
                shiprocketService.schedulePickup(shipmentId, pickupDate);
            } catch (Exception e) {
                System.err.println("Failed to call generate pickup: " + e.getMessage());
            }
        }

        order.setStatus("Pickup Scheduled");
        ShopOrder saved = orderRepository.save(order);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/orders/{id}/status")
    @Transactional
    public ResponseEntity<ShopOrder> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, Object> body) {
        ShopOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + id));
        if (body.containsKey("status")) {
            String newStatus = (String) body.get("status");
            order.setStatus(newStatus);
            if ("Delivered".equalsIgnoreCase(newStatus)) {
                order.setDeliveryDate(java.time.LocalDateTime.now());
            }
        }
        if (body.containsKey("paymentStatus")) order.setPaymentStatus((String) body.get("paymentStatus"));
        if (body.containsKey("trackingNumber")) order.setTrackingNumber((String) body.get("trackingNumber"));
        if (body.containsKey("courierPartner")) order.setCourierPartner((String) body.get("courierPartner"));
        if (body.containsKey("estimatedDeliveryDate")) order.setEstimatedDeliveryDate((String) body.get("estimatedDeliveryDate"));
        ShopOrder saved = orderRepository.save(order);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/orders/{id}/refund")
    @Transactional
    public ResponseEntity<ShopOrder> updateOrderRefund(@PathVariable String id, @RequestBody Map<String, Object> body) {
        ShopOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + id));
        if (body.containsKey("status")) order.setStatus((String) body.get("status"));
        if (body.containsKey("paymentStatus")) order.setPaymentStatus((String) body.get("paymentStatus"));
        if (body.containsKey("refundDetailsJson")) order.setRefundDetailsJson((String) body.get("refundDetailsJson"));
        ShopOrder saved = orderRepository.save(order);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody Map<String, Object> body) {
        try {
            Object amountObj = body.get("amount");
            if (amountObj == null) {
                return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Amount is required"));
            }
            long amount = ((Number) amountObj).longValue();
            if (amount < 100) {
                return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Minimum amount must be 100 paise (1 INR)"));
            }
            String currency = (String) body.getOrDefault("currency", "INR");
            String receipt = (String) body.getOrDefault("receipt", "rec_" + System.currentTimeMillis());

            String auth = razorpayKeyId + ":" + razorpayKeySecret;
            String encodedAuth = java.util.Base64.getEncoder().encodeToString(auth.getBytes(java.nio.charset.StandardCharsets.UTF_8));

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Basic " + encodedAuth);

            Map<String, Object> requestBody = new java.util.HashMap<>();
            requestBody.put("amount", amount);
            requestBody.put("currency", currency);
            requestBody.put("receipt", receipt);

            org.springframework.http.HttpEntity<Map<String, Object>> entity = new org.springframework.http.HttpEntity<>(requestBody, headers);
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            
            ResponseEntity<?> response = restTemplate.postForEntity("https://api.razorpay.com/v1/orders", entity, Map.class);
            if (response.getStatusCode() == org.springframework.http.HttpStatus.CREATED || response.getStatusCode() == org.springframework.http.HttpStatus.OK) {
                Map<?, ?> responseBody = (Map<?, ?>) response.getBody();
                return ResponseEntity.ok(Map.of(
                    "order_id", responseBody.get("id"),
                    "amount", responseBody.get("amount"),
                    "currency", responseBody.get("currency")
                ));
            } else {
                return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to create order on Razorpay"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> body) {
        String paymentId = body.get("razorpay_payment_id");
        String orderId = body.get("razorpay_order_id");
        String signature = body.get("razorpay_signature");

        if (paymentId == null || orderId == null || signature == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Missing required fields"));
        }

        try {
            String data = orderId + "|" + paymentId;
            javax.crypto.Mac sha256_HMAC = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec secret_key = new javax.crypto.spec.SecretKeySpec(razorpayKeySecret.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            
            byte[] hash = sha256_HMAC.doFinal(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            
            String generatedSignature = hexString.toString();
            if (generatedSignature.equals(signature)) {
                return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified successfully"));
            } else {
                return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST)
                        .body(Map.of("status", "failure", "message", "Signature mismatch"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // --- RETURNS & REFUNDS ---
    @GetMapping("/returns")
    public ResponseEntity<List<ReturnRequest>> getReturns() {
        return ResponseEntity.ok(returnRequestRepository.findAll());
    }

    @PostMapping("/returns")
    @Transactional
    public ResponseEntity<ReturnRequest> createReturn(@RequestBody ReturnRequest request) {
        if (request.getId() == null || request.getId().isEmpty()) {
            request.setId("RET-" + (int)(100 + Math.random() * 900));
        }
        ReturnRequest saved = returnRequestRepository.save(request);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/returns/{id}")
    @Transactional
    public ResponseEntity<ReturnRequest> updateReturn(@PathVariable String id, @RequestBody Map<String, Object> body) {
        ReturnRequest req = returnRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Return not found: " + id));

        if (body.containsKey("status")) req.setStatus((String) body.get("status"));
        if (body.containsKey("refundTransactionId")) req.setRefundTransactionId((String) body.get("refundTransactionId"));
        if (body.containsKey("refundDate")) req.setRefundDate((String) body.get("refundDate"));
        if (body.containsKey("rejectionReason")) req.setRejectionReason((String) body.get("rejectionReason"));
        if (body.containsKey("expectedCreditDate")) req.setExpectedCreditDate((String) body.get("expectedCreditDate"));
        if (body.containsKey("pickupDate")) req.setPickupDate((String) body.get("pickupDate"));

        ReturnRequest saved = returnRequestRepository.save(req);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    // --- COUPONS MANAGER ---
    @GetMapping("/coupons")
    public ResponseEntity<List<ShopCoupon>> getCoupons() {
        return ResponseEntity.ok(couponRepository.findAll());
    }

    @PostMapping("/coupons")
    @Transactional
    public ResponseEntity<ShopCoupon> createCoupon(@RequestBody ShopCoupon coupon) {
        coupon.setCode(coupon.getCode().toUpperCase());
        ShopCoupon saved = couponRepository.save(coupon);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/coupons/{code}")
    @Transactional
    public ResponseEntity<?> deleteCoupon(@PathVariable String code) {
        couponRepository.deleteById(code.toUpperCase());
        syncService.bumpVersion();
        return ResponseEntity.ok(Map.of("message", "Coupon deleted successfully"));
    }

    // --- REVIEWS MODERATOR ---
    @GetMapping("/reviews")
    public ResponseEntity<List<ProductReview>> getReviews() {
        return ResponseEntity.ok(reviewRepository.findAll());
    }

    @PostMapping("/reviews")
    @Transactional
    public ResponseEntity<ProductReview> createReview(@RequestBody ProductReview review) {
        if (review.getId() == null || review.getId().isEmpty()) {
            review.setId("rev-" + System.currentTimeMillis());
        }
        if (review.getReviewDate() == null || review.getReviewDate().isEmpty()) {
            review.setReviewDate(new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date()));
        }
        ProductReview saved = reviewRepository.save(review);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/reviews/{id}/status")
    @Transactional
    public ResponseEntity<ProductReview> updateReviewStatus(@PathVariable String id, @RequestBody Map<String, Object> body) {
        ProductReview review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review not found: " + id));
        review.setStatus((String) body.get("status"));
        ProductReview saved = reviewRepository.save(review);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    // --- SHIPROCKET WEBHOOKS & TRACKER ---
    @PostMapping("/shiprocket/webhook")
    @Transactional
    public ResponseEntity<?> handleShiprocketWebhook(@RequestBody Map<String, Object> payload) {
        System.out.println("Received Shiprocket Webhook: " + payload);
        
        String orderId = null;
        if (payload.containsKey("channel_order_id") && payload.get("channel_order_id") != null) {
            orderId = String.valueOf(payload.get("channel_order_id")).trim();
        }
        if (orderId == null || orderId.isEmpty()) {
            if (payload.containsKey("order_id") && payload.get("order_id") != null) {
                orderId = String.valueOf(payload.get("order_id")).trim();
            }
        }
        
        if (orderId == null || orderId.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Order ID missing in payload"));
        }
        
        // Find order
        final String searchId = orderId;
        ShopOrder order = orderRepository.findById(searchId)
                .orElse(null);
                
        // Fallback: search by tracking number (awb)
        if (order == null && payload.containsKey("awb")) {
            String awb = String.valueOf(payload.get("awb")).trim();
            if (!awb.isEmpty()) {
                order = orderRepository.findAll().stream()
                        .filter(o -> awb.equals(o.getTrackingNumber()))
                        .findFirst()
                        .orElse(null);
            }
        }
        
        if (order == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Order not found with ID: " + searchId));
        }
        
        // Update order status fields
        String status = null;
        if (payload.containsKey("shipment_status")) {
            status = String.valueOf(payload.get("shipment_status"));
        } else if (payload.containsKey("current_status")) {
            status = String.valueOf(payload.get("current_status"));
        }
        if (status != null) {
            order.setStatus(status);
            if ("Delivered".equalsIgnoreCase(status)) {
                order.setDeliveryDate(java.time.LocalDateTime.now());
            }
        }
        
        if (payload.containsKey("awb")) {
            order.setTrackingNumber(String.valueOf(payload.get("awb")));
        }
        
        if (payload.containsKey("courier_name")) {
            order.setCourierPartner(String.valueOf(payload.get("courier_name")));
        } else if (payload.containsKey("courier_partner")) {
            order.setCourierPartner(String.valueOf(payload.get("courier_partner")));
        }
        
        if (payload.containsKey("etd")) {
            order.setEstimatedDeliveryDate(String.valueOf(payload.get("etd")));
        }
        
        if (payload.containsKey("scans")) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                String scansJsonStr = mapper.writeValueAsString(payload.get("scans"));
                order.setScansJson(scansJsonStr);
            } catch (Exception e) {
                System.err.println("Failed to serialize scans: " + e.getMessage());
            }
        }
        
        ShopOrder saved = orderRepository.save(order);
        syncService.bumpVersion();
        
        return ResponseEntity.ok(Map.of("message", "Order updated successfully", "orderId", saved.getId(), "status", saved.getStatus()));
    }

    // --- VENDORS ---
    @GetMapping("/vendors")
    public ResponseEntity<List<Vendor>> getVendors() {
        return ResponseEntity.ok(vendorRepository.findAll());
    }

    @PostMapping("/vendors")
    @Transactional
    public ResponseEntity<Vendor> createVendor(@RequestBody Vendor vendor) {
        if (vendor.getId() == null || vendor.getId().isEmpty()) {
            vendor.setId("v" + System.currentTimeMillis());
        }
        Vendor saved = vendorRepository.save(vendor);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/vendors/{id}")
    @Transactional
    public ResponseEntity<Vendor> updateVendor(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found: " + id));

        if (body.containsKey("companyName")) vendor.setCompanyName((String) body.get("companyName"));
        if (body.containsKey("contactPerson")) vendor.setContactPerson((String) body.get("contactPerson"));
        if (body.containsKey("email")) vendor.setEmail((String) body.get("email"));
        if (body.containsKey("phone")) vendor.setPhone((String) body.get("phone"));
        if (body.containsKey("revenue") && body.get("revenue") != null) {
            vendor.setRevenue(((Number) body.get("revenue")).doubleValue());
        }
        if (body.containsKey("products")) {
            Object prods = body.get("products");
            if (prods instanceof List) {
                try {
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    vendor.setProductsJson(mapper.writeValueAsString(prods));
                } catch (Exception e) {}
            } else if (prods != null) {
                vendor.setProductsJson(prods.toString());
            }
        }

        Vendor saved = vendorRepository.save(vendor);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/vendors/{id}")
    @Transactional
    public ResponseEntity<?> deleteVendor(@PathVariable String id) {
        vendorRepository.deleteById(id);
        syncService.bumpVersion();
        return ResponseEntity.ok(Map.of("message", "Vendor deleted successfully"));
    }

    // --- VENDOR PRODUCTS ---
    @GetMapping("/vendors/products")
    public ResponseEntity<List<Map<String, Object>>> getVendorProducts() {
        List<VendorProduct> list = vendorProductRepository.findAll();
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        
        List<Map<String, Object>> result = list.stream().map(p -> {
            Map<String, Object> map = new java.util.HashMap<>();
            if (p.getFullJson() != null && !p.getFullJson().isEmpty()) {
                try {
                    map = mapper.readValue(p.getFullJson(), Map.class);
                } catch (Exception e) {}
            }
            map.put("id", p.getId());
            if (p.getName() != null) map.put("name", p.getName());
            if (p.getHouse() != null) map.put("house", p.getHouse());
            if (p.getPrice() != null) map.put("price", p.getPrice());
            if (p.getImage() != null) map.put("image", p.getImage());
            if (p.getCategory() != null) map.put("category", p.getCategory());
            if (p.getGender() != null) map.put("gender", p.getGender());
            if (p.getTag() != null) map.put("tag", p.getTag());
            if (p.getSku() != null) map.put("sku", p.getSku());
            if (p.getOriginalPrice() != null) map.put("originalPrice", p.getOriginalPrice());
            if (p.getDiscount() != null) map.put("discount", p.getDiscount());
            if (p.getStatus() != null) map.put("status", p.getStatus());
            if (p.getVisibility() != null) map.put("visibility", p.getVisibility());
            if (p.getMaterial() != null) map.put("material", p.getMaterial());
            if (p.getFabric() != null) map.put("fabric", p.getFabric());
            if (p.getColor() != null) map.put("color", p.getColor());
            if (p.getCollections() != null) map.put("collections", p.getCollections());
            if (p.getOverviewTitle() != null) map.put("overviewTitle", p.getOverviewTitle());
            if (p.getDescription() != null) map.put("description", p.getDescription());
            if (p.getDetails() != null) map.put("details", p.getDetails());
            if (p.getInStock() != null) map.put("inStock", p.getInStock());
            if (p.getIsNew() != null) map.put("isNew", p.getIsNew());
            if (p.getIsNewArrival() != null) map.put("isNewArrival", p.getIsNewArrival());
            if (p.getIsTrending() != null) map.put("isTrending", p.getIsTrending());
            if (p.getIsBestSeller() != null) map.put("isBestSeller", p.getIsBestSeller());
            if (p.getIsFeatured() != null) map.put("isFeatured", p.getIsFeatured());
            if (p.getIsRecommended() != null) map.put("isRecommended", p.getIsRecommended());

            if (p.getImagesJson() != null && !p.getImagesJson().isEmpty() && !map.containsKey("images")) {
                try { map.put("images", mapper.readValue(p.getImagesJson(), List.class)); } catch(Exception e){}
            }
            if (p.getSizesJson() != null && !p.getSizesJson().isEmpty() && !map.containsKey("sizes")) {
                try { map.put("sizes", mapper.readValue(p.getSizesJson(), List.class)); } catch(Exception e){}
            }
            if (p.getTagsJson() != null && !p.getTagsJson().isEmpty() && !map.containsKey("tags")) {
                try { map.put("tags", mapper.readValue(p.getTagsJson(), List.class)); } catch(Exception e){}
            }
            if (p.getStockPerSizeJson() != null && !p.getStockPerSizeJson().isEmpty() && !map.containsKey("stockPerSize")) {
                try { map.put("stockPerSize", mapper.readValue(p.getStockPerSizeJson(), Map.class)); } catch(Exception e){}
            }
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/vendors/products")
    @Transactional
    public ResponseEntity<Map<String, Object>> createVendorProduct(@RequestBody Map<String, Object> body) {
        String id = body.containsKey("id") && body.get("id") != null ? String.valueOf(body.get("id")) : "pr" + System.currentTimeMillis();
        body.put("id", id);

        VendorProduct product = new VendorProduct();
        product.setId(id);
        
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        try {
            product.setFullJson(mapper.writeValueAsString(body));
        } catch (Exception e) {}

        if (body.containsKey("name")) product.setName((String) body.get("name"));
        if (body.containsKey("house")) product.setHouse((String) body.get("house"));
        if (body.containsKey("price")) product.setPrice(String.valueOf(body.get("price")));
        if (body.containsKey("image")) product.setImage((String) body.get("image"));
        if (body.containsKey("category")) product.setCategory((String) body.get("category"));
        if (body.containsKey("gender")) product.setGender((String) body.get("gender"));
        if (body.containsKey("tag")) product.setTag((String) body.get("tag"));
        if (body.containsKey("sku")) product.setSku((String) body.get("sku"));
        if (body.containsKey("originalPrice")) product.setOriginalPrice(String.valueOf(body.get("originalPrice")));
        if (body.containsKey("discount") && body.get("discount") != null) product.setDiscount(safeParseInt(body.get("discount")));
        if (body.containsKey("status")) product.setStatus(String.valueOf(body.get("status")));
        if (body.containsKey("visibility")) product.setVisibility(String.valueOf(body.get("visibility")));
        if (body.containsKey("material")) product.setMaterial((String) body.get("material"));
        if (body.containsKey("fabric")) product.setFabric((String) body.get("fabric"));
        if (body.containsKey("color")) product.setColor((String) body.get("color"));
        if (body.containsKey("collections")) product.setCollections((String) body.get("collections"));
        if (body.containsKey("description")) product.setDescription((String) body.get("description"));
        if (body.containsKey("details")) product.setDetails((String) body.get("details"));
        if (body.containsKey("inStock")) product.setInStock(safeParseBoolean(body.get("inStock")));
        if (body.containsKey("isNew")) product.setIsNew(safeParseBoolean(body.get("isNew")));
        if (body.containsKey("isNewArrival")) product.setIsNewArrival(safeParseBoolean(body.get("isNewArrival")));
        if (body.containsKey("isTrending")) product.setIsTrending(safeParseBoolean(body.get("isTrending")));
        if (body.containsKey("isBestSeller")) product.setIsBestSeller(safeParseBoolean(body.get("isBestSeller")));
        if (body.containsKey("isFeatured")) product.setIsFeatured(safeParseBoolean(body.get("isFeatured")));
        if (body.containsKey("isRecommended")) product.setIsRecommended(safeParseBoolean(body.get("isRecommended")));

        if (body.containsKey("images")) {
            try { product.setImagesJson(mapper.writeValueAsString(body.get("images"))); } catch(Exception e){}
        }
        if (body.containsKey("sizes")) {
            try { product.setSizesJson(mapper.writeValueAsString(body.get("sizes"))); } catch(Exception e){}
        }
        if (body.containsKey("tags")) {
            try { product.setTagsJson(mapper.writeValueAsString(body.get("tags"))); } catch(Exception e){}
        }
        if (body.containsKey("stockPerSize")) {
            try { product.setStockPerSizeJson(mapper.writeValueAsString(body.get("stockPerSize"))); } catch(Exception e){}
        }
        if (body.containsKey("productSections")) {
            try { product.setProductSectionsJson(mapper.writeValueAsString(body.get("productSections"))); } catch(Exception e){}
        }

        vendorProductRepository.save(product);
        syncService.bumpVersion();
        return ResponseEntity.ok(body);
    }

    @PutMapping("/vendors/products/{id}")
    @Transactional
    public ResponseEntity<Map<String, Object>> updateVendorProduct(@PathVariable String id, @RequestBody Map<String, Object> body) {
        VendorProduct product = vendorProductRepository.findById(id)
                .orElseGet(() -> {
                    VendorProduct p = new VendorProduct();
                    p.setId(id);
                    return p;
                });

        body.put("id", id);
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        try {
            product.setFullJson(mapper.writeValueAsString(body));
        } catch (Exception e) {}

        if (body.containsKey("name")) product.setName((String) body.get("name"));
        if (body.containsKey("house")) product.setHouse((String) body.get("house"));
        if (body.containsKey("price")) product.setPrice(String.valueOf(body.get("price")));
        if (body.containsKey("image")) product.setImage((String) body.get("image"));
        if (body.containsKey("category")) product.setCategory((String) body.get("category"));
        if (body.containsKey("gender")) product.setGender((String) body.get("gender"));
        if (body.containsKey("tag")) product.setTag((String) body.get("tag"));
        if (body.containsKey("sku")) product.setSku((String) body.get("sku"));
        if (body.containsKey("originalPrice")) product.setOriginalPrice(String.valueOf(body.get("originalPrice")));
        if (body.containsKey("discount") && body.get("discount") != null) product.setDiscount(safeParseInt(body.get("discount")));
        if (body.containsKey("status")) product.setStatus(String.valueOf(body.get("status")));
        if (body.containsKey("visibility")) product.setVisibility(String.valueOf(body.get("visibility")));
        if (body.containsKey("material")) product.setMaterial((String) body.get("material"));
        if (body.containsKey("fabric")) product.setFabric((String) body.get("fabric"));
        if (body.containsKey("color")) product.setColor((String) body.get("color"));
        if (body.containsKey("collections")) product.setCollections((String) body.get("collections"));
        if (body.containsKey("description")) product.setDescription((String) body.get("description"));
        if (body.containsKey("details")) product.setDetails((String) body.get("details"));
        if (body.containsKey("inStock")) product.setInStock(safeParseBoolean(body.get("inStock")));
        if (body.containsKey("isNew")) product.setIsNew(safeParseBoolean(body.get("isNew")));
        if (body.containsKey("isNewArrival")) product.setIsNewArrival(safeParseBoolean(body.get("isNewArrival")));
        if (body.containsKey("isTrending")) product.setIsTrending(safeParseBoolean(body.get("isTrending")));
        if (body.containsKey("isBestSeller")) product.setIsBestSeller(safeParseBoolean(body.get("isBestSeller")));
        if (body.containsKey("isFeatured")) product.setIsFeatured(safeParseBoolean(body.get("isFeatured")));
        if (body.containsKey("isRecommended")) product.setIsRecommended(safeParseBoolean(body.get("isRecommended")));

        if (body.containsKey("images")) {
            try { product.setImagesJson(mapper.writeValueAsString(body.get("images"))); } catch(Exception e){}
        }
        if (body.containsKey("sizes")) {
            try { product.setSizesJson(mapper.writeValueAsString(body.get("sizes"))); } catch(Exception e){}
        }
        if (body.containsKey("tags")) {
            try { product.setTagsJson(mapper.writeValueAsString(body.get("tags"))); } catch(Exception e){}
        }
        if (body.containsKey("stockPerSize")) {
            try { product.setStockPerSizeJson(mapper.writeValueAsString(body.get("stockPerSize"))); } catch(Exception e){}
        }
        if (body.containsKey("productSections")) {
            try { product.setProductSectionsJson(mapper.writeValueAsString(body.get("productSections"))); } catch(Exception e){}
        }

        vendorProductRepository.save(product);
        syncService.bumpVersion();
        return ResponseEntity.ok(body);
    }

    private int safeParseInt(Object val) {
        if (val == null) return 0;
        if (val instanceof Number) return ((Number) val).intValue();
        try {
            return Integer.parseInt(String.valueOf(val).replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return 0;
        }
    }

    private boolean safeParseBoolean(Object val) {
        if (val == null) return false;
        if (val instanceof Boolean) return (Boolean) val;
        return "true".equalsIgnoreCase(String.valueOf(val));
    }

    @DeleteMapping("/vendors/products/{id}")
    @Transactional
    public ResponseEntity<?> deleteVendorProduct(@PathVariable String id) {
        vendorProductRepository.deleteById(id);
        syncService.bumpVersion();
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }
}

