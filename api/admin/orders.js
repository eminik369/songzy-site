// GET /api/admin/orders — recent orders + brief + delivery. Basic auth via ADMIN_PASSWORD.
import { sql, hasDb } from '../_lib/db.js';
import { json, requireAdmin, requireMethod } from '../_lib/http.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'GET')) return;
  if (!requireAdmin(req, res)) return;
  if (!hasDb()) return json(res, 503, { error: 'Database not configured' });
  try {
    const { rows } = await sql`
      SELECT o.id, o.stripe_session_id, o.tier, o.addons, o.amount_total, o.currency,
             o.customer_email, o.customer_name, o.status, o.created_at, o.updated_at,
             b.occasion, b.recipient_name, b.voice_slug, b.genre, b.mood, b.tempo,
             b.story_1, b.story_2, b.story_3, b.gift_message, b.is_surprise,
             d.mp3_url, d.share_slug, d.delivered_at
        FROM orders o
        LEFT JOIN briefs b     ON b.order_id = o.id
        LEFT JOIN deliveries d ON d.order_id = o.id
       ORDER BY o.created_at DESC LIMIT 200`;
    return json(res, 200, { orders: rows });
  } catch (e) {
    console.error('[admin/orders]', e?.message || e);
    return json(res, 500, { error: 'Lookup failed' });
  }
}
