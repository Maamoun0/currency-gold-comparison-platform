-- Database Schema for Financial Comparison Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user', -- 'user', 'admin'
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Banks Table
CREATE TABLE banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL, -- e.g., 'nbe', 'banque-misr'
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Currencies Table
CREATE TABLE currencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- e.g., 'USD', 'EUR', 'USDT'
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    symbol TEXT,
    type TEXT NOT NULL, -- 'fiat', 'crypto', 'gold'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Prices Table (Current Live Prices)
CREATE TABLE prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bank_id UUID REFERENCES banks(id),
    currency_id UUID REFERENCES currencies(id),
    buy_price DECIMAL(18, 4) NOT NULL,
    sell_price DECIMAL(18, 4) NOT NULL,
    change_percentage DECIMAL(5, 2),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bank_id, currency_id)
);

-- 5. Price History Table (For Charts)
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bank_id UUID REFERENCES banks(id),
    currency_id UUID REFERENCES currencies(id),
    buy_price DECIMAL(18, 4) NOT NULL,
    sell_price DECIMAL(18, 4) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster chart queries
CREATE INDEX idx_price_history_lookup ON price_history (currency_id, bank_id, recorded_at DESC);

-- 6. Alerts Table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    currency_id UUID REFERENCES currencies(id),
    target_price DECIMAL(18, 4) NOT NULL,
    condition TEXT NOT NULL, -- 'above', 'below'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Scraper Logs
CREATE TABLE scraper_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bank_id UUID REFERENCES banks(id),
    status TEXT NOT NULL, -- 'success', 'failed'
    error_message TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
