-- =============================================================================
-- SONGZY — Schema extensions for marketing automation
-- Apply with:  psql "$POSTGRES_URL_NON_POOLING" -f db/schema-automation.sql
-- Idempotent.
-- =============================================================================

-- =============================================================================
-- LEADS — email captured via newsletter form, lead magnet, exit intent
-- =============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email               text UNIQUE NOT NULL,
  source              text NOT NULL DEFAULT 'newsletter_footer',
  language            text NOT NULL DEFAULT 'en',
  utm_source          text,
  utm_medium          text,
  utm_campaign        text,
  utm_content         text,
  utm_term            text,
  ip_address          text,
  user_agent          text,
  consent_marketing   boolean NOT NULL DEFAULT true,
  unsubscribed_at     timestamptz,
  sequence_step       integer NOT NULL DEFAULT 0,  -- 0=just signed, 1=welcome sent, etc.
  next_send_at        timestamptz,
  last_open_at        timestamptz,
  last_click_at       timestamptz,
  converted_order_id  uuid REFERENCES orders(id) ON DELETE SET NULL,
  metadata            jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_email_idx        ON leads (email);
CREATE INDEX IF NOT EXISTS leads_next_send_idx    ON leads (next_send_at) WHERE unsubscribed_at IS NULL;
CREATE INDEX IF NOT EXISTS leads_sequence_idx     ON leads (sequence_step);
CREATE INDEX IF NOT EXISTS leads_created_idx      ON leads (created_at DESC);

DROP TRIGGER IF EXISTS leads_set_updated_at ON leads;
CREATE TRIGGER leads_set_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- EMAIL_SENDS — log of every email sent (transactional + marketing)
-- =============================================================================
CREATE TABLE IF NOT EXISTS email_sends (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email  text NOT NULL,
  kind             text NOT NULL,  -- welcome_d0, welcome_d2, abandoned_cart_1h, review_request, etc.
  subject          text NOT NULL,
  template_version text,
  provider_id      text,  -- Resend message ID
  status           text NOT NULL DEFAULT 'queued',
                   -- queued, sent, delivered, opened, clicked, bounced, complained, failed
  opened_at        timestamptz,
  clicked_at       timestamptz,
  bounced_at       timestamptz,
  metadata         jsonb NOT NULL DEFAULT '{}'::jsonb,
  sent_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS email_sends_recipient_idx ON email_sends (recipient_email);
CREATE INDEX IF NOT EXISTS email_sends_kind_idx      ON email_sends (kind);
CREATE INDEX IF NOT EXISTS email_sends_sent_idx      ON email_sends (sent_at DESC);

-- =============================================================================
-- BLOG_POSTS — generated SEO content
-- =============================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  title           text NOT NULL,
  description     text NOT NULL,
  language        text NOT NULL DEFAULT 'en',
  category        text,           -- gift-guide, lyrics-tips, case-study, occasion-guide
  primary_keyword text NOT NULL,
  secondary_keywords text[] NOT NULL DEFAULT '{}',
  content_md      text NOT NULL,  -- markdown source
  content_html    text NOT NULL,  -- rendered html
  cover_image_url text,
  reading_time_min integer,
  status          text NOT NULL DEFAULT 'draft',
                  -- draft, scheduled, published, archived
  published_at    timestamptz,
  scheduled_at    timestamptz,
  view_count      integer NOT NULL DEFAULT 0,
  generated_by    text NOT NULL DEFAULT 'anthropic',  -- anthropic, openai, human
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx        ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_status_idx      ON blog_posts (status);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx   ON blog_posts (published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS blog_posts_language_idx    ON blog_posts (language);

DROP TRIGGER IF EXISTS blog_posts_set_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_set_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- KEYWORD_BANK — keyword queue for blog post generation
-- =============================================================================
CREATE TABLE IF NOT EXISTS keyword_bank (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword         text UNIQUE NOT NULL,
  language        text NOT NULL DEFAULT 'en',
  category        text,
  intent          text NOT NULL DEFAULT 'informational',
                  -- informational, commercial, transactional, navigational
  difficulty      integer,
  monthly_volume  integer,
  picked_at       timestamptz,
  picked_for_post_id uuid REFERENCES blog_posts(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS keyword_bank_unused_idx ON keyword_bank (created_at DESC) WHERE picked_at IS NULL;
CREATE INDEX IF NOT EXISTS keyword_bank_lang_idx   ON keyword_bank (language);

-- =============================================================================
-- SOCIAL_POSTS — scheduled posts for Pinterest, Instagram, TikTok, etc.
-- =============================================================================
CREATE TABLE IF NOT EXISTS social_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform        text NOT NULL,  -- pinterest, instagram, tiktok, facebook, youtube
  external_id     text,           -- ID returned by the platform after posting
  buffer_update_id text,          -- Buffer update ID (when posted via Buffer)
  status          text NOT NULL DEFAULT 'queued',
                  -- queued, scheduled, posted, failed, deleted
  scheduled_at    timestamptz,
  posted_at       timestamptz,
  caption         text,
  alt_text        text,
  image_url       text,           -- for image posts
  video_url       text,           -- for video posts
  link_url        text,           -- outbound link
  board_id        text,           -- Pinterest only
  hashtags        text[] NOT NULL DEFAULT '{}',
  impressions     integer,
  clicks          integer,
  saves           integer,
  shares          integer,
  comments        integer,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS social_posts_platform_idx ON social_posts (platform);
CREATE INDEX IF NOT EXISTS social_posts_status_idx   ON social_posts (status);
CREATE INDEX IF NOT EXISTS social_posts_scheduled_idx ON social_posts (scheduled_at) WHERE status IN ('queued','scheduled');

DROP TRIGGER IF EXISTS social_posts_set_updated_at ON social_posts;
CREATE TRIGGER social_posts_set_updated_at
BEFORE UPDATE ON social_posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- ADS_CAMPAIGNS — Google Ads (and future platforms) campaign tracking
-- =============================================================================
CREATE TABLE IF NOT EXISTS ads_campaigns (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform        text NOT NULL,  -- google_ads, meta, tiktok
  external_id     text NOT NULL,  -- platform campaign ID
  name            text NOT NULL,
  status          text NOT NULL DEFAULT 'paused',
  daily_budget    integer,        -- in cents
  currency        text NOT NULL DEFAULT 'eur',
  total_spend     integer NOT NULL DEFAULT 0,
  total_clicks    integer NOT NULL DEFAULT 0,
  total_conversions integer NOT NULL DEFAULT 0,
  total_revenue   integer NOT NULL DEFAULT 0,
  last_sync_at    timestamptz,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS ads_campaigns_external_idx ON ads_campaigns (platform, external_id);

DROP TRIGGER IF EXISTS ads_campaigns_set_updated_at ON ads_campaigns;
CREATE TRIGGER ads_campaigns_set_updated_at
BEFORE UPDATE ON ads_campaigns
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
