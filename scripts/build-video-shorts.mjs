#!/usr/bin/env node
// =============================================================================
// SONGZY — Video shorts generator (TikTok / IG Reels / YouTube Shorts)
//
// Pipeline (no ffmpeg drawtext required):
//   1. ImageMagick: build a 1080x1920 PNG frame with blurred bg cover +
//      centered cover + brand "Songzy" + hook + subhook + CTA
//   2. ffmpeg: combine 28-sec audio clip with that static frame → MP4
//
// Output: content/social-queue/videos/short-NNN.mp4
//         content/social-queue/videos/index.json
// =============================================================================

import { execSync, execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'content/social-queue/videos');
const TMP_DIR = path.join(OUT_DIR, '_tmp_frames');

const VIDEO_CONFIGS = [
  { audio: 'golden-hour-rewrite', cover: 'golden-hour-rewrite', hook: 'A song from\nyour love story', subhook: 'Custom wedding & anniversary songs', cta: 'From 19 EUR  songzy.eu' },
  { audio: 'golden-hour-rewrite', cover: 'golden-hour-rewrite', hook: 'Their first dance,\nwritten from your story', subhook: 'Custom wedding song. Ready in 2h.', cta: 'songzy.eu' },
  { audio: 'those-hands', cover: 'those-hands', hook: 'A song about your\n10 years together', subhook: 'Custom anniversary songs', cta: 'From 19 EUR  songzy.eu' },
  { audio: 'those-hands', cover: 'those-hands', hook: 'For the partner who\nhas everything', subhook: 'A custom song from your story', cta: 'songzy.eu' },
  { audio: 'little-blue-steps', cover: 'little-blue-steps', hook: 'A song to play when\nwords arent enough', subhook: 'Memorial tribute songs', cta: 'songzy.eu' },
  { audio: 'muddy-paws', cover: 'muddy-paws', hook: 'A birthday song for dad\nhell quietly replay', subhook: 'Custom songs from your story', cta: 'From 19 EUR  songzy.eu' },
  { audio: 'muddy-paws', cover: 'muddy-paws', hook: 'No tie. No mug.\nA song.', subhook: 'For dads who have everything', cta: 'songzy.eu' },
  { audio: 'unbreakable-rooms', cover: 'unbreakable-rooms', hook: 'The gift theyll play\non repeat for a week', subhook: 'Personalized songs from your words', cta: 'From 19 EUR  songzy.eu' },
  { audio: 'unbreakable-rooms', cover: 'unbreakable-rooms', hook: 'Better than flowers.\nLasts longer than chocolate.', subhook: 'A song from their story', cta: 'songzy.eu' },
  { audio: 'golden-hour-rewrite', cover: 'golden-hour-rewrite', hook: 'Your mums 70th.\nHer grandkids sang along.', subhook: 'A song from her story. From 19 EUR.', cta: 'songzy.eu' },
];

async function buildFrame(config, idx) {
  const idxStr = String(idx + 1).padStart(3, '0');
  const cover = path.join(ROOT, `assets/covers/${config.cover}.jpg`);
  const bgFrame = path.join(TMP_DIR, `bg-${idxStr}.png`);
  const frame = path.join(TMP_DIR, `frame-${idxStr}.png`);

  // Step 1: bg = cover scaled 1080x1920 + blur + dark
  execFileSync('magick', [
    cover,
    '-resize', '1080x1920^', '-gravity', 'center', '-extent', '1080x1920',
    '-blur', '0x40', '-brightness-contrast', '-25x0',
    bgFrame,
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  // Step 2: composite cover (820x820) on bg + text overlays
  execFileSync('magick', [
    bgFrame,
    cover, '-resize', '820x820', '-gravity', 'center', '-geometry', '+0-580', '-composite',
    // Brand "Songzy" at top
    '-gravity', 'north',
    '-font', 'Georgia-Italic', '-pointsize', '84', '-fill', 'white',
    '-annotate', '+0+140', 'Songzy',
    // Hook centered, big serif italic
    '-gravity', 'center',
    '-font', 'Georgia-Italic', '-pointsize', '76', '-fill', 'white',
    '-annotate', '+0+520', config.hook,
    // Subhook
    '-gravity', 'south',
    '-font', 'Georgia', '-pointsize', '42', '-fill', '#B8B8CC',
    '-annotate', '+0+340', config.subhook,
    // CTA bottom
    '-font', 'Georgia-Bold', '-pointsize', '52', '-fill', '#E91E8C',
    '-annotate', '+0+180', config.cta,
    frame,
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  return frame;
}

async function buildVideo(config, idx) {
  const idxStr = String(idx + 1).padStart(3, '0');
  const outFile = path.join(OUT_DIR, `short-${idxStr}.mp4`);
  const audio = path.join(ROOT, `assets/audio/${config.audio}.mp3`);

  console.log(`[${idxStr}] ${config.hook.replace(/\n/g, ' / ')}`);

  let frame;
  try {
    frame = await buildFrame(config, idx);
  } catch (e) {
    const stderr = e.stderr?.toString() || '';
    console.error(`   ✗ frame failed: ${stderr.split('\n').slice(-3).join(' | ')}`);
    return { ok: false };
  }

  const cmd = [
    'ffmpeg', '-y',
    '-ss', '30', '-t', '28',
    '-i', `"${audio}"`,
    '-loop', '1', '-framerate', '30', '-t', '28', '-i', `"${frame}"`,
    '-vf', 'scale=1080:1920,format=yuv420p',
    '-map', '1:v', '-map', '0:a',
    '-t', '28',
    '-af', 'afade=t=in:st=0:d=1.2,afade=t=out:st=26:d=2',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '23',
    '-r', '30',
    '-c:a', 'aac', '-b:a', '160k',
    '-movflags', '+faststart',
    `"${outFile}"`,
  ].join(' ');

  try {
    execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'], timeout: 90000 });
    const size = (await fs.stat(outFile)).size;
    console.log(`   ✓ ${(size / 1024 / 1024).toFixed(2)}MB`);
    return { ok: true, file: outFile, config, size };
  } catch (e) {
    const stderr = e.stderr?.toString() || '';
    console.error(`   ✗ ffmpeg: ${stderr.split('\n').slice(-3).join(' | ')}`);
    return { ok: false };
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(TMP_DIR, { recursive: true });

  const results = [];
  for (let i = 0; i < VIDEO_CONFIGS.length; i++) {
    results.push(await buildVideo(VIDEO_CONFIGS[i], i));
  }

  const meta = results.filter((r) => r.ok).map((r, i) => ({
    post_id: `tiktok-${String(i + 1).padStart(3, '0')}`,
    video_file: path.relative(ROOT, r.file),
    audio_source: r.config.audio,
    hook: r.config.hook,
    subhook: r.config.subhook,
    cta: r.config.cta,
    size_mb: (r.size / 1024 / 1024).toFixed(2),
  }));
  await fs.writeFile(path.join(OUT_DIR, 'index.json'), JSON.stringify(meta, null, 2), 'utf-8');

  const ok = results.filter((r) => r.ok).length;
  console.log(`\nDONE: ${ok}/${results.length} videos generated`);

  // Cleanup temp frames
  try { await fs.rm(TMP_DIR, { recursive: true, force: true }); } catch {}
}

main().catch((e) => { console.error(e); process.exit(1); });
