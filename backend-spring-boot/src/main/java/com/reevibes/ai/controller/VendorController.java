package com.reevibes.ai.controller;

import com.reevibes.ai.model.*;
import com.reevibes.ai.repository.*;
import com.reevibes.ai.service.VendorSyncService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = {"http://localhost:5173", "https://reevibes.com"})
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings({"null", "unchecked"})
public class VendorController {

    private final VendorRepository vendorRepository;
    private final VendorConnectionRepository vendorConnectionRepository;
    private final VendorProductRepository vendorProductRepository;
    private final VendorProductImageRepository vendorProductImageRepository;
    private final VendorProductSizeRepository vendorProductSizeRepository;
    private final VendorProductStockRepository vendorProductStockRepository;
    private final VendorSyncHistoryRepository vendorSyncHistoryRepository;
    private final VendorProductVersionRepository vendorProductVersionRepository;
    private final VendorSyncService vendorSyncService;

    // --- VENDORS REST ---

    @GetMapping
    public ResponseEntity<?> getVendors() {
        List<Vendor> vendors = vendorRepository.findAll();
        List<Map<String, Object>> response = vendors.stream().map(v -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", v.getId());
            map.put("companyName", v.getCompanyName());
            map.put("contactPerson", v.getContactPerson());
            map.put("email", v.getEmail());
            map.put("phone", v.getPhone());
            map.put("revenue", v.getRevenue());
            map.put("active", v.getActive());
            map.put("logoUrl", v.getLogoUrl());

            // Count products
            List<VendorProduct> products = vendorProductRepository.findByVendorId(v.getId());
            long total = products.size();
            long active = products.stream().filter(p -> "PUBLISHED".equalsIgnoreCase(p.getStatus())).count();
            long hidden = products.stream().filter(p -> "HIDDEN".equalsIgnoreCase(p.getStatus())).count();
            long draft = products.stream().filter(p -> "DRAFT".equalsIgnoreCase(p.getStatus())).count();

            map.put("totalProducts", total);
            map.put("activeProducts", active);
            map.put("hiddenProducts", hidden);
            map.put("draftProducts", draft);

            // Fetch Connection details
            Optional<VendorConnection> connOpt = vendorConnectionRepository.findByVendorId(v.getId());
            if (connOpt.isPresent()) {
                VendorConnection conn = connOpt.get();
                map.put("connectionStatus", conn.getConnectionStatus());
                map.put("lastSyncTime", conn.getLastSyncTime());
                map.put("syncFrequency", conn.getSyncFrequency());
                map.put("syncUrl", conn.getSyncUrl());
            } else {
                map.put("connectionStatus", "DISCONNECTED");
                map.put("lastSyncTime", null);
                map.put("syncFrequency", "MANUAL");
                map.put("syncUrl", "");
            }

            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> registerVendor(@RequestBody Vendor vendor) {
        if (vendor.getId() == null || vendor.getId().trim().isEmpty()) {
            vendor.setId("vnd-" + UUID.randomUUID().toString().substring(0, 8));
        }
        Vendor saved = vendorRepository.save(vendor);

        // Auto-create connection setup
        VendorConnection conn = new VendorConnection();
        conn.setVendorId(saved.getId());
        conn.setSyncUrl("https://www.blankapparel.in/products.json"); // Default template
        conn.setConnectionStatus("DISCONNECTED");
        conn.setSyncFrequency("MANUAL");
        vendorConnectionRepository.save(conn);

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteVendor(@PathVariable String id) {
        vendorRepository.deleteById(id);
        // Cascades should clean up connection, products, etc.
        return ResponseEntity.ok(Map.of("message", "Vendor successfully deleted."));
    }

    // --- CONNECTION & SYNC ---

    @GetMapping("/{id}/connection")
    public ResponseEntity<?> getConnection(@PathVariable String id) {
        VendorConnection conn = vendorConnectionRepository.findByVendorId(id)
                .orElseGet(() -> {
                    VendorConnection n = new VendorConnection();
                    n.setVendorId(id);
                    n.setSyncUrl("");
                    return vendorConnectionRepository.save(n);
                });
        return ResponseEntity.ok(conn);
    }

    @PostMapping("/{id}/connection")
    public ResponseEntity<?> saveConnection(@PathVariable String id, @RequestBody VendorConnection incoming) {
        VendorConnection conn = vendorConnectionRepository.findByVendorId(id)
                .orElseGet(() -> {
                    VendorConnection n = new VendorConnection();
                    n.setVendorId(id);
                    return n;
                });
        conn.setSyncUrl(incoming.getSyncUrl());
        conn.setSyncFrequency(incoming.getSyncFrequency());
        conn.setApiKey(incoming.getApiKey());
        VendorConnection saved = vendorConnectionRepository.save(conn);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/sync")
    public ResponseEntity<?> triggerSync(@PathVariable String id) {
        try {
            VendorSyncHistory history = vendorSyncService.syncCatalog(id);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/sync/history")
    public ResponseEntity<?> getSyncHistory(@PathVariable String id) {
        List<VendorSyncHistory> history = vendorSyncHistoryRepository.findByVendorIdOrderByRunTimeDesc(id);
        return ResponseEntity.ok(history);
    }

    // --- PRODUCTS ---

    @GetMapping("/products")
    public ResponseEntity<?> getProducts(
            @RequestParam(required = false) String vendorId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean inCatalog) {
        
        List<VendorProduct> products = vendorProductRepository.findAll();
        
        if (vendorId != null && !vendorId.isEmpty()) {
            products = products.stream().filter(p -> vendorId.equalsIgnoreCase(p.getVendorId())).collect(Collectors.toList());
        }
        if (status != null && !status.isEmpty()) {
            products = products.stream().filter(p -> status.equalsIgnoreCase(p.getStatus())).collect(Collectors.toList());
        }
        if (category != null && !category.isEmpty()) {
            products = products.stream().filter(p -> category.equalsIgnoreCase(p.getCategory())).collect(Collectors.toList());
        }
        if (inCatalog != null) {
            products = products.stream().filter(p -> Objects.equals(inCatalog, p.getInCatalog())).collect(Collectors.toList());
        } else {
            // Default: if no vendorId is specified, only return catalog-published/unpublished products
            if (vendorId == null || vendorId.isEmpty()) {
                products = products.stream().filter(p -> Boolean.TRUE.equals(p.getInCatalog())).collect(Collectors.toList());
            }
        }

        // Map complete response with images and stock
        List<Map<String, Object>> response = products.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("vendorId", p.getVendorId());
            map.put("externalId", p.getExternalId());
            map.put("name", p.getName());
            map.put("description", p.getDescription());
            map.put("category", p.getCategory());
            map.put("brand", p.getBrand());
            map.put("material", p.getMaterial());
            map.put("fabric", p.getFabric());
            map.put("gender", p.getGender());
            map.put("type", p.getType());
            map.put("price", p.getPrice());
            map.put("discount", p.getDiscount());
            map.put("sku", p.getSku());
            map.put("status", p.getStatus());
            map.put("visibility", p.getVisibility());
            map.put("lastSync", p.getLastSync());
            map.put("isFeatured", p.getIsFeatured());
            map.put("isNewArrival", p.getIsNewArrival());
            map.put("isTrending", p.getIsTrending());
            map.put("isRecommended", p.getIsRecommended());
            map.put("inCatalog", p.getInCatalog());
            map.put("tag", p.getTag());
            map.put("tags", p.getTags() != null ? Arrays.asList(p.getTags().split(",")) : Collections.emptyList());
            map.put("collections", p.getCollections());

            // Add images
            List<String> images = vendorProductImageRepository.findByProductId(p.getId()).stream()
                    .map(VendorProductImage::getImageUrl)
                    .collect(Collectors.toList());
            map.put("images", images);
            map.put("image", images.isEmpty() ? "" : images.get(0));

            // Add sizes
            List<String> sizes = vendorProductSizeRepository.findByProductId(p.getId()).stream()
                    .map(VendorProductSize::getSizeName)
                    .collect(Collectors.toList());
            map.put("sizes", sizes);

            // Add stock map
            List<VendorProductStock> stocks = vendorProductStockRepository.findByProductId(p.getId());
            Map<String, Integer> stockMap = new LinkedHashMap<>();
            int totalStock = 0;
            for (VendorProductStock s : stocks) {
                stockMap.put(s.getSizeName(), s.getAvailableStock());
                totalStock += s.getAvailableStock();
            }
            map.put("stockPerSize", stockMap);
            map.put("totalStock", totalStock);

            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/products/import")
    @Transactional
    public ResponseEntity<?> importProductsToCatalog(@RequestBody Map<String, List<String>> request) {
        List<String> productIds = request.get("productIds");
        if (productIds == null || productIds.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No product IDs specified"));
        }

        List<Map<String, Object>> importedProducts = new ArrayList<>();

        for (String id : productIds) {
            Optional<VendorProduct> prodOpt = vendorProductRepository.findById(id);
            if (prodOpt.isPresent()) {
                VendorProduct original = prodOpt.get();
                String catalogId = original.getId() + "-catalog";

                // Check if already in catalog
                VendorProduct clone;
                Optional<VendorProduct> existingOpt = vendorProductRepository.findById(catalogId);
                if (existingOpt.isPresent()) {
                    clone = existingOpt.get();
                } else {
                    clone = new VendorProduct();
                    clone.setId(catalogId);
                    clone.setVendorId(original.getVendorId());
                    clone.setExternalId(original.getExternalId());
                }

                // Copy all properties
                clone.setName(original.getName());
                clone.setDescription(original.getDescription());
                clone.setCategory(original.getCategory());
                clone.setBrand(original.getBrand());
                clone.setMaterial(original.getMaterial());
                clone.setFabric(original.getFabric());
                clone.setGender(original.getGender());
                clone.setType(original.getType());
                clone.setPrice(original.getPrice());
                clone.setDiscount(original.getDiscount());
                clone.setSku(original.getSku());
                clone.setStatus("UNPUBLISHED"); // Mark as Unpublished by default
                clone.setVisibility(original.getVisibility());
                clone.setLastSync(LocalDateTime.now());
                clone.setDisplayOrder(original.getDisplayOrder());
                clone.setIsFeatured(original.getIsFeatured());
                clone.setIsNewArrival(original.getIsNewArrival());
                clone.setIsTrending(original.getIsTrending());
                clone.setIsRecommended(original.getIsRecommended());
                clone.setSeoTitle(original.getSeoTitle());
                clone.setSeoDescription(original.getSeoDescription());
                clone.setSeoKeywords(original.getSeoKeywords());
                clone.setTag(original.getTag());
                clone.setTags(original.getTags());
                clone.setCollections(original.getCollections());
                clone.setInCatalog(true); // Mark as copied to ReeVibes catalog

                vendorProductRepository.save(clone);

                // Clone Images
                vendorProductImageRepository.deleteByProductId(catalogId);
                List<VendorProductImage> originalImages = vendorProductImageRepository.findByProductId(id);
                for (VendorProductImage img : originalImages) {
                    VendorProductImage imgClone = new VendorProductImage();
                    imgClone.setProductId(catalogId);
                    imgClone.setImageUrl(img.getImageUrl());
                    imgClone.setPosition(img.getPosition());
                    vendorProductImageRepository.save(imgClone);
                }

                // Clone Sizes
                vendorProductSizeRepository.deleteByProductId(catalogId);
                List<VendorProductSize> originalSizes = vendorProductSizeRepository.findByProductId(id);
                for (VendorProductSize sz : originalSizes) {
                    VendorProductSize szClone = new VendorProductSize();
                    szClone.setProductId(catalogId);
                    szClone.setSizeName(sz.getSizeName());
                    vendorProductSizeRepository.save(szClone);
                }

                // Clone Stock
                vendorProductStockRepository.deleteByProductId(catalogId);
                List<VendorProductStock> originalStocks = vendorProductStockRepository.findByProductId(id);
                for (VendorProductStock st : originalStocks) {
                    VendorProductStock stClone = new VendorProductStock();
                    stClone.setProductId(catalogId);
                    stClone.setSizeName(st.getSizeName());
                    stClone.setAvailableStock(st.getAvailableStock());
                    stClone.setReservedStock(st.getReservedStock());
                    stClone.setSoldStock(st.getSoldStock());
                    vendorProductStockRepository.save(stClone);
                }

                importedProducts.add(Map.of("id", clone.getId(), "name", clone.getName()));
            }
        }

        return ResponseEntity.ok(Map.of("message", "Successfully imported products", "imported", importedProducts));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProductDetail(@PathVariable String id) {
        VendorProduct p = vendorProductRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));

        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        map.put("vendorId", p.getVendorId());
        map.put("externalId", p.getExternalId());
        map.put("name", p.getName());
        map.put("description", p.getDescription());
        map.put("category", p.getCategory());
        map.put("brand", p.getBrand());
        map.put("material", p.getMaterial());
        map.put("fabric", p.getFabric());
        map.put("gender", p.getGender());
        map.put("type", p.getType());
        map.put("price", p.getPrice());
        map.put("discount", p.getDiscount());
        map.put("sku", p.getSku());
        map.put("status", p.getStatus());
        map.put("visibility", p.getVisibility());
        map.put("lastSync", p.getLastSync());
        map.put("isFeatured", p.getIsFeatured());
        map.put("isNewArrival", p.getIsNewArrival());
        map.put("isTrending", p.getIsTrending());
        map.put("isRecommended", p.getIsRecommended());
        map.put("seoTitle", p.getSeoTitle());
        map.put("seoDescription", p.getSeoDescription());
        map.put("seoKeywords", p.getSeoKeywords());
        map.put("inCatalog", p.getInCatalog());
        map.put("tag", p.getTag());
        map.put("tags", p.getTags() != null ? Arrays.asList(p.getTags().split(",")) : Collections.emptyList());
        map.put("collections", p.getCollections());

        // Images
        List<String> images = vendorProductImageRepository.findByProductId(p.getId()).stream()
                .map(VendorProductImage::getImageUrl)
                .collect(Collectors.toList());
        map.put("images", images);
        map.put("image", images.isEmpty() ? "" : images.get(0));

        // Sizes & Stock
        List<VendorProductStock> stocks = vendorProductStockRepository.findByProductId(p.getId());
        Map<String, Integer> stockMap = new LinkedHashMap<>();
        for (VendorProductStock s : stocks) {
            stockMap.put(s.getSizeName(), s.getAvailableStock());
        }
        map.put("stockPerSize", stockMap);
        map.put("sizes", new ArrayList<>(stockMap.keySet()));

        // Versions
        List<VendorProductVersion> versions = vendorProductVersionRepository.findByProductIdOrderByVersionTimestampDesc(p.getId());
        map.put("versions", versions);

        return ResponseEntity.ok(map);
    }

    @PutMapping("/products/{id}")
    @Transactional
    public ResponseEntity<?> updateProductDetail(@PathVariable String id, @RequestBody Map<String, Object> body) {
        VendorProduct p = vendorProductRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));

        // Update basic info
        if (body.containsKey("name")) p.setName((String) body.get("name"));
        if (body.containsKey("description")) p.setDescription((String) body.get("description"));
        if (body.containsKey("category")) p.setCategory((String) body.get("category"));
        if (body.containsKey("brand")) p.setBrand((String) body.get("brand"));
        if (body.containsKey("material")) p.setMaterial((String) body.get("material"));
        if (body.containsKey("fabric")) p.setFabric((String) body.get("fabric"));
        if (body.containsKey("gender")) p.setGender((String) body.get("gender"));
        if (body.containsKey("type")) p.setType((String) body.get("type"));
        if (body.containsKey("price")) p.setPrice(new BigDecimal(body.get("price").toString()));
        if (body.containsKey("discount")) p.setDiscount(new BigDecimal(body.get("discount").toString()));
        if (body.containsKey("status")) p.setStatus((String) body.get("status"));
        if (body.containsKey("visibility")) p.setVisibility((String) body.get("visibility"));
        if (body.containsKey("sku")) p.setSku((String) body.get("sku"));
        if (body.containsKey("inCatalog")) p.setInCatalog((Boolean) body.get("inCatalog"));
        if (body.containsKey("tag")) p.setTag((String) body.get("tag"));
        if (body.containsKey("tags")) {
            Object tagsVal = body.get("tags");
            if (tagsVal instanceof List) {
                p.setTags(String.join(",", (List<String>) tagsVal));
            } else if (tagsVal != null) {
                p.setTags(tagsVal.toString());
            } else {
                p.setTags(null);
            }
        }
        if (body.containsKey("collections")) p.setCollections((String) body.get("collections"));

        if (body.containsKey("isFeatured")) p.setIsFeatured((Boolean) body.get("isFeatured"));
        if (body.containsKey("isNewArrival")) p.setIsNewArrival((Boolean) body.get("isNewArrival"));
        if (body.containsKey("isTrending")) p.setIsTrending((Boolean) body.get("isTrending"));
        if (body.containsKey("isRecommended")) p.setIsRecommended((Boolean) body.get("isRecommended"));

        if (body.containsKey("seoTitle")) p.setSeoTitle((String) body.get("seoTitle"));
        if (body.containsKey("seoDescription")) p.setSeoDescription((String) body.get("seoDescription"));
        if (body.containsKey("seoKeywords")) p.setSeoKeywords((String) body.get("seoKeywords"));

        vendorProductRepository.save(p);

        // Update Images if provided
        if (body.containsKey("images")) {
            List<String> list = (List<String>) body.get("images");
            vendorProductImageRepository.deleteByProductId(p.getId());
            for (int i = 0; i < list.size(); i++) {
                VendorProductImage img = new VendorProductImage();
                img.setProductId(p.getId());
                img.setImageUrl(list.get(i));
                img.setPosition(i);
                vendorProductImageRepository.save(img);
            }
        }

        // Update stock/sizes if provided
        if (body.containsKey("stockPerSize")) {
            Map<String, Object> map = (Map<String, Object>) body.get("stockPerSize");
            vendorProductSizeRepository.deleteByProductId(p.getId());
            vendorProductStockRepository.deleteByProductId(p.getId());
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                VendorProductSize sz = new VendorProductSize();
                sz.setProductId(p.getId());
                sz.setSizeName(entry.getKey());
                vendorProductSizeRepository.save(sz);

                VendorProductStock st = new VendorProductStock();
                st.setProductId(p.getId());
                st.setSizeName(entry.getKey());
                st.setAvailableStock(Integer.parseInt(entry.getValue().toString()));
                vendorProductStockRepository.save(st);
            }
        }

        return ResponseEntity.ok(p);
    }

    @DeleteMapping("/products/{id}")
    @Transactional
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        vendorProductRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }

    @PostMapping("/products/{id}/restore")
    @Transactional
    public ResponseEntity<?> restoreVersion(@PathVariable String id, @RequestParam Long versionId) {
        VendorProduct p = vendorProductRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));

        VendorProductVersion version = vendorProductVersionRepository.findById(versionId)
                .orElseThrow(() -> new IllegalArgumentException("Version not found: " + versionId));

        // Restore values
        p.setPrice(version.getPrice());
        p.setDescription(version.getDescription());
        p.setCategory(version.getCategory());
        p.setBrand(version.getBrand());
        vendorProductRepository.save(p);

        // Restore Images if not empty
        if (version.getImageUrl() != null && !version.getImageUrl().isEmpty()) {
            vendorProductImageRepository.deleteByProductId(p.getId());
            VendorProductImage img = new VendorProductImage();
            img.setProductId(p.getId());
            img.setImageUrl(version.getImageUrl());
            img.setPosition(0);
            vendorProductImageRepository.save(img);
        }

        // Restore Stock & Sizes
        if (version.getStockSummary() != null && !version.getStockSummary().isEmpty()) {
            vendorProductSizeRepository.deleteByProductId(p.getId());
            vendorProductStockRepository.deleteByProductId(p.getId());
            
            String[] pairs = version.getStockSummary().split(",");
            for (String pair : pairs) {
                String[] parts = pair.split(":");
                if (parts.length == 2) {
                    String size = parts[0];
                    int qty = Integer.parseInt(parts[1]);

                    VendorProductSize sz = new VendorProductSize();
                    sz.setProductId(p.getId());
                    sz.setSizeName(size);
                    vendorProductSizeRepository.save(sz);

                    VendorProductStock st = new VendorProductStock();
                    st.setProductId(p.getId());
                    st.setSizeName(size);
                    st.setAvailableStock(qty);
                    vendorProductStockRepository.save(st);
                }
            }
        }

        return ResponseEntity.ok(p);
    }

    @PostMapping("/products/bulk")
    @Transactional
    public ResponseEntity<?> bulkAction(@RequestBody BulkRequest request) {
        List<VendorProduct> products = vendorProductRepository.findAllById(request.getProductIds());
        
        switch (request.getAction().toUpperCase()) {
            case "PUBLISH":
                products.forEach(p -> p.setStatus("PUBLISHED"));
                break;
            case "HIDE":
                products.forEach(p -> p.setStatus("HIDDEN"));
                break;
            case "DELETE":
                vendorProductRepository.deleteAll(products);
                return ResponseEntity.ok(Map.of("message", "Bulk deleted successfully."));
            case "CATEGORY":
                products.forEach(p -> p.setCategory(request.getValue()));
                break;
            case "BRAND":
                products.forEach(p -> p.setBrand(request.getValue()));
                break;
            case "DISCOUNT":
                BigDecimal disc = new BigDecimal(request.getValue());
                products.forEach(p -> p.setDiscount(disc));
                break;
        }

        vendorProductRepository.saveAll(products);
        return ResponseEntity.ok(Map.of("message", "Bulk action executed successfully."));
    }

    // --- CATEGORIES ---

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(vendorProductRepository.findDistinctCategories());
    }

    @PostMapping("/categories/merge")
    @Transactional
    public ResponseEntity<?> mergeCategories(@RequestBody MergeRequest request) {
        List<VendorProduct> products = vendorProductRepository.findAll().stream()
                .filter(p -> request.getSource().equalsIgnoreCase(p.getCategory()))
                .collect(Collectors.toList());

        products.forEach(p -> p.setCategory(request.getTarget()));
        vendorProductRepository.saveAll(products);
        return ResponseEntity.ok(Map.of("message", "Categories merged successfully."));
    }

    @PostMapping("/categories/rename")
    @Transactional
    public ResponseEntity<?> renameCategory(@RequestBody RenameRequest request) {
        List<VendorProduct> products = vendorProductRepository.findAll().stream()
                .filter(p -> request.getOldName().equalsIgnoreCase(p.getCategory()))
                .collect(Collectors.toList());

        products.forEach(p -> p.setCategory(request.getNewName()));
        vendorProductRepository.saveAll(products);
        return ResponseEntity.ok(Map.of("message", "Category renamed successfully."));
    }

    // --- ANALYTICS ---

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        List<VendorProduct> products = vendorProductRepository.findAll();
        
        long total = products.size();
        long published = products.stream().filter(p -> "PUBLISHED".equalsIgnoreCase(p.getStatus())).count();
        long hidden = products.stream().filter(p -> "HIDDEN".equalsIgnoreCase(p.getStatus())).count();
        long draft = products.stream().filter(p -> "DRAFT".equalsIgnoreCase(p.getStatus())).count();

        // Calculate Average Price
        BigDecimal avgPrice = BigDecimal.ZERO;
        if (total > 0) {
            BigDecimal sum = products.stream()
                    .map(VendorProduct::getPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            avgPrice = sum.divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);
        }

        // Calculate Low Stock (sum of stock < 5 for any size)
        long lowStockCount = 0;
        List<VendorProductStock> stocks = vendorProductStockRepository.findAll();
        Set<String> lowStockProductIds = new HashSet<>();
        for (VendorProductStock s : stocks) {
            if (s.getAvailableStock() < 5) {
                lowStockProductIds.add(s.getProductId());
            }
        }
        lowStockCount = lowStockProductIds.size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", total);
        stats.put("publishedProducts", published);
        stats.put("hiddenProducts", hidden);
        stats.put("draftProducts", draft);
        stats.put("lowStockCount", lowStockCount);
        stats.put("averagePrice", avgPrice);

        return ResponseEntity.ok(stats);
    }

    // --- HELPER CLASSES ---

    @Data
    public static class BulkRequest {
        private List<String> productIds;
        private String action; // PUBLISH, HIDE, DELETE, CATEGORY, BRAND, DISCOUNT
        private String value;
    }

    @Data
    public static class MergeRequest {
        private String source;
        private String target;
    }

    @Data
    public static class RenameRequest {
        private String oldName;
        private String newName;
    }
}
