#!/usr/bin/env node
// =============================================================================
// SONGZY — Buffer batch auto-publisher
//
// Pubblica TUTTI i post "queued" che match piattaforme con channel connessi.
// Skippa quelli senza channel o senza media compatibile (es. TikTok needs video).
//
// Run: node scripts/publish-buffer-batch.mjs [--limit N]
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { bufferConfigured, listChannels, createPost } from '../lib/buffer.js';
import { imageUrl as pollImageUrl, brandInstagramSquarePrompt, brandPinterestPrompt, IG_SQUARE_DIMENSIONS, PIN_DIMENSIONS } from '../lib/image-gen.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const QUEUE_PATH = path.join(ROOT, 'content/social-queue/buffer-posts.json');

const limit = parseInt(process.argv.find((a) => a.startsWith('--limit='))?.split('=')[1] || '999', 10);

async function loadQueue() {
  return JSON.parse(await fs.readFile(QUEUE_PATH, 'utf-8'));
}
async function saveQueue(p) {
  await fs.writeFile(QUEUE_PATH, JSON.stringify(p, null, 2), 'utf-8');
}

async function main() {
  if (!bufferConfigured()) { console.error('BUFFER_ACCESS_TOKEN missing'); process.exit(2); }
  const channels = await listChannels();
  const byService = Object.fromEntries(channels.map((c) => [c.service.toLowerCase(), c]));
  console.log('Channels:', Object.keys(byService).join(', '));

  const posts = await loadQueue();
  const queued = posts.filter((p) => p.status === 'queued');
  console.log(`${queued.length} posts queued in total`);

  let posted = 0, skipped = 0, failed = 0;
  for (const next of queued) {
    if (posted >= limit) break;

    const ch = byService[next.platform.toLowerCase()];
    if (!ch) {
      console.log(`  SKIP ${next.post_id} → no channel for ${next.platform}`);
      next.status = 'skipped';
      next.error = `No Buffer channel for ${next.platform}`;
      skipped++;
      continue;
    }

    // Pinterest needs boardServiceId — skip if missing
    if (next.platform.toLowerCase() === 'pinterest' && !next.board_service_id) {
      console.log(`  SKIP ${next.post_id} → Pinterest needs board_service_id (create boards on Pinterest first)`);
      next.status = 'needs_board';
      skipped++;
      continue;
    }

    // TikTok needs video
    if (next.platform.toLowerCase() === 'tiktok' && !next.video_url) {
      console.log(`  SKIP ${next.post_id} → TikTok needs video`);
      next.status = 'needs_video';
      skipped++;
      continue;
    }

    // Resolve image URL (only if no video)
    let imageUrlFinal = next.image_url;
    const videoUrlFinal = next.video_url;
    if (!videoUrlFinal && !imageUrlFinal && next.image_prompt) {
      const isPin = next.platform.toLowerCase() === 'pinterest';
      const dims = isPin ? PIN_DIMENSIONS : IG_SQUARE_DIMENSIONS;
      const promptFn = isPin ? brandPinterestPrompt : brandInstagramSquarePrompt;
      imageUrlFinal = pollImageUrl(promptFn(next.image_prompt, { mood: next.mood || 'warm' }),
        { width: dims.width, height: dims.height, seed: next.image_seed });
      next.image_url = imageUrlFinal;
    }

    const captionWithHashtags = next.caption + (next.hashtags?.length
      ? '\n\n' + next.hashtags.map((h) => `#${h}`).join(' ') : '');

    try {
      const meta = {};
      if (next.platform === 'instagram') {
        // If we have a video → it's a Reel; otherwise a regular post
        meta.instagram = {
          type: videoUrlFinal ? (next.instagram_type || 'reel') : 'post',
          shouldShareToFeed: true,
        };
      } else if (next.platform === 'pinterest') {
        meta.pinterest = {
          title: next.caption.split('\n')[0].slice(0, 100),
          url: next.link || 'https://songzy.eu',
          boardServiceId: next.board_service_id,
        };
      } else if (next.platform === 'tiktok') {
        meta.tiktok = { title: next.caption.split('\n')[0].slice(0, 90) };
      }

      const post = await createPost({
        channelId: ch.id,
        text: captionWithHashtags,
        image: videoUrlFinal ? undefined : imageUrlFinal,
        video: videoUrlFinal || undefined,
        mode: 'addToQueue',
        ...meta,
      });
      next.status = 'scheduled';
      next.buffer_post_id = post.id;
      next.posted_at = post.dueAt || new Date().toISOString();
      console.log(`  ✓ ${next.post_id} → ${ch.service} (post ${post.id}, due ${post.dueAt})`);
      posted++;
    } catch (e) {
      console.error(`  ✗ ${next.post_id} → ${e.message}`);
      next.status = 'failed';
      next.error = e.message;
      failed++;
    }
  }

  await saveQueue(posts);
  console.log(`\nDONE: posted=${posted} skipped=${skipped} failed=${failed}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
