// GET /api/order/[id] — returns delivery payload for /m/:slug pages.
// `id` can be either an order UUID or a delivery share_slug. Only returns
// 200 when an associated delivery exists (i.e. the song is ready to stream).

import { sql, hasDb } from '../_lib/db.js';
import { json, requireMethod } from '../_lib/http.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'GET')) return;
  if (!hasDb()) return json(res, 503, { error: 'Database not configured' });

  const id = req.query?.id || req.url.split('/').pop().split('?')[0];
  if (!id) return json(res, 400, { error: 'Missing id' });

  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  try {
    const { rows } = uuidRe.test(id)
      ? await sql`
          SELECT o.id AS order_id, o.status, o.customer_name,
                 b.recipient_name, b.voice_slug, b.genre,
                 d.mp3_url, d.cover_url, d.lyrics, d.share_slug, d.delivered_at
            FROM orders o
            LEFT JOIN briefs b     ON b.order_id = o.id
            LEFT JOIN deliveries d ON d.order_id = o.id
           WHERE o.id = ${id}
           ORDER BY d.delivered_at DESC NULLS LAST
           LIMIT 1`
      : await sql`
          SELECT o.id AS order_id, o.status, o.customer_name,
                 b.recipient_name, b.voice_slug, b.genre,
                 d.mp3_url, d.cover_url, d.lyrics, d.share_slug, d.delivered_at
            FROM deliveries d
            JOIN orders o  ON o.id = d.order_id
            LEFT JOIN briefs b ON b.order_id = o.id
           WHERE d.share_slug = ${id}
           LIMIT 1`;

    const r = rows[0];
    if (!r || !r.mp3_url) return json(res, 404, { error: 'Not ready' });

    // mark as opened (best-effort)
    try { await sql`UPDATE deliveries SET customer_opened_at = now() WHERE share_slug = ${r.share_slug} AND customer_opened_at IS NULL`; } catch (e) {}

    return json(res, 200, {
      orderId:       r.order_id,
      mp3Url:        r.mp3_url,
      coverUrl:      r.cover_url,
      lyrics:        r.lyrics,
      recipientName: r.recipient_name,
      voiceName:     r.voice_slug,
      genre:         r.genre,
      shareSlug:     r.share_slug,
      deliveredAt:   r.delivered_at,
    });
  } catch (e) {
    console.error('[order] lookup failed', e?.message || e);
    return json(res, 500, { error: 'Lookup failed' });
  }
}
