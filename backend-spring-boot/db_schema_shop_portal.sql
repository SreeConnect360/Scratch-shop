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
    last_login VARCHAR(50),
    wallet_balance NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_buckets (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    product_ids TEXT NOT NULL,
    star_product_id VARCHAR(50),
    thumbnail TEXT DEFAULT '',
    display_order INT DEFAULT 0,
    hidden BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
    used_count INT DEFAULT 0,
    product_type VARCHAR(100) DEFAULT '',
    brand VARCHAR(100) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallet_gift_cards (
    id VARCHAR(100) PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    usage_type VARCHAR(50) DEFAULT 'unlimited',
    usage_limit INT DEFAULT 100,
    used_count INT DEFAULT 0,
    validity_type VARCHAR(50) DEFAULT 'unlimited',
    expiry_date VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    redeemed_users TEXT DEFAULT ''
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
    estimated_delivery_date VARCHAR(50),
    scans_json TEXT,
    delivery_date TIMESTAMP,
    shiprocket_order_id VARCHAR(100),
    shiprocket_shipment_id VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS vendor_products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255),
    house VARCHAR(255),
    price VARCHAR(50),
    image TEXT,
    images_json TEXT,
    category VARCHAR(100),
    gender VARCHAR(50),
    tag VARCHAR(100),
    sku VARCHAR(100),
    original_price VARCHAR(50),
    discount INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PUBLISHED',
    visibility VARCHAR(50) DEFAULT 'VISIBLE',
    material VARCHAR(255),
    fabric VARCHAR(255),
    color VARCHAR(100),
    collections VARCHAR(255),
    overview_title VARCHAR(255),
    description TEXT,
    details TEXT,
    sizes_json TEXT,
    tags_json TEXT,
    stock_per_size_json TEXT,
    product_info TEXT,
    product_sections_json TEXT,
    full_json TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    is_new BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_recommended BOOLEAN DEFAULT FALSE,
    vendor_id VARCHAR(50),
    custom_rating NUMERIC(4, 2) DEFAULT 4.8,
    custom_review_count INT DEFAULT 14,
    rating NUMERIC(4, 2) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    stock_quantity INT DEFAULT 100,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(50) PRIMARY KEY,
    company_name VARCHAR(255),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    products_json TEXT,
    revenue NUMERIC(12, 2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS homepage_layout (
    id VARCHAR(50) PRIMARY KEY,
    layout_json TEXT NOT NULL DEFAULT '{}',
    version BIGINT DEFAULT 1,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100) DEFAULT 'admin'
);

ALTER TABLE homepage_layout ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'homepage_layout' AND policyname = 'Allow public select on homepage_layout') THEN
    CREATE POLICY "Allow public select on homepage_layout" ON homepage_layout FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'homepage_layout' AND policyname = 'Allow public insert on homepage_layout') THEN
    CREATE POLICY "Allow public insert on homepage_layout" ON homepage_layout FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'homepage_layout' AND policyname = 'Allow public update on homepage_layout') THEN
    CREATE POLICY "Allow public update on homepage_layout" ON homepage_layout FOR UPDATE USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'homepage_layout' AND policyname = 'Allow public delete on homepage_layout') THEN
    CREATE POLICY "Allow public delete on homepage_layout" ON homepage_layout FOR DELETE USING (true);
  END IF;
END $$;

-- Individual user tables for wishlist, cart, and addresses
CREATE TABLE IF NOT EXISTS user_wishlists (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_cart_items (
    id VARCHAR(150) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    selected_size VARCHAR(20) DEFAULT 'M',
    qty INT DEFAULT 1,
    name VARCHAR(255),
    price VARCHAR(50),
    image TEXT,
    house VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_addresses (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    address_data JSONB NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_reviews (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50),
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100),
    order_id VARCHAR(50),
    product_name VARCHAR(255),
    product_image TEXT,
    rating INT NOT NULL DEFAULT 5,
    comment TEXT NOT NULL,
    images TEXT,
    videos TEXT,
    review_date VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_reviews' AND policyname = 'Allow public select on product_reviews') THEN
    CREATE POLICY "Allow public select on product_reviews" ON product_reviews FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_reviews' AND policyname = 'Allow public insert on product_reviews') THEN
    CREATE POLICY "Allow public insert on product_reviews" ON product_reviews FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_reviews' AND policyname = 'Allow public update on product_reviews') THEN
    CREATE POLICY "Allow public update on product_reviews" ON product_reviews FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_reviews' AND policyname = 'Allow public delete on product_reviews') THEN
    CREATE POLICY "Allow public delete on product_reviews" ON product_reviews FOR DELETE USING (true);
  END IF;
END $$;

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
    status VARCHAR(50) NOT NULL DEFAULT 'Return Requested',
    refund_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    refund_transaction_id VARCHAR(100),
    refund_date VARCHAR(20),
    selected_size VARCHAR(10),
    qty INT DEFAULT 1,
    refund_method VARCHAR(50),
    rejection_reason TEXT,
    expected_credit_date VARCHAR(20),
    pickup_date VARCHAR(20),
    shiprocket_return_order_id VARCHAR(100),
    shiprocket_return_shipment_id VARCHAR(100),
    return_awb VARCHAR(100),
    return_courier VARCHAR(100),
    wallet_refund_amount NUMERIC(12, 2) DEFAULT 0,
    razorpay_refund_amount NUMERIC(12, 2) DEFAULT 0,
    razorpay_refund_id VARCHAR(100),
    wallet_transaction_id VARCHAR(100),
    return_label_url TEXT,
    return_scans_json TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'return_requests' AND policyname = 'Allow public select on return_requests') THEN
    CREATE POLICY "Allow public select on return_requests" ON return_requests FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'return_requests' AND policyname = 'Allow public insert on return_requests') THEN
    CREATE POLICY "Allow public insert on return_requests" ON return_requests FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'return_requests' AND policyname = 'Allow public update on return_requests') THEN
    CREATE POLICY "Allow public update on return_requests" ON return_requests FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'return_requests' AND policyname = 'Allow public delete on return_requests') THEN
    CREATE POLICY "Allow public delete on return_requests" ON return_requests FOR DELETE USING (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.shop_overview_metrics (
    id VARCHAR(50) PRIMARY KEY,
    timeframe VARCHAR(20) NOT NULL,
    new_users_count INT DEFAULT 0,
    total_orders_count INT DEFAULT 0,
    turnover_amount NUMERIC(14, 2) DEFAULT 0,
    net_revenue_amount NUMERIC(14, 2) DEFAULT 0,
    delivered_orders_count INT DEFAULT 0,
    in_shipping_count INT DEFAULT 0,
    pending_approval_count INT DEFAULT 0,
    declined_orders_count INT DEFAULT 0,
    total_returns_count INT DEFAULT 0,
    pending_refund_amount NUMERIC(14, 2) DEFAULT 0,
    pending_refund_count INT DEFAULT 0,
    settled_refund_amount NUMERIC(14, 2) DEFAULT 0,
    razorpay_payments_amount NUMERIC(14, 2) DEFAULT 0,
    wallet_payments_amount NUMERIC(14, 2) DEFAULT 0,
    cod_payments_amount NUMERIC(14, 2) DEFAULT 0,
    top_products_json JSONB DEFAULT '[]'::jsonb,
    metrics_json JSONB DEFAULT '{}'::jsonb,
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.shop_overview_metrics ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shop_overview_metrics' AND policyname = 'Allow public select on shop_overview_metrics'
  ) THEN
    CREATE POLICY "Allow public select on shop_overview_metrics" ON public.shop_overview_metrics FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shop_overview_metrics' AND policyname = 'Allow public insert on shop_overview_metrics'
  ) THEN
    CREATE POLICY "Allow public insert on shop_overview_metrics" ON public.shop_overview_metrics FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shop_overview_metrics' AND policyname = 'Allow public update on shop_overview_metrics'
  ) THEN
    CREATE POLICY "Allow public update on shop_overview_metrics" ON public.shop_overview_metrics FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;

