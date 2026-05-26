# Songzy Loop — istruzioni per l'autopilot infinito

> Quando vuoi che io lavori in loop continuo, digita un comando `/loop` e questo file mi dice cosa fare ad ogni wakeup.

---

## COMANDO PER ATTIVARE IL LOOP

Alla fine di una sessione, digita uno di questi:

```
/loop 1h marketing-songzy-batch
```
→ Mi sveglio ogni ora, eseguo un batch (vedi sotto). Va avanti finché tu non fermi (Ctrl+C o /stop).

```
/loop 4h marketing-songzy-batch
```
→ Mi sveglio ogni 4 ore. Più conservativo, brucia meno API quota.

```
/loop continua marketing songzy
```
→ Mi auto-paco (decido io quando svegliarmi in base a quanto lavoro c'è da fare).

---

## COSA FA OGNI BATCH (ad ogni wakeup)

In ordine di priorità. Salta i passi se l'env var richiesta manca.

### 1. Pinterest publish — 1 pin (richiede `PINTEREST_ACCESS_TOKEN`)
```bash
node scripts/publish-pinterest-next.mjs
```
- Prende il prossimo pin "queued" da `content/social-queue/pinterest-pins.json`
- Genera immagine via Pollinations.ai (gratis)
- Upload a Pinterest via API v5
- Marca posted nel JSON
- **Risultato atteso**: 1 pin pubblicato per batch

### 2. Buffer schedule — 1 post (richiede `BUFFER_ACCESS_TOKEN`)
```bash
node scripts/publish-buffer-next.mjs
```
- Prende il prossimo post "queued" da `content/social-queue/buffer-posts.json`
- Genera immagine se serve
- Schedula su Buffer (IG/TikTok/Facebook/Pinterest)
- **Risultato atteso**: 1 post programmato per batch

### 3. Check pool — refill se basso
- Conta pin "queued" in pinterest-pins.json
- Se < 10 queued → **rigenero 30 pin nuovi** (nel mio prossimo turno generation)
- Conta IG/TikTok in buffer-posts.json
- Se < 5 queued → **rigenero 20 social post nuovi**

### 4. Blog generation — 1 nuovo blog post se serve
- Conta blog in `/blog/*.html`
- Se < 20 → genero 1 nuovo blog post (~2500 words)
- Se ≥ 20 → skip (focus su social)

### 5. Sitemap + commit + push
```bash
SITEMAP_NO_PING=1 node scripts/build-sitemap.mjs
git add -A && git commit -m "loop: $(date +%Y-%m-%d-%H%M) batch update" && git push
```
- Aggiorna sitemap.xml
- Commit + push → Vercel auto-deploy
- **Risultato atteso**: sito aggiornato, nuovi contenuti live

### 6. Performance check (richiede `GA4_*` keys, opzionale)
- Query GA4 API per ultime 24h conversion
- Email founder se >0 vendite o se traffico spike

### 7. Google Ads check (richiede `GOOGLE_ADS_*` keys, opzionale)
- Query daily spend + conversion
- Pause keyword con CPA > €40 e zero conversion in 30+ click
- Email founder se budget esaurito o anomalie

---

## BUDGET TEMPO PER BATCH

- Step 1 (Pinterest): 30-60 sec
- Step 2 (Buffer): 20-40 sec
- Step 3 (pool check): 10 sec (genero solo se serve, ed è skipato in batch normali)
- Step 4 (blog gen): se attivato, 3-10 min
- Step 5 (deploy): 30-60 sec
- Step 6-7 (analytics): 30 sec

**Batch normale = 2-4 min totale**. Batch di refill = 10-30 min.

---

## STATO ATTUALE DEL POOL (aggiornato 2026-05-26)

| Pool | Queued | Posted | Target |
|---|---|---|---|
| Pinterest pins | 50 | 0 | mantieni > 20 queued |
| Buffer IG posts | 5 | 0 | mantieni > 10 |
| Buffer TikTok posts | 1 | 0 | mantieni > 5 |
| Buffer Pinterest (via Buffer) | 1 | 0 | (opzionale, default è API direct) |
| Blog posts pubblicati | 4 | — | mantieni > 20 totali |
| Landing pages | 50 | — | (statiche, rigenera quando aggiungi keyword) |

---

## QUANDO IL POOL SI SVUOTA

Notifica via email founder con:
- "Pool basso: Pinterest 4 queued, Buffer IG 2 queued"
- "Apri Claude Code, digita: continua refill marketing Songzy"

Io vedo l'email, rigenero ~30 pin + 20 IG post + 1-2 blog post in 30-45 min, poi riprendo il loop normale.

---

## CHIAVI ENV CRITICHE (status)

Da inserire in Vercel ENV via `vercel env add <KEY> <VALUE>` (production scope). Dopo redeploy automatico.

| Chiave | Status | Priorità | Cosa sblocca |
|---|---|---|---|
| `PINTEREST_ACCESS_TOKEN` | ⏳ TODO | 🔴 ALTA | Pinterest auto-publish |
| `BUFFER_ACCESS_TOKEN` | ⏳ TODO | 🔴 ALTA | IG/TikTok scheduling |
| `NEXT_PUBLIC_GA4_ID` | ⏳ TODO | 🟡 MEDIA | Tracking + reports |
| `RESEND_API_KEY` | ✅ DONE | — | Email (già OK) |
| `STRIPE_*` | ✅ DONE | — | Pagamenti (già OK) |
| `POSTGRES_*` | ✅ DONE | — | DB (già OK) |
| `BLOB_READ_WRITE_TOKEN` | ✅ DONE | — | Upload immagini (già OK) |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | ⏳ TODO | 🟢 BASSA | Ads automation (approval 24-48h) |
| `GOOGLE_ADS_CUSTOMER_ID` | ⏳ TODO | 🟢 BASSA | Ads target account |
| `GOOGLE_ADS_REFRESH_TOKEN` | ⏳ TODO | 🟢 BASSA | OAuth Google Ads |
| `GOOGLE_ADS_CONVERSION_ID` + `LABEL` | ⏳ TODO | 🟢 BASSA | Conversion tracking |
| `NEXT_PUBLIC_META_PIXEL_ID` | ⏳ TODO | 🟢 BASSA | FB Pixel retargeting (no ads ma utile) |
| `NEXT_PUBLIC_PINTEREST_TAG_ID` | ⏳ TODO | 🟢 BASSA | Pinterest tag su sito |
| `HUNTER_API_KEY` | ❌ NON SERVE | — | (cold email annullato) |
| `ANTHROPIC_API_KEY` | ❌ NON SERVE | — | (Claude Code sono io) |

---

## COMANDO RAPIDO MENTRE STO LOOPING

Se vuoi che faccia qualcosa di specifico immediatamente (saltando il batch normale):

- `pinterest now` → pubblico 5 pin subito
- `blog now <argomento>` → genero un blog post specifico
- `refill pool` → rigenero tutto il pool
- `report` → mando email status (pin posted, traffico, conversion)
- `stop loop` → fermo
