// Buffer API v1 client (HTTP, no SDK).
// Docs: https://buffer.com/developers/api
//
// Requires BUFFER_ACCESS_TOKEN (publish.buffer.com/account/apps → Create App).
// Buffer's v1 API uses access_token in the query string OR Authorization header.

const API = 'https://api.bufferapp.com/1';

function token() {
  return process.env.BUFFER_ACCESS_TOKEN || null;
}

export function bufferConfigured() {
  return !!token();
}

async function call(method, path, body) {
  const t = token();
  if (!t) throw new Error('BUFFER_ACCESS_TOKEN missing');
  const url = `${API}${path}.json`;
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${t}`,
      'Accept': 'application/json',
    },
  };
  if (body) {
    // Buffer v1 expects application/x-www-form-urlencoded for POST
    opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    const form = new URLSearchParams();
    for (const [k, v] of Object.entries(body)) {
      if (Array.isArray(v)) {
        v.forEach((item) => form.append(`${k}[]`, item));
      } else {
        form.append(k, String(v));
      }
    }
    opts.body = form.toString();
  }
  const resp = await fetch(url, opts);
  const text = await resp.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!resp.ok) {
    const err = new Error(`Buffer API ${method} ${path} → ${resp.status}: ${json?.message || text}`);
    err.status = resp.status;
    err.body = json;
    throw err;
  }
  return json;
}

// ----------------------- Profiles (connected social accounts) ------------
export async function listProfiles() {
  return call('GET', '/profiles');
}

export async function findProfile(serviceOrUsername) {
  const profiles = await listProfiles();
  const needle = serviceOrUsername.toLowerCase();
  return profiles.find((p) =>
    p.service?.toLowerCase() === needle ||
    p.service_username?.toLowerCase() === needle ||
    p.username?.toLowerCase() === needle ||
    p.formatted_username?.toLowerCase() === needle
  ) || null;
}

// ----------------------- Updates (the "posts" in Buffer language) --------
/**
 * createUpdate — schedule a post.
 * @param {object} opts
 * @param {string[]} opts.profileIds - Buffer profile IDs (from listProfiles)
 * @param {string} opts.text - caption / post text
 * @param {string} [opts.scheduledAt] - ISO date (optional, default = "add to queue")
 * @param {string} [opts.imageUrl] - public image URL to attach
 * @param {string} [opts.linkUrl] - URL to attach (Buffer auto-shortens via bit.ly)
 * @param {boolean} [opts.now] - true = post immediately
 * @param {boolean} [opts.shorten] - true = shorten links via Buffer
 */
export async function createUpdate({ profileIds, text, scheduledAt, imageUrl, linkUrl, now = false, shorten = true }) {
  if (!profileIds?.length) throw new Error('profileIds required');
  const body = {
    'profile_ids': profileIds,
    text,
    shorten,
  };
  if (scheduledAt) body.scheduled_at = scheduledAt;
  if (now) body.now = 'true';
  if (imageUrl) {
    body.media = JSON.stringify({ photo: imageUrl, link: imageUrl });
  }
  return call('POST', '/updates/create', body);
}

export async function getUpdate(updateId) {
  return call('GET', `/updates/${updateId}`);
}

export async function deleteUpdate(updateId) {
  return call('POST', `/updates/${updateId}/destroy`);
}

export async function listPendingUpdates(profileId) {
  return call('GET', `/profiles/${profileId}/updates/pending`);
}

export async function listSentUpdates(profileId) {
  return call('GET', `/profiles/${profileId}/updates/sent`);
}
