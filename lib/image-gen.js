// Image generation via Pollinations.ai (free, no API key required).
// Docs: https://github.com/pollinations/pollinations/blob/master/APIDOCS.md
//
// Pollinations returns a JPEG directly when you GET their /prompt/<encoded-prompt> URL.
// We provide a helper that builds the URL with proper params, and another that
// downloads bytes into a Buffer for upload to Pinterest/Buffer/Blob.

const POLL_BASE = 'https://image.pollinations.ai/prompt';

/**
 * imageUrl — builds a Pollinations URL for an image generated from the prompt.
 * The image is generated on-demand when the URL is fetched. It's cached at
 * Pollinations CDN for ~24h.
 *
 * @param {string} prompt - the text description
 * @param {object} opts
 * @param {number} [opts.width=1024]
 * @param {number} [opts.height=1024]
 * @param {string} [opts.model='flux'] - flux | turbo | flux-realism | flux-anime | etc.
 * @param {number} [opts.seed] - deterministic seed (same prompt + seed = same image)
 * @param {boolean} [opts.nologo=true] - hide Pollinations watermark
 * @param {boolean} [opts.enhance=true] - LLM-enhanced prompt for better quality
 * @returns {string} URL
 */
export function imageUrl(prompt, { width = 1024, height = 1024, model = 'flux', seed, nologo = true, enhance = true } = {}) {
  const qs = new URLSearchParams();
  qs.set('width',  String(width));
  qs.set('height', String(height));
  qs.set('model',  model);
  if (seed !== undefined) qs.set('seed', String(seed));
  if (nologo) qs.set('nologo', 'true');
  if (enhance) qs.set('enhance', 'true');
  return `${POLL_BASE}/${encodeURIComponent(prompt)}?${qs.toString()}`;
}

/**
 * imageBuffer — downloads the generated image as a Buffer (for upload to
 * Pinterest/Buffer/Blob etc.).
 *
 * @returns {Promise<{buffer: Buffer, contentType: string, sizeBytes: number}>}
 */
export async function imageBuffer(prompt, opts = {}) {
  const url = imageUrl(prompt, opts);
  const resp = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!resp.ok) throw new Error(`Pollinations failed: ${resp.status}`);
  const ab = await resp.arrayBuffer();
  return {
    buffer: Buffer.from(ab),
    contentType: resp.headers.get('content-type') || 'image/jpeg',
    sizeBytes: ab.byteLength,
  };
}

/**
 * imageBase64 — same as imageBuffer but returns base64-encoded string for
 * Pinterest API's image_base64 source_type.
 */
export async function imageBase64(prompt, opts = {}) {
  const { buffer, contentType } = await imageBuffer(prompt, opts);
  return {
    base64: buffer.toString('base64'),
    contentType,
  };
}

// ----------------------- Songzy brand prompt helpers ---------------------

/**
 * brandPinterestPrompt — wraps a scene description with the Songzy brand
 * visual language for Pinterest pins (2:3 portrait, dark cinematic, warm light).
 */
export function brandPinterestPrompt(scene, { mood = 'warm' } = {}) {
  const palettes = {
    warm:    'warm golden hour lighting, gradient orange to pink to deep purple, dark cinematic background',
    quiet:   'soft muted palette, deep blue and cream, dignified low light, soft warm candlelight',
    elegant: 'elegant soft pastel palette, cream and dusty rose, gentle window light',
    night:   'night scene, deep navy and amethyst, subtle gold accents, intimate low light',
  };
  const palette = palettes[mood] || palettes.warm;
  return `${scene}. Pinterest pin 2:3 portrait composition, photorealistic, ${palette}, shallow depth of field, magazine quality, no text overlay, no logo, no watermark`;
}

/**
 * brandInstagramSquarePrompt — IG square 1:1.
 */
export function brandInstagramSquarePrompt(scene, { mood = 'warm' } = {}) {
  return brandPinterestPrompt(scene, { mood }).replace('2:3 portrait', '1:1 square');
}

export const PIN_DIMENSIONS = { width: 1024, height: 1536 };       // 2:3
export const IG_SQUARE_DIMENSIONS = { width: 1080, height: 1080 }; // 1:1
export const IG_STORY_DIMENSIONS  = { width: 1080, height: 1920 }; // 9:16
