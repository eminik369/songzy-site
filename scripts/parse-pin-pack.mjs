#!/usr/bin/env node
// Parse sales/pinterest/pin-pack.md → content/social-queue/pinterest-pins.json
// One-shot: run after editing the pin pack.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IN_PATH  = path.join(ROOT, 'sales/pinterest/pin-pack.md');
const OUT_PATH = path.join(ROOT, 'content/social-queue/pinterest-pins.json');

function pickField(block, label) {
  const re = new RegExp(`\\*\\*${label}\\*\\*:\\s*([^\\n]+)`, 'i');
  const m = block.match(re);
  return m ? m[1].trim() : null;
}

function parseVisualBrief(block) {
  const re = /\*\*Visual brief\*\*:\s*([\s\S]+?)(?:\n\n|\n## |$)/i;
  const m = block.match(re);
  return m ? m[1].trim() : null;
}

function parsePinPack(md) {
  // Split by "## PIN N — " pattern
  const sections = md.split(/^## PIN \d+/m).slice(1);
  const pins = [];
  let idx = 0;
  for (const section of sections) {
    idx++;
    const block = section;
    const titleLine = block.split('\n')[0].trim();
    const titleAfterDash = titleLine.replace(/^[\s—-]*/, '').trim();

    const title = pickField(block, 'Title') || titleAfterDash;
    const description = pickField(block, 'Description');
    const altText = pickField(block, 'Alt text');
    const board = pickField(block, 'Board');
    let link = pickField(block, 'Link');
    if (!link) {
      link = `https://songzy.eu/?utm_source=pinterest&utm_medium=pin&utm_campaign=organic&utm_content=pin-${String(idx).padStart(2, '0')}`;
    }
    const visualBrief = parseVisualBrief(block);

    if (!title || !description) continue;

    pins.push({
      pin_id: `pin-${String(idx).padStart(3, '0')}`,
      idx,
      title,
      description,
      alt_text: altText || title,
      board_name: board || 'Personalized Music Gifts',
      link,
      image_prompt: visualBrief || `${title}, Songzy brand`,
      image_seed: idx * 137 + 42,  // deterministic per pin
      mood: board && /memorial|tribute/i.test(board) ? 'quiet' :
            board && /wedding|anniversary/i.test(board) ? 'elegant' : 'warm',
      status: 'queued',
      scheduled_at: null,
      posted_at: null,
      external_pin_id: null,
      external_image_url: null,
    });
  }
  return pins;
}

async function main() {
  const md = await fs.readFile(IN_PATH, 'utf-8');
  const pins = parsePinPack(md);
  if (!pins.length) {
    console.error('[parse-pin-pack] no pins parsed — check pattern in pin-pack.md');
    process.exit(1);
  }
  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, JSON.stringify(pins, null, 2), 'utf-8');
  console.log(`[parse-pin-pack] wrote ${pins.length} pins → ${path.relative(ROOT, OUT_PATH)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
