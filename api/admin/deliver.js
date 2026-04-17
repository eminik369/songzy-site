// POST /api/admin/deliver — founder uploads finished MP3 for an order.
// multipart/form-data: orderId, lyrics?, coverUrl?, mp3 file OR mp3Url.
// Basic auth via ADMIN_PASSWORD.
import { put } from '@vercel/blob';
import { sql, hasDb } from '../_lib/db.js';
import { json, requireAdmin, requireMethod, shortSlug } from '../_lib/http.js';
import { send, wrap } from '../_lib/email.js';

export const config = { api: { bodyParser: false } };

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const ct = req.headers['content-type'] || '';
    const m = /boundary=(.+)$/.exec(ct);
    if (!m) return reject(new Error('Missing boundary'));
    const boundary = '--' + m[1];
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const buf = Buffer.concat(chunks);
        const parts = [];
        let idx = buf.indexOf(boundary);
        while (idx !== -1) {
          const next = buf.indexOf(boundary, idx + boundary.length);
          if (next === -1) break;
          const raw = buf.slice(idx + boundary.length, next);
          idx = next;
          const hEnd = raw.indexOf('\r\n\r\n');
          if (hEnd === -1) continue;
          const header = raw.slice(2, hEnd).toString();
          const body = raw.slice(hEnd + 4, raw.length - 2);
          const nm = /name="([^"]+)"/.exec(header);
          if (!nm) continue;
          const fm = /filename="([^"]+)"/.exec(header);
          const tm = /Content-Type:\s*([^\r\n]+)/i.exec(header);
          parts.push({ name: nm[1], filename: fm ? fm[1] : null,
                       contentType: tm ? tm[1].trim() : null, data: body });
        }
        resolve(parts);
      } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let s = ''; req.on('data', (c) => { s += c; });
    req.on('end', () => { try { resolve(s ? JSON.parse(s) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;
  if (!requireAdmin(req, res)) return;
  if (!hasDb()) return json(res, 503, { error: 'Database not configured' });

  const ct = req.headers['content-type'] || '';
  let orderId, lyrics, coverUrl, mp3Url;
  try {
    if (ct.startsWith('multipart/form-data')) {
      const parts = await parseMultipart(req);
      const byName = Object.fromEntries(parts.filter(p => !p.filename).map(p => [p.name, p.data.toString()]));
      orderId = byName.orderId; lyrics = byName.lyrics || null; coverUrl = byName.coverUrl || null;
      const file = parts.find(p => p.name === 'mp3' && p.filename);
      if (file) {
        if (!process.env.BLOB_READ_WRITE_TOKEN)
          return json(res, 503, { error: 'Vercel Blob not configured' });
        const key = `songs/${orderId}-${Date.now()}.mp3`;
        const blob = await put(key, file.data, {
          access: 'public', contentType: file.contentType || 'audio/mpeg', addRandomSuffix: false,
        });
        mp3Url = blob.url;
      } else mp3Url = byName.mp3Url || null;
    } else {
      const body = await readJsonBody(req);
      orderId = body.orderId; lyrics = body.lyrics || null;
      coverUrl = body.coverUrl || null; mp3Url = body.mp3Url || null;
    }
  } catch (e) {
    console.error('[deliver] parse', e?.message || e);
    return json(res, 400, { error: 'Bad request', details: e.message });
  }
  if (!orderId) return json(res, 400, { error: 'orderId required' });
  if (!mp3Url)  return json(res, 400, { error: 'mp3 file or mp3Url required' });

  let slug;
  for (let i = 0; i < 5; i++) {
    slug = shortSlug(8);
    try {
      await sql`INSERT INTO deliveries (order_id, mp3_url, cover_url, lyrics, share_slug)
                VALUES (${orderId}, ${mp3Url}, ${coverUrl}, ${lyrics}, ${slug})`;
      break;
    } catch (e) {
      if (!/share_slug/.test(e.message || '')) {
        console.error('[deliver] insert', e?.message || e);
        return json(res, 500, { error: 'Delivery save failed' });
      }
      slug = null;
    }
  }
  if (!slug) return json(res, 500, { error: 'Could not allocate share slug' });

  try { await sql`UPDATE orders SET status = 'delivered' WHERE id = ${orderId}`; } catch (e) {}

  let customerEmail, recipientName;
  try {
    const { rows } = await sql`
      SELECT o.customer_email, b.recipient_name FROM orders o
      LEFT JOIN briefs b ON b.order_id = o.id WHERE o.id = ${orderId} LIMIT 1`;
    customerEmail = rows[0]?.customer_email; recipientName = rows[0]?.recipient_name;
  } catch (e) {}

  const shareUrl = `${process.env.SITE_URL || 'https://songzy.com'}/m/${slug}`;
  if (customerEmail) {
    await send({
      to: customerEmail,
      subject: `Your Songzy song is ready${recipientName ? ` for ${recipientName}` : ''}`,
      html: wrap({
        title: 'Your song is ready.',
        body: `<p>The song is live. Press play, then share it when the moment feels right.</p>
               <p>This link is yours forever — private and unlisted unless you share it.</p>`,
        cta: { href: shareUrl, label: 'Listen to your song' },
      }),
    });
  }
  return json(res, 200, { ok: true, shareSlug: slug, shareUrl, mp3Url });
}
