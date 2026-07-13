package com.reevibes.ai.controller;

import com.reevibes.ai.model.ProductBucket;
import com.reevibes.ai.model.PlatformUser;
import com.reevibes.ai.repository.ProductBucketRepository;
import com.reevibes.ai.repository.PlatformUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

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
        return ResponseEntity.ok(bucketRepository.save(bucket));
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

        return ResponseEntity.ok(bucketRepository.save(bucket));
    }

    @DeleteMapping("/buckets/{id}")
    @Transactional
    public ResponseEntity<?> deleteBucket(@PathVariable String id) {
        bucketRepository.deleteById(id);
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
        return ResponseEntity.ok(userRepository.save(user));
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

        return ResponseEntity.ok(userRepository.save(user));
    }

    @DeleteMapping("/customers/{id}")
    @Transactional
    public ResponseEntity<?> deleteCustomer(@PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Customer deleted successfully"));
    }
}
