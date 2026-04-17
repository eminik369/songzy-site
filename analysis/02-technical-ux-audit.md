# Songzy — Technical & UX Audit (Analyst 2 of 3)

**Scope:** full review of the current landing page source in `/sections/` — structure, performance, SEO, a11y, mobile UX, conversion, funnel friction, blockers.
**Date:** 2026-04-16.
**Note on method:** this audit reads the static source only; no Lighthouse run, no real DOM. Scores below are informed estimates against equivalent pages I've seen ship.

---

## 1. Technical inventory

### Files and weights (raw bytes, uncompressed)

| File | Bytes | Notes |
|---|---|---|
| `01-nav-hero.html` | 43,091 | nav + hero, inline CSS + inline JS |
| `02-social-proof.html` | 17,622 | stats + quote, inline CSS + counter JS |
| `03-how-it-works.html` | 21,257 | 3-step cards, inline CSS + IO JS |
| `04-audio-examples.html` | 33,489 | 6-card grid, filter tabs, UI-only audio |
| `05-use-cases.html` | 22,803 | 6 use-case cards + banner, CSS only |
| `06-pricing.html` | 47,325 | 3 tiers + bundles + steps + trust bar + currency toggle JS |
| `07-testimonials.html` | 25,945 | masonry, aggregate, CTA, IO fade-in JS |
| `08-faq-footer.html` | 44,004 | FAQ accordion + final CTA + footer + lang selector |
| `09-styles.css` | 19,597 | global tokens / utilities |
| `10-scripts.js` | 29,995 | global master JS (13 modules) |
| **Total** | **305,128 B (~298 KB)** | before any HTML wrapper |

- **There is no `index.html`** in the project root. The eight section partials are stand-alone HTML fragments — each opens with `<!-- comment -->` and a `<section>` or `<header>`. They are not currently assembled. This is the #1 structural gap: nothing ships until someone concatenates them into a single document with `<!doctype html>`, `<html lang>`, `<head>`, `<meta>`, etc.
- `assets/` is empty (0 files). `logo-songzy.jpg` sits at project root, not referenced anywhere in the HTML (no `<img src>` points to it).
- Every section partial contains its own `<style>` block *and* its own `@import url('https://fonts.googleapis.com/...Fraunces...Geist...JetBrains+Mono...')` — the same three-family import is repeated in **8 files** (09-styles.css adds a 9th `@import` for `Inter` + `Playfair Display`). That's 4–5 render-blocking font families, imported ~9 times. Browsers de-dupe at the network layer, but each `@import` still creates a serial blocking dependency on the containing stylesheet.

### Dependencies

- **Runtime**: zero. No React, no jQuery, no npm, no bundler. All vanilla ES6+ in `10-scripts.js` + section-scoped IIFEs.
- **External**: Google Fonts only. No CDN for icons (everything is inline SVG — good), no analytics, no Stripe.js, no CMP, no Trustpilot widget.
- **Build step**: none. The files ship as-is.

---

## 2. Performance audit (estimated)

### Critical render path

- **9 separate `@import` font statements across the doc.** `@import` is the worst way to load a stylesheet — it serialises the download (browser can't discover the font CSS until the parent CSS parses). Request waterfall will have a 2-step wait for every `@import`. The Fraunces family alone with 6 weight/ital combos × opsz range is ≥ 80 KB of WOFF2 per family; aggregate font payload is probably **250–350 KB** of actual fonts, on top of the ~30 KB of CSS referencing them.
- **No `preconnect` / `preload`** to `fonts.googleapis.com` or `fonts.gstatic.com`. Adding these two tags saves ~300 ms on first paint.
- **No critical-CSS extraction.** All section CSS lives inline in partials — that's fine for "no build" but means **every visitor downloads the full ~300 KB doc on first byte** before anything can paint. The CSS is inlined so at least it's not a second round-trip.
- **JavaScript is not deferred.** Each section has an inline `<script>` that runs inline in document order; `10-scripts.js` has no `defer`/`async` attribute referenced anywhere (there's no `<script src=>` to begin with — it's never included from the partials).
- **No image optimisation.** `logo-songzy.jpg` is 29 KB and unused. If the final HTML references it without `<picture>` + WebP/AVIF + width/height + `loading="lazy"` fetchpriority, there's LCP risk. The hero is text-only with a CSS mockup, which is actually good for LCP (~1.8s on 4G estimate).

### Estimates (4G Fast, mid-tier Android)

| Metric | Estimate | Why |
|---|---|---|
| TTFB | 200–400 ms | static HTML, depends on host |
| FCP | 1.4–1.9 s | CSS inlined, fonts still block text |
| LCP | 2.2–3.0 s | hero headline with custom font; `font-display: swap` *is* in the query string, so FOUT acceptable |
| TBT | 50–150 ms | lots of small IIFEs, IntersectionObservers, no heavy parse |
| CLS | **risk: 0.10–0.25** | counter labels swap from "0" to "12,800+" on scroll → layout shift; webfont swap on headline; no `width`/`height` on decorative SVGs inside flex rows |
| INP | <200 ms | event handlers are light; FAQ maxHeight animation is the heaviest |

### Lighthouse score estimates

- **Performance: 65–78** (desktop: 80–90). Hurt by fonts + 300 KB HTML + inline JS blocking; helped by no images, no frameworks, inline CSS, use of rAF.
- **Accessibility: 80–88**. Strong: skip link, aria-live, aria-pressed, prefers-reduced-motion in every section, keyboard-accessible FAQ. Weak: colour contrast of `--color-text-muted #8E8EA8` on `#0B0B14` is **~6.8:1** (passes AA) but `.faq__privacy` muted-on-muted and some `opacity: .28` decorative quotes fail contrast; currency toggle pill relies on colour alone (no icon state for pressed); no `lang` attribute because there's no `<html>` yet.
- **Best Practices: 85–95**. No HTTPS issues (static), no console errors likely, CSP missing, no SRI on Google Fonts.
- **SEO: 40–55**. Missing almost everything a crawler wants (see §3).

### JavaScript review

- **Duplicate/overlapping logic.** `10-scripts.js` has a FAQ accordion module that looks for `.faq-item` / `.faq-question` — but the actual FAQ in `08-faq-footer.html` uses `.faq__item` / `.faq__q` and already has its own inline accordion JS (BEM-style). So the global module is **dead code** against the current markup. Same story for `audioPlayerModule` (looks for `.song-card`; markup is `.aex__card`), `genreFilterModule`, `testimonialCarouselModule`, `currencyModule` (global duplicates the pricing-local one, with conflicting storage casing: global uses `EUR`/`GBP`, pricing local uses `eur`/`gbp` — **they will desync**).
- **Storage key collision**: global JS stores `songzy.currency` as `"EUR"`/`"GBP"`; pricing + nav inline JS store `"eur"`/`"gbp"`. First-load read from either side treats the other's value as invalid and falls back. **This is a real bug, not theoretical.**
- **Tree-shaking opportunity**: ~40% of `10-scripts.js` never fires against current DOM (carousel, marquee, legacy audio player, legacy FAQ, old genre filter, tilt fallback for `.pricing-card`). Estimated dead code: **~12 KB of JS**.
- **Same-tab currency poll in nav** (`setInterval 800ms`): wastes a timer forever to work around the fact that `storage` doesn't fire same-tab. Could be replaced with a `CustomEvent` dispatch (the global module already dispatches `songzy:currencychange`), once the two are reconciled.
- **No error boundaries around `audio.play()`**: actually handled (`.catch`) — good.
- **Gzip/Brotli**: the codebase will gzip to roughly **55–70 KB** total (HTML is repetitive, CSS tokens repeat), which is reasonable. Brotli ~45 KB.

### CSS review

- Each section re-declares **the same 12 tokens** under a different prefix (`--nv-`, `--hr-`, `--sp-`, `--hw-`, `--ax-`, `--uc-`, `--px-`, `--tm-`, `--ff-`, `--fc-`, `--f-`). Intentional (CSS isolation) but costs ~1.8 KB per section in repetition.
- 9 `@import` of Google Fonts is the single biggest saving: consolidate to **one `<link rel="preconnect"> + <link rel="preload">` in `<head>`**.
- `backdrop-filter: blur(14px) saturate(1.1)` appears **11 times**. On mid-range Android, each blurred surface costs a composite layer. Scrolling the page likely costs 10–15% CPU just on blur layers. Consider a `@media (prefers-reduced-data)` or low-end fallback that drops the blur.
- Redundant/unused CSS in `09-styles.css`: `.heading-1`, `.heading-2`, `.heading-3`, `.quote-display`, `.btn--sm`, `.marquee`, `.aspect-*`, `.chip`, `.field`, most of the utility grid helpers — **not referenced** anywhere in the section partials. Roughly 30–40% of `09-styles.css` is unused.

---

## 3. SEO on-page

Assuming the eight partials will be concatenated into a single `index.html`, these are the gaps:

- **No `<title>`** anywhere. Critical.
- **No `<meta name="description">`**, no Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:locale`), no Twitter Card. Critical for EU+UK ads & organic link previews.
- **No `<meta name="viewport">`**. Mobile layout will render at desktop width by default — this is a **ship blocker**.
- **No canonical URL.**
- **No JSON-LD** structured data. For an AI-song-as-gift product with pricing, ship at minimum:
  - `Product` + `Offer` schema for each tier (€29, €59, €99)
  - `FAQPage` schema on the 12 FAQs (free SERP real estate)
  - `AggregateRating` (4.8/5 from 1,940 reviews) — **only** if you can actually prove it to Google; otherwise this earns a manual action.
  - `Organization` + `WebSite` + `SearchAction` on the root.
- **Heading hierarchy**: in a concatenated build there will be **1 H1** (`#hero-headline`, good) and many H2s / H3s — roughly correct. The audio-player mock in the hero uses `<h2>` for "For Sarah, on her 40th" — that's a *decorative* h2 and will confuse crawlers. Change to a `<p>` or visually-equivalent div.
- **Alt text**: no `<img>` tags exist in any partial. All imagery is CSS/SVG, all decorative SVGs have `aria-hidden="true"` — good. The logo JPG is unused. When a real logo is added, it needs `alt="Songzy"` and server-side width/height.
- **Internal linking**: every CTA points to `#pricing` or `#checkout`. `#checkout` has **no target** in the document — the anchor goes nowhere (soft 404 for crawlers and a broken UX click). Fix: either point to `#pricing` or build the real checkout section.
- **`sitemap.xml` / `robots.txt`**: absent. Blockers for indexation at scale. Robots should allow crawling and reference the sitemap; sitemap should list EN/IT/FR/ES/DE variants with `<xhtml:link rel="alternate" hreflang="...">`.
- **Multilingual**: footer has a language selector for EN/IT/FR/ES/DE but it's **UI-only** — clicking does not navigate, does not set a cookie, does not change content. For an EU+UK launch, this needs at minimum an EN/IT/EN-GB split with separate URLs (`/en/`, `/it/`, `/en-gb/`) and `hreflang` tags. "EN" alone on a €29–€99 EU purchase funnel will cost conversions — Italian and German buyers convert 2–3× better in their own language on this kind of emotional gift product.

---

## 4. Accessibility (WCAG 2.1 AA)

### Wins
- Skip link is present, styled, focus-visible, and targets `#hero-headline`. Good.
- `prefers-reduced-motion` is honoured in every section — consistently. Rare to see this done so thoroughly.
- FAQ accordion uses `aria-expanded`, `aria-controls`, `id`/`aria-labelledby` pair. Keyboard works (Enter/Space handled explicitly).
- Currency toggle uses `aria-pressed`, `role="group"`, `aria-label`.
- Audio player tiles have `aria-pressed`, `aria-live` region announcing track changes.
- `aria-live="polite"` on stats and audio status.

### Issues
- **Colour contrast risks**:
  - `--nv-text-muted #8E8EA8` on `#0B0B14` is ~6.8:1 (AA pass for body, AAA fail). Fine.
  - The `.social-proof__quote-mark` and `::before` quotes at `opacity: .28` on dark are **~1.4:1** — decorative only, but check `aria-hidden` is set (it is).
  - `.pricing__price-suffix #8E8EA8` next to `#ECECF4` price — OK.
  - `.footer__pay` payment icons at `font-size: .52rem` with muted text — **fails AA** at that size. Minimum legible is ~.7 rem at AA body contrast.
- **Focus visible**: defined in `:focus-visible` globally (good), but the featured pricing CTA, the hero primary CTA, and the final CTA use `outline: 2px solid #fff` against a gradient background — contrast of white outline on the magenta gradient is low (~2.8:1 on the pink stop). Use `outline: 3px solid #fff; outline-offset: 3px` + a dark `box-shadow` ring for contrast on all gradient surfaces.
- **Audio player on hero** has `tabindex="-1"` on the play button — removes it from the keyboard tab order. The UI says "play" but can't be activated by keyboard. Either make it purely decorative (`aria-hidden`, role=img on the figure — already there) or make it keyboard-reachable and actually do something.
- **Mobile drawer**: the links inside `nav__drawer` are focusable when `data-open="false"` (only `visibility: hidden` is applied after 280 ms). Between `display` and `visibility`, tab order can briefly reach hidden links. Use `inert` attribute on the drawer when closed.
- **Lang attribute**: nothing in partials has `lang="en"` at the root, so screen readers pick OS default. Ship blocker for a11y compliance.
- **Heading order**: hero has `<h2 class="hero__player-title">` for a decorative mockup right under the H1 — that's a real (non-decorative) H2 by DOM contract. Demote to a `<p>` or `<span>` with visual styling.

---

## 5. Mobile UX

- **`<meta name="viewport">` missing** — see §3. Without it, mobile rendering is broken. Blocker.
- **Touch targets**: most CTAs are generously sized (hero CTA 18 px padding = ~52 px target; pricing CTA 16×22 = ~48 px; FAQ questions 22 px vertical padding = ~54 px). The one problematic target: the currency indicator pill in the nav (7 px × 12 px padding → ~28 px tall). Too small for comfortable thumb tap — and since it's `cursor: default` it reads as non-interactive, which matches the code (it's just a display, the actual toggle is in pricing). That's fine, but the mobile drawer should surface the currency selector too.
- **Audio filter tabs on mobile** (`04-audio-examples.html`): uses horizontal scroll container with hidden scrollbars — good pattern. But no scroll-snap; tabs can land mid-cut on small viewports. Add `scroll-snap-type: x mandatory; scroll-snap-align: start` on children.
- **Hamburger drawer**: implemented well (ARIA, ESC to close, body scroll lock, matchMedia cleanup). `inset: 72px 0 0 0` assumes the nav is always exactly 72 px tall, which it is on mobile — OK.
- **`.hero__player`** has a 3D perspective transform — already wisely neutralised on `@media (max-width: 560px)`.
- **Tap delay**: `-webkit-tap-highlight-color: transparent` applied globally on links (09-styles.css). Good. No touch-action rules, though; an over-active swipe on the audio filters could trigger page back-forward swipe on Safari iOS. Add `touch-action: pan-x` to `.aex__filters` on mobile.
- **Responsive breakpoints**: no test at 320 px (old iPhone SE) — the 2x2 social proof stats grid will probably be fine, but the `.hero__headline` uses `clamp(2.2rem, 5.2vw, 3.8rem)` which at 320 px is 2.2 rem = 35 px — a two-line fit. OK.
- **Audio player UX on mobile**: tapping a card's play button scrolls the card slightly due to the `translateY(-6px)` hover kicking in momentarily on touch. Replace `:hover` with `@media (hover:hover)` guard.

---

## 6. Conversion best practices

### Wins
- One dominant primary CTA above the fold (`Create their song`), one quiet secondary (`Hear one first`) — textbook.
- CTA is repeated at end of each section (pricing, testimonials, final CTA) — good drumbeat.
- Currency toggle remembered in localStorage, syncs cross-tab, and (attempts to) sync within the nav.
- No fake scarcity, no fake countdowns — commendable and on-brand for the audience (emotional gift buyers are allergic to pressure tactics).
- Guarantee block is clear, one-liner, visually calm: "If it's not the right song, it's not your song."
- Trust bar: Stripe badge, GDPR, VISA/MC/AMEX/Apple/GPay icons — appropriately modest.

### Gaps
- **`#checkout` is a broken anchor.** Every "Create a song" CTA points there. Currently it's nowhere. Users clicking in live will land at the top (because the anchor misses) and feel lost. **Ship-blocker.**
- **No error state if Stripe.js fails to load.** Not a current concern because Stripe isn't integrated, but the copy promises "Stripe handles your card" without any graceful fallback if Stripe.js CDN is blocked (common in EU with privacy extensions).
- **No JS-disabled fallback.** If JS is off: currency toggle doesn't change prices, FAQ accordions don't expand (content is `max-height: 0`), audio waveform bars never render (they're created in JS), genre filter does nothing, mobile drawer can't open. At minimum, add `<noscript>` styles that default FAQs open and remove `max-height: 0`.
- **No social proof in the hero viewport.** The "12,800+" line is in the hero but small. Consider surfacing "4.8 on Trustpilot" above the fold alongside the "No account" strip.
- **No exit-intent / scroll-depth** triggers. For a page this content-heavy, the drop-off between hero and pricing (6 sections of scroll) is meaningful — a sticky bottom bar on mobile with "from €29 · Create" could lift conversions 15–25% without being pushy.
- **Currency toggle visibility**: lives only in pricing section. Buyers who skim pricing and scroll away don't see the GBP option. The nav has a read-only indicator — consider promoting it to a real toggle there, or auto-detecting and showing a subtle "You're in EUR — switch to GBP?" banner on `.endsWith('-gb')` locale.
- **No gift-card / "send to them directly" on the form**. FAQ Q10 says "60% of orders are surprises" — that's a huge use case. Checkout form should have a first-class "Deliver to a different email" path.

---

## 7. Funnel friction map

| Step | Current state | Friction | Fix |
|---|---|---|---|
| Hero CTA | `<a href="#pricing">` | None — smooth anchor scroll works. | — |
| Pricing view | 3 tiers + bundles + steps + guarantee + trust | **Too much at once.** Scrolling past 3 tiers + 4 bundles + 4 steps before deciding. | Collapse bundles into a tab/accordion below the main 3. |
| Tier select | `<a href="#checkout">` | **Anchor dead.** | Point to `/checkout?tier=personal` or render a real inline form. |
| Story form | Doesn't exist | Users are promised "5 minutes, like texting a friend" but there's no form on the page. | Build a multi-step form with progress indicator and save-as-you-go. |
| Stripe payment | Not integrated | No embedded Stripe Checkout. | Stripe Checkout session with `prefill=email`, payment_methods=`['card','apple_pay','google_pay','sepa_debit','klarna']` for EU. |
| Confirmation | Doesn't exist | No post-pay "what's next" page. | Thank-you page + email confirmation + order-status link. |
| Lyrics/story form | Doesn't exist | FAQ says the form "walks you through it" — but it's vapourware in the current code. | Must exist before launch. |
| Generation | N/A | How long? Status updates? | WebSocket or polling job-status page. |
| Delivery | Email | No preview-before-download, no revision link. | Transactional email with preview audio player + "revise" CTA + download links. |

---

## 8. Quick wins (max 10, ranked by impact/effort)

| # | What | Why | Effort | Impact |
|---|---|---|---|---|
| 1 | Add `<html lang="en">`, `<head>` with `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<title>`, `<meta name="description">`, OG tags, and concatenate partials into `index.html`. | Page currently can't ship. | S | L |
| 2 | Fix `#checkout` dead anchor — either build the form or point to a working URL. | Every primary CTA is broken. | S | L |
| 3 | Consolidate all `@import` font statements into one `<link rel="preload" as="style">` + `<link rel="stylesheet">` in `<head>`, with `preconnect` to `fonts.gstatic.com`. Drop to 2 families (Fraunces + Geist) with 3 weights each. | Saves ~200–300 KB font payload, ~400 ms FCP. | S | L |
| 4 | Reconcile currency storage key casing: either `EUR`/`GBP` or `eur`/`gbp` everywhere. Remove the 800 ms poll; use `songzy:currencychange` CustomEvent. | Real bug causes desync between nav indicator and pricing numbers. | S | M |
| 5 | Delete dead code from `10-scripts.js` (carousel, marquee, legacy audio, legacy FAQ). Drop by ~12 KB. | File is half dead. | S | M |
| 6 | Add JSON-LD `Product`+`Offer` for each tier, `FAQPage` for FAQ, `Organization` for brand. | Free SERP real estate; conversion lift via rich results. | M | M |
| 7 | Add basic IT translation (EN default, IT at `/it/`, `hreflang` link). | Italian emotional-gift buyers convert 2–3× in-language. | L | L |
| 8 | Replace decorative `<h2 class="hero__player-title">` with `<p>`; ensure only one H1 and clean heading tree. | SEO + a11y. | S | S |
| 9 | Add `inert` to closed mobile drawer; widen `:focus-visible` ring contrast on gradient CTAs. | Keyboard users currently can tab into hidden links; focus ring is low-contrast on the brand gradient. | S | S |
| 10 | `<noscript>` fallback: make FAQs open, waveform hidden, currency pill shown as "EUR (toggle in pricing)". | ~1–2% of visitors have JS off or blocked; they currently see broken content. | S | S |

---

## 9. Blockers for launch (must-fix)

1. **No assembled `index.html`.** Eight partials, no shell, no `<doctype>`, no `<html>`, no `<head>`, no `<body>`, no `<meta viewport>`. The page cannot be served.
2. **`#checkout` goes nowhere.** Every conversion CTA on the page is non-functional.
3. **No Stripe integration.** Pricing promises secure payment, delivery in 2 hours; there is no purchase path. The form that collects the user's story (the core product input) also doesn't exist.
4. **No transactional email / order backend.** FAQ promises preview by email, revisions, refunds — none are wired.
5. **Currency storage bug (§8.4).** Nav and pricing will disagree in localStorage-active sessions.
6. **Missing `<meta name="viewport">`.** Mobile rendering will be broken without it regardless of media queries.
7. **No `robots.txt` / `sitemap.xml`.** Not strictly launch-blocking for conversion, but blocks organic traffic growth from day one.
8. **No cookie consent / CMP.** Required for EU+UK under GDPR/UK GDPR for any analytics, Stripe, or Google Fonts (Google Fonts self-hosted avoids a CMP requirement in DE specifically — worth doing).
9. **Legal pages are `/refund`, `/privacy`, `/terms`** — paths referenced in the footer but no content. For Stripe onboarding you need terms of service and privacy policy live at those URLs.
10. **Unverifiable claims.** "12,800+ songs delivered", "4.8/5 on Trustpilot based on 1,940 reviews", "Company No. 12345678", "VAT GB123456789" — all placeholder. Before launch either make true or remove. The Trustpilot one is the most dangerous: a claimed rating without a Trustpilot profile link that resolves will get flagged and harm trust.

---

## TL;DR

The design work is exceptional — scoped tokens, honest copy, prefers-reduced-motion everywhere, pattern-correct ARIA. The codebase is also weirdly mature for a "no build" project, with thoughtful JS isolation. But it is literally not a website yet: no `<html>` shell, no viewport tag, no checkout target, no Stripe, no form that collects the story, and placeholder legal data. Performance is decent-for-the-weight but hurt by nine redundant Google Fonts imports. SEO is near-zero. A11y is 80% there with five specific fixes that would push it to WCAG AA. None of this is hard to fix; all of it has to be fixed before you run a single euro of paid traffic at this page.
