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

@Component
@RequiredArgsConstructor
@SuppressWarnings("null")
public class DatabaseSeeder implements CommandLineRunner {

    private final AIIntentRepository intentRepository;
    private final AICommandPatternRepository commandPatternRepository;
    private final CommandNormalizationService normalizationService;
    private final VendorRepository vendorRepository;
    private final VendorConnectionRepository vendorConnectionRepository;
    private final VendorProductRepository vendorProductRepository;
    private final VendorProductImageRepository vendorProductImageRepository;
    private final VendorProductSizeRepository vendorProductSizeRepository;
    private final VendorProductStockRepository vendorProductStockRepository;
    private final VendorSyncService vendorSyncService;
    private final ProductBucketRepository productBucketRepository;
    private final PlatformUserRepository platformUserRepository;
    private final HomepageLayoutRepository homepageLayoutRepository;
    private final ShopOrderRepository orderRepository;
    private final ReturnRequestRepository returnRequestRepository;
    private final ShopCouponRepository couponRepository;
    private final ProductReviewRepository reviewRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (intentRepository.count() == 0) {
            seedIntents();
        }
        seedVendor();
        seedBuckets();
        seedPlatformUsers();
        seedHomepageLayout();
        seedCoupons();
        seedOrders();
        seedReturns();
        seedReviews();
        triggerInitialSync();
    }

    @Transactional
    public void seedBuckets() {
        if (productBucketRepository.count() == 0) {
            ProductBucket b1 = new ProductBucket("bkt1", "Summer Essentials", "pr1,pr3", "pr1", false);
            ProductBucket b2 = new ProductBucket("bkt2", "Luxury Black Curation", "pr2,pr5", "pr2", false);
            productBucketRepository.saveAll(List.of(b1, b2));
        }
    }

    @Transactional
    public void seedPlatformUsers() {
        if (platformUserRepository.count() == 0) {
            String[] first = {"Anaïs","Sofia","Amara","Yuna","Camila","Zara","Isabela","Naomi","Aaliyah","Lucia","Mei","Olivia","Inés","Chiamaka","Lara","Valentina","Élise","Kenji","Adaeze","Marco","Léa","Hiro","Ada","Carlos","Sara"};
            String[] last  = {"Laurent","Marchetti","Okafor","Park","Reyes","Hadid","Costa","Bergström","Khan","Romano","Tanaka","Bennett","Vidal","Eze","Petrov","Cruz","Moreau","Watanabe","Nwosu","Bellucci","Dubois","Nakamura","Eze","Mendes","Cohen"};
            String[] countries = {"Maharashtra","Karnataka","Gujarat","West Bengal","Telangana","Delhi","Kerala","Tamil Nadu","Rajasthan","Maharashtra","Gujarat","Uttar Pradesh","Bihar","Punjab","Assam","Odisha","Maharashtra","Karnataka","Delhi","Tamil Nadu","Maharashtra","Karnataka","Delhi","Tamil Nadu","Maharashtra"};
            
            for (int i = 0; i < first.length; i++) {
                String fn = first[i];
                String ln = last[i];
                String id = "USR-" + (1000 + i);
                String email = fn.toLowerCase().replaceAll("[^a-z]", "") + "." + ln.toLowerCase().replaceAll("[^a-z]", "") + "@reevibes.com";
                String country = countries[i];
                int year = 1995 + (i % 12);
                String dob = year + "-" + String.format("%02d", (i % 9) + 1) + "-" + String.format("%02d", 10 + (i % 18));
                String phone = "+" + (30 + (i % 60)) + " " + (100 + i) + " " + (1000 + i * 7);
                String gender = "Female";
                String status = (i % 11 == 0) ? "Invited" : (i % 17 == 0) ? "Suspended" : "Active";
                
                String roles = "General";
                if (i < 16) roles += ",Contestant";
                if (i >= 16 && i <= 19) roles += ",Photographer";
                if (i == 20) roles += ",Admin";
                if (i == 21) roles += ",Applications,Ratings";
                if (i == 22) roles += ",Casting Call,Judgements";

                PlatformUser user = new PlatformUser(id, fn, ln, email, phone, country, dob, gender, status, roles);
                platformUserRepository.save(user);
            }
        }
    }

    @Transactional
    public void seedHomepageLayout() {
        if (homepageLayoutRepository.count() == 0) {
            String defaultLayout = "{\"sectionOrder\":[\"announcement\",\"hero\",\"features\",\"buckets\",\"featured\",\"curated\",\"trending\",\"photography\",\"footer\"],\"announcement\":{\"text\":\"Complimentary Shipping on all Maison orders above ₹1,00,000\"},\"hero\":{\"title\":\"Luxury Redefined\",\"subtitle\":\"Season 03 Collection Out Now\"}}";
            HomepageLayout pub = new HomepageLayout("published", defaultLayout);
            HomepageLayout draft = new HomepageLayout("draft", defaultLayout);
            homepageLayoutRepository.saveAll(List.of(pub, draft));
        }
    }

    @Transactional
    public void seedCoupons() {
        if (couponRepository.count() == 0) {
            ShopCoupon c1 = new ShopCoupon("FESTIVE20", new BigDecimal("20"), "percentage", "2026-12-31", 100, "All", true, 0);
            ShopCoupon c2 = new ShopCoupon("REEVIBES10", new BigDecimal("10"), "percentage", "2026-12-31", 200, "All", true, 0);
            couponRepository.saveAll(List.of(c1, c2));
        }
    }

    @Transactional
    public void seedOrders() {
        if (orderRepository.count() == 0) {
            String items1 = "[{\"productId\":\"pr2\",\"name\":\"Cashmere Cape\",\"house\":\"Atelier Reine\",\"price\":\"₹1,50,000\",\"image\":\"https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&h=1600&q=80\",\"qty\":1,\"selectedSize\":\"M\"}]";
            ShopOrder o1 = new ShopOrder("ORD-9481", "USR-1000", LocalDateTime.now().minusDays(30), items1, new BigDecimal("150000"), "Shipped", "123, Luxury Lane, Indiranagar, Bangalore - 560038", "Paid", null);

            String items2 = "[{\"productId\":\"pr1\",\"name\":\"Silk Slip — Noir\",\"house\":\"Maison Lumière\",\"price\":\"₹85,000\",\"image\":\"https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=1200&h=1600&q=80\",\"qty\":1,\"selectedSize\":\"S\"}]";
            ShopOrder o2 = new ShopOrder("ORD-9500", "USR-1000", LocalDateTime.now().minusDays(4), items2, new BigDecimal("85000"), "Processing", "123, Luxury Lane, Indiranagar, Bangalore - 560038", "Paid", null);

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
            ProductReview r1 = new ProductReview("rev1", "pr1", "Aditi Rao", 5, "Absolutely stunning dress! Fits perfectly and the silk material feels incredibly premium.", "", "", "2026-06-14", "Approved");
            ProductReview r2 = new ProductReview("rev2", "pr1", "Priya Sharma", 4, "Beautiful design, though it was slightly loose around the waist. High quality styling.", "", "", "2026-06-12", "Approved");
            ProductReview r3 = new ProductReview("rev3", "pr2", "Deepika Patel", 5, "Warm, luxurious, and elegant. Exceeded all my expectations.", "", "", "2026-06-15", "Approved");
            reviewRepository.saveAll(List.of(r1, r2, r3));
        }
    }

    @Transactional
    public void triggerInitialSync() {
        try {
            System.out.println("Cleaning up old vendor products to force fresh sync with correct sizes and quantities...");
            List<VendorProduct> existingProducts = vendorProductRepository.findByVendorId("blankapparel");
            for (VendorProduct p : existingProducts) {
                vendorProductImageRepository.deleteByProductId(p.getId());
                vendorProductSizeRepository.deleteByProductId(p.getId());
                vendorProductStockRepository.deleteByProductId(p.getId());
                vendorProductRepository.delete(p);
            }
            System.out.println("Triggering initial catalog sync...");
            vendorSyncService.syncCatalog("blankapparel");
        } catch (Exception e) {
            System.err.println("Initial automatic synchronization failed: " + e.getMessage());
        }
    }

    private void seedVendor() {
        if (!vendorRepository.existsById("blankapparel")) {
            Vendor vendor = new Vendor();
            vendor.setId("blankapparel");
            vendor.setCompanyName("Blank Apparel India");
            vendor.setContactPerson("Prakash Kumar");
            vendor.setEmail("wholesale@blankapparel.in");
            vendor.setPhone("+91 9999911111");
            vendor.setLogoUrl("https://blankapparel.in/cdn/shop/files/favicon.png");
            vendor.setRevenue(java.math.BigDecimal.ZERO);
            vendor.setActive(true);
            vendorRepository.save(vendor);

            VendorConnection conn = new VendorConnection();
            conn.setVendorId("blankapparel");
            conn.setSyncUrl("https://www.blankapparel.in/products.json");
            conn.setConnectionStatus("CONNECTED");
            conn.setSyncFrequency("DAILY");
            vendorConnectionRepository.save(conn);
            System.out.println("Blank Apparel India vendor and connection seeded successfully.");
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

    @RequiredArgsConstructor
    private static class IntentSeed {
        final String code;
        final String name;
        final String desc;
    }
}
