-- DDL Script: Shop Portal and Customer Management Tables for PostgreSQL

CREATE TABLE IF NOT EXISTS platform_users (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    country VARCHAR(50),
    dob VARCHAR(20),
    gender VARCHAR(10),
    status VARCHAR(20) DEFAULT 'Active',
    roles VARCHAR(255) DEFAULT 'CUSTOMER',
    addresses TEXT,
    wishlist TEXT,
    cart TEXT,
    last_login VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS product_buckets (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    product_ids TEXT NOT NULL,
    star_product_id VARCHAR(50),
    hidden BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE IF NOT EXISTS homepage_layout (
    id VARCHAR(50) PRIMARY KEY,
    layout_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS product_reviews (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL,
    comment TEXT NOT NULL,
    images TEXT,
    videos TEXT,
    review_date VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'Approved' NOT NULL
);

CREATE TABLE IF NOT EXISTS return_requests (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    customer_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    comment TEXT,
    images TEXT,
    videos TEXT,
    status VARCHAR(50) NOT NULL,
    refund_amount NUMERIC(12, 2) NOT NULL,
    refund_transaction_id VARCHAR(100),
    refund_date VARCHAR(20),
    selected_size VARCHAR(10),
    qty INT,
    refund_method VARCHAR(50),
    rejection_reason TEXT,
    expected_credit_date VARCHAR(20),
    pickup_date VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS shop_coupons (
    code VARCHAR(50) PRIMARY KEY,
    discount NUMERIC(12, 2) NOT NULL,
    type VARCHAR(20) NOT NULL,
    expiry_date VARCHAR(20) NOT NULL,
    usage_limit INT NOT NULL,
    user_eligibility VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    used_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS shop_orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    items_json TEXT NOT NULL,
    total NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    refund_details_json TEXT,
    razorpay_payment_id VARCHAR(100),
    razorpay_order_id VARCHAR(100),
    razorpay_signature VARCHAR(200),
    currency VARCHAR(20) DEFAULT 'INR',
    payment_method VARCHAR(50) DEFAULT 'Razorpay Gateway',
    transaction_date TIMESTAMP,
    tracking_number VARCHAR(100),
    courier_partner VARCHAR(100),
    estimated_delivery_date VARCHAR(50)
);
