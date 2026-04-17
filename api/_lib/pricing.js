// Central map: tier/addon -> Stripe Price ID (per currency).
// Helpers return null when a price isn't configured, so the caller can 400.

export const TIERS = ['quick', 'personal', 'premium'];
export const ADDONS = ['extended', 'second-voice'];

export function tierPrice(tier, currency = 'eur') {
  const c = (currency || 'eur').toLowerCase();
  const key = `STRIPE_PRICE_${tier.toUpperCase()}_${c.toUpperCase()}`;
  return process.env[key] || null;
}

export function addonPrice(addon, currency = 'eur') {
  const c = (currency || 'eur').toLowerCase();
  const base = addon === 'extended' ? 'STRIPE_PRICE_ADDON_EXTENDED'
             : addon === 'second-voice' ? 'STRIPE_PRICE_ADDON_SECOND_VOICE'
             : null;
  if (!base) return null;
  // EUR lives under the unsuffixed env var; GBP uses _GBP suffix
  return c === 'gbp' ? (process.env[`${base}_GBP`] || null) : (process.env[base] || null);
}
