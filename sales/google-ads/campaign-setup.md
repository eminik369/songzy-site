# Google Ads Campaign — Songzy

> Setup completo per lanciare oggi. Copia tutto in Google Ads Editor (free tool) o pasta keyword/ad copy direttamente in Google Ads web UI.
>
> **Budget consigliato per test iniziale**: €30/giorno per 10 giorni = €300 totale. Con €400 credit gratis nuovi account = test sostanzialmente free.
>
> **Aspettativa onesta**: con €300 budget + CPC medio stimato €0.80-€1.50, si ottengono ~250-380 click. Con conversion rate landing 1-3% (realistico per gift impulse), si ottengono **2-12 vendite** nel test iniziale. Ottimizzazione successiva (negative keyword, ad rotation, landing page test) può raddoppiare il CR.

---

## 1. STRUCTURA ACCOUNT

```
Account: Songzy
└── Campaign 1: SEARCH — Gift Intent EU (English)
    ├── Ad Group: Personalized Song Generic
    ├── Ad Group: Birthday Songs
    ├── Ad Group: Anniversary Songs
    ├── Ad Group: Wedding Songs
    └── Ad Group: Memorial Songs
└── Campaign 2: SEARCH — Gift Intent UK (English, GBP)
    └── (same ad groups, GBP bidding)
└── Campaign 3: SEARCH — Gift Intent Italy (Italian)
    ├── Ad Group: Canzone Personalizzata
    ├── Ad Group: Regalo Compleanno
    └── Ad Group: Regalo Anniversario
└── Campaign 4: SEARCH — Brand Defense
    └── Ad Group: Brand "songzy"
```

> Brand defense protegge da concorrenti che bid sul tuo nome. €1/giorno basta.

---

## 2. SETTINGS PER OGNI CAMPAIGN

| Setting | Value |
|---|---|
| Campaign type | Search |
| Goal | Sales |
| Networks | Search only (NO Display, NO Partners) |
| Locations | EU (Italy, France, Spain, Germany, NL, BE, PT, IE, AT) — separate UK campaign |
| Languages | English (campaign 1, 2, 4); Italian (campaign 3) |
| Budget | €30/giorno (split: €12 generic + €5 each occasion + €1 brand) |
| Bid strategy | Maximize conversions (after 30 conversions: Target CPA €15) |
| Start with | Manual CPC max €1.50, switch to auto after first conversions |
| Ad rotation | Optimize: prefer best performing ads |
| Ad schedule | All day, all week (gift searches happen at all hours) |
| Device | All devices (mobile-heavy, ensure landing mobile-perfect) |
| Audiences | Add as observation: "Gift shoppers", "Wedding planners", "Music & audio enthusiasts" |

---

## 3. KEYWORD RESEARCH (Cluster + Match Type)

> Match type code: [exact] "phrase" broad
> Per inizio: usa SOLO [exact] e "phrase". Broad = soldi bruciati su query non rilevanti.

### Ad Group A: Personalized Song Generic (EN, primary)

**[Exact match]**
```
[personalized song]
[custom song]
[personalised song]
[custom song gift]
[personalized song gift]
[song from my words]
[song from your words]
[song written from lyrics]
[ai song from text]
[custom music gift]
[unique song gift]
[personal song made]
```

**"Phrase match"**
```
"custom song for"
"personalized song for"
"song written from"
"make me a song"
"order custom song"
"buy custom song"
"personalised song gift"
```

**Negative keywords** (apply to ALL ad groups via campaign-level negatives):
```
-free
-lyrics generator
-spotify
-apple music
-youtube
-download mp3
-karaoke
-piano lesson
-singing lesson
-record yourself
-record studio
-mix master
-sheet music
-chord
-tab
-cover song
-vocal coach
-suno
-udio
-aiva
```

> Aggiungi nuovi negative ogni settimana dalla "Search Terms Report".

### Ad Group B: Birthday Songs (EN)

**[Exact]**
```
[birthday song personalized]
[custom birthday song]
[personalized birthday gift song]
[birthday song from name]
[song for mom birthday]
[song for dad birthday]
[song for grandma birthday]
[50th birthday song gift]
[40th birthday song gift]
[70th birthday song gift]
[80th birthday song gift]
[90th birthday song gift]
```

**"Phrase"**
```
"custom birthday song"
"personalised birthday song"
"birthday song gift for"
"unique birthday gift song"
```

### Ad Group C: Anniversary Songs (EN)

**[Exact]**
```
[anniversary song personalized]
[anniversary song custom]
[wedding anniversary song gift]
[1st anniversary song]
[5th anniversary song]
[10th anniversary song]
[25th anniversary song]
[50th anniversary song]
[anniversary song for wife]
[anniversary song for husband]
```

**"Phrase"**
```
"personalised anniversary song"
"custom anniversary gift"
"song for anniversary"
"anniversary gift unique"
```

### Ad Group D: Wedding Songs (EN, premium intent)

**[Exact]**
```
[custom wedding song]
[personalized wedding song]
[first dance song custom]
[wedding song from our story]
[bespoke wedding song]
[unique wedding gift song]
[engagement gift song]
[wedding song custom lyrics]
```

**"Phrase"**
```
"custom first dance song"
"personalised wedding song"
"wedding song gift"
"bespoke first dance"
```

### Ad Group E: Memorial Songs (EN, niche)

**[Exact]**
```
[memorial song custom]
[funeral song personalized]
[tribute song custom]
[celebration of life song]
[in memory song]
[song for funeral]
[song in remembrance]
[memorial tribute song]
```

**"Phrase"**
```
"personalised memorial song"
"custom funeral song"
"song for celebration of life"
"tribute song from letter"
```

### Italian Campaign Keywords

**Ad Group IT-A: Canzone Personalizzata**

**[Exact]**
```
[canzone personalizzata]
[canzone personalizzata regalo]
[canzone su misura]
[canzone dedica regalo]
[canzone scritta su misura]
[canzone fatta apposta]
```

**"Phrase"**
```
"canzone personalizzata per"
"regalo canzone personalizzata"
"canzone scritta da"
```

**Ad Group IT-B: Regalo Compleanno**

**[Exact]**
```
[canzone regalo compleanno]
[canzone personalizzata compleanno mamma]
[canzone personalizzata compleanno papà]
[canzone compleanno 50 anni]
[canzone compleanno 70 anni]
[regalo originale compleanno]
```

**Ad Group IT-C: Regalo Anniversario / Matrimonio**

**[Exact]**
```
[canzone anniversario matrimonio]
[canzone matrimonio personalizzata]
[canzone primo ballo matrimonio]
[regalo anniversario originale]
[canzone d'amore personalizzata]
```

---

## 4. AD COPY (Responsive Search Ads — RSA)

> RSA = Google mescola dinamicamente headlines (15) + descriptions (4). Sotto trovi 15 headlines + 4 descriptions per ognuno dei 5 ad groups EN.

### Ad Group A — Personalized Song Generic (EN)

**15 HEADLINES (30 char max each)**
```
1. Personalized Song From Your Words
2. Custom Song Written for You
3. A Song They'll Cry Over
4. Ready in 2 Hours — From €19
5. Real Songs, Real Lyrics
6. Send Your Story, Get a Song
7. The Gift That Plays on Repeat
8. Unique Gift Idea — Custom Song
9. Wedding, Birthday, Anniversary
10. Free Rewrite If You Don't Love It
11. Songzy — Songs From Your Story
12. Better Than Another Card
13. GDPR-Compliant, Private, Yours
14. Personalised Song UK & EU
15. Save €10 — First-Time Buyer
```

**4 DESCRIPTIONS (90 char max each)**
```
1. Send a few lines about someone you love. We compose an original song. Ready in 2 hours.
2. Custom song from your words. From €19. Free rewrite, refund if it isn't right. EU & UK.
3. No template, no preset. Every song written fresh from your story. By a real studio.
4. Wedding, birthday, anniversary, memorial. The gift they'll keep forever. Order now.
```

**SITELINK EXTENSIONS** (4)
```
1. Listen to Examples → https://songzy.eu/#audio-examples
2. How It Works → https://songzy.eu/#how-it-works
3. Pricing & Tiers → https://songzy.eu/#pricing
4. FAQ & Refund → https://songzy.eu/#faq
```

**CALLOUT EXTENSIONS** (8, max 25 char each)
```
1. Ready in 2 Hours
2. Free Rewrite
3. Full Refund Policy
4. GDPR Compliant
5. From €19
6. EU & UK Delivery
7. No Subscription
8. Real Human Quality Check
```

**STRUCTURED SNIPPET** (Type: Services)
```
Wedding Songs, Birthday Songs, Anniversary Songs, Memorial Songs, Surprise Gifts
```

**Landing Page (Final URL)**: `https://songzy.eu/?utm_source=google&utm_medium=cpc&utm_campaign=search-en-eu&utm_content=generic`

### Ad Group B — Birthday (EN)

**15 HEADLINES**
```
1. Birthday Song From Your Words
2. Custom Birthday Song Gift
3. Personalized Song for Mom
4. Personalized Song for Dad
5. The Gift That Made Her Cry
6. 50th Birthday Song From €19
7. 70th Birthday Gift — Custom Song
8. 90th Birthday — Their Story, Sung
9. Better Than Flowers, Cheaper Too
10. Ready in 2 Hours — Order Now
11. Free Rewrite Until It's Perfect
12. Songzy — Birthday Song Gifts
13. From Their Story to a Song
14. The Gift They'll Play Every Year
15. Unique Birthday Gift Idea
```

**4 DESCRIPTIONS**
```
1. A custom song from your words — the birthday gift they actually keep. From €19, in 2h.
2. Tell us their story. We write the lyrics, compose the song, ship in your inbox.
3. Real songwriters + real production. Free rewrite, full refund if not right.
4. The gift they'll listen to on repeat for a week. Order now, delivered by tonight.
```

**Landing**: `https://songzy.eu/birthday-song?utm_source=google&utm_medium=cpc&utm_campaign=search-en-eu&utm_content=birthday`
(landing page da creare — vedi sezione 7)

### Ad Group C — Anniversary (EN)

**15 HEADLINES**
```
1. Anniversary Song From Your Story
2. Custom Anniversary Gift Song
3. Personalised Song for Husband
4. Personalised Song for Wife
5. 25th Anniversary Song — €19+
6. 50th Anniversary Song From Lyrics
7. Make Them Cry (Good Crying)
8. The Gift That Plays Every Year
9. Better Than Roses, Lasts Longer
10. Ready in 2 Hours — Order Now
11. Free Rewrite, Full Refund Policy
12. Songzy — Anniversary Songs
13. Your Love Story, Sung
14. Personalised Music Gift EU/UK
15. Save €10 — First Order
```

**4 DESCRIPTIONS**
```
1. Anniversary song written from your love story. From €19. Ready in 2 hours. Real production.
2. Tell us how you met, the silly fights, the inside jokes. We make it a song.
3. The 25th, 50th, or "just because" anniversary gift they'll play every year.
4. Free rewrite if it's not perfect. Full refund if the second version isn't either.
```

**Landing**: `https://songzy.eu/anniversary-song?utm_source=google&utm_medium=cpc&utm_campaign=search-en-eu&utm_content=anniversary`

### Ad Group D — Wedding (EN, premium intent)

**15 HEADLINES**
```
1. Custom Wedding Song — Your Story
2. First Dance Song, Bespoke
3. Personalised Wedding Song Gift
4. Wedding Song From Your Lyrics
5. The First Dance They'll Remember
6. Engagement Gift — Their Song
7. Custom Wedding Song From €19
8. Bride's Gift to Groom — A Song
9. Bridesmaid Gift That Slays
10. Ready in 2 Hours, 7 Days Before
11. Free Rewrite Until Perfect
12. Songzy — Wedding Songs From Story
13. Bespoke First Dance From €19
14. Wedding Song UK & EU
15. From €19 — Make Their Wedding
```

**4 DESCRIPTIONS**
```
1. A first dance song no one else has. Written from your love story. Ready in hours.
2. Send the story of you two. We write lyrics and compose. Ready 7 days before your day.
3. The wedding gift that becomes their playlist forever. From €19, free rewrite.
4. Custom wedding song. Real production. EU & UK delivery. Order with 7-day buffer.
```

**Landing**: `https://songzy.eu/wedding-song?utm_source=google&utm_medium=cpc&utm_campaign=search-en-eu&utm_content=wedding`

### Ad Group E — Memorial (EN, niche, sensibilità alta)

> Copy memorial: NO esclamativi, NO emoji, NO urgenza commerciale. Tono dignitoso.

**15 HEADLINES**
```
1. Memorial Song From Your Letter
2. Tribute Song From Your Words
3. A Song for the Service
4. Custom Funeral Tribute Song
5. Celebration of Life — Their Song
6. Written From Your Letter to Them
7. Real Musicians. Human Care.
8. From €19 — Quietly Delivered
9. In Their Memory — Personalised
10. A Song to Play When Words Fail
11. Free Rewrite if Not Right
12. Songzy — Memorial Songs Made With Care
13. From Your Story, Their Song
14. Memorial Tribute From €19
15. We Read Every Letter
```

**4 DESCRIPTIONS**
```
1. A song written from your letter, for the service or to keep. Real care, real production.
2. Send what you'd want a stranger to know about them. We turn it into a respectful song.
3. From €19. Quiet delivery. Free rewrite. A human reads every word you send.
4. For the service, for the family, for the day you miss them. Songzy.
```

**Landing**: `https://songzy.eu/memorial-song?utm_source=google&utm_medium=cpc&utm_campaign=search-en-eu&utm_content=memorial`

### Ad Group IT-A — Canzone Personalizzata Generica (IT)

**15 HEADLINES**
```
1. Canzone Personalizzata Su Misura
2. Da € 19 — Pronta in 2 Ore
3. La Canzone Che Lui/Lei Ricorderà
4. Regalo Originale Per Lei/Lui
5. Songzy — Canzoni Su Misura
6. Riscrittura Gratis Se Non Va
7. Rimborso Completo Garantito
8. La Tua Storia, La Sua Canzone
9. Compleanno · Anniversario · Sposi
10. Meglio di un Mazzo di Fiori
11. Italiano Madrelingua, Naturalmente
12. Privacy Garantita, GDPR
13. Da 19€ — Ordina Ora
14. Una Canzone Solo Per Loro
15. Sconto €10 Primo Ordine
```

**4 DESCRIPTIONS**
```
1. Mandaci alcune righe sulla persona che ami. Componiamo una canzone vera. Pronta in 2h.
2. Da 19€. Riscrittura gratuita. Rimborso completo se non ti piace. EU e UK.
3. Niente template. Ogni canzone scritta nuova dalla tua storia. Da uno studio vero.
4. Compleanno, anniversario, matrimonio, memoriale. Il regalo che ascolteranno per anni.
```

**Landing**: `https://songzy.eu/?utm_source=google&utm_medium=cpc&utm_campaign=search-it&utm_content=generic-it`

---

## 5. CONVERSION TRACKING SETUP

### Tag #1: Primary Conversion — Purchase
- Type: Google tag / Manual event setup via GTM (consigliato GTM perché ti permette di gestire GA4 + Meta + TikTok dallo stesso container)
- Event: `purchase` (GA4 standard ecommerce event)
- Value: dynamic (from Stripe webhook → server-side conversion API)
- Counting: "One" per click (no duplicates)

**Codice da aggiungere a Songzy** (`api/webhooks/stripe.js`, dopo successful checkout):

```js
// Server-side conversion to Google Ads (CAPI-equivalent)
if (process.env.GOOGLE_ADS_CONVERSION_ID && process.env.GOOGLE_ADS_PURCHASE_LABEL) {
  await fetch(`https://www.googleadservices.com/pagead/conversion/${process.env.GOOGLE_ADS_CONVERSION_ID}/?label=${process.env.GOOGLE_ADS_PURCHASE_LABEL}&value=${(s.amount_total/100).toFixed(2)}&currency_code=${(s.currency||'eur').toUpperCase()}&oid=${s.id}`).catch(e => console.warn('[ga-conv]', e?.message));
}
```

Env vars da aggiungere a Vercel:
```
GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXX
GOOGLE_ADS_PURCHASE_LABEL=YYYYYYYYY/Zzzzzz
```

> Dopo creato il conversion action in Google Ads → Tools & Settings → Measurement → Conversions → "Purchase", Google ti dà i due ID. Mettili in Vercel ENV.

### Tag #2: Secondary — Begin Checkout
- Event: `begin_checkout`
- Triggered: click su "Get this tier" button in /pricing section
- Wire via `songzyTrack('begin_checkout', { tier, value, currency })` chiamato dal pricing CTA handler

### Tag #3: Tertiary — Brief Submitted
- Event: `submit_lead`
- Triggered: success POST /api/brief
- Cattura conversion attribuibile anche se purchase tracking fail

---

## 6. UTM PARAMETER PATTERN

Tutti i Final URL devono avere UTM consistenti per attribuzione GA4:

```
?utm_source=google
&utm_medium=cpc
&utm_campaign={CAMPAIGN_NAME}
&utm_content={AD_GROUP_KEY}
&utm_term={QUERY}     ← Google sostituisce con effettivo search query
&gclid={GCLID}        ← Google sostituisce con click ID
```

Esempio completo:
```
https://songzy.eu/wedding-song?utm_source=google&utm_medium=cpc&utm_campaign=search-en-eu&utm_content=wedding&utm_term={keyword}&gclid={gclid}
```

`{keyword}` e `{gclid}` sono macro Google: te li sostituisce automaticamente.

---

## 7. LANDING PAGES DEDICATE (DA CREARE)

> Ogni ad group ha una landing dedicata che matcha intent. La landing principale `songzy.eu/` è generica — converte meno su intent specifici.

Landing da creare in /sales/landing-pages/ (poi deployare):

| File | Ad Group | URL slug | Tier preselected | Headline ottimizzato |
|---|---|---|---|---|
| birthday-song.html | Birthday | /birthday-song | personal | "A Birthday Song From Your Words" |
| anniversary-song.html | Anniversary | /anniversary-song | personal | "An Anniversary Song From Your Love Story" |
| wedding-song.html | Wedding | /wedding-song | premium | "Custom Wedding Song From Your Story" |
| memorial-song.html | Memorial | /memorial-song | personal | "A Song to Play When Words Aren't Enough" |
| (Italian) | IT-A | /canzone-personalizzata | personal | "Una Canzone Scritta Dalle Tue Parole" |
| (Italian) | IT-B | /canzone-compleanno | personal | "Una Canzone Per Il Suo Compleanno" |

> Template landing in sales/landing-template.html (da creare). Per pubblicarle in Vercel basta committarle al root + cleanUrls è già attivo in vercel.json.

---

## 8. BUDGET PLAN (10-DAY TEST)

```
Day 1-3: Setup + monitoring
  Budget: €30/day = €90
  Goal: collect 50+ search query data → start refining negatives
  Expectation: 0-3 conversions (early data noisy)

Day 4-7: Optimize
  Budget: €30/day = €120
  Action: Add 20+ negative keywords from Search Terms Report
          Pause non-converting ad groups (let only converters spend)
          Increase bid on top 3 converters by 20%
  Expectation: 2-8 conversions

Day 8-10: Scale or Kill
  Budget: €30/day = €90
  Decision tree:
    - If CPA < €20 → SCALE: increase budget to €50/day next week
    - If CPA €20-40 → KEEP + optimize landing pages
    - If CPA > €40 after 30+ clicks → PAUSE that ad group, reallocate to winners
  Expectation: convergence on 2-3 winning ad groups

After day 10: 30-day plan
  Switch bid strategy to Target CPA (set at €15 if you have ≥30 conv)
  Or stay on Maximize Conversions if data still building
  Add Performance Max campaign as separate test
```

**Total 10-day spend**: €300 (effectively €0 if using Google Ads new account €400 credit).

---

## 9. ANTI-WASTE CHECKLIST (DO BEFORE PRESSING LAUNCH)

- [ ] Tutti gli ad group hanno **negative keywords condivise** (no "free", no "lyrics generator")
- [ ] Match type: SOLO [exact] e "phrase" — NO broad nel test iniziale
- [ ] Networks: SOLO Search (NO Display, NO Search Partners)
- [ ] Locations: targeting "People in or regularly in" (NOT "interested in")
- [ ] Conversion tracking attivo PRIMA di lanciare (altrimenti Google ottimizza per il niente)
- [ ] Landing pages testate da mobile (60-70% del traffico)
- [ ] Bid cap manuale €1.50 max (per evitare bid wars iniziali)
- [ ] Budget split equilibrato (no 100% su 1 ad group → un keyword tossico ti brucia tutto)
- [ ] Email alert configured per Google Ads → ti avvisa se 50% budget speso in 1 giorno (sintomo bid problem)

---

## 10. PROXIMA AZIONE PER L'UTENTE

1. **Crea account Google Ads** (5 min): ads.google.com → sign up → skip "smart campaign" → expert mode
2. **Verifica €400 credit gratis nuovi account** (auto-applied solitamente)
3. **Configura billing** (carta credito) — Google non addebita finché €400 credit non esaurito
4. **Crea Conversion Action "Purchase"** in Tools & Settings → Conversions → "+ New" → Website → Manual setup
5. **Copia Conversion ID + Label** → mandameli (li metto in Vercel ENV)
6. **Pasta keywords + ad copy** da questo file in Google Ads Editor (free download) o web UI
7. **Press Enable**. Monitor day 1-3.

Quando hai fatto i passi 1-3, dammi un OK qui in chat e procedo a creare le landing pages dedicate + scrivere il codice di conversion tracking nel webhook.
