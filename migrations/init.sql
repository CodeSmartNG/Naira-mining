-- users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT,
  kyc_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- wallets
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  currency TEXT DEFAULT 'NGN',
  available_balance_kobo BIGINT DEFAULT 0,
  locked_balance_kobo BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ledger_entries
CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL, -- deposit, reward_accrual, withdrawal, release_locked, fee
  amount_kobo BIGINT NOT NULL,
  balance_after_kobo BIGINT,
  reference TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- deposits
CREATE TABLE IF NOT EXISTS deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  amount_kobo BIGINT NOT NULL,
  payment_provider TEXT,
  provider_ref TEXT UNIQUE,
  status TEXT DEFAULT 'initialized', -- initialized, confirmed, failed
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  lock_days INT DEFAULT 30,
  lock_until TIMESTAMP WITH TIME ZONE,
  rate_per_30days NUMERIC(10,6) DEFAULT 0.05,
  day_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- reward_accruals
CREATE TABLE IF NOT EXISTS reward_accruals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deposit_id UUID REFERENCES deposits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  day_number INT,
  amount_kobo BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ensure extension for gen_random_uuid (Postgres >= 13)
CREATE EXTENSION IF NOT EXISTS pgcrypto;