package com.reevibes.ai.service;

import com.reevibes.ai.model.AIIntent;
import com.reevibes.ai.model.AICommandPattern;
import com.reevibes.ai.repository.AIIntentRepository;
import com.reevibes.ai.repository.AICommandPatternRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.reevibes.ai.model.*;
import com.reevibes.ai.repository.*;
import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@SuppressWarnings("null")
public class DatabaseSeeder implements CommandLineRunner {

    private final AIIntentRepository intentRepository;
    private final AICommandPatternRepository commandPatternRepository;
    private final CommandNormalizationService normalizationService;
    private final ProductBucketRepository productBucketRepository;
    private final PlatformUserRepository platformUserRepository;
    private final HomepageLayoutRepository homepageLayoutRepository;
    private final ShopOrderRepository orderRepository;
    private final ReturnRequestRepository returnRequestRepository;
    private final ShopCouponRepository couponRepository;
    private final ProductReviewRepository reviewRepository;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Execute DDL dynamically to ensure Supabase database schema is aligned safely
        safeExecuteDdl("ALTER TABLE platform_users ADD COLUMN IF NOT EXISTS addresses TEXT;");
        safeExecuteDdl("ALTER TABLE platform_users ADD COLUMN IF NOT EXISTS wishlist TEXT;");
        safeExecuteDdl("ALTER TABLE platform_users ADD COLUMN IF NOT EXISTS cart TEXT;");
        safeExecuteDdl("ALTER TABLE platform_users ADD COLUMN IF NOT EXISTS last_login VARCHAR(50);");
        safeExecuteDdl("ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(100);");
        safeExecuteDdl("ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100);");
        safeExecuteDdl("ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS razorpay_signature VARCHAR(200);");
        safeExecuteDdl("ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS currency VARCHAR(20);");
        safeExecuteDdl("ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);");
        safeExecuteDdl("ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS transaction_date TIMESTAMP;");
        safeExecuteDdl("ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100);");
        safeExecuteDdl("ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS courier_partner VARCHAR(100);");
        safeExecuteDdl("ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS estimated_delivery_date VARCHAR(50);");
        safeExecuteDdl("ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS scans_json TEXT;");
        safeExecuteDdl("ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS delivery_date TIMESTAMP;");
        safeExecuteDdl("ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS shiprocket_order_id VARCHAR(100);");
        safeExecuteDdl("ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS shiprocket_shipment_id VARCHAR(100);");
        safeExecuteDdl("ALTER TABLE shop_orders ADD COLUMN IF NOT EXISTS status_history_json TEXT;");

        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS image TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS name TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS house TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS category TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS full_json TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS images_json TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS sizes_json TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS tags_json TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS stock_per_size_json TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS product_sections_json TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS gender VARCHAR(50);");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS tag TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS sku VARCHAR(100);");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS original_price VARCHAR(50);");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS discount INT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS status VARCHAR(50);");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS visibility VARCHAR(50);");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS material TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS fabric TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS color TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS collections TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS overview_title TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS product_info TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS is_trending BOOLEAN;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS seo_title TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS seo_description TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS seo_keywords TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS custom_rating DOUBLE PRECISION;");
        safeExecuteDdl("ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS custom_review_count INT;");

        // Convert any existing VARCHAR columns to TEXT to avoid truncation issues
        safeExecuteDdl("ALTER TABLE vendor_products ALTER COLUMN image TYPE TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ALTER COLUMN name TYPE TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ALTER COLUMN house TYPE TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ALTER COLUMN category TYPE TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ALTER COLUMN tag TYPE TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ALTER COLUMN material TYPE TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ALTER COLUMN fabric TYPE TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ALTER COLUMN color TYPE TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ALTER COLUMN collections TYPE TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ALTER COLUMN overview_title TYPE TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ALTER COLUMN seo_title TYPE TEXT;");
        safeExecuteDdl("ALTER TABLE vendor_products ALTER COLUMN seo_keywords TYPE TEXT;");

        if (intentRepository.count() == 0) {
            seedIntents();
        }
        seedBuckets();
        // seedPlatformUsers();
        seedHomepageLayout();
        seedCoupons();
        seedOrders();
        seedReturns();
        seedReviews();
    }

    @Transactional
    public void seedBuckets() {
        if (productBucketRepository.count() == 0) {
            ProductBucket b1 = new ProductBucket();
            b1.setId("bkt1"); b1.setName("Summer Essentials"); b1.setProductIds("pr1,pr3"); b1.setStarProductId("pr1"); b1.setHidden(false);
            ProductBucket b2 = new ProductBucket();
            b2.setId("bkt2"); b2.setName("Luxury Black Curation"); b2.setProductIds("pr2,pr5"); b2.setStarProductId("pr2"); b2.setHidden(false);
            productBucketRepository.saveAll(List.of(b1, b2));
        }
    }

    @Transactional
    public void seedPlatformUsers() {
        // Do not seed demo users for Customers Directory; purge demo users if any exist
        List<PlatformUser> platformUsers = platformUserRepository.findAll();
        for (PlatformUser pu : platformUsers) {
            if (pu.getEmail() != null && pu.getEmail().toLowerCase().endsWith("@reevibes.com")) {
                platformUserRepository.delete(pu);
            }
        }
    }

    @Transactional
    public void seedHomepageLayout() {
        if (homepageLayoutRepository.count() == 0) {
            String defaultLayout = "{\"sectionOrder\":[\"announcement\",\"hero\",\"features\",\"buckets\",\"featured\",\"curated\",\"trending\",\"photography\",\"footer\"],\"announcement\":{\"text\":\"Complimentary Shipping on all Maison orders above ₹1,00,000\"},\"hero\":{\"title\":\"Luxury Redefined\",\"subtitle\":\"Season 03 Collection Out Now\"}}";
            HomepageLayout pub = new HomepageLayout();
            pub.setId("published"); pub.setLayoutJson(defaultLayout);
            HomepageLayout draft = new HomepageLayout();
            draft.setId("draft"); draft.setLayoutJson(defaultLayout);
            homepageLayoutRepository.saveAll(List.of(pub, draft));
        }
    }

    @Transactional
    public void seedCoupons() {
        if (couponRepository.count() == 0) {
            ShopCoupon c1 = new ShopCoupon();
            c1.setCode("MAISONVIP"); c1.setDiscount(new BigDecimal("25")); c1.setType("percentage"); c1.setExpiryDate("2026-12-31"); c1.setUsageLimit(100); c1.setUserEligibility("All"); c1.setActive(true); c1.setUsedCount(0);
            ShopCoupon c2 = new ShopCoupon();
            c2.setCode("REEVIBES10"); c2.setDiscount(new BigDecimal("10")); c2.setType("percentage"); c2.setExpiryDate("2026-12-31"); c2.setUsageLimit(200); c2.setUserEligibility("All"); c2.setActive(true); c2.setUsedCount(0);
            couponRepository.saveAll(List.of(c1, c2));
        }
    }

    @Transactional
    public void seedOrders() {
        if (orderRepository.count() == 0) {
            String items1 = "[{\"productId\":\"pr2\",\"name\":\"Cashmere Cape\",\"house\":\"Atelier Reine\",\"price\":\"₹1,50,000\",\"image\":\"https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&h=1600&q=80\",\"qty\":1,\"selectedSize\":\"M\"}]";
            ShopOrder o1 = new ShopOrder();
            o1.setId("ORD-9481");
            o1.setUserId("USR-1000");
            o1.setOrderDate(LocalDateTime.now().minusDays(30));
            o1.setItemsJson(items1);
            o1.setTotal(new BigDecimal("150000"));
            o1.setStatus("Shipped");
            o1.setAddress("123, Luxury Lane, Indiranagar, Bangalore - 560038");
            o1.setPaymentStatus("Paid");
            o1.setCurrency("INR");
            o1.setPaymentMethod("Razorpay Gateway");

            String items2 = "[{\"productId\":\"pr1\",\"name\":\"Silk Slip — Noir\",\"house\":\"Maison Lumière\",\"price\":\"₹85,000\",\"image\":\"https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=1200&h=1600&q=80\",\"qty\":1,\"selectedSize\":\"S\"}]";
            ShopOrder o2 = new ShopOrder();
            o2.setId("ORD-9500");
            o2.setUserId("USR-1000");
            o2.setOrderDate(LocalDateTime.now().minusDays(4));
            o2.setItemsJson(items2);
            o2.setTotal(new BigDecimal("85000"));
            o2.setStatus("Processing");
            o2.setAddress("123, Luxury Lane, Indiranagar, Bangalore - 560038");
            o2.setPaymentStatus("Paid");
            o2.setCurrency("INR");
            o2.setPaymentMethod("Razorpay Gateway");

            orderRepository.saveAll(List.of(o1, o2));
        }
    }

    @Transactional
    public void seedReturns() {
        if (returnRequestRepository.count() == 0) {
            ReturnRequest r1 = new ReturnRequest();
            r1.setId("RET-101");
            r1.setOrderId("ORD-9481");
            r1.setProductId("pr2");
            r1.setProductName("Cashmere Cape");
            r1.setCustomerId("USR-1000");
            r1.setCustomerName("Léa Dubois");
            r1.setReason("Size Issue");
            r1.setComment("The cape size is too large around the shoulders.");
            r1.setImages("https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&h=300&q=80");
            r1.setStatus("Pending");
            r1.setRefundAmount(new BigDecimal("150000"));
            returnRequestRepository.save(r1);
        }
    }

    @Transactional
    public void seedReviews() {
        if (reviewRepository.count() == 0) {
            ProductReview r1 = new ProductReview();
            r1.setId("rev1"); r1.setProductId("pr1"); r1.setUserName("Aditi Rao"); r1.setRating(5); r1.setComment("Absolutely stunning dress! Fits perfectly and the silk material feels incredibly premium."); r1.setImages(""); r1.setVideos(""); r1.setReviewDate("2026-06-14"); r1.setStatus("Approved");
            ProductReview r2 = new ProductReview();
            r2.setId("rev2"); r2.setProductId("pr1"); r2.setUserName("Priya Sharma"); r2.setRating(4); r2.setComment("Beautiful design, though it was slightly loose around the waist. High quality styling."); r2.setImages(""); r2.setVideos(""); r2.setReviewDate("2026-06-12"); r2.setStatus("Approved");
            ProductReview r3 = new ProductReview();
            r3.setId("rev3"); r3.setProductId("pr2"); r3.setUserName("Deepika Patel"); r3.setRating(5); r3.setComment("Warm, luxurious, and elegant. Exceeded all my expectations."); r3.setImages(""); r3.setVideos(""); r3.setReviewDate("2026-06-15"); r3.setStatus("Approved");
            reviewRepository.saveAll(List.of(r1, r2, r3));
        }
    }



    private void seedIntents() {
        // 1. Seed base intents
        List<IntentSeed> seeds = List.of(
            new IntentSeed("SHOW_CART", "Show Cart", "Show my active shopping cart curation."),
            new IntentSeed("SHOW_WISHLIST", "Show Wishlist", "Load my saved pieces wishlist."),
            new IntentSeed("SHOW_ORDERS", "Show Orders", "Open my Maison Orders tracker."),
            new IntentSeed("SHOW_COUPONS", "Show Coupons", "Display available active promotional codes."),
            new IntentSeed("SHOW_SETTINGS", "Show Settings", "Open my account settings dashboard."),
            new IntentSeed("SHOW_PROFILE", "Show Profile", "Open my personal dossier profile details."),
            new IntentSeed("SHOW_WALLET", "Show Wallet", "Open wallet balance and transactions logs."),
            new IntentSeed("SHOW_ADDRESSES", "Show Addresses", "Open delivery points destinations registry."),
            new IntentSeed("CHANGE_THEME", "Change Theme", "Update appearance layout look."),
            new IntentSeed("SWITCH_DARK_MODE", "Switch to Dark Mode", "Switch boutique interface theme to dark mode."),
            new IntentSeed("SWITCH_LIGHT_MODE", "Switch to Light Mode", "Switch boutique interface theme to light mode."),
            new IntentSeed("CHECKOUT_MENS_PRODUCTS", "Checkout Men's Products", "Checkout only men's products in cart."),
            new IntentSeed("CHECKOUT_WOMENS_PRODUCTS", "Checkout Women's Products", "Checkout only women's products in cart."),
            new IntentSeed("SEARCH_PRODUCTS", "Search Products", "Search catalog for products.")
        );

        for (IntentSeed s : seeds) {
            AIIntent intent = new AIIntent();
            intent.setIntentCode(s.code);
            intent.setIntentName(s.name);
            intent.setDescription(s.desc);
            intent.setEnabled(true);
            intentRepository.save(intent);

            // Add default command patterns for each base intent
            seedCommandPattern(intent, s.name);
            if (s.code.equals("SHOW_CART")) {
                seedCommandPattern(intent, "show my cart");
                seedCommandPattern(intent, "open my cart");
                seedCommandPattern(intent, "display cart items");
                seedCommandPattern(intent, "view cart");
            } else if (s.code.equals("SHOW_WISHLIST")) {
                seedCommandPattern(intent, "show my wishlist");
                seedCommandPattern(intent, "open wishlist");
                seedCommandPattern(intent, "view saved pieces");
            } else if (s.code.equals("SHOW_ORDERS")) {
                seedCommandPattern(intent, "show my orders");
                seedCommandPattern(intent, "track my orders");
                seedCommandPattern(intent, "view orders");
            } else if (s.code.equals("SWITCH_DARK_MODE")) {
                seedCommandPattern(intent, "switch to dark mode");
                seedCommandPattern(intent, "change theme to dark");
                seedCommandPattern(intent, "enable dark mode");
            } else if (s.code.equals("SWITCH_LIGHT_MODE")) {
                seedCommandPattern(intent, "switch to light mode");
                seedCommandPattern(intent, "change theme to light");
                seedCommandPattern(intent, "enable light mode");
            }
        }
        System.out.println("Base AI Intents and Command Patterns seeded successfully.");
    }

    private void seedCommandPattern(AIIntent intent, String commandText) {
        String normalized = normalizationService.normalize(commandText);
        if (commandPatternRepository.findByNormalizedCommand(normalized).isEmpty()) {
            AICommandPattern pattern = new AICommandPattern();
            pattern.setIntent(intent);
            pattern.setCommandText(commandText);
            pattern.setNormalizedCommand(normalized);
            commandPatternRepository.save(pattern);
        }
    }

    private void safeExecuteDdl(String sql) {
        try {
            jdbcTemplate.execute(sql);
        } catch (Exception e) {
            System.err.println("DDL execution skipped for SQL [" + sql + "]: " + e.getMessage());
        }
    }

    private static class IntentSeed {
        final String code;
        final String name;
        final String desc;

        IntentSeed(String code, String name, String desc) {
            this.code = code;
            this.name = name;
            this.desc = desc;
        }
    }
}
