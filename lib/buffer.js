// Buffer GraphQL API (Beta) client — pure fetch, no SDK.
// Docs: https://buffer.com/developers/api  (Beta GraphQL endpoint)
// Endpoint: https://api.buffer.com/graphql
// Auth: Bearer <PERSONAL_KEY> from publish.buffer.com → Settings → API → Personal Keys
// Limits: 100 / 15min, 100 / 24h, 3000 / 30 days (per dashboard)

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
// CreatePostInput required fields: schedulingType, channelId, assets, mode

/**
 * createPost — single-channel post via Buffer GraphQL.
 *
 * @param {object} opts
 * @param {string} opts.channelId - single Buffer channel ID
 * @param {string} opts.text - caption (with hashtags inline)
 * @param {string|object} [opts.image] - image URL or { url, thumbnailUrl }
 * @param {string|object} [opts.video] - video URL or { url, thumbnailUrl }
 * @param {string} [opts.dueAt] - ISO 8601 string for customScheduled mode
 * @param {string} [opts.mode='addToQueue'] - addToQueue | shareNow | shareNext | customScheduled | recommendedTime
 * @param {string} [opts.schedulingType='automatic'] - automatic | notification
 *
 * Platform-specific (pass only the relevant one):
 * @param {object} [opts.instagram] - { type: 'post'|'reel'|'story', firstComment, link, shouldShareToFeed }
 * @param {object} [opts.pinterest] - { title, url, boardServiceId }
 * @param {object} [opts.tiktok] - { title }
 * @param {object} [opts.facebook] - {}
 * @param {object} [opts.twitter] - {}
 */
export async function createPost({
  channelId,
  text,
  image,
  video,
  dueAt,
  mode = 'addToQueue',
  schedulingType = 'automatic',
  instagram,
  pinterest,
  tiktok,
  facebook,
  twitter,
  linkedin,
  threads,
  youtube,
}) {
  if (!channelId) throw new Error('channelId required');

  const assets = [];
  if (image) {
    const img = typeof image === 'string' ? { url: image } : image;
    assets.push({ image: img });
  }
  if (video) {
    const vid = typeof video === 'string' ? { url: video } : video;
    assets.push({ video: vid });
  }

  const metadata = {};
  if (instagram) {
    metadata.instagram = {
      type: instagram.type || 'post',
      shouldShareToFeed: instagram.shouldShareToFeed !== false,
      ...(instagram.firstComment ? { firstComment: instagram.firstComment } : {}),
      ...(instagram.link ? { link: instagram.link } : {}),
    };
  }
  if (pinterest) metadata.pinterest = pinterest;
  if (tiktok) metadata.tiktok = tiktok;
  if (facebook) metadata.facebook = facebook;
  if (twitter) metadata.twitter = twitter;
  if (linkedin) metadata.linkedin = linkedin;
  if (threads) metadata.threads = threads;
  if (youtube) metadata.youtube = youtube;

  const input = {
    channelId,
    schedulingType,
    mode,
    text,
    assets,
  };
  if (dueAt) input.dueAt = dueAt;
  if (Object.keys(metadata).length) input.metadata = metadata;

  const data = await gql(
    `mutation($input: CreatePostInput!) {
      createPost(input: $input) {
        __typename
        ... on PostActionSuccess { post { id status dueAt } }
        ... on NotFoundError { message }
        ... on UnauthorizedError { message }
        ... on UnexpectedError { message }
      }
    }`,
    { input }
  );
  const result = data.createPost;
  if (result?.message && !result.post) {
    const e = new Error(`Buffer createPost [${result.__typename}]: ${result.message}`);
    e.userError = true;
    e.typename = result.__typename;
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
