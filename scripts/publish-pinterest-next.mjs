#!/usr/bin/env node
// =============================================================================
// SONGZY — Pinterest auto-publisher
//
// Takes the next "queued" pin from content/social-queue/pinterest-pins.json,
// generates the image via Pollinations.ai, uploads to the right board via
// Pinterest API v5, marks the entry as "posted".
//
// Run:   node scripts/publish-pinterest-next.mjs
// Or as part of loop orchestrator.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  pinterestConfigured,
  ensureBoard,
  createPin,
} from '../lib/pinterest.js';
import {
  imageBase64,
  brandPinterestPrompt,
  PIN_DIMENSIONS,
} from '../lib/image-gen.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT     = path.resolve(__dirname, '..');
const QUEUE_PATH = path.join(ROOT, 'content/social-queue/pinterest-pins.json');

// Board name → description used to ensure the board exists on first run
const BOARD_DESCRIPTIONS = {
  'Wedding First Dance Ideas': "First dance songs that fit YOUR love story — not generic playlists. Personalized songs, lyric inspiration, song selection guides, and ideas for couples who want their first dance to be theirs alone.",
  'Anniversary Gifts That Mean Something': "1st, 5th, 10th, 25th, 50th — anniversary gift ideas that go past flowers and dinner. Personalized songs, sentimental keepsakes, romantic ideas, gifts for him and for her.",
  "Mother's Day Gifts Worth Crying Over": "Gifts that make your mom (or grandma) actually feel something. Personalized songs from your story, sentimental ideas, gifts she'll keep forever.",
  "Father's Day Gifts He'll Actually Keep": "Past the tie, past the mug. Gifts your dad (or grandpa) will quietly play in the car for years. Personalized songs, sentimental ideas.",
  'Memorial Keepsakes & Tribute Ideas': "Ways to honor someone you've lost — personalized memorial songs, celebration of life ideas, tribute keepsakes, what to do at a service when words aren't enough.",
  'Birthday Gifts for Mom': "Birthday gift ideas for moms and grandmothers that aren't another scarf. Personalized songs, sentimental ideas, surprise gifts. 50th, 60th, 70th, 80th, 90th milestone birthday inspo.",
  'Birthday Gifts for Dad': "Gift ideas for dads and grandfathers — personalized songs from your story, sentimental ideas, gifts for the man who already has everything.",
  'Personalized Music Gifts': "Custom songs, lyric prints, personalized vinyl, music-themed gift inspiration. For weddings, birthdays, anniversaries, memorials — any moment that deserves more than a card.",
  'Songzy Stories': "Behind-the-scenes of personalized songs we've written: the briefs we get, the lyrics we write, the moments our songs play in. Real stories, real songs.",
  'Unique & Sentimental Wedding Gifts': "For the wedding party who wants to give something the couple will keep forever. Personalized songs, photo books, sentimental gift inspiration.",
};

async function loadQueue() {
  const text = await fs.readFile(QUEUE_PATH, 'utf-8');
  return JSON.parse(text);
}

async function saveQueue(pins) {
  await fs.writeFile(QUEUE_PATH, JSON.stringify(pins, null, 2), 'utf-8');
}

async function main() {
  if (!pinterestConfigured()) {
    console.error('[publish-pinterest] PINTEREST_ACCESS_TOKEN missing — aborting');
    process.exit(2);
  }

  const pins = await loadQueue();
  const next = pins.find((p) => p.status === 'queued');
  if (!next) {
    console.log('[publish-pinterest] no queued pins — refill the queue');
    return;
  }

  console.log(`[publish-pinterest] processing ${next.pin_id}: ${next.title}`);

  // 1) Ensure board exists
  const boardName = next.board_name;
  const boardDesc = BOARD_DESCRIPTIONS[boardName] || `Songzy — ${boardName}`;
  const board = await ensureBoard({ name: boardName, description: boardDesc, privacy: 'PUBLIC' });
  console.log(`[publish-pinterest] board: ${board.name} (${board.id})`);

  // 2) Generate image via Pollinations
  const prompt = brandPinterestPrompt(next.image_prompt, { mood: next.mood || 'warm' });
  console.log(`[publish-pinterest] generating image (seed=${next.image_seed})...`);
  const { base64, contentType } = await imageBase64(prompt, {
    width: PIN_DIMENSIONS.width,
    height: PIN_DIMENSIONS.height,
    seed: next.image_seed,
  });

  // 3) Create pin
  console.log(`[publish-pinterest] uploading pin...`);
  const pin = await createPin({
    boardId: board.id,
    title: next.title,
    description: next.description,
    altText: next.alt_text,
    link: next.link,
    imageBase64: base64,
    imageContentType: contentType,
  });

  // 4) Update queue
  next.status = 'posted';
  next.posted_at = new Date().toISOString();
  next.external_pin_id = pin.id;
  next.external_image_url = pin.media?.images?.['1200x']?.url || null;
  await saveQueue(pins);

  console.log(`[publish-pinterest] ✓ posted: https://pinterest.com/pin/${pin.id}`);
}

main().catch((e) => {
  console.error('[publish-pinterest] FAILED', e?.message || e);
  process.exit(1);
});
