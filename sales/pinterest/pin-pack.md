# Pinterest Pin Pack — Songzy

> Pinterest è un search engine per ispirazione regalo/eventi. Pin organici ben SEO-ottimizzati portano traffico per **mesi/anni** dopo la pubblicazione, costo zero.
>
> **ROI atteso**: ~50 pin pubblicati a cadenza 2-3 al giorno, in 60 giorni 5-15k impression/mese, 200-800 outbound click/mese, ~5-30 vendite/mese stabili.
>
> **Account richiesto**: Pinterest Business (business.pinterest.com → crea account, verifica dominio songzy.eu, abilita Rich Pins).

---

## SETUP — STEP 1: Verifica Dominio

1. business.pinterest.com → Settings → Domains & Notifications → Claim website
2. Pinterest dà un meta tag → aggiungilo nel `<head>` di `index.html`:
   ```html
   <meta name="p:domain_verify" content="XXXXXXXXXXXXXXXX"/>
   ```
3. Save in Pinterest → verify (1-10 min)

## SETUP — STEP 2: Abilita Rich Pins

I Rich Pins prendono automaticamente metadata da Open Graph e li mostrano formattati. Tu hai già OG tags in `index.html` (linee 19-24). Basta:

1. https://developers.pinterest.com/tools/url-debugger/
2. Inserisci `https://songzy.eu` → "Validate"
3. Approva i Rich Pins → si attivano per tutto il dominio

## SETUP — STEP 3: 10 Board iniziali

Crea questi 10 board prima di pubblicare i pin. Per ognuno: titolo + descrizione + cover image suggestion.

| # | Board Title | Description (max 500 char) | Cover |
|---|---|---|---|
| 1 | Wedding First Dance Ideas | First dance songs that fit YOUR love story — not generic playlists. Personalized songs, lyric inspiration, song selection guides, and ideas for couples who want their first dance to be theirs alone. | couple silhouette + waveform |
| 2 | Anniversary Gifts That Mean Something | 1st, 5th, 10th, 25th, 50th — anniversary gift ideas that go past flowers and dinner. Personalized songs, sentimental keepsakes, romantic ideas, gifts for him and for her. | ring on lyrics |
| 3 | Mother's Day Gifts Worth Crying Over | Gifts that make your mom (or grandma) actually feel something. Personalized songs from your story, sentimental ideas, gifts she'll keep forever. | mom hugging child illustration |
| 4 | Father's Day Gifts He'll Actually Keep | Past the tie, past the mug. Gifts your dad (or grandpa) will quietly play in the car for years. Personalized songs, sentimental ideas. | hands on guitar warm tone |
| 5 | Memorial Keepsakes & Tribute Ideas | Ways to honor someone you've lost — personalized memorial songs, celebration of life ideas, tribute keepsakes, what to do at a service when words aren't enough. | candle, soft palette |
| 6 | Birthday Gifts for Mom (and Grandma) | Birthday gift ideas for moms and grandmothers that aren't another scarf. Personalized songs, sentimental ideas, surprise gifts. 50th, 60th, 70th, 80th, 90th milestone birthday inspo. | birthday card + headphones |
| 7 | Birthday Gifts for Dad (and Grandpa) | Gift ideas for dads and grandfathers — personalized songs from your story, sentimental ideas, gifts for the man who already has everything. | vinyl + glasses |
| 8 | Personalized Music Gifts | Custom songs, lyric prints, personalized vinyl, music-themed gift inspiration. For weddings, birthdays, anniversaries, memorials — any moment that deserves more than a card. | grid 4 mini covers |
| 9 | Songzy Stories | Behind-the-scenes of personalized songs we've written: the briefs we get, the lyrics we write, the moments our songs play in. Real stories, real songs. | studio softly lit |
| 10 | Unique & Sentimental Wedding Gifts | For the wedding party who wants to give something the couple will keep forever. Personalized songs, photo books, sentimental gift inspiration. | wrapped gift + ribbon |

---

# 50 PIN — Production-ready

> Specifiche tecniche per ogni pin:
> - **Image**: 1000 × 1500 px (ratio 2:3), JPG quality 90, max 20 MB
> - **Title**: max 100 char (showing only first ~40 in feed)
> - **Description**: 500 char, SEO-rich, conversational
> - **Alt text**: descrittiva per accessibility (Pinterest preferisce alt text vs hashtag spam)
> - **Link**: deep link con UTM
> - **Board**: vedi mapping
>
> **Visual brief**: tool per design = Canva (free template Pinterest), o Figma con plugin Pinterest Ratio. Brand palette: gradient orange #FF6B35 → pink #E91E8C → purple #7B2FF7 su bg dark #0B0B14 OR bg warm cream #f5f3ee per memorial/wedding. Font: Fraunces serif italic per heading + Geist sans per body.

---

## PIN 1 — Wedding First Dance

- **Title**: First Dance Song That's Actually Yours
- **Description**: Forget the Spotify top-10 wedding playlist. A first dance song written from your love story — the silly fights, the inside jokes, the first time you knew. Ready 7 days before the wedding. From €19. ★ Free rewrite, full refund policy.
- **Alt text**: Couple silhouette dancing with custom song lyrics overlay
- **Board**: Wedding First Dance Ideas
- **Link**: https://songzy.eu/wedding-song?utm_source=pinterest&utm_medium=pin&utm_campaign=organic&utm_content=pin-01
- **Visual brief**: Couple silhouette mid-dance against gradient sky. Overlay: italic serif text "Their first dance / written from / their love story". Bottom: small Songzy logo.

## PIN 2 — Anniversary Gift Mom Crying

- **Title**: An Anniversary Song That Made Her Cry
- **Description**: Tell us your story — first date, silly fights, the one line that captures you two. We turn it into an original song you can play every anniversary. From €19. Ready in 2 hours. ★ EU & UK delivery.
- **Alt text**: Wedding ring on lyrics card with quote from happy customer
- **Board**: Anniversary Gifts That Mean Something
- **Link**: https://songzy.eu/anniversary-song?utm_source=pinterest&utm_medium=pin&utm_campaign=organic&utm_content=pin-02

## PIN 3 — Mom's 70th Birthday

- **Title**: Mom's 70th Birthday Gift She Actually Played
- **Description**: A song written from the story of who she is. Not a Hallmark card. Send us a few lines about her — her life, her quirks, what she taught you. We compose an original song. Delivered to your inbox in 2 hours. From €19. ★ Wedding-tested, mom-approved.
- **Alt text**: Older woman smiling listening to headphones with birthday balloons
- **Board**: Birthday Gifts for Mom

## PIN 4 — Memorial Tribute Song

- **Title**: A Song to Play When Words Aren't Enough
- **Description**: For the funeral, the celebration of life, or the day you miss them most. A personalized tribute song written from your letter. Real human care. From €19. ★ GDPR compliant, private.
- **Alt text**: Single candle flame against dark background with lyrics text
- **Board**: Memorial Keepsakes & Tribute Ideas
- **Link**: https://songzy.eu/memorial-song?utm_source=pinterest&utm_medium=pin&utm_campaign=organic&utm_content=pin-04

## PIN 5 — Surprise Gift Husband

- **Title**: I Wrote My Husband a Song for Our Anniversary
- **Description**: He cried. He played it for his mom. He keeps it in his pinned playlist. Total cost: €45. Custom song written from our love story. Ready in 2 hours. ★ Free rewrite if it's not right.
- **Alt text**: Couple looking at phone smiling with audio waveform
- **Board**: Anniversary Gifts That Mean Something

## PIN 6 — Father's Day Surprise

- **Title**: Father's Day Gift Your Dad Will Quietly Play in the Car
- **Description**: Tell us about him — his work, his stories, the way he taught you to drive. We write the lyrics, compose the song, deliver MP3 in 2 hours. From €19. ★ For the dad who has everything.
- **Alt text**: Older man with grey hair listening attentively
- **Board**: Father's Day Gifts He'll Actually Keep

## PIN 7 — 50th Wedding Anniversary

- **Title**: 50th Wedding Anniversary Gift Idea From Their Story
- **Description**: Half a century together. They've heard every song. Give them one written about THEM — the way they met, the kids, the inside jokes only they get. From €19. Delivered in 2h.
- **Alt text**: Elderly couple holding hands with vintage filter
- **Board**: Anniversary Gifts That Mean Something

## PIN 8 — Bridesmaid Gift Idea

- **Title**: Bridesmaid Gift to the Bride That Slays
- **Description**: Get the bride a song from the maid of honor + bridesmaids — her real friendships, the night you all got too drunk, the moment you knew she'd found her person. From €19. Play it at the rehearsal dinner. ★ Make her cry good crying.
- **Alt text**: Group of women laughing at rehearsal dinner
- **Board**: Unique & Sentimental Wedding Gifts

## PIN 9 — Lyric Writing Tips

- **Title**: How to Write Lyrics from Your Story (Even If You Can't Write)
- **Description**: You don't have to be a poet. The best briefs we get are 4-line texts. "She makes coffee wrong and I love her for it." That's the kind of thing that becomes a song. We do the lyrics — you tell us what matters. Read more.
- **Alt text**: Handwritten brief on cream paper with fountain pen
- **Board**: Songzy Stories
- **Link**: https://songzy.eu/?utm_source=pinterest&utm_medium=pin&utm_campaign=organic&utm_content=pin-09

## PIN 10 — Christmas Gift

- **Title**: Christmas Gift Idea: A Song From Your Family Story
- **Description**: Past the gadgets, past the slippers — this year, give one person a song from your family's story. Ready in 2 hours, delivered to your inbox before Christmas Eve. From €19. ★ Last-minute friendly.
- **Alt text**: Christmas tree with wrapped vinyl record gift
- **Board**: Personalized Music Gifts

## PIN 11 — Valentine's Day

- **Title**: Valentine's Day Gift That Beats Roses
- **Description**: A song written from your love story. Hers, his, ours. Delivered to your inbox in 2 hours — perfect for a Valentine's surprise. From €19. ★ Free rewrite, refund policy.
- **Alt text**: Rose petals around headphones on red background
- **Board**: Personalized Music Gifts

## PIN 12 — Funeral Service Music

- **Title**: What to Play at a Funeral When Generic Songs Won't Do
- **Description**: A custom tribute song written from your letter — for the service, for the family, for the day you miss them. We treat every brief with care. From €19. ★ Quiet delivery, real human review.
- **Alt text**: Service program with candle and quiet background
- **Board**: Memorial Keepsakes & Tribute Ideas

## PIN 13 — Grandparent's Birthday

- **Title**: Grandma's 90th Birthday — Her Grandkids Sang Along
- **Description**: "I played it at her 90th. Her grandkids sang along." — Daniela, Modena. A song from your family story, written for her birthday. From €19. ★ Real testimonial, real delivery.
- **Alt text**: Grandmother surrounded by smiling grandchildren
- **Board**: Birthday Gifts for Mom

## PIN 14 — Engagement Gift

- **Title**: Engagement Gift That Beats a Photo Album
- **Description**: They just got engaged. Forget another picture frame — write them a song from their love story. Ready in 2 hours. From €19. Play it at the engagement party or send privately. ★ EU & UK.
- **Alt text**: Hands with engagement ring on a love letter
- **Board**: Unique & Sentimental Wedding Gifts

## PIN 15 — Sister Gift

- **Title**: Big Sister / Little Sister Gift Ideas That Aren't Cliché
- **Description**: A song from the story of you two — the secrets, the fights, the unbreakable thing. Birthday, just because, or "you got the promotion" moment. From €19. ★ Custom, original, hers.
- **Alt text**: Two women hugging, candid photo
- **Board**: Personalized Music Gifts

## PIN 16 — Idea for "Just Because" Gift

- **Title**: The "Just Because" Gift That Hits Harder Than Birthdays
- **Description**: Random Tuesday. Random reason. A song written from your story to someone you love — no occasion needed. The unexpected ones land harder. From €19. ★ Delivered in 2h.
- **Alt text**: Phone showing custom song playing on a Tuesday morning coffee scene
- **Board**: Personalized Music Gifts

## PIN 17 — Music Therapy

- **Title**: Personalized Songs for Memory & Healing
- **Description**: A song written from someone's life story — used in dementia care, grief therapy, milestone moments. Research shows personalized music aids memory recall. From €19 per song. ★ B2B pricing for therapists, message us.
- **Alt text**: Headphones over open hands, warm light
- **Board**: Songzy Stories

## PIN 18 — Wedding Vows Reading

- **Title**: A Song Instead of Vows (or Alongside Them)
- **Description**: A custom song based on what you'd say in your vows — or to set up the moment before the rings. We write the lyrics from your story. From €19. ★ Wedding-tested, 7-day buffer.
- **Alt text**: Wedding setup with chairs and aisle, soft light
- **Board**: Wedding First Dance Ideas

## PIN 19 — Husband 40th Birthday

- **Title**: 40th Birthday Gift for Your Husband He'll Replay Forever
- **Description**: Past the watch, past the bottle of bourbon. A song written from your life together — the chaos of raising the kids, the way he still makes you laugh. From €19. ★ Free rewrite policy.
- **Alt text**: Man in his 40s smiling at phone, casual setting
- **Board**: Birthday Gifts for Dad

## PIN 20 — Wife 30th Birthday

- **Title**: 30th Birthday Gift for Your Wife That Will Land
- **Description**: She's having a milestone. Don't overthink it — write her a song. From her real story (the messy parts too). From €19. Ready in 2 hours. ★ Real production, not karaoke.
- **Alt text**: Woman in her 30s blowing out candles, warm light
- **Board**: Personalized Music Gifts

## PIN 21 — Wedding Reception Song

- **Title**: Wedding Reception Highlight Song Idea
- **Description**: Not the first dance — the moment between courses when everyone needs to laugh-cry. A custom song from your story, played quietly at dinner. Wedding-tested. ★ From €19, ready 7 days before.
- **Alt text**: Wedding reception dinner table with candles
- **Board**: Wedding First Dance Ideas

## PIN 22 — Long Distance Relationship

- **Title**: Long Distance Anniversary Gift That Bridges the Gap
- **Description**: Write your long-distance story into a song. The time zones, the FaceTime dinners, the count to next visit. Delivered to their inbox wherever they are. From €19. ★ International delivery.
- **Alt text**: World map with pin on two cities and dotted line
- **Board**: Anniversary Gifts That Mean Something

## PIN 23 — Pet Memorial

- **Title**: Memorial Song for the Pet You Lost
- **Description**: They were family. Write us a letter about them — the way they greeted you, the spot on the couch, the moment you knew it was time. We turn it into a song. From €19. ★ Real care, no template.
- **Alt text**: Empty pet bed with paw print and soft light
- **Board**: Memorial Keepsakes & Tribute Ideas

## PIN 24 — Mom's Retirement Gift

- **Title**: Mom's Retirement Gift That Captures Her Whole Career
- **Description**: 40 years of teaching, nursing, working. A song from her career story — the kids she taught, the lives she touched, the version of her colleagues knew. From €19. ★ Personal milestone.
- **Alt text**: Older woman at retirement party with cake
- **Board**: Birthday Gifts for Mom

## PIN 25 — Surprise Coworker

- **Title**: Office Goodbye / Retirement Gift That Goes Viral
- **Description**: For the coworker leaving after 15 years. A song from the whole team — the inside jokes, the meetings that ran too long, the way they always brought donuts on Fridays. Group-pay friendly. From €19. ★ Corporate gifting available.
- **Alt text**: Office goodbye party with people gathered
- **Board**: Personalized Music Gifts

## PIN 26 — Baby Shower Gift

- **Title**: Baby Shower Gift From the Whole Family
- **Description**: A song for the baby being born — from mom's friends, the family, the future they're stepping into. Played at the shower, played at the first birthday, played for years. From €19. ★ Sentimental gold.
- **Alt text**: Baby shower decorations with pastel colors and gift box
- **Board**: Personalized Music Gifts

## PIN 27 — Mother of the Bride Speech Song

- **Title**: Mother of the Bride Gift to Her Daughter on the Wedding Day
- **Description**: A song from a mom to her daughter — the time she was 6 and you knew, the heartbreaks she came home crying about, the version of her that just walked down the aisle. Play it during the toast. From €19.
- **Alt text**: Mother and daughter in wedding attire embracing
- **Board**: Wedding First Dance Ideas

## PIN 28 — Best Man Gift to Groom

- **Title**: Best Man Gift to Groom That's Not Whiskey
- **Description**: A song from the best man and crew — the bachelor weekend, the friendship since 14, the way he changed when he met her. Send privately or play at the bachelor party. From €19. ★ Bro-coded sentimentality.
- **Alt text**: Group of men toasting at bachelor party
- **Board**: Unique & Sentimental Wedding Gifts

## PIN 29 — Mother-in-Law Gift

- **Title**: Mother-in-Law Gift That Wins Her Over Forever
- **Description**: For your spouse's mom on her birthday or Mother's Day. A song from your perspective — the way she raised the person you love, the kindness she's shown you. From €19. ★ Bridge gift, certified.
- **Alt text**: Two women laughing together at a family gathering
- **Board**: Mother's Day Gifts Worth Crying Over

## PIN 30 — Christmas Eve Surprise

- **Title**: Christmas Eve Family Surprise: A Song From the Year
- **Description**: A song from the year your family had — the loss, the new baby, the move, the small wins. Played Christmas Eve before dinner. From €19. ★ Tradition-starter.
- **Alt text**: Family around fireplace with Christmas decorations
- **Board**: Personalized Music Gifts

## PIN 31 — New Job Celebration

- **Title**: Celebrate Their New Job With Their Career Song
- **Description**: They just got the offer. The big move. The thing they've been working toward. Write them a song from their career story. From €19. ★ Played in their car on the first commute.
- **Alt text**: Person looking proud at laptop screen with celebration
- **Board**: Personalized Music Gifts

## PIN 32 — Memorial Anniversary

- **Title**: For the Anniversary of Losing Someone
- **Description**: One year, five years, ten years since they died. A tribute song from your story of them — to mark the day quietly, with care. From €19. ★ Real human review, GDPR.
- **Alt text**: Single candle with photo frame and quiet background
- **Board**: Memorial Keepsakes & Tribute Ideas

## PIN 33 — Mother's Day UK

- **Title**: UK Mother's Day Gift Idea (March 4th Sunday Lent)
- **Description**: UK Mother's Day is earlier than the rest of Europe. Give her a song from your story — ready in 2 hours, no last-minute panic. From £16. ★ UK delivery, GBP pricing.
- **Alt text**: Daughter giving mother flowers in spring garden
- **Board**: Mother's Day Gifts Worth Crying Over

## PIN 34 — Italian Wedding

- **Title**: Canzone Per Il Matrimonio Scritta Su Misura
- **Description**: Niente playlist di Spotify. Una canzone scritta dalla vostra storia d'amore — il primo appuntamento, le risate, la frase che vi descrive. Pronta in 2 ore. Da €19. ★ Italiano madrelingua, riscrittura gratuita.
- **Alt text**: Coppia italiana in matrimonio sotto pergola con luci
- **Board**: Wedding First Dance Ideas
- **Link**: https://songzy.eu/canzone-matrimonio?utm_source=pinterest&utm_medium=pin&utm_campaign=organic-it&utm_content=pin-34

## PIN 35 — Italian Birthday for Mom

- **Title**: Regalo Compleanno Mamma: Una Canzone Dalla Sua Storia
- **Description**: Niente sciarpa, niente cornice. Una canzone scritta dalla storia di lei — chi è, cosa ti ha insegnato, la sua versione che i nipoti non conoscono. Da €19. ★ Pronta in 2 ore.
- **Alt text**: Mamma italiana sorridente con cuffie
- **Board**: Birthday Gifts for Mom

## PIN 36 — Italian Anniversary

- **Title**: Regalo Anniversario Originale Per Lui (Da Lei)
- **Description**: Scrivigli una canzone dalla vostra storia — i primi anni, la routine che amate, le sue manie. Da €19. Pronta in 2 ore. ★ Riscrittura gratis se non va.
- **Alt text**: Coppia italiana mature abbraccia in cucina con caffè
- **Board**: Anniversary Gifts That Mean Something

## PIN 37 — Idea Pin Multi-page: How It Works

- **Type**: Idea Pin (multi-page, native Pinterest format, gets boost)
- **Page 1**: "Want to surprise someone you love?" big text on dark bg
- **Page 2**: "Step 1: Order a Songzy tier (€19-69)"
- **Page 3**: "Step 2: Tell us their story in a 5-min form"
- **Page 4**: "Step 3: We write the lyrics & compose"
- **Page 5**: "Step 4: Song in your inbox in 2 hours"
- **Page 6**: "Press play. Watch them cry good crying. ★ From €19"
- **Description**: 4 steps to surprise someone you love with a song written from your words. From €19. Ready in 2 hours.
- **Board**: Songzy Stories
- **Link**: https://songzy.eu/?utm_source=pinterest&utm_medium=ideapin&utm_campaign=organic&utm_content=how-it-works

## PIN 38 — Idea Pin: Sample Songs

- **Type**: Idea Pin with audio
- **Page 1**: "Listen to a Songzy custom song" play button
- **Page 2-5**: 4 audio clips from /assets/audio/ samples (10 sec each, with text "Custom song for [occasion]")
- **Page 6**: "Order your song from €19 ★ Songzy"
- **Description**: Hear what Songzy custom songs sound like. Real samples from real customers. From €19, ready in 2 hours.
- **Board**: Songzy Stories

## PIN 39 — Engagement Surprise Reveal

- **Title**: I Surprised My Fiancée with a Custom Song at Engagement Dinner
- **Description**: She thought it was the playlist. Then I told her it was about us. Reaction: full meltdown. €45 total. Custom song written from our story by Songzy. Ready in 2h. ★ Wedding gift level.
- **Alt text**: Couple at restaurant dinner with surprised expression
- **Board**: Unique & Sentimental Wedding Gifts

## PIN 40 — Father-Daughter Wedding Dance

- **Title**: Father-Daughter Wedding Dance Song That Hits Different
- **Description**: A custom song from your relationship with your dad — the way he walked you to school, the time you came home crying, the moment he sees you in white. From €19. Played at the dance. ★ Tears guaranteed.
- **Alt text**: Father-daughter slow dance at wedding
- **Board**: Wedding First Dance Ideas

## PIN 41 — New Mom Gift

- **Title**: New Mom Gift That Beats Another Baby Outfit
- **Description**: For the first-time mom — a song about the version of her becoming. About what her baby will know about her. About the friend she still is. From €19. ★ Baby shower or 3-month post-partum.
- **Alt text**: New mom with infant in soft natural light
- **Board**: Personalized Music Gifts

## PIN 42 — Adoption Day Anniversary

- **Title**: Adoption Day "Gotcha Day" Anniversary Gift
- **Description**: A song from your family's story — the day they came home, the years since, the bond that has nothing to do with biology. From €19. ★ Custom, original, sentimental.
- **Alt text**: Family group photo with adopted child smiling
- **Board**: Personalized Music Gifts

## PIN 43 — Coming Out / Pride Gift

- **Title**: A Song for Their Pride Story
- **Description**: For someone in your life on their coming out story, or for a pride milestone. A song written from their journey, with care. From €19. ★ Real production, no clichés.
- **Alt text**: Rainbow flag and silhouette of person at sunset
- **Board**: Personalized Music Gifts

## PIN 44 — Sober Anniversary

- **Title**: 1 Year / 5 Year / 10 Year Sober Anniversary Song
- **Description**: For the milestone in sobriety nobody talks about enough. A song from their recovery story — the day, the years, the version of themselves they fought to become. From €19. ★ Care first, always.
- **Alt text**: Hands holding coin/chip with quiet background
- **Board**: Personalized Music Gifts

## PIN 45 — Pet Birthday

- **Title**: Songs From the Story of Your Pet's Life
- **Description**: Pet birthday, adoption anniversary, or to commemorate a beloved animal. A song from their life — the chaos, the love, the small moments. From €19. ★ Surprisingly popular.
- **Alt text**: Dog with birthday hat and treats
- **Board**: Personalized Music Gifts

## PIN 46 — UK 25th Wedding Anniversary

- **Title**: UK 25th Wedding Anniversary Gift Idea — Silver Year
- **Description**: 25 years. A song from your marriage's story — the kids, the moves, the silver-haired version of you two. From £25 (€29). Delivered to your inbox in 2 hours. ★ GBP pricing, UK delivery.
- **Alt text**: Couple in 50s/60s slow dancing in kitchen
- **Board**: Anniversary Gifts That Mean Something

## PIN 47 — Halloween Surprise Idea

- **Title**: Halloween Gift Idea That's Not Candy (For Someone You Love)
- **Description**: Don't laugh — Halloween is a quiet "thinking of you" day for people who care about each other. A song from your story, sent as a surprise. From €19. ★ Unexpected and lands hard.
- **Alt text**: Pumpkin with note "you matter" attached
- **Board**: Personalized Music Gifts

## PIN 48 — Wedding Officiant Gift

- **Title**: Thank-You Gift to the Wedding Officiant Who Made Your Day
- **Description**: They married you (the legal way). Send them a song from your story as thanks — they'll cry, they'll keep it, they'll mention it next time they officiate. From €19. ★ Wedding-pro gift.
- **Alt text**: Officiant with couple at wedding aisle
- **Board**: Unique & Sentimental Wedding Gifts

## PIN 49 — School Teacher Retirement

- **Title**: Retiring Teacher Gift From the Class / Parents
- **Description**: 35 years of teaching. A song from the parents' perspective — the way they shaped the kids, the lessons they taught beyond curriculum. Group-pay friendly. From €19. ★ Send-off gift.
- **Alt text**: Classroom with empty teacher's desk and apples
- **Board**: Personalized Music Gifts

## PIN 50 — Final CTA Pin

- **Title**: 5 Songs Songzy Has Made — Pick Your Favorite Sound
- **Description**: Listen to 5 real Songzy songs we've made. Each one written for a real moment. Pick the one that sounds like the gift you want to give. From €19. ★ Wedding, birthday, anniversary, memorial.
- **Alt text**: 5 album covers in grid layout with play buttons
- **Board**: Songzy Stories
- **Link**: https://songzy.eu/#audio-examples?utm_source=pinterest&utm_medium=pin&utm_campaign=organic&utm_content=pin-50

---

# PUBLISHING SCHEDULE

> Pinterest premia consistency. Pin a cadenza 2-3 al giorno → algoritmo classifica come account "fresh".

**Settimana 1**: Pin 1-15 (1-2 al giorno, spread su tutti i board)
**Settimana 2**: Pin 16-30 + ripin alcuni della settimana 1 su board diversi
**Settimana 3**: Pin 31-45 + 2 Idea Pins (37, 38)
**Settimana 4**: Pin 46-50 + ricicla i top 5 performer della settimana 1-2 con nuove descrizioni

**Tool consigliato per scheduling**: 
- **Pinterest native scheduler** (gratis, fino a 100 pin schedulati 2 settimane in avanti) — basta. Non serve Tailwind o Buffer per Pinterest.
- Quando hai account Buffer per IG/TikTok, ci colleghi anche Pinterest.

---

# TRACKING & OTTIMIZZAZIONE

**Settimana 1**: Pinterest Analytics → Audience insights, top pin impressions
**Settimana 2**: Identifica top 3 pin per outbound click rate → crea 3 varianti di ognuno (stesso link, design diverso)
**Settimana 4**: Pin Sponsored solo sui top 5 organici performer (€5/giorno per 7 giorni test = €35) — Pinterest Ads sono economici

**Pinterest Ads Manager** quando vorrai testare paid:
- Audience: "Lookalike of website visitors"
- Bid: max CPC €0.25 (Pinterest CPC stranissimo basso, often €0.05-0.15)
- Goal: Conversion (purchase)
- Geo: Italy + UK + Germany + France (top EU)
- Age: 25-60
- Interest: Wedding planning, Gift ideas, DIY, Family, Anniversary, Memorial

---

# CREATIVE PRODUCTION (action items)

Per realizzare i 50 visual:

**Opzione A — Canva** (free / Pro €11/mese):
1. Cerca template "Pinterest Pin"
2. Setup brand kit Songzy: colori #FF6B35, #E91E8C, #7B2FF7, #0B0B14, #f5f3ee + font Fraunces + Geist
3. Crea 5 master template (1 per board theme) → duplica 10x per pin
4. Tempo stimato: 4-5 ore per produrre tutti 50

**Opzione B — AI generation** (Midjourney / DALL-E):
1. Prompt template: "Pinterest pin 2:3 portrait, [SCENE DESCRIPTION], dark cinematic background, italic serif text overlay '[TITLE]', warm light, photorealistic, --ar 2:3"
2. Per ogni pin sostituisci [SCENE] dal visual brief sopra
3. Esempio: "Pinterest pin 2:3, couple silhouette dancing at golden hour wedding, audio waveform overlay, italic serif text 'Their first dance, written from their love story', warm cinematic, photorealistic --ar 2:3"
4. Tempo: 2-3 ore + costo subscription Midjourney $10/mese

**Opzione C — Mix**: Master design Canva + AI generated background = velocissimo. Raccomandato.

---

# FILE OUTPUT QUANDO PUBBLICATO

Salva i pin pubblicati in /sales/pinterest/published.csv:
```
pin_id, pin_url, board, published_at, title, link, impressions_7d, outbound_clicks_7d, saves_7d
```

Settimanalmente esporto da Pinterest Analytics → aggiorno → identifico top performer.
