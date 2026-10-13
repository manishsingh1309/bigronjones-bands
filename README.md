# BigRonJones® — Funnel B: Paid Ads / Bands First
**Repository:** `bigronjones-funnel-b`  
**Production Subdomain:** `bands.bigronjones.com`  
**Traffic Source:** Paid Ads (Meta, Google, YouTube Campaigns)  
**Core Purpose:** Cold-traffic acquisition via Free Resistance Bands hook, leading to mandatory assessment and training program sales.  

---

## 1. Funnel Architecture & Sequence

```
[Entry: bands.bigronjones.com]
   │
   ▼
Step 1: Free Resistance Bands Offer Hook ($0 + $15 S&H)
   │     • Shared 30-sale cap with Funnel A
   │     • Live remaining counter
   │     • If cap >= 30: automatically redirects to Step 2 (Assessment) with UTMs preserved
   ▼
Step 2: Mandatory Fitness Assessment
   │     • Required for every buyer / visitor (cannot be bypassed)
   │     • 6 diagnostic questions computing personalized prescription
   ▼
Step 3: Matched Training Program ($249)
   │     • One of eight programs matched to assessment answers
   ├─────────────────────────────────────────┐
   ▼ [YES: $249 Purchased]                   ▼ [NO: $249 Declined]
Step 4: Two-Program Upsell                Step 3b: $199 Downsell
   │     • Choose 2 distinct programs              │ (Self-directed DIY edition)
   │     • 20% off each ($199.20 each)             ├────────────────────────┐
   │     • Total: $398.40                          ▼ [YES: $199 Purchased]  ▼ [NO: Declined]
   ▼                                       Confirmation             Neutral Exit
Step 5: $3,000 Coaching Offer             (Direct Access Granted)  (Prescription Saved)
   │     • Men’s Fitness Alliance ($3k)
   │     • Women’s Wellness Program ($3k)
   ▼
Confirmation & VIP Access
```

---

## 2. Commercial & Pricing Rules
* **Resistance Bands:** $0.00 product + $15.00 shipping ($15.00 total).
* **Matched Core Program:** $249.00 one-time.
* **Downsell Program:** $199.00 one-time.
* **Two-Program Upsell:** $199.20 each program × 2 = **$398.40 total** (20% discount).
* **Ascension Coaching:** $3,000.00 PIF or 4 monthly installments of $750.00.

---

## 3. Local Development & Build Commands

```bash
# Start local development server (port 3002)
npm run dev

# Run TypeScript typecheck
npm run typecheck

# Build production bundle
npm run build
```
