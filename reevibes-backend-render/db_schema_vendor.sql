-- DDL Script: Vendor Catalog Integration System for PostgreSQL

CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(50) PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    revenue NUMERIC(12,2) DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    logo_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS vendor_connections (
    id SERIAL PRIMARY KEY,
    vendor_id VARCHAR(50) REFERENCES vendors(id) ON DELETE CASCADE,
    sync_url VARCHAR(255) NOT NULL,
    sync_frequency VARCHAR(50) DEFAULT 'MANUAL', -- 'DAILY', 'HOURLY', 'MANUAL'
    connection_status VARCHAR(20) DEFAULT 'DISCONNECTED', -- 'CONNECTED', 'DISCONNECTED', 'ERROR'
    last_sync_time TIMESTAMP,
    api_key VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS vendor_products (
    id VARCHAR(50) PRIMARY KEY,
    vendor_id VARCHAR(50) REFERENCES vendors(id) ON DELETE CASCADE,
    external_id VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    brand VARCHAR(100),
    material VARCHAR(100),
    fabric VARCHAR(100),
    gender VARCHAR(20) DEFAULT 'Unisex',
    type VARCHAR(50),
    price NUMERIC(10,2) NOT NULL,
    discount NUMERIC(5,2) DEFAULT 0,
    sku VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'PUBLISHED', 'HIDDEN', 'ARCHIVED'
    visibility VARCHAR(20) NOT NULL DEFAULT 'VISIBLE', -- 'VISIBLE', 'HIDDEN'
    last_sync TIMESTAMP,
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_recommended BOOLEAN DEFAULT FALSE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords VARCHAR(255),
    in_catalog BOOLEAN DEFAULT FALSE,
    tag VARCHAR(50),
    tags VARCHAR(255),
    collections VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS vendor_product_images (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES vendor_products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    position INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS vendor_product_videos (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES vendor_products(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vendor_product_sizes (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES vendor_products(id) ON DELETE CASCADE,
    size_name VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS vendor_product_stock (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES vendor_products(id) ON DELETE CASCADE,
    size_name VARCHAR(20) NOT NULL,
    available_stock INT DEFAULT 0,
    reserved_stock INT DEFAULT 0,
    sold_stock INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS vendor_sync_history (
    id SERIAL PRIMARY KEY,
    vendor_id VARCHAR(50) REFERENCES vendors(id) ON DELETE CASCADE,
    run_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    duration_ms BIGINT,
    products_added INT DEFAULT 0,
    products_updated INT DEFAULT 0,
    products_removed INT DEFAULT 0,
    products_failed INT DEFAULT 0,
    log_message TEXT
);

CREATE TABLE IF NOT EXISTS vendor_product_versions (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES vendor_products(id) ON DELETE CASCADE,
    version_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    price NUMERIC(10,2),
    description TEXT,
    stock_summary VARCHAR(255),
    sizes_summary VARCHAR(255),
    image_url TEXT,
    category VARCHAR(100),
    brand VARCHAR(100),
    restored_from_version_id INT
);

-- Seed initial vendor
INSERT INTO vendors (id, company_name, contact_person, email, phone, revenue, active, logo_url)
VALUES ('blankapparel', 'Blank Apparel India', 'Prakash Kumar', 'wholesale@blankapparel.in', '+91 9999911111', 0.00, TRUE, 'https://res.cloudinary.com/ihbgxvyo/image/upload/f_auto,q_auto/favicon_turcbu')
ON CONFLICT (id) DO NOTHING;

INSERT INTO vendor_connections (vendor_id, sync_url, sync_frequency, connection_status, last_sync_time)
VALUES ('blankapparel', 'https://www.blankapparel.in/products.json', 'DAILY', 'CONNECTED', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
