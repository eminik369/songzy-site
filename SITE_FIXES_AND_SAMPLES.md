# SONGZY — BUILD PROMPT (fix + samples + hero video + link map)

> **Tu che stai leggendo sei Claude.** Il sito Songzy è in `/Users/emidiodellapietra/progetto con ale/`. Questo documento è il tuo prompt operativo: fonte della verità per tutto ciò che devi cambiare. Non deviare. Lavora nell'ordine della checklist (§5), fermati prima di ogni azione che richiede un URL/segreto che solo il founder può generare (es. Stripe Payment Link), e chiedi. Il brand è **Songzy** — non Keepsong. Niente subscription: il founder ha escluso modelli ricorrenti.
>
> **Data:** 2026-04-17

---

## PARTE 1 — DIAGNOSI (cosa c'è adesso)

### ✅ Quello che funziona
- Ancoraggi interni: `#how-it-works`, `#audio-examples`, `#pricing`, `#testimonials`, `#faq` sono tutti collegati a sezioni esistenti.
- Currency switcher EUR/GBP (dati `data-eur` / `data-gbp` presenti).
- Copy emozionale forte in pricing ("A small song, exactly right." / "Not a track. A memory." / "The one they'll frame.").
- Struttura tier pulita: Quick €19/£16, Personal €39/£33, Premium €69/£59.
- 4 bundle aggiuntivi (Duo, Family Year, Wedding Suite, Valentine's Duo).

### ❌ Problemi critici (da risolvere prima del launch)

| # | Problema | Dove | Impatto |
|---|---|---|---|
| 1 | **`#checkout` NON ESISTE** | 3 pricing CTA (righe 4868, 4920, 4970) + 4 bundle CTA (5016, 5028, 5039, 5050) + Final CTA (6652) | **🚨 Il click principale del sito non fa nulla.** Conversion = 0. |
| 2 | **Audio = SoundHelix placeholder** | 6 card audio (righe 2812-2982) | I visitatori premono play e sentono beat elettronici da demo library. Distrugge credibilità: il prodotto venduto è "canzoni con testo", non "instrumental generico". |
| 3 | **Cover art = picsum.photos** | 6 immagini (righe 2802-2972) | Immagini random che non comunicano niente sull'occasione/voice del brano. |
| 4 | **Rotte `/about`, `/blog`, `/careers`, `/refund`, `/privacy`, `/terms` non esistono** | Footer (righe 7099-7113) | Click = 404 su static server. Piedino non credibile. |
| 5 | **Ancore morte**: `#gift`, `#anniversary-club`, `#trustpilot`, `#` (logo + cookie-prefs) | righe 644, 5055, 5861, 7114 | Scroll inutile o salto in alto. |
| 6 | **Nessun cart**, nessun mini-summary, nessuna memoria add-on | — | Il flusso salta da "Choose plan" direttamente al checkout. Manca il momento "tengo il prodotto da parte mentre guardo altro". |
| 7 | **Mailto `hello@songzy.com`** non configurato | riga 6413, 7110 | Se l'email non esiste il click apre mail client verso il nulla. |
| 8 | **JSON-LD dice "AggregateOffer lowPrice 29 highPrice 99"** | riga 45 | Ma il sito vende da €19 a €69. Incoerenza SEO → Google può contestare i rich snippet. |

---

## PARTE 2 — AUDIO SAMPLES: COSA METTERE DAVVERO

Il punto più urgente. Le 6 card audio devono suonare come **vere canzoni personalizzate con voce cantata + testo** — altrimenti il prodotto venduto non matcha ciò che ascoltano.

### Strategia raccomandata (in ordine di preferenza)

#### 🥇 OPZIONE A — Generare 6 sample veri con **Suno Pro** ($10/mese)
**Questa è la risposta giusta. Il founder deve farlo lui, ora, prima del launch.**

1. Sottoscrivi **Suno Pro** ($10/mese → 2.500 crediti = ~500 canzoni). Fondamentale: devi essere **subscriber AL MOMENTO della generazione** per avere i diritti commerciali. Canzoni generate sul piano Free restano non-commerciali anche se dopo fai upgrade.
2. Per ogni card del sito genera una canzone con brief coerente al titolo attuale (90-120 sec, verse+chorus):

| Card | Titolo attuale | Prompt Suno (esempio) |
|---|---|---|
| 1 | *For Sarah, on her 40th* | `Style: pop, warm, female vocal. Lyrics: happy-birthday-to-a-sister song, mentions Sarah, her laugh, "40 and flying", chorus "here's to you Sarah, here's to another forty".` |
| 2 | *The day we met the dog* | `Style: acoustic guitar, male vocal, intimate. Lyrics: couple adopting a rescue dog, rainy Saturday, the dog named "Milo" jumping on the bed.` |
| 3 | *Grandad's hands* | `Style: folk, male vocal, fingerpicked guitar, cello. Lyrics: grandson remembering grandfather's hands — wood shop, calluses, 80 years, "same hands that held me when I was one".` |
| 4 | *Still here* | `Style: piano ballad, female vocal, strings. Lyrics: anniversary song, long marriage through hard years, "after everything, still here".` |
| 5 | *Leo's first steps* | `Style: acoustic, soft, female vocal. Lyrics: mother's-day song, toddler Leo taking first steps, a promise to walk beside him forever.` |
| 6 | *Saturday morning radio* | `Style: hip-hop, lo-fi beat, male vocal. Lyrics: son thanking dad who was a DJ in the 80s, vinyl crackles, Saturday mornings in the kitchen.` |

3. Scarica MP3 (Suno Pro permette WAV anche). Rinominare:
   ```
   /assets/audio/songzy-01-for-sarah.mp3
   /assets/audio/songzy-02-the-dog.mp3
   /assets/audio/songzy-03-grandads-hands.mp3
   /assets/audio/songzy-04-still-here.mp3
   /assets/audio/songzy-05-leo-first-steps.mp3
   /assets/audio/songzy-06-saturday-radio.mp3
   ```
4. **Salva la fattura Suno e la data di generazione** come prova dei diritti commerciali (critico se ci sono dispute).
5. Salva anche i **testi** in `/assets/lyrics/songzy-XX.txt` — servono per il lyric video del tier Personal + Premium.

**Link utili:**
- Suno sign-up: https://suno.com/
- Piani e licenze commerciali: https://suno.com/hub/royalty-free-music
- FAQ diritti Pro/Premier: https://help.suno.com/en/articles/9601665
- Suno Explore (per ispirarsi ad altre canzoni pubbliche): https://suno.com/explore

#### 🥈 OPZIONE B — Backup royalty-free da Pixabay (limitato)
Se budget zero, Pixabay dà royalty-free senza attribuzione. Limite: la maggior parte sono **strumentali** (non voci cantate con testo). Usale solo come filler background o per le card in cui l'emotività strumentale basta (es. "Grandad's hands" con guitar fingerpicking strumentale può funzionare).

| Uso | URL |
|---|---|
| Emotional acoustic/piano | https://pixabay.com/music/search/emotional/ |
| Wedding feel | https://pixabay.com/music/search/wedding/ |
| Memorial/funeral | https://pixabay.com/music/search/memorial/ |
| Sad/reflective | https://pixabay.com/music/search/sad/ |
| Acoustic catalog | https://pixabay.com/music/search/acoustic/ |
| Bensound (attribuzione richiesta sul free plan) | https://www.bensound.com/royalty-free-music/acoustic-folk |
| CCMixter (CC-BY) | http://dig.ccmixter.org/free |
| MelodyLoops (per wedding) | https://www.melodyloops.com/music-for/wedding/ |
| Free Stock Music acoustic | https://www.free-stock-music.com/acoustic.html |

**Non usare senza check**: qualsiasi file con "Suno free tier" generato in passato (licenza non-commercial); tracce di CCMixter marcate "no commercial".

#### 🥉 OPZIONE C — Embed Suno pubblici (solo per demo page, NON per sito venduto)
Suno permette condivisione pubblica via link tipo `https://suno.com/song/<uuid>`. Puoi embed in `<iframe>`, ma:
- Non puoi scaricare l'MP3 legalmente se non sei tu il generatore Pro.
- UI di Suno non è on-brand.
- Dipendenza da dominio esterno.

Usa solo come ponte temporaneo.

### Cover art (le 6 immagini picsum)
- **Opzione rapida**: genera 6 cover con DALL·E/Midjourney/Stable Diffusion. Prompt template:
  ```
  "Album cover art, 1:1, warm analog photography, soft window light, slight film grain,
  emotional tone of [occasion], minimal typography negative space for title,
  palette of orange/pink/purple matching Songzy brand, no face, no text in image"
  ```
- Salva in `/assets/covers/songzy-01-for-sarah.jpg` etc. (1200×1200).
- Update HTML righe 2802, 2836, 2870, 2904, 2938, 2972 → sostituisci `src="https://picsum.photos/seed/..."` con path locale.

---

## PARTE 2.5 — HERO VIDEO BACKGROUND (urgente — il founder lo vuole)

Il background attuale dell'hero è un **gradient animato viola/scuro con note musicali flottanti** (righe ~330-425). Il founder l'ha giudicato **brutto**. Sostituire con **video loop full-bleed** dietro il testo.

### Cosa costruire

1. Sostituisci `.hero__bg` (gradient) e `.hero__particles` (note flottanti) con un `<video>` element full-bleed:
   ```html
   <video
     class="hero__bg-video"
     autoplay
     muted
     loop
     playsinline
     preload="auto"
     poster="/assets/hero/hero-poster.jpg"
     aria-hidden="true">
     <source src="/assets/hero/hero-bg.webm" type="video/webm">
     <source src="/assets/hero/hero-bg.mp4" type="video/mp4">
   </video>
   ```

2. CSS:
   ```css
   .hero__bg-video {
     position: absolute;
     inset: 0;
     width: 100%;
     height: 100%;
     object-fit: cover;
     z-index: 0;
     filter: brightness(0.55) saturate(1.05);
   }
   ```
   Mantieni `.hero__bg-overlay` sopra il video per leggibilità testo (il radial gradient overlay esistente funziona già).

3. **Performance obbligatoria:**
   - Video WebM + MP4 fallback, peso massimo totale **≤ 2.5 MB**
   - Durata loop: **8-12 sec**
   - Risoluzione: 1920×1080 desktop, servire 960×540 a `<768px` tramite `<source media>` query
   - Poster frame pre-caricato (ultimo frame emotivo del loop)
   - LCP target <2.0s su 4G

4. **Reduced-motion fallback:**
   ```css
   @media (prefers-reduced-motion: reduce) {
     .hero__bg-video { display: none; }
     .hero__bg-video-fallback { display: block; }
   }
   ```
   Mostra solo l'immagine poster.

5. **Contenuto del video — cosa cercare:**
   Il tono dev'essere **reaction emotiva calda** (NON generic tech/gradient). Opzioni:
   - **Reazioni vere** (preferito): clip ravvicinati di volti — una madre che piange di gioia, due mani di anziani che si stringono, un bambino che ride, una coppia che balla lento. No full faces zoom (rights) — preferire **hands, details, silhouettes, warm window light**.
   - **B-roll cinematografico**: fingerpicking chitarra close-up, mano che scrive su carta, vinile che gira, candela accesa su torta, bouquet d'autunno.

6. **Fonti video royalty-free (commerciale gratis, no attribuzione obbligatoria):**

   | Fonte | URL | Note |
   |---|---|---|
   | **Pexels Video** | https://www.pexels.com/videos/ | Search: "emotional hug", "grandmother hands", "acoustic guitar", "wedding dance" — free commercial |
   | **Coverr** | https://coverr.co/ | Curated, loop-friendly, molti clip 10-15s perfetti per hero |
   | **Mixkit** | https://mixkit.co/free-stock-video/ | Free commercial, categoria "People & Emotion" |
   | **Pixabay Video** | https://pixabay.com/videos/ | Free commercial, search "family reunion", "hands", "wedding" |
   | **Videvo** | https://www.videvo.net/ | Alcuni free, alcuni Pro — filtra "Free" |

7. **Ricetta consigliata (shortlist 3-4 clip):**
   - 1× close-up mani anziane che si stringono (memorial/anniversary)
   - 1× primo piano candela su torta di compleanno (birthday)
   - 1× coppia che balla lento silhouette/low light (wedding)
   - 1× mano che scrive una lettera a mano (story-telling)

   Se ne scegli **UNO** solo: **coppia che balla lento in controluce caldo** — universale, emotivo, non invadente.

8. **Salvataggio file:**
   ```
   /assets/hero/hero-bg.mp4          ← ≤2.5MB, H.264, 1920×1080, 24fps
   /assets/hero/hero-bg.webm         ← ≤2MB, VP9, stessa sorgente
   /assets/hero/hero-bg-mobile.mp4   ← 960×540, ≤1MB
   /assets/hero/hero-poster.jpg      ← ultimo frame del loop, 1920×1080 JPG quality 80
   ```
   Converti con `ffmpeg`:
   ```bash
   ffmpeg -i input.mov -vcodec libx264 -crf 28 -preset slow -an -vf "scale=1920:1080" hero-bg.mp4
   ffmpeg -i input.mov -c:v libvpx-vp9 -crf 32 -b:v 0 -an -vf "scale=1920:1080" hero-bg.webm
   ffmpeg -i input.mov -an -vf "scale=960:540" -vcodec libx264 -crf 30 hero-bg-mobile.mp4
   ffmpeg -sseof -0.1 -i hero-bg.mp4 -vframes 1 -q:v 3 hero-poster.jpg
   ```

9. **Rimuovi** dal markup hero esistente (rendono il codice pesante e ora sono ridondanti):
   - `.hero__bg` gradient animato (mantieni il div ma svuotalo o eliminalo)
   - `.hero__particles` con 10 `.hero__note--N` (toglili tutti, il video li rende inutili)
   - `@keyframes hero__gradient-shift`, `@keyframes hero__float-note`

10. **Mantieni** `.hero__bg-overlay` (il radial gradient scuro che garantisce WCAG AA sul testo bianco sovrapposto).

### ⚠️ Tipografia del testo hero sopra video

Ora che c'è un video dietro, il testo può apparire meno leggibile. Due accorgimenti:
- Overlay scuro minimo: `background: linear-gradient(135deg, rgba(26,26,46,0.6), rgba(123,47,247,0.35));`
- Text-shadow sottile sull'H1: `text-shadow: 0 2px 20px rgba(0,0,0,0.3);`
- Testa il contrasto con Lighthouse — target AA su ogni frame del video.

---

## PARTE 3 — MAPPA COMPLETA BOTTONI/LINK → DOVE DEVONO PUNTARE

### A) Navbar (righe 657-688)

| Elemento | Attuale | Raccomandato | Note |
|---|---|---|---|
| Logo/home link | `href="#"` riga 644 | `href="#top"` (aggiungi `id="top"` sul `<body>` o hero) | Click su logo deve scrollare in cima. |
| Nav "How It Works" | `#how-it-works` | ✅ OK | funziona. |
| Nav "Examples" | `#audio-examples` | ✅ OK | funziona. |
| Nav "Pricing" | `#pricing` | ✅ OK | funziona. |
| Nav "Reviews" | `#testimonials` | ✅ OK | funziona. |
| Nav CTA "Give a song" | `#pricing` | **→ `#pricing`** per ora ok, eventualmente `#order` quando crei form | funziona come scroll. |

### B) Hero (righe 725-783)

| Elemento | Attuale | Raccomandato |
|---|---|---|
| Primary CTA | `#pricing` | **→ `#pricing`** ok. |
| Secondary CTA "Hear samples" | `#audio-examples` | ✅ OK. |
| Scroll indicator | `#how-it-works` | ✅ OK. |

### C) Audio Examples section (riga 3012)

| Elemento | Attuale | Raccomandato |
|---|---|---|
| Bottom CTA "Turn their story into a song" | `#pricing` | ✅ OK. |

### D) Use-cases section (righe 3732-3874)

Tutti e 7 i link (`#pricing`) sono OK. ✅

### E) ⚠️ PRICING — IL PROBLEMA PRINCIPALE

Ogni `href="#checkout"` (righe 4868, 4920, 4970, 5016, 5028, 5039, 5050, 6652) deve essere sostituito. **Tre strategie di fix in ordine di implementabilità:**

#### 🎯 FIX RACCOMANDATO — Stripe Checkout diretto (nessun cart da sviluppare)
1. Nel dashboard Stripe crea **7 Payment Links** (uno per ogni SKU):
   - Quick €19 / £16
   - Personal €39 / £33
   - Premium €69 / £59
   - Duo €99 / £85
   - Family Year €179 / £155
   - Wedding Suite €199 / £175
   - Valentine's Duo €129 / £109
2. Per ogni Payment Link Stripe restituisce un URL tipo `https://buy.stripe.com/eVa...`. Dopo pagamento, Stripe può redirigere a una pagina `/order-brief.html` dove il cliente compila la form con nomi, occasione, storia (6-step).
3. Sostituisci tutti i `#checkout` con il relativo URL Stripe:
   ```html
   <!-- Tier Quick -->
   <a href="https://buy.stripe.com/eVa...qA" data-tier="quick" class="pricing__cta pricing__cta--ghost">
   
   <!-- Tier Personal -->
   <a href="https://buy.stripe.com/9AQ...zB" data-tier="personal" class="pricing__cta pricing__cta--primary">
   ```
4. **Add-on e currency switching** in Stripe Checkout: abilita "Promotion codes" per il codice LAUNCH20, e usa "Adjustable quantity" disabilitata. Multi-currency: Stripe supporta auto-conversion se attivi "Presentment currency" nel dashboard.

**Perché è la scelta giusta**: zero backend, zero hosting sicurezza, PCI compliance Stripe, supporto multi-currency nativo, Apple Pay / Google Pay / Klarna nativi, funziona su sito statico.

#### ALTERNATIVA — Order Brief Form → POST → Stripe
Se serve catturare brief PRIMA di pagare: crea `/order.html` come form multi-step (vedi sezione 7.9 del KEEPSONG_BUILD_PROMPT.md originale) → al submit il JS chiama una Netlify Function / Vercel Function / Stripe Checkout Sessions API che crea una sessione con i line items. Più lavoro, più controllo. Per MVP: non farlo ancora.

#### PESSIMO fix (ma minimal) — `#checkout` → scroll a form email placeholder
Solo se MVP ultra-rapido senza Stripe pronto: crea una sezione `<section id="checkout">` subito dopo pricing con un form "Enter your email to start" → Mailchimp/Resend → email manuale con link pagamento. Lo consiglio solo per validare la domanda.

### F) Bundles section (riga 5055)

| Elemento | Attuale | Raccomandato |
|---|---|---|
| "gift cards" link | `#gift` (dead) | Se hai gift card → crea `<section id="gift">` con descrizione + Stripe link. Se non ancora → **rimuovi il link** (la copy può restare come teaser `"Gift cards coming soon."`). |
| "Anniversary Club subscription" | `#anniversary-club` (dead) | **⚠️ IL FOUNDER HA DETTO NO SUBSCRIPTIONS.** Rimuovi completamente questa menzione. Contraddice il posizionamento. |

### G) Testimonials (riga 5861, 5885)

| Elemento | Attuale | Raccomandato |
|---|---|---|
| Trustpilot link | `#trustpilot` | Quando avrai account Trustpilot reale → sostituisci con `https://www.trustpilot.com/review/songzy.com` + `target="_blank" rel="noopener"`. Se non ancora → rimuovi il bottone (meglio no Trustpilot che un link finto). |
| Testimonials CTA | `#pricing` | ✅ OK. |

### H) FAQ (riga 6274, 6413)

| Elemento | Attuale | Raccomandato |
|---|---|---|
| "Examples section" link | `#audio-examples` | ✅ OK. |
| "Email us" mailto | `mailto:hello@songzy.com` | **Configura davvero l'email** (Gmail, FastMail, Resend inbound). Se non pronto → sostituisci con `<a href="https://forms.gle/...">Contact us</a>` via Google Form. |

### I) Final CTA banner (riga 6652)

| Elemento | Attuale | Raccomandato |
|---|---|---|
| `href="#checkout"` | dead | **→ `#pricing`** per ora (semplice). Meglio ancora: usa lo stesso Stripe Payment Link del tier Personal (l'AOV atteso). |

### J) Footer (righe 7048-7114)

| Link | Attuale | Raccomandato |
|---|---|---|
| Logo footer | `#top` | Aggiungi `id="top"` al `<body>` o al primo `<section>` — altrimenti 404. |
| "How it works" | `#how-it-works` | ✅ OK. |
| "Examples" | `#audio-examples` | ✅ OK. |
| "Pricing" | `#pricing` | ✅ OK. |
| "Gift cards" | `#gift` | Crea pagina `/gift.html` OPPURE rimuovi. |
| `/about` | 404 | Crea `/about.html` statico (founder story, team, mission — 400 parole). |
| `/blog` | 404 | Se blog non pronto → rimuovi dal footer. Anti-pattern tenerlo vuoto. |
| `/careers` | 404 | Rimuovi finché non assumi. |
| `#faq` | ✅ OK | |
| `mailto:hello@songzy.com` | non attivo | Configura. |
| `/refund` | 404 | Crea `/refund.html` con copy refund drafted (vedi KEEPSONG_BUILD_PROMPT §12.1). |
| `/privacy` | 404 | Crea `/privacy.html` con **Iubenda** (€27-299/anno, include GDPR). |
| `/terms` | 404 | Crea `/terms.html` con ToS + AUP. |
| `#` cookie prefs | dead | Installa **Cookiebot** o **Iubenda Cookie Solution** — binding automatico su `[data-cookie-prefs]`. |

### K) Mobile menu + JSON-LD cleanup

- **JSON-LD line 45-46**: aggiorna `lowPrice: "19"`, `highPrice: "199"` (riflette Quick→Wedding Suite).
- **Mobile menu CTA "Give a song"** (riga 688) — OK punta a `#pricing`.

---

## PARTE 4 — DESIGN DEL CART / CHECKOUT FLOW

Il sito non ha bisogno di un cart React classico. Per gift digitale a €19-69 **Stripe Checkout hosted è la scelta corretta**. Ma puoi aggiungere 3 pezzi di UX che alzano il CVR senza costruire un cart:

### 1. Sticky bottom bar (appare dopo scroll oltre il fold)
Quando l'utente scrolla oltre l'hero, mostra in basso una barra:
```
┌──────────────────────────────────────────────────┐
│ Personal · €39 · in 2 hours   [Give them the song →]│
└──────────────────────────────────────────────────┘
```
- Background: `#1a1a2e` (dark, come hero)
- Testo bianco, CTA gradient brand
- Si dismiss con X, riappare su prossima visita
- Su mobile è **la** CTA principale sotto il thumb

### 2. Confronto tier → badge "Saving"
Quando Personal è selezionato, mostra sopra il prezzo:
```
€39 one-time — save €10 vs. Quick + Lyric video add-on
```
Crea l'anchor mentale di "value del middle tier".

### 3. Pre-checkout "Tell the story" snippet
Sotto ogni CTA, invece di dropdownmare in Stripe puro, 1 riga:
```
Secure checkout · No account needed · Brief form after payment (3 min)
```
Rassicura sulla velocità del post-checkout.

### 4. Abandoned intent capture
**Exit-intent popup** su desktop + **form-abandoned detection** su mobile (scroll-up veloce dopo pricing):
- Modal 480×420, waveform animata in hero
- H1: *"Wait — hear one first?"*
- Sub: *"30-second sample. No email needed."*
- Primary: "Play a sample" (scroll back a `#audio-examples`)
- Secondary piccolo text-link: "Get 10% off my first song →" (email capture → Klaviyo)
- Frequency cap: 1x per 7 giorni per device

### 5. Stripe Checkout customization
Nel dashboard Stripe → Checkout settings:
- **Logo Songzy** (upload logo-songzy.jpg — 42×42 già c'è)
- **Colore brand** `#E91E8C` (pink del gradient)
- **Shipping** disabilitato (digitale)
- **Phone number** opzionale
- **Save card** = OFF (one-time gift, non ha senso)
- **Promotion codes** = ON
- **Adjustable quantity** = OFF
- **After payment** → redirect a `/order-brief.html?session_id={CHECKOUT_SESSION_ID}` (qui il cliente compila lo story brief)

---

## PARTE 5 — CHECKLIST IMPLEMENTATIVA (in ordine)

Priorità 🔴 critica → 🟡 importante → 🟢 nice-to-have

- [ ] 🔴 **Sostituire background hero**: togliere gradient+note flottanti, installare `<video>` loop 8-12s (MP4+WebM, ≤2.5MB), con poster + reduced-motion fallback. Scaricare clip da Pexels/Coverr/Mixkit (vedi §2.5)
- [ ] 🔴 **Generare 6 canzoni Suno Pro** con brief coerenti + scaricare MP3
- [ ] 🔴 Salvare MP3 in `/assets/audio/` e **sostituire URL SoundHelix** in 6 `data-audio` attributes
- [ ] 🔴 Configurare **7 Stripe Payment Links** (Quick, Personal, Premium + 4 bundle)
- [ ] 🔴 **Sostituire tutti gli `href="#checkout"`** (8 occorrenze) con i Payment Link URL — con `data-tier` attribute per analytics
- [ ] 🔴 Rimuovere **Anniversary Club** dalla pagina pricing (contraddice "no subscriptions")
- [ ] 🔴 Fix **JSON-LD** `lowPrice: 19`, `highPrice: 199`
- [ ] 🔴 Configurare **email hello@songzy.com** (Gmail/Resend inbound) o sostituire con Google Form
- [ ] 🟡 Generare **6 cover art** con DALL·E/MJ → `/assets/covers/` → sostituire picsum.photos
- [ ] 🟡 Creare pagine statiche: `/refund.html`, `/privacy.html`, `/terms.html`, `/about.html`
- [ ] 🟡 Configurare **Iubenda** (o Cookiebot) per cookie banner + privacy policy GDPR-ready
- [ ] 🟡 Attivare **sticky bottom bar** dopo scroll pricing
- [ ] 🟡 Implementare **exit-intent popup** con sample play CTA
- [ ] 🟡 Rimuovere link `/blog` e `/careers` dal footer (o creare stub pages con "Coming soon")
- [ ] 🟡 Decidere **gift cards**: creare `/gift.html` o rimuovere il link
- [ ] 🟡 Aggiungere `id="top"` al `<body>` per far funzionare il logo footer
- [ ] 🟢 Aggiungere **Trustpilot** (dopo 20-30 recensioni reali) con link esterno vero
- [ ] 🟢 Installare **Klaviyo** con flow abandoned-cart (3 email: T+1h, T+24h, T+72h)
- [ ] 🟢 Installare **Meta Pixel + TikTok Pixel + GA4** (eventi `view_item`, `click_cta`, `begin_checkout`)
- [ ] 🟢 Scrivere pagina **/order-brief.html** post-payment con 6-step form (occasion, recipient, story, genre, mood, email)

---

## PARTE 6 — RIFERIMENTI DI DESIGN DA COPIARE (come da brief originale)

Per pulire il design generale rispetto ai problemi che vedo:

| URL | Cosa copiare esattamente |
|---|---|
| https://www.songfinch.com/ | Audio player inline (waveform + play/pause + context line), 3-step "How it works", order-form architecture |
| https://songheart.co/ | Speed-laddered price cards, Songblocs physical add-on card style |
| https://www.cameo.com/ | "Browse creators" grid pattern per eventuale pagina `/voices` futura |
| https://www.mixtiles.com/ | Mobile-first checkout, sticky bottom CTA, friction-free guest flow |
| https://artifactuprising.com/ | Hero che mostra la reaction del destinatario invece del prodotto |
| https://www.vinylmeplease.com/ | Card audio con album-art-forward layout, ritual-di-musica feel |
| https://linear.app/ | Micro-interazioni e hover transitions a ≤200ms |
| https://welcome.storyworth.com/ | Landing stagionali (Mother's Day, Valentine's) |

---

## PARTE 7 — OUTPUT PER IL PROSSIMO CLAUDE

**Prompt short-form (copia-incolla in una nuova sessione Claude Code):**

> Sei Claude, stai lavorando su Songzy in `/Users/emidiodellapietra/progetto con ale/`. Leggi `SITE_FIXES_AND_SAMPLES.md` per intero — è la fonte della verità. Esegui gli item 🔴 (critici) in ordine stretto:
> 1. Hero video background (PARTE 2.5) — scarica clip da Pexels/Coverr, converti con ffmpeg, salva in `/assets/hero/`, rimuovi gradient+note flottanti dal markup, aggiungi `<video>` + poster + reduced-motion fallback.
> 2. Audio reali (PARTE 2) — chiedi al founder se ha già generato le 6 canzoni Suno Pro; se sì salvale in `/assets/audio/` e aggiorna i 6 `data-audio=` attributes (righe 2812, 2846, 2880, 2914, 2948, 2982). Se no, fermati e chiedi.
> 3. Stripe Payment Links — il founder deve crearli nel dashboard Stripe e passarteli uno per uno (7 link totali). Sostituisci tutti gli `href="#checkout"` (8 occorrenze totali: righe 4868, 4920, 4970, 5016, 5028, 5039, 5050, 6652).
> 4. Rimuovi "Anniversary Club subscription" dal footer pricing (riga 5055).
> 5. Fix JSON-LD pricing range (riga 45-46): `lowPrice: "19"`, `highPrice: "199"`.
>
> Regole: non aggiungere feature non elencate · non rinominare il brand (è Songzy, non Keepsong) · non rintrodurre subscription · ogni sostituzione Stripe URL mantiene `data-tier` per analytics · al termine esegui `curl -s http://localhost:8000/ | grep -c "#checkout"` — deve tornare 0.

---

**Fine documento. Salva Suno Pro subscription invoice il giorno in cui generi le canzoni — prova dei diritti commerciali.**
