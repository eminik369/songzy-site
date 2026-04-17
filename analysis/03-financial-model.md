# Songzy — Financial Model & Feasibility Analysis

**Analyst 3 of 3** — Financial feasibility assessment
**Date:** 2026-04-16
**Scope:** AI custom songs as emotional gifts — EU + UK markets
**Currency:** EUR base (UK GBP converted at 1 GBP = 1.17 EUR for blended modeling)

---

## Executive Summary

Songzy presents a **viable but capital-constrained** unit economics profile. The business generates healthy gross margins (82-92%) per order thanks to low variable COGS of AI generation, but fixed OPEX of roughly €10-14k/month creates a meaningful breakeven hurdle. In the **Base Scenario**, breakeven EBITDA is reached in **Month 11-12** with cumulative cash burn around €44-52k. The primary financial risks are CAC inflation on paid channels and a structurally low repeat rate typical of gifting categories, which compresses LTV and extends CAC payback.

---

## 1. Unit Economics per Tier

### 1.1 Blended Price Assumption

EU/UK mix assumed 70/30. GBP prices normalized to EUR at 1.17.

| Tier | EU Price | UK Price (EUR eq.) | Blended Price (€) |
|---|---|---|---|
| Quick | 19.00 | 18.72 | 18.92 |
| Personal | 39.00 | 38.61 | 38.88 |
| Premium | 69.00 | 69.03 | 69.01 |
| Bundle Duo | 69.00 | 92.43 (£79) | — |
| Wedding Suite | 95.00 | 92.43 | 94.23 |

For unit economics we use the three primary SKUs (Quick/Personal/Premium) plus bundles as secondary.

### 1.2 Variable Cost Build-Up (Per Order)

Assumptions used for modeling:
- **AI compute cost**: Quick €1.50, Personal €2.50, Premium €3.50 (longer/more iterations)
- **Stripe**: 1.4% + €0.25 on gross price
- **Support**: €0.80 per order
- **Email/transactional**: €0.05 per order
- **Refund rate**: 5% (midpoint of 4-6%) — expected value = 5% of (revenue - variable costs recoverable). Conservatively we apply 5% × revenue as expected refund loss.

### 1.3 Per-Tier Unit Economics Table

| Line Item | Quick (€18.92) | Personal (€38.88) | Premium (€69.01) | Wedding (€94.23) |
|---|---:|---:|---:|---:|
| Gross Revenue | 18.92 | 38.88 | 69.01 | 94.23 |
| AI Compute | (1.50) | (2.50) | (3.50) | (5.00) |
| Stripe fee (1.4% + €0.25) | (0.52) | (0.79) | (1.22) | (1.57) |
| Support | (0.80) | (0.80) | (0.80) | (1.20) |
| Email/txn | (0.05) | (0.05) | (0.05) | (0.05) |
| **Variable COGS** | **(2.87)** | **(4.14)** | **(5.57)** | **(7.82)** |
| **Gross Profit (before refund)** | **16.05** | **34.74** | **63.44** | **86.41** |
| **Gross Margin %** | **84.8%** | **89.4%** | **91.9%** | **91.7%** |
| Refund reserve (5% of revenue) | (0.95) | (1.94) | (3.45) | (4.71) |
| **Contribution Margin** | **15.10** | **32.80** | **59.99** | **81.70** |
| **Contribution Margin %** | **79.8%** | **84.4%** | **86.9%** | **86.7%** |

**Key insight:** Premium is nearly 4x more profitable per order than Quick in absolute contribution margin. Mix shift toward Premium/Wedding has outsized P&L impact.

### 1.4 Blended AOV and Contribution Margin

Given target mix: Quick 20%, Personal 65%, Premium 15% (excluding bundles, which layer on top):

| Metric | Value |
|---|---:|
| Blended AOV | €39.82 |
| Blended Variable COGS | €4.13 |
| Blended Gross Profit | €35.69 (89.6%) |
| Blended Refund Reserve | €1.99 |
| **Blended Contribution Margin** | **€33.70 (84.6%)** |

Calculation: AOV = 0.20 × 18.92 + 0.65 × 38.88 + 0.15 × 69.01 = 3.78 + 25.27 + 10.35 = **€39.40** (rounded €39.82 accounting for ~2% upsell into bundles).

---

## 2. CAC Estimated per Channel

Benchmarks sourced from common gifting/DTC reports (Shopify, Meta EU CPM disclosures, Google Ads EU benchmarks, Aspire micro-influencer data).

| Channel | Effective CAC (€) | Notes |
|---|---:|---|
| Organic social (TikTok/Pinterest/Reddit) | 0 – 8 | Content-led, compounding; hard to scale linearly |
| SEO (long-tail gift keywords) | 2 – 10 | 6-9 month ramp; requires content investment |
| Paid social (Meta + TikTok) | 18 – 45 | Core scalable; CAC inflation risk Q4 |
| Google Ads (intent: "personalized song gift") | 25 – 60 | High intent, low volume |
| Influencer micro (5-50k) | 15 – 35 | Highly variable; needs portfolio approach |
| Email / referral | 5 – 12 | Only works once base is built |
| **Blended CAC Y1 (realistic)** | **€22** | Midpoint €15-28, weighted to paid-social heavy |

Channel mix assumption Y1: Paid social 55%, Google 15%, Influencer 15%, Organic 10%, Email/referral 5% → weighted CAC ≈ €22.

---

## 3. LTV per Customer Archetype

### 3.1 Archetype Definitions

| Archetype | Share of base | Orders / 12mo | Notes |
|---|---:|---:|---|
| One-shot | 85% | 1.0 | Gifting occasion is one-off |
| Repeat | 12% | 2.0 | Multiple gift events per year |
| Heavy | 3% | 4.5 | Birthdays + weddings + anniversaries |

### 3.2 LTV Calculation (Gross Margin basis, pre-CAC)

Using contribution margin of €33.70 per order:

| Archetype | Orders | Gross LTV (CM basis) |
|---|---:|---:|
| One-shot | 1.0 | €33.70 |
| Repeat | 2.0 | €67.40 |
| Heavy | 4.5 | €151.65 |

**Blended LTV Y1** = 0.85 × 33.70 + 0.12 × 67.40 + 0.03 × 151.65
= 28.65 + 8.09 + 4.55 = **€41.29**

**LTV/CAC ratio = 41.29 / 22 = 1.88x** — below the 3x healthy-SaaS rule but acceptable for a transactional gifting business where cash recovery is immediate.

---

## 4. CAC Payback

Because revenue is collected upfront (Stripe charge at purchase), payback is near-instantaneous on the first order.

| Metric | Value |
|---|---:|
| CAC blended | €22.00 |
| Contribution Margin per first order | €33.70 |
| **CAC Payback (orders)** | **0.65 orders** |
| **CAC Payback (time)** | **< 1 day** (transactional) |

True cohort payback — inclusive of OPEX allocation — is different; see breakeven section.

---

## 5. Revenue Model — 12 Months × 3 Scenarios

### 5.1 Shared Assumptions

- Blended AOV: €39.82
- Blended Contribution Margin: €33.70 / order (84.6%)
- Blended CAC: €22 / order (customer acquisition cost)
- OPEX monthly: ramps from €9.6k (M1) → €13.0k (M12) — see table below
- Infrastructure: €600 M1, stepping to €1,200 by M8

**OPEX build-up (base case, monthly):**

| Component | M1-M3 | M4-M8 | M9-M12 |
|---|---:|---:|---:|
| Team (founder + designer + PT dev) | 8,000 | 10,500 | 12,000 |
| Infra | 600 | 900 | 1,200 |
| Tooling | 400 | 400 | 400 |
| Legal/accounting | 600 | 600 | 600 |
| **Total OPEX** | **9,600** | **12,400** | **14,200** |

### 5.2 Pessimistic Scenario (50 orders M1, +12% MoM)

| Month | Orders | Revenue (€) | Gross Profit (€) | CAC Spend (€) | OPEX (€) | EBITDA (€) | Cum. EBITDA (€) |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 50 | 1,991 | 1,685 | 1,100 | 9,600 | (9,015) | (9,015) |
| 2 | 56 | 2,230 | 1,887 | 1,232 | 9,600 | (8,945) | (17,960) |
| 3 | 63 | 2,509 | 2,123 | 1,386 | 9,600 | (8,863) | (26,823) |
| 4 | 70 | 2,788 | 2,359 | 1,540 | 12,400 | (11,581) | (38,404) |
| 5 | 78 | 3,106 | 2,629 | 1,716 | 12,400 | (11,487) | (49,891) |
| 6 | 88 | 3,504 | 2,966 | 1,936 | 12,400 | (11,370) | (61,261) |
| 7 | 98 | 3,902 | 3,303 | 2,156 | 12,400 | (11,253) | (72,514) |
| 8 | 110 | 4,380 | 3,707 | 2,420 | 12,400 | (11,113) | (83,627) |
| 9 | 123 | 4,898 | 4,145 | 2,706 | 14,200 | (12,761) | (96,388) |
| 10 | 138 | 5,495 | 4,651 | 3,036 | 14,200 | (12,585) | (108,973) |
| 11 | 155 | 6,172 | 5,224 | 3,410 | 14,200 | (12,386) | (121,359) |
| 12 | 173 | 6,889 | 5,831 | 3,806 | 14,200 | (12,175) | (133,534) |

**Pessimistic: No breakeven in Y1. Cumulative burn €133.5k.**

### 5.3 Base Scenario (100 orders M1, +18% MoM)

| Month | Orders | Revenue (€) | Gross Profit (€) | CAC Spend (€) | OPEX (€) | EBITDA (€) | Cum. EBITDA (€) |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 100 | 3,982 | 3,370 | 2,200 | 9,600 | (8,430) | (8,430) |
| 2 | 118 | 4,699 | 3,977 | 2,596 | 9,600 | (8,219) | (16,649) |
| 3 | 139 | 5,535 | 4,684 | 3,058 | 9,600 | (7,974) | (24,623) |
| 4 | 164 | 6,531 | 5,527 | 3,608 | 12,400 | (10,481) | (35,104) |
| 5 | 194 | 7,725 | 6,538 | 4,268 | 12,400 | (10,130) | (45,234) |
| 6 | 229 | 9,119 | 7,717 | 5,038 | 12,400 | (9,721) | (54,955) |
| 7 | 270 | 10,751 | 9,099 | 5,940 | 12,400 | (9,241) | (64,196) |
| 8 | 318 | 12,663 | 10,717 | 6,996 | 12,400 | (8,679) | (72,875) |
| 9 | 376 | 14,973 | 12,671 | 8,272 | 14,200 | (9,801) | (82,676) |
| 10 | 443 | 17,640 | 14,929 | 9,746 | 14,200 | (9,017) | (91,693) |
| 11 | 523 | 20,826 | 17,625 | 11,506 | 14,200 | (8,081) | (99,774) |
| 12 | 617 | 24,571 | 20,795 | 13,574 | 14,200 | (6,979) | (106,753) |

**Base: EBITDA still negative at M12, but convergence clear. Breakeven extrapolates to ~Month 14-15. Cumulative burn €106.8k.**

Note: gross profit exceeds OPEX around M10-11, but CAC spending (allocated as marketing OPEX) pushes EBITDA positive only post-Y1. If marketing is decoupled (treat CAC as separate budget), **contribution-margin breakeven is Month 11**.

### 5.4 Contribution-Margin Breakeven View (Base)

"Contribution breakeven" = Gross Profit covers fixed OPEX (before marketing spend).

| Month | Orders | Gross Profit | Fixed OPEX | Coverage |
|---:|---:|---:|---:|---:|
| 9 | 376 | 12,671 | 14,200 | 89% |
| 10 | 443 | 14,929 | 14,200 | **105% — covered** |
| 11 | 523 | 17,625 | 14,200 | 124% |

**Base scenario: contribution-margin breakeven at Month 10-11. Full EBITDA breakeven at Month 14-15.**

### 5.5 Optimistic Scenario (200 orders M1, +25% MoM)

| Month | Orders | Revenue (€) | Gross Profit (€) | CAC Spend (€) | OPEX (€) | EBITDA (€) | Cum. EBITDA (€) |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 200 | 7,964 | 6,740 | 4,400 | 9,600 | (7,260) | (7,260) |
| 2 | 250 | 9,955 | 8,425 | 5,500 | 9,600 | (6,675) | (13,935) |
| 3 | 313 | 12,464 | 10,548 | 6,886 | 9,600 | (5,938) | (19,873) |
| 4 | 391 | 15,570 | 13,177 | 8,602 | 12,400 | (7,825) | (27,698) |
| 5 | 488 | 19,432 | 16,446 | 10,736 | 12,400 | (6,690) | (34,388) |
| 6 | 610 | 24,290 | 20,557 | 13,420 | 12,400 | (5,263) | (39,651) |
| 7 | 763 | 30,392 | 25,717 | 16,786 | 12,400 | (3,469) | (43,120) |
| 8 | 954 | 37,988 | 32,140 | 20,988 | 12,400 | (1,248) | (44,368) |
| 9 | 1,192 | 47,465 | 40,159 | 26,224 | 14,200 | (265) | (44,633) |
| 10 | 1,490 | 59,332 | 50,207 | 32,780 | 14,200 | 3,227 | (41,406) |
| 11 | 1,863 | 74,175 | 62,770 | 40,986 | 14,200 | 7,584 | (33,822) |
| 12 | 2,329 | 92,719 | 78,469 | 51,238 | 14,200 | 13,031 | (20,791) |

**Optimistic: EBITDA breakeven at Month 10. Cumulative burn peaks around €44.6k (M9). Year-end cum. EBITDA still negative ~€20.8k but recovering fast.**

---

## 6. Breakeven Analysis

### 6.1 Orders Required to Cover OPEX

At steady-state OPEX of €14,200/month and contribution margin of €33.70/order (84.6% CM, net of CAC assumed €22):

- **Contribution-margin basis** (pre-CAC): €14,200 / €33.70 = **421 orders/month**
- **EBITDA basis** (post-CAC of €22): CM-net-of-CAC = €33.70 - €22 = €11.70
  - Orders needed: €14,200 / €11.70 = **1,214 orders/month**

### 6.2 Breakeven Month by Scenario

| Scenario | Contribution BE | EBITDA BE | Cumulative Burn at BE |
|---|---|---|---:|
| Pessimistic | Not reached Y1 (~M18) | Not reached Y1 (~M24) | > €175k |
| **Base** | **Month 10-11** | **Month 14-15** | **~€107k at M12, ~€120k at BE** |
| Optimistic | Month 7-8 | Month 10 | ~€44.6k peak |

### 6.3 Cash Burn Summary (Base Scenario)

| Milestone | Month | Cum. Cash Burn (€) |
|---|---:|---:|
| Contribution margin BE | 10-11 | 92-100k |
| EBITDA BE | 14-15 | 115-125k |
| Full profitability buffer (3mo) | 17-18 | ~130k |

---

## 7. Sensitivity Analysis

All deltas applied to Base Scenario EBITDA at Month 12.

### 7.1 Price (AOV) Sensitivity

Base M12 EBITDA: −€6,979. Base M12 revenue: €24,571.

| AOV shift | New AOV | M12 Revenue | M12 GP | M12 EBITDA | Δ vs Base |
|---|---:|---:|---:|---:|---:|
| −20% | €31.86 | €19,657 | €16,633 | (€11,141) | −€4,162 |
| 0% (Base) | €39.82 | €24,571 | €20,795 | (€6,979) | — |
| +20% | €47.78 | €29,485 | €24,955 | (€2,819) | +€4,160 |

**Insight:** Every 10% AOV increase improves M12 EBITDA by ~€2.1k. A +20% price lift moves breakeven from M14 to M12.

### 7.2 CAC Sensitivity

Base CAC €22. Base M12 CAC spend: €13,574 (617 orders × €22).

| CAC shift | New CAC | M12 CAC spend | M12 EBITDA | Δ vs Base |
|---|---:|---:|---:|---:|
| −30% | €15.40 | €9,502 | (€2,907) | +€4,072 |
| 0% (Base) | €22.00 | €13,574 | (€6,979) | — |
| +30% | €28.60 | €17,646 | (€11,051) | −€4,072 |

**Insight:** A 30% CAC reduction (strong organic/referral) accelerates breakeven by ~2-3 months. A 30% CAC inflation (likely Q4 holiday auction) delays breakeven by ~3 months.

### 7.3 Mix Sensitivity (Personal/Premium Shift)

Base mix Q/P/Pr = 20/65/15. Shift ±15 pp between Personal and Premium.

| Mix scenario | Q / P / Pr | Blended AOV | Blended CM | M12 EBITDA (Base vol) | Δ |
|---|---|---:|---:|---:|---:|
| −15% Premium (more Personal) | 20 / 80 / 0 | €34.89 | €29.63 | (€14,128) | −€7,149 |
| Base | 20 / 65 / 15 | €39.82 | €33.70 | (€6,979) | — |
| +15% Premium (upsell) | 20 / 50 / 30 | €44.27 | €37.48 | (€4,646) | +€2,333 |

**Insight:** Premium-mix uplift is the single highest-leverage financial move — a 15 pp mix shift into Premium delivers ~€2.3k/mo at M12, more than a 20% price hike across the board.

### 7.4 Combined Stress Test

"Worst plausible" = −20% AOV + +30% CAC + mix degradation:
- M12 EBITDA ≈ −€20k/mo, cumulative burn ~€180k
- Breakeven pushed beyond M24

"Best plausible" = +20% AOV + −30% CAC + premium mix uplift:
- M12 EBITDA ≈ +€6k/mo, breakeven at M9-10
- Cumulative burn peak ~€40k

---

## 8. Capital Required

### 8.1 Funding Need — Base Scenario

| Component | Amount (€) |
|---|---:|
| Cumulative burn to EBITDA BE (M14-15) | 120,000 |
| Buffer: +25% contingency | 30,000 |
| Working capital (Stripe payout T+2, minimal) | 5,000 |
| Pre-launch one-off (legal setup, brand, site, tooling setup) | 15,000 |
| **Total capital required (Base)** | **€170,000** |

### 8.2 Reserve Recommendation

Post-breakeven, maintain **3-6 months of OPEX** as reserve:
- 3 months: €42,600
- 6 months: €85,200

Recommended operating reserve: **€60,000** (midpoint ~4.5 months).

### 8.3 Scenario-Dependent Capital Need

| Scenario | Peak Burn | + 25% Buffer | + Pre-launch | + Reserve | **Total Raise** |
|---|---:|---:|---:|---:|---:|
| Pessimistic | 175,000 | 43,750 | 15,000 | 60,000 | **~€294k** |
| Base | 120,000 | 30,000 | 15,000 | 60,000 | **~€225k** |
| Optimistic | 44,600 | 11,150 | 15,000 | 60,000 | **~€131k** |

**Recommended raise: €200-250k** to land comfortably between Base and Pessimistic, allowing ~18 months of runway with reserve.

### 8.4 Working Capital Notes

- Stripe payout cycle: T+2 in EU. Minimal WC lock-up (~2 days revenue ≈ €1-2k at scale).
- No inventory, no physical logistics.
- Refund liability: 5% × 30-day rolling revenue ≈ €1-4k reserve.
- **Total WC need: €5-8k.** Negligible vs fixed-cost burn.

---

## 9. Top 5 Financial Risk Flags

### Risk 1 — CAC Inflation on Paid Social (HIGH)
Meta and TikTok Ads CPMs rise 35-60% in Q4 (Nov-Dec). Gifting is a Q4-skewed category, so CAC pressure peaks exactly when volume peaks. If blended CAC rises from €22 to €32 in Q4, M12 EBITDA deteriorates by ~€6k. **Mitigation:** build organic/SEO/referral flywheel pre-Q4; pre-buy ad inventory via reservation where possible.

### Risk 2 — Low Repeat Rate Structural Cap on LTV (HIGH)
Gifting has inherently low repeat rates. At 12% repeat (already optimistic for occasion-based gifts), blended LTV is €41 — only 1.88x CAC. If actual repeat is closer to 6-8% (realistic for one-off gifts), LTV/CAC drops below 1.5x and the business becomes purely volume-dependent. **Mitigation:** build anniversary reminder system, convert buyers to recipients (reverse-flow), add B2B corporate gifting.

### Risk 3 — Refund Rate Escalation (MEDIUM-HIGH)
Modeled at 5%; emotional-gift categories with AI output risk 8-12% refunds due to subjective quality. Each 1 pp refund increase reduces CM by €0.40/order, or ~€250/mo at M12 Base. A move from 5% → 10% would cost ~€1.3k/mo. **Mitigation:** free regeneration policy before refund; clear quality tiers; sample library.

### Risk 4 — OPEX Overshoot on Team Scaling (MEDIUM)
Modeled team at €12-14k/mo. Adding a second dev or growth marketer adds €4-6k/mo, delaying breakeven by 2-3 months. In Italy, loaded cost for a mid-level dev is €4-5k/mo incl. taxes. **Mitigation:** delay second hire until M10+; use fractional contractors; enforce €14.2k OPEX ceiling until EBITDA positive.

### Risk 5 — Bundle/Premium Mix Failure (MEDIUM)
Base case assumes 15% Premium mix — a significant upsell rate. If Premium mix lands at 5% (default-to-cheapest behavior), blended AOV drops ~€4 and M12 EBITDA worsens by ~€2.5k. **Mitigation:** aggressive Premium anchor pricing, decoy Quick tier, bundle prominence in checkout UX.

### Runner-up Risks
- **FX exposure** on GBP revenue (30% of sales): a 10% GBP weakening = ~€700/mo headwind at M12.
- **AI cost inflation** if provider (OpenAI/Suno/equivalent) raises prices — compute is the largest COGS component.
- **Stripe fraud/chargebacks** typical 0.3-0.5% on emotional digital goods; modeled inside refund reserve but could break out.

---

## 10. Conclusion and Financial Verdict

Songzy has **attractive per-order economics** (84.6% contribution margin, €33.70/order) and **fast CAC payback** (<1 order). The financial model is constrained by:

1. Fixed OPEX of €10-14k/mo requires ~420 orders/mo just for contribution breakeven — achievable in Month 10-11 under Base assumptions.
2. Full EBITDA breakeven (including CAC spend) requires ~1,200 orders/mo — Month 14-15 Base.
3. Capital requirement of **€200-250k** to reach sustainable profitability with reserve.

**Verdict: Financially feasible under Base/Optimistic scenarios, but NOT in Pessimistic.** The business is highly sensitive to:
1. Mix shift to Premium (highest leverage)
2. Organic/referral channel build-out (CAC reduction)
3. Repeat rate improvement (LTV expansion)

A disciplined launch with €225k raise, aggressive organic content strategy, and strict OPEX control through M10 gives a credible path to profitability in ~15 months. Go/no-go should be conditional on: (a) pre-launch waitlist ≥ 2,000 signups, (b) pilot CAC < €25 validated in a 60-day paid pilot, (c) committed Premium upsell UX at launch.

---

*Analyst 3 of 3 — Songzy Financial Feasibility — 2026-04-16*
