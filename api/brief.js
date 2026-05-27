// POST /api/brief
// Save the post-payment brief. Verifies the Stripe session is paid, then inserts
// briefs linked to the matching orders row.
// Body: { session_id, occasion, recipientName, recipientFrom, story1, story2,
//         story3, voiceSlug, genre, mood[], tempo, isSurprise, giftMessage }

import { z } from 'zod';
import { getStripe } from '../lib/stripe.js';
import { sql, hasDb } from '../lib/db.js';
import { json, readJson, requireMethod } from '../lib/http.js';
import { send, wrap } from '../lib/email.js';

const Body = z.object({
  session_id:    z.string().min(5),
  occasion:      z.string().max(120).optional(),
  recipientName: z.string().max(120).optional(),
  recipientFrom: z.string().max(120).optional(),
  story1:        z.string().max(2000).optional(),
  story2:        z.string().max(4000).optional(),
  story3:        z.string().max(2000).optional(),
  voiceSlug:     z.string().max(80).optional(),
  genre:         z.string().max(60).optional(),
  mood:          z.array(z.string().max(40)).default([]),
  tempo:         z.string().max(40).optional(),
  isSurprise:    z.boolean().default(true),
  giftMessage:   z.string().max(600).optional(),
});

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  let input;
  try {
    input = Body.parse(await readJson(req));
  } catch (e) {
    return json(res, 400, { error: 'Invalid body', details: e.errors || e.message });
  }

  const stripe = getStripe();
  if (!stripe) return json(res, 503, { error: 'Stripe not configured' });

  // 1) Verify session is paid
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(input.session_id);
  } catch (e) {
    return json(res, 404, { error: 'Session not found' });
  }
  if (session.payment_status !== 'paid') {
    return json(res, 402, { error: 'Session not paid yet', status: session.payment_status });
  }

  if (!hasDb()) return json(res, 503, { error: 'Database not configured' });

  // 2) Look up the order
  let orderId;
  try {
    const { rows } = await sql`SELECT id FROM orders WHERE stripe_session_id = ${session.id} LIMIT 1`;
    if (rows[0]) {
      orderId = rows[0].id;
    } else {
      // Webhook might not have fired yet — insert on the fly in paid state
      const tier = session.metadata?.tier || 'personal';
      const addons = (session.metadata?.addons || '').split(',').filter(Boolean);
      const email = session.customer_details?.email || session.customer_email || null;
      const ins = await sql`
        INSERT INTO orders (stripe_session_id, stripe_payment_intent, tier, addons, amount_total, currency,
                            customer_email, customer_name, status, metadata)
        VALUES (${session.id}, ${session.payment_intent || null}, ${tier}, ${addons},
                ${session.amount_total || null}, ${(session.currency || 'eur').toLowerCase()},
                ${email}, ${session.customer_details?.name || null}, 'paid',
                ${JSON.stringify(session.metadata || {})}::jsonb)
        ON CONFLICT (stripe_session_id) DO UPDATE SET status = 'paid'
        RETURNING id
      `;
      orderId = ins.rows[0].id;
    }
  } catch (e) {
    console.error('[brief] order lookup failed', e?.message || e);
    return json(res, 500, { error: 'Order lookup failed' });
  }

  // 3) Insert brief
  try {
    await sql`
      INSERT INTO briefs (order_id, occasion, recipient_name, recipient_from,
                          story_1, story_2, story_3, voice_slug, genre, mood, tempo,
                          is_surprise, gift_message)
      VALUES (${orderId}, ${input.occasion || null}, ${input.recipientName || null},
              ${input.recipientFrom || null}, ${input.story1 || null}, ${input.story2 || null},
              ${input.story3 || null}, ${input.voiceSlug || null}, ${input.genre || null},
              ${input.mood}, ${input.tempo || null}, ${input.isSurprise}, ${input.giftMessage || null})
    `;
    // Move status forward to in_production as soon as we have a brief
    await sql`UPDATE orders SET status = 'in_production' WHERE id = ${orderId} AND status = 'paid'`;
  } catch (e) {
    console.error('[brief] insert failed', e?.message || e);
    return json(res, 500, { error: 'Brief save failed' });
  }

  // 4) Notify — customer + founder (fire-and-forget)
  const email = session.customer_details?.email || session.customer_email;
  if (email) {
    await send({
      to: email,
      subject: 'We got your story — song in the works',
      html: wrap({
        title: 'Your story is in.',
        body: `<p>We\u2019ve received the brief. Our writer is starting on your song now.</p>
               <p>Expect the first draft in your inbox within the delivery window for your tier. Keep an eye on your spam folder just in case.</p>`,
      }),
    });
  }
  const founder = process.env.FOUNDER_EMAIL;
  if (founder) {
    await send({
      to: founder,
      subject: `[Songzy] New brief ready — ${input.occasion || 'order'}`,
      html: wrap({
        title: 'New brief ready',
        body: `<p><strong>Order:</strong> ${orderId}<br>
               <strong>Occasion:</strong> ${input.occasion || '(none)'}<br>
               <strong>Recipient:</strong> ${input.recipientName || '(none)'}<br>
               <strong>Voice:</strong> ${input.voiceSlug || '(any)'}<br>
               <strong>Genre:</strong> ${input.genre || '(any)'}</p>
               <p><a href="${process.env.SITE_URL || 'https://songzy.eu'}/admin.html">Open admin</a></p>`,
      }),
    });
  }

  return json(res, 200, { ok: true, orderId });
}
