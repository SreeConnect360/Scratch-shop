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

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "https://reevibes.com"})
@RequiredArgsConstructor
@SuppressWarnings({"null", "unchecked"})
public class ShopPortalController {

    private final ProductBucketRepository bucketRepository;
    private final PlatformUserRepository userRepository;
    private final HomepageLayoutRepository homepageLayoutRepository;
    private final ShopOrderRepository orderRepository;
    private final ReturnRequestRepository returnRequestRepository;
    private final ShopCouponRepository couponRepository;
    private final ProductReviewRepository reviewRepository;
    private final SyncService syncService;

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
    public ResponseEntity<List<PlatformUser>> getCustomers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/customers")
    @Transactional
    public ResponseEntity<PlatformUser> createCustomer(@RequestBody PlatformUser user) {
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
        PlatformUser user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + id));

        if (body.containsKey("firstName")) user.setFirstName((String) body.get("firstName"));
        if (body.containsKey("lastName")) user.setLastName((String) body.get("lastName"));
        if (body.containsKey("email")) user.setEmail((String) body.get("email"));
        if (body.containsKey("phone")) user.setPhone((String) body.get("phone"));
        if (body.containsKey("country")) user.setCountry((String) body.get("country"));
        if (body.containsKey("dob")) user.setDob((String) body.get("dob"));
        if (body.containsKey("gender")) user.setGender((String) body.get("gender"));
        if (body.containsKey("status")) user.setStatus((String) body.get("status"));
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
        ShopOrder saved = orderRepository.save(order);
        syncService.bumpVersion();
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/orders/{id}/status")
    @Transactional
    public ResponseEntity<ShopOrder> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, Object> body) {
        ShopOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + id));
        order.setStatus((String) body.get("status"));
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
}
