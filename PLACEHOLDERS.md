# Placeholders + attribution log

> This file tracks every third-party asset that ships in the current static build as a placeholder / fallback.
> Replace these before public launch (Suno Pro songs, Stripe Payment Links, real email, etc.) and delete the corresponding row.

Date: 2026-04-17

---

## Hero background video (assets/hero/)

| File | Source | License | Action needed |
|---|---|---|---|
| hero-bg.mp4 | Mixkit — "Couple walking hand in hand" (ID 4661), `https://assets.mixkit.co/videos/4661/4661-720.mp4` | Mixkit Free License — commercial use allowed, no attribution required. See https://mixkit.co/license/ | Replace with founder-shot or higher-fidelity clip before launch. |
| hero-bg-mobile.mp4 | Same file (2.7MB already mobile-friendly) | — | Optional: encode 960x540 mobile variant when ffmpeg is available. |
| hero-poster.jpg | Auto-generated via `qlmanage` (macOS QuickLook thumbnail of hero-bg.mp4). | Derived from Mixkit — same license as source. | Regenerate from a more emotive frame if the chosen clip changes. |

Notes:
- ffmpeg was not available on the build machine, so only MP4 (no WebM/VP9) is shipped. The video element falls back to MP4 on every browser.
- Total hero weight ~2.7MB per video × 2 sources = ~5.4MB; acceptable but slightly above the ≤2.5MB target in the brief.

---

## Audio samples (assets/audio/)

All six tracks are Kevin MacLeod originals hosted on incompetech.com, licensed **CC BY 4.0**.
**Attribution is mandatory** wherever the audio is embedded. A single credit in the site footer or a dedicated `/credits.html` page satisfies CC BY 4.0.

Suggested credit block to add to the footer or credits page:

```
Music samples by Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0
https://creativecommons.org/licenses/by/4.0/
```

| Card # | File | Kevin MacLeod track |
|---|---|---|
| 1 | songzy-01-dreamy-flashback.mp3 | "Dreamy Flashback" — https://incompetech.com/music/royalty-free/mp3-royaltyfree/Dreamy%20Flashback.mp3 |
| 2 | songzy-02-private-reflection.mp3 | "Private Reflection" — https://incompetech.com/music/royalty-free/mp3-royaltyfree/Private%20Reflection.mp3 |
| 3 | songzy-03-despair-and-triumph.mp3 | "Despair and Triumph" — https://incompetech.com/music/royalty-free/mp3-royaltyfree/Despair%20and%20Triumph.mp3 |
| 4 | songzy-04-aftermath.mp3 | "Aftermath" — https://incompetech.com/music/royalty-free/mp3-royaltyfree/Aftermath.mp3 |
| 5 | songzy-05-evening-melodrama.mp3 | "Evening Melodrama" — https://incompetech.com/music/royalty-free/mp3-royaltyfree/Evening%20Melodrama.mp3 |
| 6 | songzy-06-thinking-music.mp3 | "Thinking Music" — https://incompetech.com/music/royalty-free/mp3-royaltyfree/Thinking%20Music.mp3 |

**Replace ASAP with 6 Suno Pro generations** — these instrumentals don't match what the product actually delivers (sung, personalised lyrics).

---

## Checkout flow (checkout.html)

- Pure static HTML/JS multi-step form — **no Stripe integration**.
- On submit the form attempts a POST to `https://formsubmit.co/ajax/hello@songzy.com` (FormSubmit.co free tier).
- First-time delivery requires **activating the FormSubmit address**: the first submission triggers a confirmation email to hello@songzy.com. Until someone clicks the activation link, no downstream deliveries happen.
- Draft state is persisted in `localStorage.songzy_order_draft`; cleared on successful submission.
- Replace the entire file once 7 Stripe Payment Links are generated, or add a real backend endpoint.

---

## Contact endpoints

- `hello@songzy.com` is not yet configured. All `mailto:` links have been replaced with `https://formsubmit.co/hello@songzy.com` (index.html FAQ, footer Contact; about/privacy/terms/refund pages link the same URL).
- **FormSubmit activation pending** — the founder must click the verification email sent to hello@songzy.com the first time a submission lands, otherwise the endpoint returns HTTP 200 but the message is queued indefinitely.
- Until hello@songzy.com is a real inbox, the activation email cannot be received. Short-term workaround: temporarily point FormSubmit to a personal Gmail (`https://formsubmit.co/<your-gmail>@gmail.com`) and swap later.

---

## Cookie banner / privacy

- `#cookieBanner` in index.html is a two-button placeholder (Accept / Reject) persisted to `localStorage.songzy_cookies`.
- Footer "Cookie preferences" is an `alert()` stub. Replace with Iubenda / Cookiebot script for production.

---

## Stripe (not yet wired)

Brief task §E, 🔴 priority — founder must generate 7 Payment Links and replace:
- `checkout.html?tier=quick` → Stripe URL (Quick €19)
- `checkout.html?tier=personal` → Stripe URL (Personal €39) ⭐
- `checkout.html?tier=premium` → Stripe URL (Premium €69)
- `checkout.html?tier=duo` → Stripe URL (Duo €99)
- `checkout.html?tier=family-year` → Stripe URL (Family Year €179)
- `checkout.html?tier=wedding-suite` → Stripe URL (Wedding Suite €199)
- `checkout.html?tier=valentines-duo` → Stripe URL (Valentine's Duo €129)

Every replacement must keep the existing `data-tier="<slug>"` attribute for analytics.

---

## Trustpilot / social proof

- `#trustpilot` links on testimonials are still dead anchors. Create real Trustpilot account, gather reviews, then swap to the real `https://www.trustpilot.com/review/songzy.com` URL.
