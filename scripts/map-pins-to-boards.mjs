#!/usr/bin/env node
// Map each Pinterest pin in the queue to the matching board_service_id
// (Pinterest API board IDs), then schedule them via Buffer.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Hard-coded mapping from queue board_name → Pinterest board ID (created today)
// Run scripts/refresh-board-ids.mjs to regen if boards change.
const BOARD_ID = {
  'Wedding First Dance Songs':              '1145181080188551417',
  'Anniversary Gifts That Mean Something':  '1145181080188551419',  // queue uses single-space
  'Anniversary Gifts That Mean  Something': '1145181080188551419',  // Pinterest has double-space
  'Birthday Gift Ideas':                    '1145181080188551426',
  'Memorial Tribute Songs':                 '1145181080188551434',
  'Personalized Music Gifts':               '1145181080188551424',
};

// Many of the existing pin pack boards are different names. Map them to the
// 5 we actually created.
const BOARD_ALIAS = {
  'Wedding First Dance Ideas':                  'Wedding First Dance Songs',
  'Anniversary Gifts That Mean Something':      'Anniversary Gifts That Mean Something',
  "Mother's Day Gifts Worth Crying Over":       'Personalized Music Gifts',  // no dedicated board, fold into Personalized Music
  "Father's Day Gifts He'll Actually Keep":     'Birthday Gift Ideas',       // fold dad gifts here
  'Memorial Keepsakes & Tribute Ideas':         'Memorial Tribute Songs',
  'Birthday Gifts for Mom':                     'Birthday Gift Ideas',
  'Birthday Gifts for Dad':                     'Birthday Gift Ideas',
  'Personalized Music Gifts':                   'Personalized Music Gifts',
  'Songzy Stories':                             'Personalized Music Gifts',
  'Unique & Sentimental Wedding Gifts':         'Wedding First Dance Songs',
};

async function main() {
  // 1. Pinterest direct pin queue (publish via Pinterest API direct, fails without write scope)
  const pinPackPath = path.join(ROOT, 'content/social-queue/pinterest-pins.json');
  const pinPack = JSON.parse(await fs.readFile(pinPackPath, 'utf-8'));
  let mapped = 0, unmapped = 0;
  for (const pin of pinPack) {
    const target = BOARD_ALIAS[pin.board_name] || pin.board_name;
    const id = BOARD_ID[target];
    if (id) {
      pin.board_service_id = id;
      pin.board_mapped_to = target;
      mapped++;
    } else {
      console.warn(`  ! unmapped pin board: "${pin.board_name}" → no target`);
      unmapped++;
    }
  }
  await fs.writeFile(pinPackPath, JSON.stringify(pinPack, null, 2), 'utf-8');
  console.log(`pinterest-pins.json: ${mapped} mapped, ${unmapped} unmapped`);

  // 2. Also add Buffer-queued Pinterest entries (route through Buffer GraphQL)
  const bufferPath = path.join(ROOT, 'content/social-queue/buffer-posts.json');
  const buffer = JSON.parse(await fs.readFile(bufferPath, 'utf-8'));

  // For each Pinterest pin in pin-pack, create a Buffer entry that targets the right board
  // (we deduplicate by post_id)
  const existing = new Set(buffer.map((p) => p.post_id));
  let added = 0;
  for (const pin of pinPack) {
    if (!pin.board_service_id) continue;
    const postId = `pinterest-${pin.pin_id}`;
    if (existing.has(postId)) continue;

    buffer.push({
      post_id: postId,
      platform: 'pinterest',
      caption: pin.description,
      hashtags: [],
      image_url: null,  // generated at publish time
      image_prompt: pin.image_prompt,
      image_seed: pin.image_seed,
      mood: pin.mood,
      board_service_id: pin.board_service_id,
      link: pin.link,
      pin_title: pin.title,
      scheduled_at: null,
      status: 'queued',
      buffer_post_id: null,
      style: 'pinterest_v1',
    });
    added++;
  }
  await fs.writeFile(bufferPath, JSON.stringify(buffer, null, 2), 'utf-8');
  console.log(`buffer-posts.json: ${added} Pinterest entries added`);
}

main().catch((e) => { console.error(e); process.exit(1); });
