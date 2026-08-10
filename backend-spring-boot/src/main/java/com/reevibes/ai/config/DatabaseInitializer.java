package com.reevibes.ai.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initializeDatabaseSchema() {
        try {
            System.out.println("Initializing and verifying vendor_products database schema in PostgreSQL...");
            
            // Create table if not exists
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS vendor_products (id VARCHAR(255) PRIMARY KEY)");

            // Add all required columns if they do not exist
            String[] alterQueries = {
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS name TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS house TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS price TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS image TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS images_json TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS category TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS gender TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS tag TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS sku TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS original_price TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS discount INT DEFAULT 0",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PUBLISHED'",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'VISIBLE'",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS material TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS fabric TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS color TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS collections TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS overview_title TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS description TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS details TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS sizes_json TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS tags_json TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS stock_per_size_json TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS product_info TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS product_sections_json TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS full_json TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT false",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT false",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT false",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN DEFAULT false",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS vendor_id TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS custom_rating DOUBLE PRECISION DEFAULT 4.8",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS custom_review_count INT DEFAULT 14",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS rating DOUBLE PRECISION DEFAULT 5.0",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS stock_quantity INT DEFAULT 100",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS seo_title TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS seo_description TEXT",
                "ALTER TABLE vendor_products ADD COLUMN IF NOT EXISTS seo_keywords TEXT"
            };

            for (String q : alterQueries) {
                if (q != null) {
                    try {
                        jdbcTemplate.execute(q);
                    } catch (Exception e) {
                        System.err.println("Column alter notice: " + e.getMessage());
                    }
                }
            }

            System.out.println("vendor_products table schema successfully verified!");
        } catch (Exception e) {
            System.err.println("Failed to initialize database schema: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
