// Buffer GraphQL API (Beta) client — pure fetch, no SDK.
// Docs: https://buffer.com/developers/api  (Beta GraphQL endpoint)
// Endpoint: https://api.buffer.com/graphql
// Auth: Bearer <PERSONAL_KEY> (from publish.buffer.com → Settings → API → Personal Keys)
// Limits: 100 calls / 15min, 100 / 24h, 3000 / 30 days (per the dashboard)

const API = 'https://api.buffer.com/graphql';

function token() {
  return process.env.BUFFER_ACCESS_TOKEN || null;
}

export function bufferConfigured() {
  return !!token();
}

async function gql(query, variables) {
  const t = token();
  if (!t) throw new Error('BUFFER_ACCESS_TOKEN missing');
  const resp = await fetch(API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${t}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query, variables: variables || {} }),
  });
  const text = await resp.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!resp.ok || json.errors) {
    const msg = json.errors?.[0]?.message || text || resp.statusText;
    const err = new Error(`Buffer GraphQL ${resp.status}: ${msg}`);
    err.status = resp.status;
    err.body = json;
    throw err;
  }
  return json.data;
}

// ----------------------- Account / orgs ----------------------------------
export async function getAccount() {
  return (await gql('{ account { id email name organizations { id name } } }')).account;
}

let cachedOrgId;
export async function getOrganizationId() {
  if (cachedOrgId) return cachedOrgId;
  const acc = await getAccount();
  if (!acc?.organizations?.length) throw new Error('No organization for this Buffer account');
  cachedOrgId = acc.organizations[0].id;
  return cachedOrgId;
}

// ----------------------- Channels ----------------------------------------
const CHANNEL_FIELDS = `id name displayName service serviceId type isDisconnected isLocked allowedActions organizationId`;

export async function listChannels({ organizationId } = {}) {
  const orgId = organizationId || (await getOrganizationId());
  const data = await gql(
    `query($input: ChannelsInput!) { channels(input: $input) { ${CHANNEL_FIELDS} } }`,
    { input: { organizationId: orgId } }
  );
  return data.channels;
}

export async function findChannel(serviceOrName) {
  const channels = await listChannels();
  const needle = serviceOrName.toLowerCase();
  return channels.find((c) =>
    c.service?.toLowerCase() === needle ||
    c.name?.toLowerCase() === needle ||
    c.displayName?.toLowerCase() === needle
  ) || null;
}

// ----------------------- Posts -------------------------------------------
/**
 * createPost — schedule or queue a post via Buffer.
 *
 * @param {object} opts
 * @param {string[]} opts.channelIds - IDs from listChannels()
 * @param {string} opts.text - caption
 * @param {string} [opts.scheduledAt] - ISO 8601 string. Omit to add to queue.
 * @param {string[]} [opts.imageUrls] - publicly-accessible image URLs to attach
 * @param {string} [opts.boardId] - Pinterest only (board to pin to)
 * @param {boolean} [opts.now] - send immediately
 */
export async function createPost({ channelIds, text, scheduledAt, imageUrls = [], boardId, now = false }) {
  if (!channelIds?.length) throw new Error('channelIds required');
  if (!text) throw new Error('text required');

  const input = {
    organizationId: await getOrganizationId(),
    channelIds,
    text,
    media: imageUrls.length ? imageUrls.map((url) => ({ type: 'image', url })) : undefined,
  };
  if (scheduledAt) input.scheduledAt = scheduledAt;
  if (now) input.sendNow = true;
  if (boardId) input.pinterest = { boardId };

  const data = await gql(
    `mutation($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on CreatePostSuccess { post { id status scheduledAt } }
        ... on UserError { message }
      }
    }`,
    { input }
  );
  const result = data.createPost;
  if (result?.message && !result.post) {
    const e = new Error(`Buffer createPost error: ${result.message}`);
    e.userError = true;
    throw e;
  }
  return result.post;
}

// ----------------------- Daily limit -------------------------------------
export async function getDailyLimits({ channelIds, date }) {
  const data = await gql(
    `query($input: DailyPostingLimitsInput!) { dailyPostingLimits(input: $input) { channelId remaining limit } }`,
    { input: { channelIds, date: date || new Date().toISOString().split('T')[0] } }
  );
  return data.dailyPostingLimits;
}
