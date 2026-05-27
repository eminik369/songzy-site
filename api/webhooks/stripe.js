// POST /api/webhooks/stripe
// Verifies Stripe webhook signature and updates orders.
// Requires STRIPE_WEBHOOK_SECRET. Needs the raw body — hence `config.api.bodyParser=false`.

import { getStripe } from '../../lib/stripe.js';
import { sql, hasDb } from '../../lib/db.js';
import { send, wrap } from '../../lib/email.js';

export const config = { api: { bodyParser: false } };

function readRaw(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405; res.end('Method not allowed'); return;
  }
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    res.statusCode = 503; res.end('Stripe webhook not configured'); return;
  }

  const sig = req.headers['stripe-signature'];
  const raw = await readRaw(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error('[webhook] signature verification failed', e?.message || e);
    res.statusCode = 400; res.end(`Webhook Error: ${e.message}`); return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object;
        const email = s.customer_details?.email || s.customer_email || null;
        const name  = s.customer_details?.name || null;
        if (hasDb()) {
          await sql`
            UPDATE orders
               SET status = 'paid',
                   stripe_payment_intent = ${s.payment_intent || null},
                   customer_email = COALESCE(${email}, customer_email),
                   customer_name  = COALESCE(${name},  customer_name),
                   amount_total   = ${s.amount_total || null},
                   currency       = ${(s.currency || 'eur').toLowerCase()}
             WHERE stripe_session_id = ${s.id}
          `;
        }
        if (email) {
          const briefUrl = `${process.env.SITE_URL || 'https://songzy.eu'}/order-brief.html?session_id=${s.id}`;
          await send({
            to: email,
            subject: 'Your Songzy order — tell us the story',
            html: wrap({
              title: 'Your song is in the works.',
              body: `<p>Thanks for trusting us with a moment that matters.</p>
                     <p>One last step: tell us who the song is for and the story behind it. It takes about two minutes, and your answers shape every line we write.</p>`,
              cta: { href: briefUrl, label: 'Share the story' },
            }),
          });
          const founder = process.env.FOUNDER_EMAIL;
          if (founder) {
            await send({
              to: founder,
              subject: `[Songzy] New paid order — ${email}`,
              html: wrap({
                title: 'New paid order',
                body: `<p><strong>${email}</strong> just paid. Session <code>${s.id}</code>. Awaiting brief.</p>`,
              }),
            });
          }
        }
        break;
      }
      case 'charge.refunded':
      case 'charge.refund.updated': {
        const ch = event.data.object;
        if (hasDb()) {
          await sql`
            UPDATE orders SET status = 'refunded'
             WHERE stripe_payment_intent = ${ch.payment_intent || null}
          `;
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        if (hasDb()) {
          await sql`
            UPDATE orders SET status = 'failed'
             WHERE stripe_payment_intent = ${pi.id}
          `;
        }
        break;
      }
      default:
        // no-op — ack so Stripe doesn't retry
        break;
    }
  } catch (e) {
    console.error('[webhook] handler error', e?.message || e);
    // Return 500 so Stripe retries, but only if it's likely transient
    res.statusCode = 500; res.end('handler error'); return;
  }

  res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end('{"received":true}');
}
