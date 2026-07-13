package com.reevibes.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reevibes.ai.model.*;
import com.reevibes.ai.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings({"null"})
public class VendorSyncService {

    private final VendorConnectionRepository vendorConnectionRepository;
    private final VendorProductRepository vendorProductRepository;
    private final VendorProductImageRepository vendorProductImageRepository;
    private final VendorProductSizeRepository vendorProductSizeRepository;
    private final VendorProductStockRepository vendorProductStockRepository;
    private final VendorSyncHistoryRepository vendorSyncHistoryRepository;
    private final VendorProductVersionRepository vendorProductVersionRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Triggers manual synchronization for a given vendor.
     */
    @Transactional
    public VendorSyncHistory syncCatalog(String vendorId) {
        long startTime = System.currentTimeMillis();
        VendorSyncHistory history = new VendorSyncHistory();
        history.setVendorId(vendorId);
        history.setStatus("RUNNING");
        history = vendorSyncHistoryRepository.save(history);

        int added = 0;
        int updated = 0;
        int removed = 0;
        int failed = 0;
        StringBuilder logs = new StringBuilder();

        try {
            VendorConnection connection = vendorConnectionRepository.findByVendorId(vendorId)
                    .orElseThrow(() -> new IllegalArgumentException("Connection not found for vendor: " + vendorId));

            logs.append("Starting sync for URL: ").append(connection.getSyncUrl()).append("\n");

            // Fetch JSON from Shopify URL
            String jsonResponse = restTemplate.getForObject(connection.getSyncUrl(), String.class);
            if (jsonResponse == null || jsonResponse.trim().isEmpty()) {
                throw new IllegalStateException("Received empty response from sync URL.");
            }

            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode productsNode = root.get("products");
            if (productsNode == null || !productsNode.isArray()) {
                throw new IllegalStateException("Response does not contain a valid products array.");
            }

            logs.append("Fetched ").append(productsNode.size()).append(" products from source.\n");

            Set<String> incomingExternalIds = new HashSet<>();

            for (JsonNode prodNode : productsNode) {
                try {
                    String externalId = prodNode.get("id").asText();
                    incomingExternalIds.add(externalId);

                    String title = prodNode.get("title").asText();
                    String description = prodNode.has("body_html") ? prodNode.get("body_html").asText() : "";
                    String type = prodNode.has("product_type") ? prodNode.get("product_type").asText() : "";
                    String vendorName = prodNode.has("vendor") ? prodNode.get("vendor").asText() : "";

                    // Extract category/brand
                    String category = type != null && !type.isEmpty() ? type : "Apparel";
                    String brand = vendorName != null && !vendorName.isEmpty() ? vendorName : "Vendor";

                    // Parse variants for sizes, prices and stock
                    JsonNode variantsNode = prodNode.get("variants");
                    BigDecimal price = BigDecimal.ZERO;
                    String sku = "";
                    List<String> sizes = new ArrayList<>();
                    Map<String, Integer> stockMap = new LinkedHashMap<>();

                    if (variantsNode != null && variantsNode.isArray() && variantsNode.size() > 0) {
                        // Use first variant's price as base price
                        price = new BigDecimal(variantsNode.get(0).get("price").asText());
                        sku = variantsNode.get(0).has("sku") ? variantsNode.get(0).get("sku").asText() : "";

                        for (JsonNode varNode : variantsNode) {
                            String option1 = varNode.has("option1") ? varNode.get("option1").asText() : "";
                            String varTitle = varNode.get("title").asText();
                            
                            // Guess size from title or option1
                            String size = extractSize(option1.isEmpty() ? varTitle : option1);
                            if (!sizes.contains(size)) {
                                sizes.add(size);
                            }
                            
                            // Stock quantity (public API hides inventory numbers, check available status first)
                            boolean available = !varNode.has("available") || varNode.get("available").asBoolean();
                            int qty = available ? (varNode.has("inventory_quantity") ? varNode.get("inventory_quantity").asInt() : 15) : 0;
                            stockMap.put(size, stockMap.getOrDefault(size, 0) + qty);
                        }
                    }

                    // Extract images
                    List<String> imageUrls = new ArrayList<>();
                    JsonNode imagesNode = prodNode.get("images");
                    if (imagesNode != null && imagesNode.isArray()) {
                        for (JsonNode imgNode : imagesNode) {
                            imageUrls.add(imgNode.get("src").asText());
                        }
                    }
                    String primaryImage = imageUrls.isEmpty() ? "" : imageUrls.get(0);

                    // Check if product exists in database
                    Optional<VendorProduct> existingOpt = vendorProductRepository.findByVendorIdAndExternalId(vendorId, externalId);

                    if (existingOpt.isEmpty()) {
                        // Create product
                        VendorProduct newProduct = new VendorProduct();
                        newProduct.setId("vp-" + vendorId + "-" + externalId);
                        newProduct.setVendorId(vendorId);
                        newProduct.setExternalId(externalId);
                        newProduct.setName(title);
                        newProduct.setDescription(description);
                        newProduct.setCategory(category);
                        newProduct.setBrand(brand);
                        newProduct.setPrice(price);
                        newProduct.setSku(sku);
                        newProduct.setStatus("DRAFT"); // Default review queue
                        newProduct.setVisibility("VISIBLE");
                        newProduct.setLastSync(LocalDateTime.now());
                        vendorProductRepository.save(newProduct);

                        // Save images
                        for (int i = 0; i < imageUrls.size(); i++) {
                            VendorProductImage img = new VendorProductImage();
                            img.setProductId(newProduct.getId());
                            img.setImageUrl(imageUrls.get(i));
                            img.setPosition(i);
                            vendorProductImageRepository.save(img);
                        }

                        // Save sizes & stock
                        for (String size : sizes) {
                            VendorProductSize sz = new VendorProductSize();
                            sz.setProductId(newProduct.getId());
                            sz.setSizeName(size);
                            vendorProductSizeRepository.save(sz);

                            VendorProductStock st = new VendorProductStock();
                            st.setProductId(newProduct.getId());
                            st.setSizeName(size);
                            st.setAvailableStock(stockMap.getOrDefault(size, 10));
                            vendorProductStockRepository.save(st);
                        }

                        added++;
                        logs.append("Added Product: ").append(title).append(" (").append(externalId).append(")\n");
                    } else {
                        // Product exists: Check changes
                        VendorProduct existing = existingOpt.get();
                        boolean changed = false;

                        // 1. Fetch current details for change detection
                        List<VendorProductImage> curImages = vendorProductImageRepository.findByProductId(existing.getId());
                        List<VendorProductStock> curStocks = vendorProductStockRepository.findByProductId(existing.getId());
                        
                        String curStockSummary = curStocks.stream()
                                .map(s -> s.getSizeName() + ":" + s.getAvailableStock())
                                .collect(Collectors.joining(","));
                        String incomingStockSummary = stockMap.entrySet().stream()
                                .map(e -> e.getKey() + ":" + e.getValue())
                                .collect(Collectors.joining(","));

                        String curSizesSummary = curStocks.stream().map(VendorProductStock::getSizeName).sorted().collect(Collectors.joining(","));
                        String incomingSizesSummary = sizes.stream().sorted().collect(Collectors.joining(","));

                        String curPrimaryImg = curImages.isEmpty() ? "" : curImages.get(0).getImageUrl();

                        // Detect modifications
                        if (existing.getPrice().compareTo(price) != 0 ||
                                !Objects.equals(existing.getDescription(), description) ||
                                !Objects.equals(curPrimaryImg, primaryImage) ||
                                !Objects.equals(curStockSummary, incomingStockSummary) ||
                                !Objects.equals(curSizesSummary, incomingSizesSummary) ||
                                !Objects.equals(existing.getCategory(), category) ||
                                !Objects.equals(existing.getBrand(), brand)) {
                            changed = true;
                        }

                        if (changed) {
                            // Record version history before updating
                            VendorProductVersion version = new VendorProductVersion();
                            version.setProductId(existing.getId());
                            version.setPrice(existing.getPrice());
                            version.setDescription(existing.getDescription());
                            version.setStockSummary(curStockSummary);
                            version.setSizesSummary(curSizesSummary);
                            version.setImageUrl(curPrimaryImg);
                            version.setCategory(existing.getCategory());
                            version.setBrand(existing.getBrand());
                            vendorProductVersionRepository.save(version);

                            // Update active record
                            existing.setName(title);
                            existing.setDescription(description);
                            existing.setPrice(price);
                            existing.setCategory(category);
                            existing.setBrand(brand);
                            existing.setSku(sku);
                            existing.setLastSync(LocalDateTime.now());
                            vendorProductRepository.save(existing);

                            // Replace images
                            vendorProductImageRepository.deleteByProductId(existing.getId());
                            for (int i = 0; i < imageUrls.size(); i++) {
                                VendorProductImage img = new VendorProductImage();
                                img.setProductId(existing.getId());
                                img.setImageUrl(imageUrls.get(i));
                                img.setPosition(i);
                                vendorProductImageRepository.save(img);
                            }

                            // Replace sizes & stock
                            vendorProductSizeRepository.deleteByProductId(existing.getId());
                            vendorProductStockRepository.deleteByProductId(existing.getId());
                            for (String size : sizes) {
                                VendorProductSize sz = new VendorProductSize();
                                sz.setProductId(existing.getId());
                                sz.setSizeName(size);
                                vendorProductSizeRepository.save(sz);

                                VendorProductStock st = new VendorProductStock();
                                st.setProductId(existing.getId());
                                st.setSizeName(size);
                                st.setAvailableStock(stockMap.getOrDefault(size, 10));
                                vendorProductStockRepository.save(st);
                            }

                            updated++;
                            logs.append("Updated Product: ").append(title).append(" (").append(externalId).append(")\n");
                        } else {
                            // Touch timestamp
                            existing.setLastSync(LocalDateTime.now());
                            vendorProductRepository.save(existing);
                        }
                    }

                } catch (Exception pe) {
                    failed++;
                    logs.append("Failed parsing product: ").append(pe.getMessage()).append("\n");
                }
            }

            // Remove/Archive database products that are no longer present in incoming feed
            List<VendorProduct> dbProducts = vendorProductRepository.findByVendorId(vendorId);
            for (VendorProduct dbProd : dbProducts) {
                if (dbProd.getExternalId() != null && !incomingExternalIds.contains(dbProd.getExternalId())) {
                    dbProd.setStatus("ARCHIVED");
                    vendorProductRepository.save(dbProd);
                    removed++;
                    logs.append("Archived/Removed Product from feed: ").append(dbProd.getName()).append("\n");
                }
            }

            connection.setLastSyncTime(LocalDateTime.now());
            connection.setConnectionStatus("CONNECTED");
            vendorConnectionRepository.save(connection);

            history.setStatus("SUCCESS");
            logs.append("Sync completed successfully.");

        } catch (Exception e) {
            history.setStatus("FAILED");
            logs.append("Sync failed with exception: ").append(e.getMessage());
            e.printStackTrace();
        }

        history.setProductsAdded(added);
        history.setProductsUpdated(updated);
        history.setProductsRemoved(removed);
        history.setProductsFailed(failed);
        history.setDurationMs(System.currentTimeMillis() - startTime);
        history.setLogMessage(logs.toString());
        return vendorSyncHistoryRepository.save(history);
    }

    private String extractSize(String name) {
        if (name == null) return "M";
        name = name.toUpperCase().trim();
        
        // Remove trailing numbers or chest sizes like "- 38", " (38)"
        String firstToken = name.split("[\\s\\-]+")[0];
        if (firstToken.matches("^\\d*X*L$") || firstToken.matches("^X*S$") || firstToken.equals("S") || firstToken.equals("M") || firstToken.equals("L")) {
            return firstToken;
        }
        
        // Fallback checks from most specific to least specific
        if (name.contains("4XL") || name.contains("XXXXL")) return "4XL";
        if (name.contains("3XL") || name.contains("XXXL")) return "3XL";
        if (name.contains("2XL") || name.contains("XXL")) return "2XL";
        if (name.contains("XL")) return "XL";
        if (name.contains("XS")) return "XS";
        if (name.contains("S") || name.startsWith("S")) return "S";
        if (name.contains("M") || name.startsWith("M")) return "M";
        if (name.contains("L") || name.startsWith("L")) return "L";
        return name;
    }

    /**
     * Scheduled job running at 2 AM every day to auto-sync catalogs.
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void scheduledSync() {
        log.info("Starting scheduled vendor catalog sync job...");
        List<VendorConnection> connections = vendorConnectionRepository.findAll();
        for (VendorConnection conn : connections) {
            if ("DAILY".equalsIgnoreCase(conn.getSyncFrequency())) {
                try {
                    syncCatalog(conn.getVendorId());
                } catch (Exception e) {
                    log.error("Failed scheduled sync for vendor: " + conn.getVendorId(), e);
                }
            }
        }
    }
}
