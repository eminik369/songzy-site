#!/usr/bin/env node
// =============================================================================
// SONGZY — Buffer GraphQL auto-publisher
//
// Takes the next "queued" entry from content/social-queue/buffer-posts.json,
// resolves the matching Buffer channel, generates the image via Pollinations,
// and creates the post via Buffer GraphQL API.
//
// Run:   node scripts/publish-buffer-next.mjs
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  bufferConfigured,
  listChannels,
  createPost,
} from '../lib/buffer.js';
import {
  imageUrl as pollImageUrl,
  brandInstagramSquarePrompt,
  brandPinterestPrompt,
  IG_SQUARE_DIMENSIONS,
  PIN_DIMENSIONS,
} from '../lib/image-gen.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const QUEUE_PATH = path.join(ROOT, 'content/social-queue/buffer-posts.json');

async function loadQueue() {
  const text = await fs.readFile(QUEUE_PATH, 'utf-8');
  return JSON.parse(text);
}

async function saveQueue(posts) {
  await fs.writeFile(QUEUE_PATH, JSON.stringify(posts, null, 2), 'utf-8');
}

async function main() {
  if (!bufferConfigured()) {
    console.error('[publish-buffer] BUFFER_ACCESS_TOKEN missing — aborting');
    process.exit(2);
  }

  const posts = await loadQueue();
  const next = posts.find((p) => p.status === 'queued');
  if (!next) {
    console.log('[publish-buffer] no queued posts');
    return;
  }

  console.log(`[publish-buffer] processing ${next.post_id} (${next.platform}): ${next.caption?.slice(0, 80)}...`);

  // 1) Find Buffer channel for the platform
  const channels = await listChannels();
  if (!channels.length) {
    console.error('[publish-buffer] no Buffer channels connected. Connect at https://publish.buffer.com/channels');
    next.status = 'failed';
    next.error = 'No Buffer channels connected';
    await saveQueue(posts);
    process.exit(3);
  }
  console.log(`[publish-buffer] available channels: ${channels.map((c) => c.service).join(', ')}`);

  const channel = channels.find((c) => c.service?.toLowerCase() === next.platform.toLowerCase());
  if (!channel) {
    console.error(`[publish-buffer] no Buffer channel for "${next.platform}". Available: ${channels.map((c) => c.service).join(', ')}`);
    next.status = 'failed';
    next.error = `No Buffer channel for ${next.platform}`;
    await saveQueue(posts);
    process.exit(3);
  }
  console.log(`[publish-buffer] using channel: ${channel.service} (${channel.displayName || channel.name})`);

  // 2) Generate image URL (Pollinations direct URL — Buffer fetches it)
  let imageUrls = [];
  if (next.image_url) {
    imageUrls = [next.image_url];
  } else if (next.image_prompt) {
    const isPinterest = channel.service?.toLowerCase() === 'pinterest';
    const dims = isPinterest ? PIN_DIMENSIONS : IG_SQUARE_DIMENSIONS;
    const promptBuilder = isPinterest ? brandPinterestPrompt : brandInstagramSquarePrompt;
    const url = pollImageUrl(
      promptBuilder(next.image_prompt, { mood: next.mood || 'warm' }),
      { width: dims.width, height: dims.height, seed: next.image_seed }
    );
    imageUrls = [url];
    next.image_url = url;  // cache
  }

  // 3) Build caption (add hashtags inline for the platforms that want them)
  const captionWithHashtags = next.caption + (next.hashtags?.length
    ? '\n\n' + next.hashtags.map((h) => `#${h}`).join(' ')
    : '');

  // 4) Create post via Buffer GraphQL
  console.log(`[publish-buffer] creating post...`);
  const post = await createPost({
    channelIds: [channel.id],
    text: captionWithHashtags,
    scheduledAt: next.scheduled_at || undefined,
    imageUrls,
    boardId: next.board_id || undefined,
    now: next.now || false,
  });

  // 5) Update queue
  next.status = post.status?.toLowerCase() === 'sent' ? 'posted' : 'scheduled';
  next.buffer_post_id = post.id;
  next.posted_at = post.scheduledAt || new Date().toISOString();
  await saveQueue(posts);

  console.log(`[publish-buffer] ✓ ${next.status}: ${post.id}`);
}

main().catch((e) => {
  console.error('[publish-buffer] FAILED', e?.message || e);
  process.exit(1);
});
