// POST /api/checkout
// Creates a Stripe Checkout Session and a pending `orders` row.
// Body: { tier, addons[], customerEmail, currency?, metadata? }
// Returns: { url } — front-end redirects the browser there.

import { z } from 'zod';
import { getStripe } from './_lib/stripe.js';
import { sql, hasDb } from './_lib/db.js';
import { json, readJson, requireMethod } from './_lib/http.js';
import { TIERS, ADDONS, tierPrice, addonPrice } from './_lib/pricing.js';

const Body = z.object({
  tier: z.enum(TIERS),
  addons: z.array(z.enum(ADDONS)).default([]),
  customerEmail: z.string().email().optional(),
  currency: z.enum(['eur', 'gbp']).default('eur'),
  metadata: z.object({
    occasion: z.string().max(120).optional(),
    recipientName: z.string().max(120).optional(),
    fromUrl: z.string().max(500).optional(),
  }).partial().default({}),
});

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  const stripe = getStripe();
  if (!stripe) return json(res, 503, { error: 'Stripe not configured' });

  let input;
  try {
    const raw = await readJson(req);
    input = Body.parse(raw);
  } catch (e) {
    return json(res, 400, { error: 'Invalid body', details: e.errors || e.message });
  }

  // Resolve Stripe Price IDs for tier + each addon
  const tierPriceId = tierPrice(input.tier, input.currency);
  if (!tierPriceId) return json(res, 500, { error: `Missing Stripe price for ${input.tier}/${input.currency}` });

  const line_items = [{ price: tierPriceId, quantity: 1 }];
  for (const a of input.addons) {
    const pid = addonPrice(a, input.currency);
    if (!pid) return json(res, 500, { error: `Missing Stripe price for addon ${a}/${input.currency}` });
    line_items.push({ price: pid, quantity: 1 });
  }

  const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      customer_email: input.customerEmail,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      // Collect phone only when useful later; leave off for now.
      success_url: `${siteUrl}/order-brief.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout.html?canceled=1`,
      metadata: {
        tier: input.tier,
        addons: input.addons.join(','),
        occasion: input.metadata.occasion || '',
        recipientName: input.metadata.recipientName || '',
        fromUrl: input.metadata.fromUrl || '',
      },
      payment_intent_data: {
        metadata: {
          tier: input.tier,
          addons: input.addons.join(','),
        },
      },
    });
  } catch (e) {
    console.error('[checkout] stripe.create failed', e?.message || e);
    return json(res, 502, { error: 'Stripe session create failed' });
  }

  // Persist a pending order (best-effort; don't block the redirect if DB is down).
  if (hasDb()) {
    try {
      await sql`
        INSERT INTO orders (stripe_session_id, tier, addons, customer_email, currency, status, metadata)
        VALUES (${session.id}, ${input.tier}, ${input.addons}, ${input.customerEmail || null},
                ${input.currency}, 'pending', ${JSON.stringify(input.metadata)}::jsonb)
        ON CONFLICT (stripe_session_id) DO NOTHING
      `;
    } catch (e) {
      console.error('[checkout] DB insert failed (continuing)', e?.message || e);
    }
  }

  return json(res, 200, { url: session.url, sessionId: session.id });
}
