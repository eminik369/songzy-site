// Pinterest API v5 client (REST, no SDK — pure fetch).
// Docs: https://developers.pinterest.com/docs/api/v5/
//
// Requires PINTEREST_ACCESS_TOKEN with scopes: pins:read, pins:write, boards:read,
// boards:write (optional), user_accounts:read.
//
// Token: developers.pinterest.com → My Apps → app → Generate access token.
// Pinterest tokens have ~30-day TTL for standard apps; refresh with refresh token
// flow if needed. For initial development, just regenerate via dashboard.

const API = 'https://api.pinterest.com/v5';

function token() {
  return process.env.PINTEREST_ACCESS_TOKEN || null;
}

export function pinterestConfigured() {
  return !!token();
}

async function call(method, path, body) {
  const t = token();
  if (!t) throw new Error('PINTEREST_ACCESS_TOKEN missing');
  const url = `${API}${path}`;
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${t}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const resp = await fetch(url, opts);
  const text = await resp.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!resp.ok) {
    const err = new Error(`Pinterest API ${method} ${path} → ${resp.status}: ${json?.message || text}`);
    err.status = resp.status;
    err.body = json;
    throw err;
  }
  return json;
}

// ----------------------- User --------------------------------------------
export async function getUser() {
  return call('GET', '/user_account');
}

// ----------------------- Boards ------------------------------------------
export async function listBoards({ pageSize = 100 } = {}) {
  const all = [];
  let bookmark = '';
  do {
    const qs = new URLSearchParams({ page_size: String(pageSize) });
    if (bookmark) qs.set('bookmark', bookmark);
    const resp = await call('GET', `/boards?${qs.toString()}`);
    if (resp.items) all.push(...resp.items);
    bookmark = resp.bookmark || '';
  } while (bookmark);
  return all;
}

export async function createBoard({ name, description, privacy = 'PUBLIC' }) {
  return call('POST', '/boards', { name, description, privacy });
}

export async function findBoardByName(name) {
  const boards = await listBoards();
  return boards.find((b) => b.name.toLowerCase() === name.toLowerCase()) || null;
}

// Idempotent: returns existing or creates new board
export async function ensureBoard({ name, description, privacy = 'PUBLIC' }) {
  const existing = await findBoardByName(name);
  if (existing) return existing;
  return createBoard({ name, description, privacy });
}

// ----------------------- Pins --------------------------------------------
/**
 * createPin — upload a pin to a board.
 * @param {object} opts
 * @param {string} opts.boardId
 * @param {string} opts.title - max 100 char
 * @param {string} opts.description - max 800 char (we recommend ≤500)
 * @param {string} opts.link - destination URL on click
 * @param {string} [opts.altText] - for accessibility
 * @param {string} opts.imageUrl - publicly accessible image URL (Pinterest fetches it)
 *   OR { source_type: 'image_base64', data, content_type }
 */
export async function createPin({ boardId, title, description, link, altText, imageUrl, imageBase64, imageContentType = 'image/jpeg' }) {
  if (!boardId) throw new Error('boardId required');
  if (!imageUrl && !imageBase64) throw new Error('imageUrl or imageBase64 required');

  const media_source = imageBase64
    ? { source_type: 'image_base64', content_type: imageContentType, data: imageBase64 }
    : { source_type: 'image_url', url: imageUrl };

  return call('POST', '/pins', {
    board_id: boardId,
    title: title?.slice(0, 100),
    description: description?.slice(0, 800),
    alt_text: altText?.slice(0, 500),
    link,
    media_source,
  });
}

export async function getPin(pinId) {
  return call('GET', `/pins/${encodeURIComponent(pinId)}`);
}

export async function deletePin(pinId) {
  return call('DELETE', `/pins/${encodeURIComponent(pinId)}`);
}

export async function listPins({ boardId, pageSize = 50 } = {}) {
  const all = [];
  let bookmark = '';
  do {
    const qs = new URLSearchParams({ page_size: String(pageSize) });
    if (bookmark) qs.set('bookmark', bookmark);
    const path_ = boardId ? `/boards/${boardId}/pins?${qs.toString()}` : `/pins?${qs.toString()}`;
    const resp = await call('GET', path_);
    if (resp.items) all.push(...resp.items);
    bookmark = resp.bookmark || '';
  } while (bookmark);
  return all;
}

// ----------------------- Pin analytics -----------------------------------
export async function getPinAnalytics(pinId, { startDate, endDate, metricTypes = 'IMPRESSION,OUTBOUND_CLICK,SAVE,PIN_CLICK' } = {}) {
  const qs = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
    metric_types: metricTypes,
  });
  return call('GET', `/pins/${encodeURIComponent(pinId)}/analytics?${qs.toString()}`);
}
