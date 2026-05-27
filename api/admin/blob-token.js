// POST /api/admin/blob-token — handles Vercel Blob client-upload token exchange.
// Called by @vercel/blob/client upload() under the hood: the client posts a JSON
// payload here and we must respond with a signed token scoped to this upload.
// Admin auth via ADMIN_PASSWORD (Basic or Bearer).
import { handleUpload } from '@vercel/blob/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).end(); return; }
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ error: 'Blob not configured' });
  if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ error: 'Admin not configured' });

  try {
    const body = await readJson(req);
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayloadStr) => {
        let payload = {};
        try { payload = JSON.parse(clientPayloadStr || '{}'); } catch (_) {}
        if (payload.adminToken !== process.env.ADMIN_PASSWORD) {
          throw new Error('Unauthorized');
        }
        return {
          allowedContentTypes: ['audio/mpeg', 'audio/mp3', 'audio/x-mp3', 'audio/mpeg3'],
          tokenPayload: JSON.stringify({ pathname, orderId: payload.orderId }),
          maximumSizeInBytes: 50 * 1024 * 1024, // 50 MB cap
        };
      },
      onUploadCompleted: async () => { /* optional: log server-side */ },
    });
    return res.status(200).json(jsonResponse);
  } catch (e) {
    console.error('[blob-token]', e?.message || e);
    return res.status(400).json({ error: e.message || 'Token generation failed' });
  }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let s = '';
    req.on('data', (c) => { s += c; });
    req.on('end', () => { try { resolve(s ? JSON.parse(s) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}
