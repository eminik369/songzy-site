# Songzy — setup guide (end to end)

Everything's wired; you just sign up for the services and paste the credentials into Vercel. Budget ~2 hours for the first pass (mostly waiting on DNS + Stripe KYC).

All env var names referenced below are also listed in `.env.example` at the project root.

---

## 0. Prerequisites

- Node 22+ locally (`node -v`) and `npm`
- A GitHub account (the repo is already at `github.com/eminik369/songzy-site`)
- A credit card for paid services (Iubenda, Stripe KYC, optional Suno)

Clone + install deps once:

```bash
git clone https://github.com/eminik369/songzy-site.git
cd songzy-site
npm install
```

---

## 1. Domain — Cloudflare Registrar (≈ €9/yr for `.com`)

1. Buy `songzy.com` at https://dash.cloudflare.com/ → Domain Registration → Register.
2. DNS nameservers are already Cloudflare. Keep them — we'll point records to Vercel in step 2.

---

## 2. Vercel — import repo + domain

1. https://vercel.com/new → import `eminik369/songzy-site`.
2. Framework preset: **Other** (static). Build command: leave empty (the static files are served as-is). Install command: `npm install` (for the serverless functions).
3. Deploy. You'll get a `songzy-site.vercel.app` URL — confirm the landing page loads.
4. Project → **Settings → Domains** → Add `songzy.com` and `www.songzy.com`. Vercel prints the DNS records; paste them into Cloudflare (A/CNAME as instructed).
5. Project → **Settings → Environment Variables**. You'll paste values here at each subsequent step.

Set these now (they unblock the rest):

| Key | Value |
|---|---|
| `SITE_URL` | `https://songzy.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://songzy.com` |
| `CONTACT_EMAIL` | `hello@songzy.com` |
| `FOUNDER_EMAIL` | your inbox for new-order alerts |
| `ADMIN_PASSWORD` | `openssl rand -base64 24` (generate a long random string) |

---

## 3. Neon Postgres — via Vercel Marketplace

1. Vercel project → **Storage → Create Database → Neon**.
2. Choose the **Free** tier. Region: Frankfurt or Paris for EU.
3. Connect to the Songzy project. Vercel wires `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, etc. automatically (no copy/paste needed).
4. Apply the schema:

```bash
vercel env pull .env.local   # downloads POSTGRES_URL_NON_POOLING
psql "$(grep POSTGRES_URL_NON_POOLING .env.local | cut -d= -f2-)" -f db/schema.sql
```

You should see the four tables (`orders`, `briefs`, `deliveries`, `abandoned_carts`) listed with `\dt` in psql.

---

## 4. Vercel Blob — for MP3 delivery

1. Vercel project → **Storage → Create Blob Store**.
2. Name it `songzy-songs`. Connect to the project.
3. `BLOB_READ_WRITE_TOKEN` is auto-set in the project env. No further action.

---

## 5. Stripe

1. Sign up at https://stripe.com. Complete **KYC** (P.IVA / VAT required for EU payout). This is the longest step — Stripe may take up to 24 h to approve the account for payouts.
2. **Products → Add product** (create three, one Price each in EUR):
   - "Songzy Quick" — one-time €19 → copy the resulting `price_...`
   - "Songzy Personal" — one-time €39
   - "Songzy Premium" — one-time €69
3. Create the two add-ons the same way:
   - "Extended Version" (add-on) — one-time €10 → `price_...`
   - "Second Voice" (add-on) — one-time €15 → `price_...`
4. **Developers → API keys** — copy the *live* `pk_live_...` and `sk_live_...`.
5. **Developers → Webhooks → Add endpoint**:
   - URL: `https://songzy.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `charge.refunded`, `charge.refund.updated`, `payment_intent.payment_failed`
   - Copy the signing secret `whsec_...`.
6. Paste into Vercel env:

| Key | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `STRIPE_PRICE_QUICK_EUR` | `price_...` |
| `STRIPE_PRICE_PERSONAL_EUR` | `price_...` |
| `STRIPE_PRICE_PREMIUM_EUR` | `price_...` |
| `STRIPE_PRICE_ADDON_EXTENDED` | `price_...` |
| `STRIPE_PRICE_ADDON_SECOND_VOICE` | `price_...` |

Optional: create matching GBP products and set the `_GBP` variants.

For testing before you go live, use test-mode keys (`sk_test_...`, `pk_test_...`) on a **Preview** deployment instead.

---

## 6. Resend — transactional email

1. Sign up at https://resend.com. Free tier handles 3k/month.
2. **Domains → Add** `songzy.com`. Resend prints three DNS records (MX, TXT-SPF, TXT-DKIM). Paste them into Cloudflare.
3. Wait ~10 min for Resend to verify.
4. **API Keys → Create**. Copy `re_...`.
5. In Vercel env:

| Key | Value |
|---|---|
| `RESEND_API_KEY` | `re_...` |
| `RESEND_FROM_EMAIL` | `hello@songzy.com` |
| `RESEND_REPLY_TO` | `hello@songzy.com` |

---

## 7. Google Workspace (optional — for a real inbox at `hello@songzy.com`)

Only needed if you want to *receive* replies at `hello@songzy.com`. Resend only *sends*.

1. https://workspace.google.com → Start free trial (€6/mo).
2. Verify domain via TXT record on Cloudflare.
3. Add MX records for Google (the setup wizard lists them — make sure these DO NOT conflict with Resend; Resend only requires TXT DKIM, not MX).

---

## 8. Iubenda — cookie consent + privacy / terms policies

Required in the EU. Without this you shouldn't activate GA/Meta/TikTok pixels.

1. https://www.iubenda.com → Starter (≈ €27/yr).
2. **Cookie Solution** → Create for `songzy.com`. Copy **Site ID** and **Cookie Policy ID**.
3. **Privacy & Cookie Policy Generator** → generate policy; embed on `/privacy.html`.
4. In Vercel env:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_IUBENDA_SITE_ID` | the site id (number) |
| `NEXT_PUBLIC_IUBENDA_COOKIE_POLICY_ID` | the policy id (number) |

---

## 9. Analytics

### Google Analytics 4

1. https://analytics.google.com → Create property → Web data stream → `https://songzy.com`.
2. Copy the **Measurement ID** (`G-XXXXXXX`).
3. `NEXT_PUBLIC_GA4_ID = G-XXXXXXX` in Vercel env.

### Meta Pixel

1. https://business.facebook.com → Events Manager → Connect → Web → Create pixel.
2. Copy the **Pixel ID** (numeric).
3. `NEXT_PUBLIC_META_PIXEL_ID = ...` in Vercel env.

### TikTok Pixel

1. https://ads.tiktok.com → Events Manager → Pixel → Create.
2. Copy the **Pixel ID** (alphanumeric).
3. `NEXT_PUBLIC_TIKTOK_PIXEL_ID = ...` in Vercel env.

Vercel Analytics is loaded automatically by `/scripts/analytics.js` — no ID needed.

---

## 10. Suno Pro — to actually write songs ($10/mo)

1. https://suno.com → Pro plan.
2. For each paid order, read the brief (admin dashboard), build the Suno prompt, generate, pick the best take, download the MP3.
3. Upload via the admin dashboard (step 13 below).

---

## 11. First deploy

Commit + push, Vercel auto-deploys, then run:

```bash
vercel --prod
# or just: git push
```

Verify:
- `https://songzy.com` loads the landing
- `https://songzy.com/api/env.js` returns a JS snippet with your public IDs
- `https://songzy.com/admin.html` prompts for password

---

## 12. End-to-end test (before launch)

1. On a Preview deploy with Stripe **test** keys, click a pricing CTA → land on `/checkout.html` → complete form → you're redirected to Stripe → pay with `4242 4242 4242 4242`.
2. After success, you land on `/order-brief.html?session_id=cs_test_...` → fill the brief → submit.
3. You receive two emails (order + brief).
4. Open `/admin.html`, sign in with `ADMIN_PASSWORD`, see the order in the table.
5. Upload a small MP3 via admin → customer email arrives with `/m/<slug>` URL → opens the delivery page.
6. In Stripe dashboard, refund the test payment → confirm order status flips to `refunded` in admin.

---

## 13. Operating the business

- **New order alert** lands at `FOUNDER_EMAIL` as soon as Stripe confirms payment.
- **Brief ready alert** lands when the customer completes `/order-brief.html`.
- Open `https://songzy.com/admin.html`, pick the order, paste the lyrics, attach the MP3, hit **Ship it**.
- The customer gets an email with an unlisted `/m/<slug>` link. Forever-link; no account required.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `/api/checkout` returns 503 | `STRIPE_SECRET_KEY` unset or wrong prefix | Re-check env, redeploy |
| Webhook 400 | `STRIPE_WEBHOOK_SECRET` mismatch | Copy from the endpoint page, redeploy |
| `/api/brief` 503 | `POSTGRES_URL` missing | Attach Neon in Storage tab |
| Admin uploads fail | `BLOB_READ_WRITE_TOKEN` missing | Attach Blob store, redeploy |
| GA/Meta/TikTok not firing | Iubenda blocking pre-consent (normal) | Accept cookies, watch Network tab |
| Email not arriving | Domain not verified in Resend | Wait for DNS + re-check in Resend UI |

All API routes gracefully 503 when their dependency isn't configured — the site stays up.
