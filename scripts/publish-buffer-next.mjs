#!/usr/bin/env node
// =============================================================================
// SONGZY — Buffer auto-scheduler
//
// Takes the next "queued" entry from content/social-queue/buffer-posts.json
// and schedules it on the matching Buffer profile (IG, TikTok, Facebook, etc.).
// Image is generated via Pollinations.ai if `image_prompt` is set.
//
// Run:   node scripts/publish-buffer-next.mjs
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

import {
  bufferConfigured,
  listProfiles,
  createUpdate,
} from '../lib/buffer.js';
import {
  imageBuffer,
  brandInstagramSquarePrompt,
  IG_SQUARE_DIMENSIONS,
} from '../lib/image-gen.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const QUEUE_PATH = path.join(ROOT, 'content/social-queue/buffer-posts.json');

// We need to host the image somewhere Buffer can fetch it. Two options:
//  A) Upload to Vercel Blob and use that URL
//  B) Use Pollinations URL directly (Buffer can fetch it during scheduling)
// Option B is simpler and free. Use option A if you want stable URLs across
// regenerations. We default to B.
const USE_POLLINATIONS_URL_DIRECT = true;

async function loadQueue() {
  const text = await fs.readFile(QUEUE_PATH, 'utf-8');
  return JSON.parse(text);
}

async function saveQueue(posts) {
  await fs.writeFile(QUEUE_PATH, JSON.stringify(posts, null, 2), 'utf-8');
}

async function uploadToBlob(buf, contentType) {
  // Lazy import so the script doesn't require Blob token when running queue-only ops
  const { put } = await import('@vercel/blob');
  const ext = contentType?.includes('png') ? 'png' : 'jpg';
  const key = `social/${crypto.randomUUID()}.${ext}`;
  const { url } = await put(key, buf, { access: 'public', contentType });
  return url;
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

  // 1) Find Buffer profile for the platform
  const profiles = await listProfiles();
  const profile = profiles.find((p) =>
    p.service?.toLowerCase() === next.platform.toLowerCase()
  );
  if (!profile) {
    console.error(`[publish-buffer] no Buffer profile for "${next.platform}". Connect it in Buffer first.`);
    next.status = 'failed';
    next.error = `No Buffer profile for ${next.platform}`;
    await saveQueue(posts);
    process.exit(3);
  }
  console.log(`[publish-buffer] profile: ${profile.service} (@${profile.formatted_username || profile.username})`);

  // 2) Resolve / generate image URL
  let imageUrl = next.image_url;
  if (!imageUrl && next.image_prompt) {
    if (USE_POLLINATIONS_URL_DIRECT) {
      const { imageUrl: pollUrl } = await import('../lib/image-gen.js');
      imageUrl = pollUrl(
        brandInstagramSquarePrompt(next.image_prompt, { mood: next.mood || 'warm' }),
        { width: IG_SQUARE_DIMENSIONS.width, height: IG_SQUARE_DIMENSIONS.height, seed: next.image_seed }
      );
    } else {
      console.log(`[publish-buffer] generating + uploading image...`);
      const { buffer, contentType } = await imageBuffer(
        brandInstagramSquarePrompt(next.image_prompt, { mood: next.mood || 'warm' }),
        { width: IG_SQUARE_DIMENSIONS.width, height: IG_SQUARE_DIMENSIONS.height, seed: next.image_seed }
      );
      imageUrl = await uploadToBlob(buffer, contentType);
      next.image_url = imageUrl;  // cache so re-runs reuse it
    }
  }

  // 3) Create Buffer update
  console.log(`[publish-buffer] scheduling on Buffer...`);
  const update = await createUpdate({
    profileIds: [profile.id],
    text: next.caption + (next.hashtags?.length ? '\n\n' + next.hashtags.map((h) => `#${h}`).join(' ') : ''),
    scheduledAt: next.scheduled_at,
    imageUrl,
    shorten: false,  // we already include UTM-tagged short URLs ourselves
  });

  // 4) Update queue
  next.status = update.updates?.[0]?.status === 'pending' ? 'scheduled' : 'posted';
  next.buffer_update_id = update.updates?.[0]?.id;
  next.scheduled_at = update.updates?.[0]?.scheduled_at
    ? new Date(update.updates[0].scheduled_at * 1000).toISOString()
    : next.scheduled_at;
  await saveQueue(posts);

  console.log(`[publish-buffer] ✓ scheduled: ${next.buffer_update_id} (${next.status})`);
}

main().catch((e) => {
  console.error('[publish-buffer] FAILED', e?.message || e);
  process.exit(1);
});
