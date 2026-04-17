// Stripe client factory — returns null if env is missing so callers can 503 gracefully.
import Stripe from 'stripe';

let cached;
export function getStripe() {
  if (cached !== undefined) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  cached = key && key.startsWith('sk_') ? new Stripe(key) : null;
  return cached;
}
