#!/usr/bin/env node
// Upload generated video shorts to Vercel Blob, then enrich the Buffer queue
// with TikTok + Instagram Reel entries that reference the blob URLs.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { put } from '@vercel/blob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const VIDEO_INDEX = path.join(ROOT, 'content/social-queue/videos/index.json');
const QUEUE_PATH  = path.join(ROOT, 'content/social-queue/buffer-posts.json');

// Caption templates per video — TikTok-flavored, hook-first, with CTA
function ttCaption(v) {
  return `${v.hook.replace(/\n/g, ' ')}\n\n${v.subhook}\n\n→ ${v.cta}\n\n#personalizedsong #customsong #songgift #songzy #uniquegift #handmadegift #fyp #weddinggift #anniversarygift #birthdaygift`;
}

function igReelCaption(v) {
  return `${v.hook.replace(/\n/g, '\n')}\n\n${v.subhook}.\n\nLink in bio → songzy.eu\n\n#personalizedsong #customsong #weddingsong #anniversarygift #songgift #songzy`;
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN missing');
    process.exit(2);
  }

  const videos = JSON.parse(await fs.readFile(VIDEO_INDEX, 'utf-8'));
  console.log(`Uploading ${videos.length} videos to Vercel Blob...`);

  const queue = JSON.parse(await fs.readFile(QUEUE_PATH, 'utf-8'));

  // Mark obsolete placeholder tiktok-001 as superseded
  const old = queue.find((p) => p.post_id === 'tiktok-001' && !p.video_url);
  if (old) {
    old.status = 'superseded';
    old.note = 'Replaced by tiktok-002..011 with real video files.';
  }

  for (let i = 0; i < videos.length; i++) {
    const v = videos[i];
    const localPath = path.join(ROOT, v.video_file);
    const data = await fs.readFile(localPath);
    const blobKey = `social/videos/${path.basename(v.video_file)}`;
    const { url } = await put(blobKey, data, {
      access: 'public',
      contentType: 'video/mp4',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    console.log(`  ✓ ${v.video_file} → ${url}`);

    const newId = `tiktok-${String(i + 2).padStart(3, '0')}`;  // start from 002
    const igId  = `ig-reel-${String(i + 1).padStart(3, '0')}`;

    // TikTok entry
    queue.push({
      post_id: newId,
      platform: 'tiktok',
      caption: ttCaption(v),
      hashtags: [],
      video_url: url,
      image_url: null,
      mood: 'warm',
      scheduled_at: null,
      status: 'queued',
      buffer_post_id: null,
      audio_source: v.audio_source,
    });

    // Instagram Reel entry (uses same video, different caption)
    queue.push({
      post_id: igId,
      platform: 'instagram',
      caption: igReelCaption(v),
      hashtags: [],
      video_url: url,
      image_url: null,
      mood: 'warm',
      scheduled_at: null,
      status: 'queued',
      buffer_post_id: null,
      instagram_type: 'reel',
      audio_source: v.audio_source,
    });
  }

  await fs.writeFile(QUEUE_PATH, JSON.stringify(queue, null, 2), 'utf-8');
  console.log(`\nDONE: added ${videos.length} TikTok + ${videos.length} IG Reel entries to queue`);
}

main().catch((e) => { console.error(e); process.exit(1); });
