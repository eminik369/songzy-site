# Songzy Marketing Automation — Status

> Stato del lavoro al 2026-05-26. Aggiornato ad ogni batch del loop.

---

## ✅ COMPLETATO (asset live nel repo)

### Content statico SEO (deploy on next push)
- **50 programmatic landing pages** (root del repo, slug come `/wedding-song`, `/anniversary-song`, `/canzone-personalizzata`, ecc.)
  - EN: 35 pagine
  - IT: 15 pagine
  - Ognuna: hero focalizzato, audio sample, 4-step process, CTA, JSON-LD Product schema, canonical, OG tags
- **4 blog post** (in `/blog/`)
  - `how-to-write-a-personalized-song-brief` (educational, ~2500 words)
  - `anniversary-gift-ideas-that-make-them-cry` (gift guide, ~3000 words)
  - `custom-wedding-song-ideas` (real stories, ~3500 words)
  - `birthday-gift-ideas-for-mom-she-will-actually-keep` (gift guide, ~2500 words)
- **Sitemap.xml** con 59 URL (auto-rigenerato ad ogni build)
- **Robots.txt** che permette crawling e punta alla sitemap

### Infrastruttura automation (script + libs)
- `lib/pinterest.js` — Pinterest API v5 client (richiede `PINTEREST_ACCESS_TOKEN`)
- `lib/buffer.js` — Buffer API v1 client (richiede `BUFFER_ACCESS_TOKEN`)
- `lib/image-gen.js` — Pollinations.ai image generator (gratis, no API key)
- `scripts/build-landing-pages.mjs` — genera landing pages da CSV
- `scripts/build-sitemap.mjs` — genera sitemap.xml + robots.txt + ping Google/Bing
- `scripts/parse-pin-pack.mjs` — converte sales/pinterest/pin-pack.md in JSON queue
- `scripts/publish-pinterest-next.mjs` — publishes 1 pin from queue via API
- `scripts/publish-buffer-next.mjs` — schedules 1 social post via Buffer API
- `db/schema-automation.sql` — Postgres tables per leads, email_sends, blog_posts, keyword_bank, social_posts, ads_campaigns

### Content queues (pronti da pubblicare appena chiavi inserite)
- `content/social-queue/pinterest-pins.json` — **50 pin queued** per upload Pinterest
- `content/social-queue/buffer-posts.json` — **5 IG + 1 TikTok + 1 Pinterest seed**

### Sales pack documenti pronti (oggi non si usano direttamente — utente non vuole Etsy/manual)
- `sales/etsy-listings.md` — 3 listing Etsy completi (parked, utente ha detto no Etsy)
- `sales/google-ads/campaign-setup.md` — campaign Google Ads completa con keyword/copy/budget
- `sales/pinterest/pin-pack.md` — 50 pin spec (source di pinterest-pins.json)
- `sales/reddit-quora/answer-pack.md` — 50 risposte Reddit/Quora (parked, manual posting)

---

## ⏳ IN ATTESA — chiavi che mi servono per attivare i sistemi

| Chiave | Sblocca | Priorità |
|---|---|---|
| `PINTEREST_ACCESS_TOKEN` | Pinterest auto-publish (50 pin pronti) | 🔴 alta |
| `BUFFER_ACCESS_TOKEN` | IG/TikTok/FB scheduling (7 post seed pronti) | 🔴 alta |
| `NEXT_PUBLIC_GA4_ID` | Tracking + report performance | 🟡 media |
| `GOOGLE_ADS_*` (5 chiavi) | Auto-launch Google Ads campaign + conversion tracking | 🟢 bassa (€400 credit gratis) |

---

## 🔄 PROSSIMI BATCH NEL LOOP (quando chiavi attive)

### Batch 1 (ora 0)
- Pinterest: 1 pin pubblicato (`pin-001` — wedding first dance)
- Buffer IG: 1 post scheduled (`ig-001`)
- Update sitemap + commit + push

### Batch 2 (ora +1h)
- Pinterest: 1 pin (`pin-002`)
- Buffer IG: 1 post (`ig-002`)

### ... continua ad oltranza ...

### Batch ~50 (giorno 2-3)
- Pool Pinterest si svuota → notifica founder via email
- Founder apre Claude → "continua refill marketing Songzy"
- Io rigenero altri 30 pin + 20 social post in 30 min
- Loop riprende

---

## 📊 KPI TRACCIATI (con chiavi attive)

- **Pinterest**: impressions, outbound clicks, saves per pin
- **Buffer**: engagement per post per piattaforma
- **Sito**: GA4 page views, conversion rate, top landing pages
- **Google Ads**: spend, CPA, ROAS per ad group
- **Vendite Stripe**: per source/medium/campaign UTM

---

## 🎯 OBIETTIVI A 30 GIORNI

(Stima onesta, non promessa)

| Canale | Output | Risultato atteso |
|---|---|---|
| 50 landing SEO + 30 blog post | 80+ URL indicizzati Google | 200-500 visite/mese organiche da Google (mese 1, cresce) |
| 50 Pinterest pin (3/giorno) | 50 pin live su Pinterest | 2k-10k impressions/mese, 50-200 outbound click |
| 30 IG/TikTok post (1/giorno via Buffer) | 30 post live | Variabile (account nuovo cresce lento) |
| Google Ads (se attivato, €300 budget) | ~300 click | 2-12 vendite stimate |

Mese 1 è il mese di seed. Mese 2-3 cresce esponenzialmente man mano che:
- Google indicizza i 80+ contenuti
- Pinterest accumula impressions
- Recurring buyers iniziano

---

## 🚀 COME FAR PARTIRE IL LOOP

Quando hai inserito le 3 chiavi (`PINTEREST_ACCESS_TOKEN`, `BUFFER_ACCESS_TOKEN`, `NEXT_PUBLIC_GA4_ID`) in Vercel ENV:

1. Apri Claude Code (questa sessione o nuova)
2. Digita: `/loop 1h marketing-songzy-batch`
3. Lascia il computer aperto
4. Io eseguo un batch ogni ora, all'infinito

Vedi `sales/LOOP-INSTRUCTIONS.md` per il dettaglio completo del comportamento del loop.
