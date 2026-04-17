-- =============================================================================
-- SONGZY — Postgres schema (Neon via Vercel Marketplace)
-- Apply with:   psql "$POSTGRES_URL_NON_POOLING" -f db/schema.sql
-- Idempotent: safe to re-run. Tables: orders, briefs, deliveries, abandoned_carts.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- orders: one row per Stripe Checkout Session (created BEFORE payment)
-- Lifecycle: pending -> paid -> in_production -> delivered (or refunded/failed)
CREATE TABLE IF NOT EXISTS orders (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id     text UNIQUE,
  stripe_payment_intent text,
  tier                  text NOT NULL CHECK (tier IN ('quick','personal','premium')),
  addons                text[] NOT NULL DEFAULT '{}',
  amount_total          integer,
  currency              text NOT NULL DEFAULT 'eur',
  customer_email        text,
  customer_name         text,
  status                text NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','paid','in_production','delivered','refunded','failed')),
  metadata              jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON orders (customer_email);
CREATE INDEX IF NOT EXISTS orders_status_idx          ON orders (status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx      ON orders (created_at DESC);

-- briefs: the story, collected AFTER payment on /order-brief.html
CREATE TABLE IF NOT EXISTS briefs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  occasion        text,
  recipient_name  text,
  recipient_from  text,
  story_1         text,
  story_2         text,
  story_3         text,
  voice_slug      text,
  genre           text,
  mood            text[] NOT NULL DEFAULT '{}',
  tempo           text,
  is_surprise     boolean NOT NULL DEFAULT true,
  gift_message    text,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS briefs_order_id_idx ON briefs (order_id);

-- deliveries: the finished song + sharable page
CREATE TABLE IF NOT EXISTS deliveries (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  mp3_url             text NOT NULL,
  cover_url           text,
  lyrics              text,
  share_slug          text NOT NULL UNIQUE,
  delivered_at        timestamptz NOT NULL DEFAULT now(),
  customer_opened_at  timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS deliveries_share_slug_idx ON deliveries (share_slug);
CREATE INDEX IF NOT EXISTS deliveries_order_id_idx ON deliveries (order_id);

-- abandoned_carts: recovery loop for email captured, never paid
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email               text,
  tier                text,
  state               jsonb NOT NULL DEFAULT '{}'::jsonb,
  recovery_sent_at    timestamptz[] NOT NULL DEFAULT '{}',
  created_at          timestamptz NOT NULL DEFAULT now(),
  converted_order_id  uuid REFERENCES orders(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS abandoned_carts_email_idx      ON abandoned_carts (email);
CREATE INDEX IF NOT EXISTS abandoned_carts_created_at_idx ON abandoned_carts (created_at DESC);

-- orders.updated_at auto-refresh
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_set_updated_at ON orders;
CREATE TRIGGER orders_set_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
