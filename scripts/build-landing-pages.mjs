#!/usr/bin/env node
// =============================================================================
// SONGZY — programmatic SEO landing-page generator
//
// Reads content/landing-keywords/master.csv and emits one HTML file per row
// at the repo root. Each landing page is a slim, fast-loading variant of the
// main site, focused on a single high-intent keyword cluster. Generated pages
// are flagged with a marker comment so they can be regenerated cleanly.
//
// Run:   node scripts/build-landing-pages.mjs
// or:    npm run build-landings
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');
const CSV_PATH   = path.join(ROOT, 'content/landing-keywords/master.csv');

const GENERATED_MARKER = '<!-- SONGZY:GENERATED-LANDING-PAGE -->';

function csvParseSimple(text) {
  // Minimal CSV parser supporting quoted fields with commas inside. Not RFC-perfect,
  // but enough for our controlled inputs.
  const rows = [];
  let i = 0, field = '', row = [], inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
      if (c === '"') { inQuotes = false; i++; continue; }
      field += c; i++;
    } else {
      if (c === '"') { inQuotes = true; i++; continue; }
      if (c === ',') { row.push(field); field = ''; i++; continue; }
      if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
      if (c === '\r') { i++; continue; }
      field += c; i++;
    }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function csvToObjects(text) {
  const rows = csvParseSimple(text).filter((r) => r.some((c) => c.trim() !== ''));
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (r[i] || '').trim(); });
    return obj;
  });
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function tierPriceLabel(tier, lang) {
  const en = { quick: '€19', personal: '€39', premium: '€69' };
  const it = { quick: '€19', personal: '€39', premium: '€69' };
  const map = lang === 'it' ? it : en;
  return map[tier] || '€19';
}

function ctaLabel(lang) {
  return lang === 'it' ? 'Inizia ora' : 'Start your song';
}

function listenLabel(lang) {
  return lang === 'it' ? 'Ascolta un esempio' : 'Listen to an example';
}

function trustLine(lang) {
  return lang === 'it'
    ? 'Da €19 · Pronta in 2 ore · Riscrittura gratuita · Rimborso se non va'
    : 'From €19 · Ready in 2 hours · Free rewrite · Full refund if not right';
}

function howLabel(lang) {
  return lang === 'it' ? 'Come funziona' : 'How it works';
}

function whatYouGetLabel(lang) {
  return lang === 'it' ? 'Cosa ricevi' : 'What you get';
}

function howSteps(lang) {
  return lang === 'it'
    ? [
        ['Ordina', 'Scegli il tier che vuoi.'],
        ['Raccontaci', 'Cinque minuti, dieci domande.'],
        ['Scriviamo', 'Componiamo originale, ti aggiorniamo.'],
        ['Premi play', 'Canzone in casella in 1.5-3 ore.'],
      ]
    : [
        ['Order', 'Pick the tier you want.'],
        ['Tell us the story', 'Five minutes, ten questions.'],
        ['We write', 'Original lyrics + production, with updates.'],
        ['Press play', 'Song in your inbox in 1.5-3 hours.'],
      ];
}

function whatYouGet(lang) {
  return lang === 'it'
    ? [
        'Una canzone originale (~3 minuti)',
        'MP3 320kbps + WAV (Personal/Premium)',
        'Video con i testi (Personal/Premium)',
        'Video musicale dalle tue foto (Premium)',
        'Licenza uso privato (matrimonio, compleanno, memoriale)',
      ]
    : [
        'A complete original song (~3 minutes)',
        'MP3 320kbps + WAV (Personal/Premium)',
        'Lyric video (Personal/Premium)',
        'Music video from your photos (Premium)',
        'Private use license (wedding, birthday, memorial)',
      ];
}

function buildHtml(row) {
  const lang = row.language || 'en';
  const slug = row.slug;
  const audioFile = `${row.audio_sample || 'unbreakable-rooms'}.mp3`;
  const coverFile = `${row.audio_sample || 'unbreakable-rooms'}.jpg`;
  const tier = row.tier_default || 'personal';
  const price = tierPriceLabel(tier, lang);
  const trustL = trustLine(lang);
  const cta = ctaLabel(lang);
  const listenL = listenLabel(lang);
  const howL = howLabel(lang);
  const wyg = whatYouGetLabel(lang);
  const steps = howSteps(lang);
  const wygItems = whatYouGet(lang);

  const checkoutUrl = `/checkout.html?tier=${tier}&from=${slug}`;

  return `<!DOCTYPE html>
${GENERATED_MARKER}
<!--
  SONGZY landing page — ${slug}
  Generated by scripts/build-landing-pages.mjs
  DO NOT EDIT MANUALLY — regenerate via: npm run build-landings
  Primary keyword: ${row.primary_keyword}
-->
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(row.h1)} — Songzy</title>
  <meta name="description" content="${escapeHtml(row.meta_description)}">

  <link rel="canonical" href="https://songzy.eu/${slug}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(row.h1)} — Songzy">
  <meta property="og:description" content="${escapeHtml(row.meta_description)}">
  <meta property="og:url" content="https://songzy.eu/${slug}">
  <meta property="og:image" content="https://songzy.eu/assets/covers/${coverFile}">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="/logo-songzy.jpg" type="image/jpeg">

  <!-- Analytics + consent bootstrap -->
  <script src="/api/env.js"></script>
  <script defer src="/scripts/analytics.js"></script>

  <!-- TikTok Pixel Code (inline for TikTok crawler verification) -->
  <script>
  !function (w, d, t) {
    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
  var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
  ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
    ttq.load('D8BE4JJC77U5H2VHI250');
    ttq.page();
  }(window, document, 'ttq');
  </script>

  <!-- JSON-LD: Product + WebPage + BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": ${JSON.stringify(row.h1)},
    "description": ${JSON.stringify(row.meta_description)},
    "image": "https://songzy.eu/assets/covers/${coverFile}",
    "brand": { "@type": "Brand", "name": "Songzy" },
    "offers": {
      "@type": "Offer",
      "url": "https://songzy.eu/${slug}",
      "priceCurrency": "EUR",
      "price": "${tier === 'quick' ? '19' : tier === 'premium' ? '69' : '39'}",
      "availability": "https://schema.org/InStock"
    }
  }
  </script>

  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600;1,9..144,700&family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --orange: #FF6B35;
      --pink:   #E91E8C;
      --purple: #7B2FF7;
      --gradient: linear-gradient(135deg, var(--orange), var(--pink), var(--purple));
      --bg:      #0B0B14;
      --surface: rgba(255,255,255,.03);
      --surface-2: rgba(255,255,255,.05);
      --border:  rgba(255,255,255,.10);
      --text:    #ECECF4;
      --text-soft: #B8B8CC;
      --text-muted: #8E8EA8;
      --font-display: 'Fraunces', 'Playfair Display', Georgia, serif;
      --font-body:    'Geist', 'Manrope', system-ui, -apple-system, sans-serif;
    }
    html, body { background: var(--bg); color: var(--text); font-family: var(--font-body); -webkit-font-smoothing: antialiased; }
    a { color: inherit; text-decoration: none; }
    img { display: block; max-width: 100%; height: auto; }
    button { font: inherit; cursor: pointer; border: 0; background: transparent; color: inherit; }

    .nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(11,11,20,.85); backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border);
    }
    .nav__inner { max-width: 1180px; margin: 0 auto; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .nav__logo { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 700; font-size: 1.4rem; }
    .nav__logo span { background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .nav__cta { padding: 10px 22px; border-radius: 999px; background: var(--gradient); font-weight: 600; font-size: .9rem; white-space: nowrap; box-shadow: 0 6px 20px -8px rgba(233,30,140,.55); }

    .hero { padding: 80px 24px 64px; text-align: center; position: relative; overflow: hidden; }
    .hero::before { content:''; position: absolute; inset:0; pointer-events:none; background: radial-gradient(ellipse at 50% 30%, rgba(123,47,247,.18) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(233,30,140,.12) 0%, transparent 55%); z-index:-1; }
    .hero__inner { max-width: 820px; margin: 0 auto; }
    .hero__eyebrow { display: inline-block; font-size: .78rem; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 24px; }
    .hero__title { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.4rem); font-weight: 700; line-height: 1.07; letter-spacing: -.035em; margin-bottom: 22px; font-variation-settings: 'opsz' 144; }
    .hero__title em { font-style: italic; font-weight: 600; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero__sub { font-size: 1.15rem; line-height: 1.6; color: var(--text-soft); margin: 0 auto 36px; max-width: 580px; }
    .hero__ctas { display: inline-flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: center; }
    .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 18px 38px; border-radius: 14px; background: var(--gradient); font-size: 1.05rem; font-weight: 700; color: #fff; box-shadow: 0 14px 40px -10px rgba(233,30,140,.55); transition: transform .25s ease, box-shadow .25s ease; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 50px -10px rgba(233,30,140,.7); }
    .btn-secondary { padding: 17px 32px; border-radius: 14px; border: 1px solid var(--border); font-size: 1rem; font-weight: 500; color: var(--text-soft); transition: background .25s ease, color .25s ease; }
    .btn-secondary:hover { background: var(--surface-2); color: var(--text); }
    .hero__trust { margin-top: 28px; font-size: .88rem; color: var(--text-muted); }

    .sample { padding: 56px 24px; }
    .sample__inner { max-width: 720px; margin: 0 auto; padding: 28px; background: var(--surface); border: 1px solid var(--border); border-radius: 22px; display: flex; gap: 22px; align-items: center; }
    .sample__cover { width: 120px; height: 120px; border-radius: 12px; object-fit: cover; flex-shrink: 0; box-shadow: 0 18px 40px -12px rgba(0,0,0,.5); }
    .sample__info { flex: 1; min-width: 0; }
    .sample__label { font-size: .76rem; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
    .sample__title { font-family: var(--font-display); font-style: italic; font-weight: 600; font-size: 1.4rem; line-height: 1.2; margin-bottom: 14px; }
    .sample audio { width: 100%; max-width: 360px; }
    @media (max-width: 640px) {
      .sample__inner { flex-direction: column; text-align: center; padding: 24px 18px; }
      .sample__cover { width: 88px; height: 88px; }
    }

    .grid { padding: 72px 24px; }
    .grid__inner { max-width: 980px; margin: 0 auto; }
    .grid__header { text-align: center; margin-bottom: 48px; }
    .grid__eyebrow { display: inline-block; font-size: .78rem; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 14px; }
    .grid__title { font-family: var(--font-display); font-size: clamp(1.7rem, 4vw, 2.4rem); font-weight: 700; letter-spacing: -.03em; }
    .grid__title em { font-style: italic; font-weight: 600; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    @media (max-width: 800px) { .steps { grid-template-columns: repeat(2, 1fr); } }
    .step { padding: 24px 22px; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; }
    .step__num { font-family: var(--font-display); font-size: 2.4rem; font-weight: 700; letter-spacing: -.04em; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; margin-bottom: 12px; }
    .step__title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; margin-bottom: 6px; }
    .step__body { font-size: .92rem; color: var(--text-soft); line-height: 1.5; }

    .features { list-style: none; padding: 0; max-width: 580px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; }
    .features li { display: flex; gap: 12px; align-items: flex-start; padding: 18px 22px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; }
    .features li::before { content: '✓'; color: var(--orange); font-weight: 700; flex-shrink: 0; }

    .cta-band { padding: 88px 24px 96px; text-align: center; background: radial-gradient(ellipse at 50% 30%, rgba(123,47,247,.20) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(233,30,140,.16) 0%, transparent 55%), var(--bg); }
    .cta-band__title { font-family: var(--font-display); font-size: clamp(1.8rem, 4.5vw, 2.8rem); font-weight: 700; letter-spacing: -.035em; margin-bottom: 16px; max-width: 700px; margin-inline: auto; }
    .cta-band__title em { font-style: italic; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .cta-band__sub { font-size: 1.1rem; color: var(--text-soft); margin-bottom: 34px; max-width: 520px; margin-inline: auto; line-height: 1.6; }
    .cta-band__trust { margin-top: 22px; font-size: .88rem; color: var(--text-muted); }

    .footer { padding: 36px 24px; border-top: 1px solid var(--border); text-align: center; color: var(--text-muted); font-size: .85rem; }
    .footer a { color: var(--text-soft); border-bottom: 1px solid var(--border); }
    .footer a:hover { color: var(--pink); border-color: var(--pink); }
    .footer__links { display: inline-flex; gap: 18px; flex-wrap: wrap; justify-content: center; margin-bottom: 12px; }
  </style>
</head>
<body>

<nav class="nav">
  <div class="nav__inner">
    <a href="/" class="nav__logo">
      <img src="/logo-songzy.jpg" alt="Songzy" width="36" height="36" style="border-radius:8px;"/>
      <span>Songzy</span>
    </a>
    <a href="${checkoutUrl}" class="nav__cta" data-cta="nav" data-tier="${tier}" data-from="${slug}">${cta}</a>
  </div>
</nav>

<section class="hero">
  <div class="hero__inner">
    <p class="hero__eyebrow">${escapeHtml(row.intent_phrase || '')}</p>
    <h1 class="hero__title">${escapeHtml(row.h1).replace(/\bFrom\b/g, '<em>From</em>').replace(/\bDalla?\b/gi, (m) => `<em>${m}</em>`)}</h1>
    <p class="hero__sub">${escapeHtml(row.subtitle || '')}</p>
    <div class="hero__ctas">
      <a class="btn-primary" href="${checkoutUrl}" data-cta="hero" data-tier="${tier}" data-from="${slug}">
        ${cta} — ${price}
      </a>
      <a class="btn-secondary" href="#sample">${listenL}</a>
    </div>
    <p class="hero__trust">${trustL}</p>
  </div>
</section>

<section class="sample" id="sample">
  <div class="sample__inner">
    <img class="sample__cover" src="/assets/covers/${coverFile}" alt="Songzy sample cover" loading="lazy"/>
    <div class="sample__info">
      <div class="sample__label">${lang === 'it' ? 'Esempio reale' : 'Real sample'}</div>
      <div class="sample__title">${escapeHtml(row.h1).split(' From ')[0].split(' Dalla ')[0]}</div>
      <audio controls preload="none" src="/assets/audio/${audioFile}"></audio>
    </div>
  </div>
</section>

<section class="grid">
  <div class="grid__inner">
    <header class="grid__header">
      <span class="grid__eyebrow">${howL.toUpperCase()}</span>
      <h2 class="grid__title"><em>${howL}</em></h2>
    </header>
    <div class="steps">
      ${steps.map((s, i) => `<div class="step"><div class="step__num">0${i+1}</div><div class="step__title">${escapeHtml(s[0])}</div><div class="step__body">${escapeHtml(s[1])}</div></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="grid" style="padding-top:0;">
  <div class="grid__inner">
    <header class="grid__header">
      <span class="grid__eyebrow">${wyg.toUpperCase()}</span>
      <h2 class="grid__title"><em>${wyg}</em></h2>
    </header>
    <ul class="features">
      ${wygItems.map((f) => `<li>${escapeHtml(f)}</li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="cta-band">
  <h2 class="cta-band__title">${lang === 'it' ? 'Pronto a <em>iniziare</em>?' : 'Ready to <em>start</em>?'}</h2>
  <p class="cta-band__sub">${escapeHtml(row.subtitle || '')}</p>
  <a class="btn-primary" href="${checkoutUrl}" data-cta="band" data-tier="${tier}" data-from="${slug}">${cta} — ${price}</a>
  <p class="cta-band__trust">${trustL}</p>
</section>

<footer class="footer">
  <div class="footer__links">
    <a href="/">Home</a>
    <a href="/#audio-examples">${lang === 'it' ? 'Esempi' : 'Examples'}</a>
    <a href="/#pricing">${lang === 'it' ? 'Prezzi' : 'Pricing'}</a>
    <a href="/#faq">FAQ</a>
    <a href="/privacy.html">Privacy</a>
    <a href="/terms.html">Terms</a>
    <a href="/refund.html">${lang === 'it' ? 'Rimborsi' : 'Refund'}</a>
  </div>
  <div>&copy; 2026 Songzy · ${lang === 'it' ? 'Una canzone scritta dalle tue parole' : 'A song written from your words'}</div>
</footer>

<script>
  // Wire songzyTrack on every CTA so the events flow to GA4/Meta/TikTok pixels
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-cta]');
    if (!el) return;
    var payload = {
      tier: el.getAttribute('data-tier') || '',
      from: el.getAttribute('data-from') || '',
      cta:  el.getAttribute('data-cta')  || '',
      page: '${slug}',
    };
    if (typeof window.songzyTrack === 'function') {
      window.songzyTrack('landing_cta_click', payload);
    }
  });

  // Mark page_view for landing (fires once after analytics bootstrap)
  setTimeout(function () {
    if (typeof window.songzyTrack === 'function') {
      window.songzyTrack('landing_view', { slug: '${slug}', keyword: ${JSON.stringify(row.primary_keyword)} });
    }
  }, 800);
</script>

</body>
</html>
`;
}

async function main() {
  const csv = await fs.readFile(CSV_PATH, 'utf-8');
  const rows = csvToObjects(csv);
  if (!rows.length) {
    console.error('[build-landings] no rows in CSV');
    process.exit(1);
  }

  let generated = 0;
  let skipped   = 0;

  for (const row of rows) {
    if (!row.slug) { skipped++; continue; }
    const outPath = path.join(ROOT, `${row.slug}.html`);
    // Safety: never overwrite a hand-edited file. Check for marker.
    try {
      const existing = await fs.readFile(outPath, 'utf-8');
      if (!existing.includes(GENERATED_MARKER)) {
        console.warn(`[build-landings] SKIP ${row.slug}.html (hand-edited, no marker)`);
        skipped++;
        continue;
      }
    } catch (e) { /* file doesn't exist, will create */ }

    const html = buildHtml(row);
    await fs.writeFile(outPath, html, 'utf-8');
    generated++;
  }

  console.log(`[build-landings] generated ${generated} pages, skipped ${skipped}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
