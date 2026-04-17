// HTTP helpers for Vercel Node functions (ESM, bare req/res).

export function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export async function readJson(req) {
  if (req.body) return req.body; // Vercel parses when content-type is JSON
  return new Promise((resolve, reject) => {
    let buf = '';
    req.on('data', (c) => { buf += c; if (buf.length > 1e6) { req.destroy(); reject(new Error('payload too large')); } });
    req.on('end', () => { try { resolve(buf ? JSON.parse(buf) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

export function requireMethod(req, res, method) {
  if (req.method !== method) {
    json(res, 405, { error: `Method not allowed, expected ${method}` });
    return false;
  }
  return true;
}

// Basic auth for /api/admin/* using ADMIN_PASSWORD (user = "admin").
// Returns true if authorized; writes 401 otherwise.
export function requireAdmin(req, res) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) { json(res, 503, { error: 'Admin not configured' }); return false; }
  const hdr = req.headers['authorization'] || '';
  if (hdr.startsWith('Basic ')) {
    try {
      const [user, pass] = Buffer.from(hdr.slice(6), 'base64').toString().split(':');
      if (pass === pw) return true;
    } catch (e) { /* fallthrough */ }
  }
  if (hdr.startsWith('Bearer ')) {
    if (hdr.slice(7) === pw) return true;
  }
  res.setHeader('WWW-Authenticate', 'Basic realm="Songzy Admin"');
  json(res, 401, { error: 'Unauthorized' });
  return false;
}

export function shortSlug(len = 8) {
  const alpha = 'abcdefghijkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < len; i++) s += alpha[Math.floor(Math.random() * alpha.length)];
  return s;
}
