-- DDL Script: AI Assistant Support Tables for PostgreSQL

CREATE TABLE IF NOT EXISTS ai_conversations (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id VARCHAR(50) PRIMARY KEY,
    conversation_id VARCHAR(50) REFERENCES ai_conversations(id),
    role VARCHAR(10) NOT NULL, -- 'user' or 'model'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_intents (
    id SERIAL PRIMARY KEY,
    message_id VARCHAR(50) REFERENCES ai_messages(id),
    intent_name VARCHAR(100) NOT NULL,
    confidence NUMERIC(3, 2),
    parameters TEXT, -- JSON structure stored as text
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_action_logs (
    id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(50) REFERENCES ai_conversations(id),
    intent_name VARCHAR(100) NOT NULL,
    action_status VARCHAR(20) NOT NULL, -- 'SUCCESS', 'CONFIRMATION_REQUIRED', 'FAILED'
    execution_details TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_recommendations (
    id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(50) REFERENCES ai_conversations(id),
    product_id VARCHAR(50),
    recommendation_reason TEXT,
    clicked BOOLEAN DEFAULT FALSE,
    recommended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_analytics (
    id SERIAL PRIMARY KEY,
    intent_name VARCHAR(100) NOT NULL,
    usage_count INT DEFAULT 1,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Authentication Tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_otps (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    attempts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

