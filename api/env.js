// GET /api/env.js — emits a tiny JS snippet that writes window.__SONGZY_CONFIG__
// with the public-safe env. Loaded first from every HTML <head>; the analytics
// bootstrapper then reads it and only activates the providers that are set.
// Served with a short cache so we don't hammer the function on every page load.

export default function handler(req, res) {
  const cfg = {
    SITE_URL:              process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || '',
    IUBENDA_SITE_ID:       process.env.NEXT_PUBLIC_IUBENDA_SITE_ID || '',
    IUBENDA_COOKIE_POLICY_ID: process.env.NEXT_PUBLIC_IUBENDA_COOKIE_POLICY_ID || '',
    GA4_ID:                process.env.NEXT_PUBLIC_GA4_ID || '',
    META_PIXEL_ID:         process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
    TIKTOK_PIXEL_ID:       process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
  };
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  // 5 min browser cache, 10 min CDN; safe because env changes require redeploy.
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.end(`window.__SONGZY_CONFIG__ = ${JSON.stringify(cfg)};`);
}
