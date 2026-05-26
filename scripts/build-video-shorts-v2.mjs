#!/usr/bin/env node
// =============================================================================
// SONGZY — Video shorts v2 (viral-style, multi-scene cinematic)
//
// Pipeline per ogni video (28 sec, 9:16 1080x1920):
//   Scene 1 (0-4s)  HOOK         AI image #1 + big text + TTS voiceover
//   Scene 2 (4-9s)  TWIST        AI image #2 + text reveal + TTS continues
//   Scene 3 (9-19s) AUDIO DROP   Songzy cover (full screen) + Songzy audio loud + lyric text
//   Scene 4 (19-25s) TESTIMONIAL AI image #3 + text quote
//   Scene 5 (25-28s) CTA         brand frame + "songzy.eu" big + price
//
// Tech: Pollinations.ai (AI images, free) + ImageMagick (text overlay frames)
//       + macOS `say` (voiceover) + ffmpeg (Ken Burns zoompan, xfade transitions,
//       audio mix)
//
// Output: content/social-queue/videos-v2/short-NNN.mp4 + index.json
// =============================================================================

import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'content/social-queue/videos-v2');
const TMP_DIR = path.join(OUT_DIR, '_tmp');

const W = 1080, H = 1920;
const VOICE_EN = 'Samantha';
const VOICE_IT = 'Alice';

// One video = one VIDEO_CONFIG (storyline with 5 scenes)
const VIDEO_CONFIGS = [
  {
    id: 'v2-001',
    lang: 'en',
    audio: 'those-hands',
    voice: VOICE_EN,
    scenes: [
      { dur: 4, kind: 'hook',
        prompt: 'A young woman alone at her desk reading a text message on her phone, soft afternoon light through window, intimate and emotional moment, cinematic 9:16, photorealistic, magazine-style portrait',
        text: 'POV: I sent 4 lines\nabout my husband',
        textSize: 88, fontStyle: 'italic',
        tts: 'POV: I sent four lines about my husband.' },
      { dur: 5, kind: 'twist',
        prompt: 'A man in his 30s sitting in a car at sunset listening to headphones, slight tear on cheek, intimate emotional cinematic moment, photorealistic, golden hour light, vertical 9:16',
        text: 'This is what they\nmade me.',
        textSize: 92, fontStyle: 'italic',
        tts: 'And this is the song they made me.' },
      { dur: 10, kind: 'drop',
        coverSource: 'those-hands',  // use Songzy cover full-screen
        text: '"I love the way\nyou make coffee wrong\nevery single morning"',
        textSize: 72, fontStyle: 'italic',
        tts: '' },
      { dur: 6, kind: 'testimonial',
        prompt: 'Close-up hands holding a cup of coffee in warm morning kitchen light, intimate domestic moment, cinematic 9:16, photorealistic, magazine style',
        text: '"He cried.\nThen replayed it 4 times."',
        textSize: 80, fontStyle: 'italic',
        tts: 'He cried. Then replayed it four times.' },
      { dur: 3, kind: 'cta',
        prompt: 'Dark moody background with subtle gradient orange to deep purple, minimal abstract, cinematic 9:16',
        text: 'Songzy\nsongzy.eu  ·  from €19',
        textSize: 96, fontStyle: 'italic',
        tts: 'Songzy. From nineteen euros.' },
    ],
  },
  {
    id: 'v2-002',
    lang: 'en',
    audio: 'golden-hour-rewrite',
    voice: VOICE_EN,
    scenes: [
      { dur: 4, kind: 'hook',
        prompt: 'A man in his 30s holding a phone with text glowing on screen, surprised wide-eyed expression, golden hour light, intimate cinematic vertical 9:16, photorealistic, magazine portrait',
        text: 'Wedding gift idea\nthat made the room cry',
        textSize: 84, fontStyle: 'italic',
        tts: 'Wedding gift idea that made the entire room cry.' },
      { dur: 5, kind: 'twist',
        prompt: 'Bride and groom slow dancing at sunset wedding reception, warm string lights, intimate first dance moment, cinematic 9:16, photorealistic',
        text: 'A custom first dance\nfrom their love story',
        textSize: 76, fontStyle: 'italic',
        tts: 'A custom first dance song. Written from their story.' },
      { dur: 10, kind: 'drop',
        coverSource: 'golden-hour-rewrite',
        text: '"You proposed at the\nkitchen table on a Tuesday\nand I never said yes faster"',
        textSize: 64, fontStyle: 'italic',
        tts: '' },
      { dur: 6, kind: 'testimonial',
        prompt: 'Wedding reception guests reacting emotionally with tissues, candlelight, soft warm cinematic vertical 9:16, photorealistic',
        text: '"Half the room\nwas full-on crying"',
        textSize: 84, fontStyle: 'italic',
        tts: 'Half the room was full-on crying.' },
      { dur: 3, kind: 'cta',
        prompt: 'Dark cinematic gradient orange pink purple abstract minimal vertical 9:16',
        text: 'songzy.eu\nfirst dance from €19',
        textSize: 92, fontStyle: 'italic',
        tts: 'Songzy. Custom wedding songs.' },
    ],
  },
  {
    id: 'v2-003',
    lang: 'en',
    audio: 'muddy-paws',
    voice: VOICE_EN,
    scenes: [
      { dur: 4, kind: 'hook',
        prompt: 'A man in his 60s sitting alone in a workshop or garage, contemplative, dim warm light, weathered hands holding coffee, cinematic vertical 9:16, photorealistic portrait',
        text: 'My dad never cries.',
        textSize: 110, fontStyle: 'italic',
        tts: 'My dad never cries.' },
      { dur: 5, kind: 'twist',
        prompt: 'Older man in his 60s wiping a tear from his eye while holding a phone, deeply moved, warm dim light, intimate cinematic vertical 9:16, photorealistic',
        text: 'For his 70th birthday\nI sent his life story\nto Songzy.',
        textSize: 68, fontStyle: 'italic',
        tts: 'For his seventieth birthday I sent his life story to Songzy.' },
      { dur: 10, kind: 'drop',
        coverSource: 'muddy-paws',
        text: '"You taught me to drive\non a country road\nin a beat-up Ford Fiesta"',
        textSize: 64, fontStyle: 'italic',
        tts: '' },
      { dur: 6, kind: 'testimonial',
        prompt: 'Father and adult son hugging warmly outdoor golden hour light, intimate emotional moment, cinematic vertical 9:16, photorealistic',
        text: 'He cried.\nThen called his sister\nto play it for her.',
        textSize: 70, fontStyle: 'italic',
        tts: 'He cried. Then called his sister to play it for her.' },
      { dur: 3, kind: 'cta',
        prompt: 'Dark cinematic minimal vertical 9:16',
        text: 'songzy.eu\nbirthday song · €19',
        textSize: 92, fontStyle: 'italic',
        tts: 'Songzy. Songs from your story.' },
    ],
  },
];

// ----- Helpers --------------------------------------------------------------

async function downloadPollinationsImage(prompt, outPath, seed) {
  const cleanPrompt = prompt.replace(/\n/g, ' ').slice(0, 800);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=${W}&height=${H}&model=flux&seed=${seed}&nologo=true&enhance=true`;
  const resp = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!resp.ok) throw new Error(`Pollinations ${resp.status}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  await fs.writeFile(outPath, buf);
  return outPath;
}

async function loadSongzyCover(coverName, outPath) {
  const src = path.join(ROOT, `assets/covers/${coverName}.jpg`);
  // Scale to W x H (cover style): scale + crop center
  execFileSync('magick', [
    src,
    '-resize', `${W}x${H}^`, '-gravity', 'center', '-extent', `${W}x${H}`,
    outPath,
  ]);
  return outPath;
}

function buildFrameWithText(srcImage, outFrame, scene, video) {
  // Apply dark gradient + text overlay
  const fontMap = {
    'italic': 'Georgia-Italic',
    'bold':   'Georgia-Bold',
    'regular': 'Georgia',
  };
  const font = fontMap[scene.fontStyle] || 'Georgia-Italic';

  // text shadow color via stroke for legibility on any bg
  const cmd = [
    srcImage,
    // Add subtle dark vignette via -evaluate-sequence (or gradient overlay)
    '-resize', `${W}x${H}^`, '-gravity', 'center', '-extent', `${W}x${H}`,
    // dim slightly for text legibility
    '-brightness-contrast', '-10x5',
    // Bottom gradient for text area (use linear gradient overlay)
    '(', '-size', `${W}x${Math.round(H * 0.45)}`,
        'gradient:none-#000000DD',
        ')',
    '-gravity', 'south', '-composite',
    // Text shadow (offset 4px down)
    '-gravity', 'center',
    '-font', font, '-pointsize', String(scene.textSize),
    '-fill', '#00000099', '-annotate', '+4+364', scene.text,
    // Text main
    '-fill', 'white', '-annotate', '+0+360', scene.text,
    // Songzy brand small at top
    '-gravity', 'north',
    '-font', 'Georgia-Italic', '-pointsize', '52', '-fill', '#FFFFFFCC',
    '-annotate', '+0+90', 'Songzy',
    outFrame,
  ];
  execFileSync('magick', cmd, { stdio: ['ignore', 'pipe', 'pipe'] });
  return outFrame;
}

async function generateTTS(text, voice, outFile) {
  // macOS say outputs AIFF; we convert to MP3 via ffmpeg
  const aiff = outFile.replace(/\.mp3$/, '.aiff');
  execFileSync('say', ['-v', voice, '-r', '170', '-o', aiff, text]);
  // Convert to MP3
  execFileSync('ffmpeg', [
    '-y', '-i', aiff,
    '-c:a', 'libmp3lame', '-b:a', '128k',
    outFile,
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  await fs.unlink(aiff).catch(() => {});
  return outFile;
}

async function buildSceneClip(frame, audio, dur, outClip) {
  // Ken Burns zoom: zoompan from 1.0 to 1.08 over the scene duration
  // Frame count = dur * 30 fps
  const totalFrames = Math.round(dur * 30);
  const zoomFilter = `zoompan=z='min(zoom+0.0008,1.10)':d=${totalFrames}:s=${W}x${H}:fps=30`;

  const args = [
    '-y',
    '-loop', '1', '-framerate', '30', '-t', String(dur), '-i', frame,
  ];
  if (audio) {
    args.push('-i', audio);
    args.push('-shortest');
  }
  args.push(
    '-vf', `${zoomFilter},format=yuv420p`,
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '22',
    '-r', '30', '-t', String(dur),
  );
  if (audio) {
    args.push('-c:a', 'aac', '-b:a', '160k');
    args.push('-map', '0:v', '-map', '1:a');
  } else {
    args.push('-an');
  }
  args.push(outClip);

  execFileSync('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  return outClip;
}

async function concatClipsWithXfade(clips, outFile, transitionDur = 0.3) {
  // Build complex filter with xfade between adjacent clips
  // Each clip becomes [v0], [v1], ... and audio [a0], [a1], ...
  const n = clips.length;
  const args = ['-y'];
  for (const c of clips) args.push('-i', c);

  // Get duration of each clip via ffprobe
  const durs = [];
  for (const c of clips) {
    const out = execFileSync('ffprobe', [
      '-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=duration',
      '-of', 'csv=p=0', c,
    ]).toString().trim();
    durs.push(parseFloat(out));
  }

  // Build xfade chain
  // v: [0:v][1:v]xfade=transition=fade:duration=0.3:offset=(d0-0.3)[vx1]
  //    [vx1][2:v]xfade=transition=fade:duration=0.3:offset=(d0+d1-0.6)[vx2]
  let vFilter = '';
  let aFilter = '';
  let prevV = '[0:v]';
  let prevA = '[0:a]';
  let offset = 0;
  for (let i = 1; i < n; i++) {
    offset += durs[i - 1] - transitionDur;
    const vOut = i === n - 1 ? '[vout]' : `[vx${i}]`;
    const aOut = i === n - 1 ? '[aout]' : `[ax${i}]`;
    vFilter += `${prevV}[${i}:v]xfade=transition=fade:duration=${transitionDur}:offset=${offset.toFixed(3)}${vOut};`;
    aFilter += `${prevA}[${i}:a]acrossfade=d=${transitionDur}${aOut};`;
    prevV = vOut;
    prevA = aOut;
  }

  args.push(
    '-filter_complex', vFilter + aFilter,
    '-map', '[vout]', '-map', '[aout]',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '160k',
    '-movflags', '+faststart',
    outFile,
  );

  execFileSync('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  return outFile;
}

async function mixAudioOverVideo(videoFile, audioFile, outFile, audioStartSec = 4, audioVolume = 0.7) {
  // Mix existing video audio (TTS) with songzy audio starting at audioStartSec
  const args = [
    '-y', '-i', videoFile, '-i', audioFile,
    '-filter_complex',
    `[1:a]atrim=start=30:end=80,asetpts=PTS-STARTPTS,volume=${audioVolume},afade=t=in:st=0:d=0.5,afade=t=out:st=23:d=2,adelay=${audioStartSec * 1000}|${audioStartSec * 1000}[songzy];[0:a][songzy]amix=inputs=2:duration=longest:dropout_transition=2[aout]`,
    '-map', '0:v', '-map', '[aout]',
    '-c:v', 'copy',
    '-c:a', 'aac', '-b:a', '192k',
    '-movflags', '+faststart',
    outFile,
  ];
  execFileSync('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  return outFile;
}

// ----- Per-video build ------------------------------------------------------

async function buildVideo(video) {
  const vTmp = path.join(TMP_DIR, video.id);
  await fs.mkdir(vTmp, { recursive: true });

  console.log(`\n=== ${video.id} (${video.audio}) ===`);
  const sceneClips = [];

  for (let s = 0; s < video.scenes.length; s++) {
    const scene = video.scenes[s];
    const sceneIdx = String(s + 1).padStart(2, '0');
    const seed = parseInt(video.id.replace(/\D/g, ''), 10) * 100 + s;

    // 1. Source image
    const srcImg = path.join(vTmp, `s${sceneIdx}-src.jpg`);
    if (scene.coverSource) {
      console.log(`  [${sceneIdx}] cover (${scene.coverSource})`);
      await loadSongzyCover(scene.coverSource, srcImg);
    } else if (scene.prompt) {
      console.log(`  [${sceneIdx}] AI image (seed ${seed})...`);
      await downloadPollinationsImage(scene.prompt, srcImg, seed);
    }

    // 2. Frame with text overlay
    const frame = path.join(vTmp, `s${sceneIdx}-frame.png`);
    buildFrameWithText(srcImg, frame, scene, video);

    // 3. TTS audio (if scene has voiceover)
    let ttsFile = null;
    if (scene.tts && scene.tts.trim()) {
      ttsFile = path.join(vTmp, `s${sceneIdx}-tts.mp3`);
      await generateTTS(scene.tts, video.voice, ttsFile);
    } else {
      // Silent audio of correct duration so xfade works
      ttsFile = path.join(vTmp, `s${sceneIdx}-silent.mp3`);
      execFileSync('ffmpeg', [
        '-y', '-f', 'lavfi',
        '-i', `anullsrc=channel_layout=stereo:sample_rate=44100`,
        '-t', String(scene.dur),
        '-c:a', 'libmp3lame', '-b:a', '128k',
        ttsFile,
      ], { stdio: ['ignore', 'pipe', 'pipe'] });
    }

    // 4. Build clip with Ken Burns + audio
    const clip = path.join(vTmp, `s${sceneIdx}-clip.mp4`);
    await buildSceneClip(frame, ttsFile, scene.dur, clip);
    sceneClips.push(clip);
  }

  // 5. Concat with xfade
  console.log(`  Concat ${sceneClips.length} clips with xfade...`);
  const concatOut = path.join(vTmp, 'concat.mp4');
  await concatClipsWithXfade(sceneClips, concatOut);

  // 6. Mix Songzy audio at the drop scene
  const audioFile = path.join(ROOT, `assets/audio/${video.audio}.mp3`);
  const finalOut = path.join(OUT_DIR, `${video.id}.mp4`);
  // drop scene starts at sum of dur of first 2 scenes (4+5 = 9s)
  const dropStart = video.scenes.slice(0, 2).reduce((a, s) => a + s.dur, 0);
  console.log(`  Mix Songzy audio starting ${dropStart}s...`);
  await mixAudioOverVideo(concatOut, audioFile, finalOut, dropStart, 0.85);

  const stats = await fs.stat(finalOut);
  console.log(`  ✓ ${path.basename(finalOut)} → ${(stats.size / 1024 / 1024).toFixed(2)}MB`);
  return { ok: true, file: finalOut, size: stats.size, video };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(TMP_DIR, { recursive: true });

  const results = [];
  for (const v of VIDEO_CONFIGS.filter(c => !process.env.SKIP_IDS?.split(",").includes(c.id))) {
    try {
      results.push(await buildVideo(v));
    } catch (e) {
      const stderr = e.stderr?.toString() || '';
      console.error(`✗ ${v.id} FAILED`);
      console.error(`  ${e.message}`);
      if (stderr) console.error(`  stderr (tail): ${stderr.split('\n').slice(-5).join(' | ')}`);
      results.push({ ok: false, video: v, error: e.message });
    }
  }

  const meta = results.filter((r) => r.ok).map((r) => ({
    post_id: r.video.id,
    video_file: path.relative(ROOT, r.file),
    audio_source: r.video.audio,
    lang: r.video.lang,
    duration_sec: r.video.scenes.reduce((a, s) => a + s.dur, 0),
    size_mb: (r.size / 1024 / 1024).toFixed(2),
    first_scene_text: r.video.scenes[0].text,
  }));
  await fs.writeFile(path.join(OUT_DIR, 'index.json'), JSON.stringify(meta, null, 2), 'utf-8');

  // Cleanup tmp
  try { await fs.rm(TMP_DIR, { recursive: true, force: true }); } catch {}

  const ok = results.filter((r) => r.ok).length;
  console.log(`\nDONE: ${ok}/${results.length} videos v2 generated`);
}

main().catch((e) => { console.error(e); process.exit(1); });
