# The Manconomy — Internal Planning Pitch

> *"Trade like a man. Live like a neighbor."*

**Version:** 1.0 | **Date:** April 2026 | **Audience:** Personal reference — founder notes,
planning decisions, extended rationale. Not for external distribution.

---

## What This Document Is

This is the fuller, less polished version of the pitch. It's the document I write for
myself — where I'm honest about what I know, what I don't, where the risks live, and why
I'm making the calls I'm making. The investor pitch says "79/100 business model score."
This document says what the other 21 points are and whether I care.

---

## The Core Idea (In My Own Words)

Every guy I know has a garage full of stuff. Tools he bought for a project he never finished.
Sports gear from a phase that lasted six months. Electronics that "still work" but haven't
been touched since the last iPhone upgrade. This stuff has real value. It just sits there
because the friction of selling it is too high relative to what it's worth.

At the same time, every guy I know has a list of stuff he wants but won't buy new. The
pressure washer. A decent table saw. A kayak. He could afford it. He just can't justify
the full retail price for something he'll use six times a year.

These two guys are three doors apart from each other and they have never met in this context.

The Manconomy fixes that. It's a neighborhood barter marketplace with a credit system
that makes it liquid, an AI that eliminates the listing friction, and enough personality
that it doesn't feel like another dead-eyed marketplace app.

The social angle — the friendship recession narrative — is real and I believe it. But I'm
not leading with it in the product. Men don't want to be told they're lonely. They want
a good deal on a used band saw. The social outcome is the side effect we're engineering,
not the promise we're making.

---

## Why Credits Are the Whole Game

This is worth really understanding because every product decision flows from it.

Pure barter has one fatal flaw: the double coincidence of wants. You need to find someone
who has what you want AND wants what you have, simultaneously. This is why every barter
app ever built has died. Listia, TradeAway, SwapThing, BarterOnly — all dead. Combined
they raised around $35M. All dead.

Credits solve this completely. It's the same economic insight as money — money is just
a generalized credit system. Instead of "I need to find the guy who wants my drill and
has the fishing rod I want," I just:
1. Sell my drill to whoever wants it, earn 85 credits
2. Spend 85 credits on the fishing rod from a completely different person

The transactions decouple. This is the entire innovation. It's not complicated, but
every failed barter app either didn't understand it or implemented it wrong.

**Why non-convertible matters:** If credits could be converted back to cash, we'd need
a money transmitter license in all 50 states. That's a $100K+ compliance project that
would kill the startup before it started. Non-convertible credits sidestep this entirely.
Credits can be purchased (IAP), but cannot be cashed out. This is legally well-established
— it's the same structure as airline miles, arcade tokens, and Chuck E. Cheese coins.
The IRS only cares about credits when they're used in business-to-consumer transactions
over $600, which triggers 1099-K reporting. We build this in from day one.

---

## The Tech Stack Decision

**React Native + Expo** for the frontend. The alternative was Flutter. I chose RN/Expo because:
- The developer ecosystem is larger and finding contractors is easier
- Expo significantly reduces native module pain
- JavaScript/TypeScript is more flexible for quick iteration
- The Supabase JavaScript SDK is first-class; Flutter's is not

**Supabase** for everything backend: Postgres database, authentication, storage, realtime,
and edge functions. The alternative was Firebase (Google) or building on raw AWS/GCP.

Supabase wins because:
- Postgres is a real relational database. The credit ledger is inherently relational.
  Row-Level Security at the DB layer is exactly what I need for per-user data isolation.
- Firebase is a NoSQL document store. Modeling a double-entry ledger in NoSQL is possible
  but painful and error-prone.
- Supabase is self-hostable, which means I'm not locked in to their pricing at scale.
- The Auth, Storage, and Realtime products are production-quality and opinionated in ways
  that match what I need.

**GPT-4o Vision** for the AI listing pipeline. This is the key enabling technology.
GPT-4o Vision can identify items from photos with enough accuracy to generate useful
listing drafts. At $0.01–0.03 per photo call, the economics work. Six months ago,
this wasn't viable. It is now.

**eBay Browse API** for price validation. Used-goods sold price data. This is the ground
truth for "what is this item actually worth." The AI suggests a price; eBay confirms or
corrects it. This is what makes the AI Seal of Approval credible.

**Cloudflare R2** for image storage. S3-compatible API, no egress fees. Cheaper than S3
at the volume we'll be operating at.

---

## The Features I Care Most About (And Why)

### AI Listing (M1) — Non-Negotiable
If listing takes more than 60 seconds, the app doesn't work. This is the core UX
hypothesis. Everything else is downstream of this. If I can get a guy from "I should
list this drill" to "listed and live" in under 60 seconds, the supply side of the
marketplace fills up. Without supply, there's no demand. Without demand, there's no
network effect. The AI listing is the unlock.

### The AI Seal (M2) — Trust Infrastructure
The "honest pricing" brand claim needs to be backed by a mechanic, not just copy.
The Seal is that mechanic. A seller who accepts the AI price gets a trust badge and
better feed placement. A buyer can filter for Sealed listings. Over time, Sealed
listings trade faster, which creates data that proves the incentive, which gets more
sellers to accept AI prices. This is a self-reinforcing trust flywheel.

It's also what makes "AI = Honest Counsel" real rather than marketing. The AI is
actually the honest friend who tells you the drill is worth $40. The Seal is the proof.

### The Insider Account (S2) — Supply Quality
The single biggest quality problem in peer-to-peer marketplaces is sellers who lie
about condition. Not maliciously — they just have a very optimistic view of their
own stuff. The Insider account is a socially brilliant solution: the person who already
knows the condition of everything in the house (and has strong opinions about it) can
flag listings privately. No enforcement needed. Social pressure from a partner is
more effective than any moderation system I could build.

It also generates the best marketing content. "Your Insider thinks 200 credits is ambitious.
The AI suggested 140." is the kind of notification that gets screenshotted.

### Item Stories (S9) — Retention and Organic Marketing
This is the feature I'm most excited about long-term. Item Stories are optional micro-prompts
("What were you going to do with this?", "How many times did you actually use this?").
They solve three problems simultaneously:

1. **Listing quality:** A seller who answers "What's actually wrong with it?" is producing
   more honest listings than any form enforcement can achieve.
2. **Entertainment:** The best Item Stories are genuinely funny and relatable. They will get
   screenshotted and shared on Reddit and in group chats. This is organic marketing.
3. **Retention:** The Story swipe feed gives users a reason to open the app even when
   they're not buying or selling. It's the content layer that makes the marketplace feel
   alive.

The flywheel: more stories → more entertaining feed → more time in app → more swipes →
more credits → more listings → more stories.

### Merit Ranks & Patches — The Long Game
The gamification layer is what turns a marketplace into a community. But it only works
if the rank system is credible — meaning you can't buy it, you can only earn it, and
earning it requires real behavior.

Neighborhood-scoped ranks are the key insight. A Legend in one neighborhood starts as
a Tenderfoot if they move. This keeps rank meaningful and local. A Quartermaster in
your neighborhood chapter is someone you can actually verify — you've probably traded
with them.

The Sash is the permanent record. A long-time member with a full Sash is immediately
legible as a real contributor. This is the social proof layer that makes cold trading
with strangers feel safer.

---

## The Risks (Honest Version)

### Cold Start / Density Problem
The hardest problem in any marketplace. The feed is empty until there are listings.
There are no listings until there are users. There are no users until the feed isn't empty.

**Mitigation:** Invite-only + neighborhood captains. By recruiting 10 Charter Members
in a single neighborhood first, I control the density. I can seed initial listings myself
if necessary. I'm targeting 50 active users and 200 listings as the "feed feels alive"
threshold. That's one well-seeded neighborhood, not a national launch.

### Credit Economy Balance
If I give out too many free credits, nobody buys IAP and the economy inflates.
If I give too few, new users can't participate and churn immediately.

**Mitigation:** Double-entry ledger from day one. Credit creation and destruction are
fully tracked. I can adjust earn rates without touching code (configuration parameters).
The first 30 days of data will tell me if the economy is in balance. Conservative
initial earn rates with a plan to loosen if needed.

### Fraud and Gaming
Fake accounts grinding credit-earn loops (price swipes, Item Story reactions). This
is the same problem every credit/points system faces.

**Mitigation:** Phone verification required to list or trade. New account ratings weighted
50% for 3 days. Pattern detection for gaming behavior (always-same-direction swipes,
reaction farms). Invite-only at launch makes mass fake account creation hard.

### Legal — Credits and Food
Credits need to stay clearly non-convertible. Food listings (especially homebrewed
alcohol) have state-law complexity.

**Mitigation:** Terms of Service explicitly prohibit credit-to-cash conversion.
Homebrew listings carry a state-law disclaimer. Food safety disclaimer on all
homemade food. IRS 1099-K reporting built in from day one for cash transactions.
Lawyer review of TOS before launch.

### Content Moderation
As with any marketplace, prohibited items will be listed. Inappropriate content in
Item Stories and public threads will appear.

**Mitigation:** AI moderation pipeline for all text (OpenAI Moderation API) and
images (Google Cloud Vision SafeSearch). Report/Block for users. Manual review
queue for flagged items. Trust the community: invite-only means the first members
have a social incentive to maintain quality.

---

## The Business Model (Full Version)

### Revenue Streams

**1. Credit IAP**
- 100 credits: $4.99
- 250 credits: $9.99
- 500 credits: $17.99
- Implied credit value: ~$0.036/credit
- Apple/Google take 30%, so net per $9.99 pack: ~$7

**2. Subscriptions**

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Full marketplace access, basic earn rates |
| Pro | $4.99/mo | 2 listing boosts/mo, AI price analysis, extended trade history |
| Legend | $9.99/mo | Everything in Pro + priority feed placement + exclusive badge |

**3. Cash Transaction Fee**
- 12% on all cash payments
- Display fee prominently to reinforce "use credits"
- Pure margin — no incremental cost

**4. Listing Boosts (Credit Sink)**
- Spend credits to boost a listing's visibility for 24/48/72 hours
- Credit sink is critical for long-term credit economy health
- Prevents credit inflation as earn rates outpace spend rates

### Unit Economics (Conservative Case)

At 1,000 active monthly users:
- Operating costs: ~$195/month (Supabase, Cloudflare, API costs)
- 10% Pro subscribers: 100 × $4.99 = $499/mo
- 5% Legend subscribers: 50 × $9.99 = $499/mo
- IAP (avg $5/user/quarter): $1,666/mo
- Cash transaction fees (2% of users pay cash, $50 avg): 20 × $6 = $120/mo
- **Total MRR: ~$2,784**
- **Operating profit at 1,000 users: ~$2,589/month**

Break-even is at ~350–500 active users. This is not a "we need millions of users"
business. A single well-run neighborhood chapter can be cash-flow positive.

---

## Phase 2 — The Commons (What This Really Is)

The marketplace is the on-ramp. The community is the product.

Once a neighborhood chapter has 200+ active members who've already met IRL to hand off
drills and spare ribs, I have something no social app can manufacture: a trusted,
hyperlocal network of people who have real transactional history. The next move is to
expand what they can do on that network.

The Commons features — The Grill (recipes), Skills Market (labor trades), Crew Up (local
activities), The Voucher (trusted contractor directory) — are all credit-generating
activities that feed back into the marketplace. One economy, multiple surfaces.

This is what makes The Manconomy defensible at scale. The marketplace creates trust.
The trust enables the community. The community is where the retention lives. By the time
a competitor figures out the model, our chapters have two years of trade history and
social capital that can't be replicated by a new entrant.

---

## Launch Targets

| Milestone | Target | Why It Matters |
|-----------|--------|----------------|
| Charter Members recruited | 10 | Seeds the first neighborhood |
| Items listed (Day 1) | 50 | Feed feels alive |
| First trades | 10 in week 1 | Proves the flow works |
| Active members (Month 1) | 80 | Enough density for daily new listings |
| Active members (Month 3) | 200 | Open enrollment threshold |
| First paid subscribers | Month 1 | Revenue signal |
| First IAP purchase | Week 1 | Demand signal |
| MRR (Month 6) | $500 | Covers operating costs |
| MRR (Month 12) | $2,500 | One neighborhood, cash-flow positive |

---

## What I'm Not Doing (And Why)

**No shipping in MVP.** Shipping triples build complexity, quintuples support tickets,
and destroys the "neighbor you can see" trust proposition. Local-only is a constraint
that's also a feature.

**No global leaderboards.** Competition is neighborhood-scoped. A national leaderboard
rewards whichever densest city gets the most users first and creates no meaningful
social competition for individual members. Neighborhood-scoped boards create rivalries
that matter.

**No cash-out for credits.** Not a tradeoff — a legal requirement. Money transmitter
licensing is a $100K+ problem. Non-convertible credits are the product.

**No Phase 2 features in MVP.** The Grill, Skills Market, Crew Up — all real features
with real plans. None of them belong in the first version. One neighborhood, one
marketplace, one mechanic. Get the core loop right first.

---

## Open Questions

1. **Optimal neighborhood radius?** Default 1-mile configured; 0.5–3 adjustable. Need
   data on whether 1 mile produces enough supply. Too small = sparse feed. Too large =
   "neighbor" stops being meaningful.

2. **Credit earn rate calibration?** Starting conservative. First 30 days of real data
   will determine if adjustment is needed. Key signal: are users running out of credits
   before finding things to buy?

3. **Homebrew alcohol — state law variability?** The disclaimer structure should be sufficient,
   but this needs a lawyer's eyes before launch. Some states have stricter person-to-person
   rules.

4. **IRS 1099-K threshold tracking?** For cash transactions, need to track per-user
   totals and issue 1099-K at $600+ (new threshold as of 2024). Supabase + a reporting
   job. Build this before first cash transaction, not after.

5. **Apple App Store review — credit IAP classification?** Apple reviews credit systems
   carefully. The "non-convertible, for use only within the app" framing should pass,
   but need to review App Store guidelines carefully before submission.

---

*This document is for founder reference only. Last updated: April 2026.*
