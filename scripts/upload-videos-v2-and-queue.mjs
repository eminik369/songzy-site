#!/usr/bin/env node
// Upload v2 viral videos to Blob and add to Buffer queue with viral-style captions.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { put } from '@vercel/blob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const VIDEO_INDEX = path.join(ROOT, 'content/social-queue/videos-v2/index.json');
const QUEUE_PATH = path.join(ROOT, 'content/social-queue/buffer-posts.json');

// Caption pack — TikTok-flavored, hook reinforces video hook, comments-bait, conversion-friendly
const CAPTIONS = {
  'v2-001': {
    tiktok: `She read it once. Then made me listen 4 more times 🥹\n\nCustom songs from your story — 4 lines is all you need.\n\nLink in bio → songzy.eu (from €19)\n\n#personalizedsong #anniversarygift #marriedlife #songgift #weddinggift #couplegoals #fyp #foryou #handmadegift #romantic`,
    instagram: `4 lines about us → a song → his face.\n\nThat's all it took. We didn't write the lyrics. We told them what to write about (the coffee thing he does, our daughter's name, the dishwasher fight that's been going for 8 years).\n\n€45. Ready in 2 hours. He played it 4 times in a row.\n\nLink in bio → songzy.eu\n\n#personalizedsong #customsong #anniversarygift #weddingsong #couplesofinstagram #marriedlife #songgift #handmadegift #uniquegift #songfromyourwords`,
  },
  'v2-002': {
    tiktok: `Wedding gift that made the whole room cry 😭\n\nCustom first dance song from your love story. Ready 7 days before your day.\n\nLink in bio → songzy.eu (from €19)\n\n#weddingsong #firstdance #bridetobe #weddingplanning #weddinggift #personalizedsong #fyp #foryou #weddinginspiration #songgift`,
    instagram: `Wedding gift idea that made the entire reception go silent.\n\nA first dance song written from THEIR story (the silly fight in the Italian restaurant, the dog they got two months in, the moment he proposed in the kitchen). Original lyrics, real production.\n\nReady 7 days before. From €19.\n\nLink in bio → songzy.eu\n\n#weddingsong #firstdance #weddingplanning #weddinginspiration #personalizedweddinggift #bridetobe #weddinggift #customsong #songzy #weddingideas`,
  },
  'v2-003': {
    tiktok: `My 65-year-old dad never cries.\n\nThis broke him 🥹\n\nCustom song from his life story for his 70th birthday.\n\nLink in bio → songzy.eu (from €19)\n\n#dadgift #birthdaygift #personalizedsong #songgift #fyp #foryou #parentsgift #emotional #unique #handmadegift`,
    instagram: `My dad never cries. He's the kind of dad who waters the plants in silence and answers the phone like he's bracing for bad news.\n\nFor his 70th I wrote 6 lines about him — the mechanic shop he ran for 40 years, the Ford Fiesta he taught me to drive in, the way he still calls me "kid" — and sent them to Songzy.\n\nHe listened. Then called his sister and asked her to play it on speakerphone.\n\nFrom €19. Link in bio → songzy.eu\n\n#dadgift #birthdaygift #parentsday #personalizedsong #fathersday #unique #songgift #handmadegift #emotional #songzy`,
  },
};

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN missing');
    process.exit(2);
  }

  const videos = JSON.parse(await fs.readFile(VIDEO_INDEX, 'utf-8'));
  const queue = JSON.parse(await fs.readFile(QUEUE_PATH, 'utf-8'));

  for (const v of videos) {
    const localPath = path.join(ROOT, v.video_file);
    const data = await fs.readFile(localPath);
    const blobKey = `social/videos-v2/${path.basename(v.video_file)}`;
    const { url } = await put(blobKey, data, {
      access: 'public', contentType: 'video/mp4',
      addRandomSuffix: false, allowOverwrite: true,
    });
    console.log(`✓ ${v.video_file} → ${url}`);

    const captions = CAPTIONS[v.post_id] || {
      tiktok: `Custom songs from your story → songzy.eu (from €19)\n\n#personalizedsong #songgift #songzy #fyp #foryou`,
      instagram: `Custom songs from your story.\n\nLink in bio → songzy.eu\n\n#personalizedsong #songgift #songzy`,
    };

    // TikTok entry
    queue.push({
      post_id: `tt-v2-${v.post_id}`,
      platform: 'tiktok',
      caption: captions.tiktok,
      hashtags: [],
      video_url: url,
      image_url: null,
      mood: 'warm',
      scheduled_at: null,
      status: 'queued',
      buffer_post_id: null,
      audio_source: v.audio_source,
      style: 'viral_v2',
    });

    // Instagram Reel entry
    queue.push({
      post_id: `ig-v2-${v.post_id}`,
      platform: 'instagram',
      caption: captions.instagram,
      hashtags: [],
      video_url: url,
      image_url: null,
      mood: 'warm',
      scheduled_at: null,
      status: 'queued',
      buffer_post_id: null,
      instagram_type: 'reel',
      audio_source: v.audio_source,
      style: 'viral_v2',
    });
  }

  await fs.writeFile(QUEUE_PATH, JSON.stringify(queue, null, 2), 'utf-8');
  console.log(`\nDONE: ${videos.length * 2} v2 entries added to queue`);
}

main().catch((e) => { console.error(e); process.exit(1); });
