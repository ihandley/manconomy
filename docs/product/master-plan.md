# THE MANCONOMY — Master Plan

> *"Trade like a man. Live like a neighbor."*

**Version:** 2.0  
**Date:** April 11, 2026  
**Status:** Pre-Build — Neighborhood Launch Ready

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Problem](#2-the-problem)
3. [Competitive Landscape](#3-competitive-landscape)
4. [The Manconomy Solution](#4-the-manconomy-solution) — including 4.8: Phase 2 The Commons, 4.9: The Provision Code, 4.10: Public Listing Conversations, 4.11: The Pitch, 4.12: Leaderboards, 4.13: The Climb
5. [Brand & Tone](#5-brand--tone)
6. [Business Model](#6-business-model)
7. [MVP Feature Specification](#7-mvp-feature-specification)
8. [Tech Stack & Build Plan](#8-tech-stack--build-plan)
9. [Launch Playbook](#9-launch-playbook)
10. [Legal & Compliance](#10-legal--compliance)
11. [Risk Assessment](#11-risk-assessment)
12. [Research Bibliography](#12-research-bibliography)

---

## 1. Executive Summary

**What it is:** The Manconomy is a hyperlocal, credit-based barter marketplace built on masculine economic principles — honest value, earned trust, relationships built through doing, and provision as the oldest language of respect. You trade the stuff cluttering your garage for the stuff you actually want, coordinated with the neighbors you already have.

**The brand position:** This is not a "men's app." It is an app built on masculine *principles* — which are universally respected and, frankly, what every marketplace app should have been doing all along. Honest pricing. Earned reputation. No shipping. No strangers. No nonsense.

**The three pillars:**

1. **Food = Provision.** Feeding people is how men say they respect you. It is the oldest economic language on earth. In The Manconomy, food is not a category — it is culture. A rack of ribs is how you close a 500-credit trade like a man.

2. **AI = Honest Counsel.** The AI in this app is not a salesman. It is the honest friend who tells you the drill is worth $40, not $70. Honesty encoded as a product feature. Masculine virtue as a competitive moat.

3. **Community = The Chapter.** Men don't join communities. They belong to one. The Manconomy is structured like a fraternal organization — ranks earned through activity, patches earned through accomplishment, a handbook written for men who actually do things.

**The pitch:** Every man in America has a garage full of stuff he doesn't use, a list of tools he wants but won't buy new, and a neighbor who has exactly that thing. The only thing stopping them from trading is friction. The Manconomy removes the friction.

**Why it works:**
- **Credits solve barter's oldest problem.** Pure barter requires two people to want exactly what each other has at the same time. Credits make everything liquid — you sell your drill, earn credits, and spend them on a fishing rod from someone else entirely.
- **Local solves everything else.** No shipping. No strangers across town. No scams. Just neighbors in a mile radius trading like civilized humans.
- **AI removes the work.** Snap a photo, AI writes the listing and prices it. Under 60 seconds from "I should get rid of this" to "This is listed."
- **The humor makes it sticky.** Nobody wants another sterile marketplace app. The Manconomy has a voice. The app talks to you like a buddy who's been waiting to roast your hoarding problem.

**Why now:**
- The male "friendship recession" is documented and growing — men under 30 are lonelier than any prior generation
- The gig economy proved people will transact with strangers if trust infrastructure exists
- LLM vision APIs (GPT-4o) just made AI-powered listing possible at $0.01–0.03 per photo — economically viable for the first time
- No direct competitor exists for this category

**The investor/press one-liner:** *"We're not building a men's app. We're building an economy on masculine principles — honest pricing, earned trust, hyperlocal community, and the radical idea that feeding your neighbor is good economics."*

**The background narrative (for press/investors, not the app):** Commerce is how men make friends. The Kula Ring — the ancient Melanesian exchange system studied by anthropologists — proved that the act of trading creates and maintains social bonds. The Manconomy is building a digital version of the neighborhood exchange that used to happen naturally before everyone moved to suburbs and worked from home. The friendship recession is real. The Manconomy is a market solution to a social problem, dressed up as a way to clear out your garage.

---

## 2. The Problem

### The Garage Problem

The average American home contains **300,000 items**. A significant portion of those items, especially in garages and basements, are used less than once a year. Men, stereotypically, are particularly prone to accumulating: tools, sports gear, electronics, outdoor equipment, and "projects" that were ambitious in 2019.

This stuff has real value. It's just stuck.

**Why men don't sell their stuff:**
- Facebook Marketplace requires negotiating with strangers, which most men find socially uncomfortable
- eBay requires photography, writing, packaging, and shipping — too much work for a $40 item
- Craigslist is a crime show waiting to happen
- Donating feels like losing

**Why men don't buy used stuff:**
- Same platforms, same friction
- Uncertainty about condition and fair price
- The effort/reward ratio is wrong for anything under ~$100

**The gap:** There is no app that says "Here's your neighbor's stuff. Here's a fair price. Here's 60 seconds of effort. Done."

### The Social Problem (Background Narrative)

Men's close-friendship networks have collapsed over the past 30 years:
- In 1990, 33% of men reported having 10 or more close friends
- By 2021, that number dropped to **13%**
- 15% of men report having **no close friends at all** (American Survey Center, 2021)

Men bond through **shared activity** (shoulder-to-shoulder), not conversation (face-to-face). Trading, fixing, and doing things together is how male friendships form and deepen. The Manconomy creates a reason to interact with the guy three doors down. The commerce is the mechanism. The friendship is the side effect.

This is the story for investors, journalists, and think-pieces. The app leads with "clear your garage" and lets the social benefits emerge organically.

---

## 3. Competitive Landscape

### What Exists (And Why It's Inadequate)

| Platform | What It Is | Why It Doesn't Solve This |
|---|---|---|
| **Facebook Marketplace** | General local classifieds | Cash only, negotiation-heavy, universally disliked but dominant by default, no trust infrastructure |
| **Craigslist** | General local classifieds | No ratings, no trust, no mobile experience, feels dangerous |
| **eBay** | National marketplace | Shipping required, fees high, not local |
| **OfferUp / Letgo** | Local buy/sell | Cash-only, no barter mechanic, male audience but generic |
| **Grailed** | Male-focused resale | Fashion-only, national, buy/sell not barter |
| **Decluttr** | Device trade-in | Sold to companies not neighbors, dead as of 2023 |
| **Bunz** | Barter app | Alive but Canadian/niche, female-skewed, no AI, no social features |

### The Barter App Graveyard

Pure barter apps have a near-100% failure rate:

| Company | Raised | Status | Cause of Death |
|---|---|---|---|
| Swap.com | $24M | Dead | Wrong category (used clothing), inventory model |
| Listia | $11M | Zombie | Too broad, no network effects, credit economy poorly managed |
| TradeAway | Unknown | Dead | Cold start problem — not enough users for matches |
| BarterOnly | Unknown | Dead | Double coincidence of wants never solved |
| SwapThing | Unknown | Dead | Same |

**Why they all died:** The "double coincidence of wants" problem — you need to find someone who has exactly what you want AND wants exactly what you have, at the same time. Pure barter marketplaces can never get liquid.

**Why The Manconomy doesn't die the same death:** Credits. The credit system means you can always transact. You don't need to find a direct swap partner — you sell to anyone, earn credits, and spend them with anyone else. Credits make barter liquid.

### The Gap

There is **no platform** that combines:
- Male-focused curation and brand voice
- Local-only (neighborhood scale)
- Credit-based economy (solves double coincidence)
- AI-powered listing (removes friction)
- Social/gamification layer (makes it sticky)
- Trust infrastructure (ratings, verification, AI Seal)

The Manconomy is the first.

---

## 4. The Manconomy Solution

### 4.1 Core Mechanic: Credits

The credit system is the foundational technical and economic innovation:

- Credits are **closed-loop and non-convertible**: you can buy them with cash, but you cannot cash them out. This keeps The Manconomy out of money-transmitter licensing territory (which would cost $100K+ and require state-by-state compliance).
- Credits are **earned through activity**: trading, rating items, referring friends, and honoring your commitments.
- Credits are **spent on items**: the core loop is list → sell → earn credits → spend credits → repeat.
- The economy is **double-entry ledger** architecture (same pattern as airline miles): every credit creation and destruction is recorded, server-authoritative, idempotency-keyed to prevent double-spending.

**The implied value of credits:** ~$0.03–0.05 per credit (based on IAP pricing). This is low enough that losing credits doesn't sting, but high enough that earning 85 credits in a day feels meaningful.

### 4.2 AI-Powered Listing (Photo-to-Listing)

The single biggest friction in any marketplace is the listing process. DBD eliminates it:

1. User taps "+" and takes 1–3 photos
2. GPT-4o Vision identifies the item, estimates condition, generates title and description
3. eBay API validates the estimated credit value against real market prices
4. User sees a complete listing draft in 2–4 seconds
5. User can accept as-is, edit any field, or override the price

**Under 60 seconds from photo to live listing.** That's the north star metric.

### 4.3 AI Seal of Approval

The trust problem in peer-to-peer marketplaces is pervasive: sellers overprice, misdescribe condition, and post misleading photos. The Manconomy solves this with a behavioral incentive, not enforcement:

- If the user **accepts the AI-suggested price** (within 20% of model estimate), the listing earns a **"Verified Value" Seal** badge
  - The Seal means: boosted visibility in the feed, a trust signal on the item card, and higher trade request rates
- If the user **overrides the price**, no badge, no boost — but full pricing freedom

The Seal is never mandatory. It's carrots, not sticks. But the data will show that Seal listings trade faster, which is its own incentive.

### 4.4 "Tinder for Blenders" — Crowd Valuation + Item Stories

Two swipe surfaces that feed the same flywheel but serve different needs.

#### Part 1: Price Swipe (Original Mechanic)

Users swipe through items they don't want to buy, rating the price: **Fair / Too High / Steal / Skip**

- Each rating earns 1 credit (max 25/day)
- Comments earn 5 credits each (max 10/day)
- After 5+ ratings on an item, the AI produces a **crowd consensus value** with a confidence score
- If the crowd thinks the listed price is off by >30%, the seller gets a gentle nudge: *"The crowd thinks your NutriBullet is worth 38 credits. You listed at 45. Adjust?"*

The brand voice: *"Judge other people's stuff. Get paid for it."*

#### Part 2: Item Stories — "The Backstory Swipe"

The insight: men are minimal in text but generous in *context* when it feels like talking, not filling out a form. "Why are you getting rid of this?" is a conversation starter. It's also the most useful information a buyer can have, and the most entertaining content in the feed.

**Item Stories** are optional micro-prompts attached to a listing. The seller answers one or more prompts — in their own voice, as little or as much as they want — and other users swipe through them and react. Every prompt answered earns credits. Every reaction is a credit-earning action for the reader.

**The Prompts (seller earns credits for answering each one):**

| Prompt | Brand Copy | Credits Earned |
|---|---|---|
| **The Plan** | "What were you *going* to do with this?" | 5 cr |
| **The Upgrade** | "What did you replace it with and why?" | 5 cr |
| **The Love** | "What did you actually love about this thing?" | 5 cr |
| **The Hate** | "What drove you nuts about it?" | 5 cr |
| **The Project** | "What could someone do with this? (Ideas welcome.)" | 5 cr |
| **The Confession** | "How many times did you actually use this?" | 5 cr |
| **The Story** | "One thing that happened with this item." | 8 cr |

The seller sees these as optional cards after listing. Tap a card → type a response (or skip). No minimum length. One sentence is fine. The app actively rewards brevity with humor:

> *"What were you going to do with those 2x4s?"*
> User types: "Deck."
> App responds: *"A man of vision. 5 credits."*

**The Swipe Feed (reader earns credits for reacting):**

Other users swipe through Item Stories in a dedicated tab — or they appear as expandable cards on item detail pages. The feed is algorithmically sorted to surface the most entertaining or useful stories first (based on reaction rates).

Reactions earn 1 credit each (capped at 30/day):

| Reaction | Emoji | Meaning |
|---|---|---|
| **Respect** | 🤜 | "I've been there, brother." |
| **Useful** | 🔧 | "Good to know for this item." |
| **Hilarious** | 💀 | "This is the funniest thing I've read today." |
| **Suspicious** | 👀 | "This description raises questions." |

Top-reacted stories get surfaced in a **"Wall of Shame / Hall of Fame"** sidebar — the most beloved confessions, most ambitious project plans that never happened, and most honest upgrade admissions. This is the content that gets screenshotted and shared on Reddit.

**Why this works:**

1. **It lowers the activation energy for participation.** Answering "How many times did you actually use this?" is infinitely easier than writing a product description. Men will do it because it's funny, not because it's a task.

2. **It creates genuinely useful buyer context.** "I upgraded to a brushless motor drill and this one works fine but it's slow" tells a buyer everything they need to know. No amount of AI description generates that.

3. **It generates the app's social content.** The best Item Stories will be shared outside the app — on Reddit, in group chats, as screenshots. This is organic marketing that no ad budget can buy.

4. **It deepens the credit earn loop.** A user who has maxed out price swipes for the day can still earn 30 more credits reacting to stories. More earn paths = more daily active use.

5. **The "Project Ideas" prompt creates a community use case.** "What could someone build with a stack of 2x4s?" is genuinely a good question. The answers — a workbench, a raised bed, a dog ramp — are useful to the buyer AND to anyone else browsing. The Manconomy accidentally becomes a DIY idea platform for a segment.

**The flywheel:** more stories → more entertaining feed → more time in app → more swipes → more credits → more listings → more stories.

This creates a **virtuous flywheel**: more ratings → better valuations → more trust → more trades → more items listed → more ratings.

### 4.5 Wife/Partner "Insider" Account + The Nudge

The best comedy premise in the app — and also genuinely useful for listing quality:

**The Insider Account:** A partner (wife, girlfriend, roommate, anyone who has opinions about your stuff) can link to a user's account. The Insider can review any of the user's listings before or after they go live — flagging condition descriptions that are optimistic, prices that are ambitious, and descriptions that omit relevant defects.

- Reviews are **completely private** — buyers never see them
- Insider reviews are suggestions, not enforcement — the user can ignore them
- Insider earns **3 credits per review** (deposited to the linked user's wallet)
- The Insider has no wallet of their own — this is a "household account" model

**The Nudge:** The partner can flag items in the house — items that have never left the garage, the bread maker used twice in 2019, the exercise bike with laundry on it — and the user receives a notification:

*"Someone who loves you thinks it's time to let go of the bread maker."*

This feature is pure gold for two reasons:
1. It generates genuinely funny, relatable content for social media and press
2. It surfaces supply — items that would never have been listed because the owner "might use it someday"

### 4.6 Merit Ranks, Patches & The Sash

#### Merit Ranks

Rank is the most visible social signal in The Manconomy. It appears prominently on every user's avatar — a badge, a stripe, a title that everyone in the room can see. Rank is earned through trading activity, community contributions, tenure, and reputation. It is **never purchasable**.

Ranks are **neighborhood-scoped**: a Legend in one neighborhood starts as a Tenderfoot if they move. This keeps rank meaningful and local.

**The Merit Rank Ladder:**

| Rank | Title | Criteria | Avatar Treatment |
|---|---|---|---|
| 0 | **Tenderfoot** | New member, no trades yet | Gray badge |
| 1 | **Scout** | 1 completed trade | Small bronze merit badge |
| 2 | **Trader** | 5 trades + 4.0★ avg | Bronze badge |
| 3 | **Dealer** | 15 trades + 4.2★ avg | Silver badge |
| 4 | **Outfitter** | 30 trades + 4.5★ avg + 1 referral | Silver badge + star |
| 5 | **Trailblazer** | 50 trades + 4.5★ avg + 6 months tenure | Gold badge |
| 6 | **Quartermaster** | 100 trades + 4.7★ avg + active in community | Gold badge + compass |
| 7 | **Captain** | Founding member OR 200+ trades + 4.8★ avg | Red badge + shield |
| 8 | **Legend** | Top 1% of neighborhood by trades + community votes + 1 year tenure | Black badge + flame |

> *The Quartermaster is the man responsible for provisions and supplies — the one who makes sure the operation runs. That's the rank that keeps a neighborhood chapter fed.*

**Design rules:**
- Rank badge is **always visible** on the avatar, in The Market, in conversations. It is the first thing you see about a user.
- Rank can only go **up** — it never decreases (suspended accounts show a gray "Suspended" state).
- Rank names use the brand voice — these feel like titles you'd actually want.

#### Patches — The Achievement System

Patches are earned accomplishments displayed on a member's **Sash**. They are specific, earned through real behavior, and never purchasable. Inspired by the merit badge tradition — you don't get a patch for showing up, you get it for doing the thing.

**Complete Patch Table:**

| Patch | Icon | How Earned |
|---|---|---|
| **First Fire** | 🔥 | Complete your first trade |
| **The Handshake** | 🤝 | Receive a 5-star rating on your first 3 trades |
| **Provisioner** | 🥩 | Complete a trade that includes a food add-on |
| **The Gardener** | 🌱 | List produce, eggs, or garden surplus |
| **Brewmaster** | 🍺 | List homemade beer, wine, or cider |
| **Storyteller** | 📖 | Answer 10 Item Story prompts across your listings |
| **The Connector** | 🔗 | Recruit 3 members who each complete at least one trade |
| **The Climb** | 📈 | Complete a full chain trade from start to finish |
| **Quartermaster's Choice** | ⭐ | Win a Member's Choice Award (any category) |
| **The Nudge** | 👀 | Have a partner-flagged item sell within 7 days of the flag |
| **Clean Sweep** | 🧹 | List 10 or more items in a single calendar month |
| **Founding Member** | 🏔️ | Be among the first 10 members in your neighborhood chapter |
| **The Grill** | 🍖 | Complete 5 food-related trades |
| **Eagle** | 🦅 | *Reserved* — Top 1 Legend per neighborhood, lifetime; community-voted |

**Key design rules for patches:**
- All patches are **permanently optional** — never gated, never mandatory, never mentioned to users who haven't encountered the triggering behavior
- They feel like Easter eggs, not homework
- Unearned patches show as greyed silhouettes on the Sash (completionist psychology — you can see what you're missing)
- New patches can be added without app updates

#### The Sash

The Sash is the profile section that displays earned patches. It is:
- Visible on every user's profile, below their rank badge
- Ordered by earn date (oldest first) — your history told in cloth
- Unearned patches visible as greyed silhouettes (motivates completion without nagging)
- Referenced in the trade feed: when someone earns a patch, a subtle card appears in the neighborhood feed ("TradePro22 just earned The Handshake.")

The Sash is the visual proof of a member's history with the chapter. A long-time Quartermaster with a full Sash is immediately legible as someone who's been doing this for real.

#### The Handbook

The Handbook is the in-app guide to The Manconomy, written in full brand voice. It lives in the profile/settings drawer and covers:

- How credits work (and why they aren't money)
- The Merit Rank system and what each rank means
- How to earn patches (written as a field guide, not a tutorial)
- The Provision Code — food norms and The Grill Phase 2 seed
- Trading code of conduct ("Show up when you say you will. Don't lowball after agreeing. A man's word means something.")
- How The Climb works
- FAQ written from the perspective of a gruff neighborhood Quartermaster answering questions from a new Scout

The Handbook is never forced on users — it's there when they want it. Men don't read instructions until something doesn't work.

#### Social Challenges (Optional)

The Manconomy defines optional challenges that create micro-communities and recurring engagement:

**Example Challenges:**
- "The Spring Purge" — list 5 items in April
- "The Man Cave Makeover" — trade for 3 items you'll actually use
- "First Responder" — first to trade with a new neighbor
- "The Provision Run" — include a food add-on in 3 trades this month

**Key design rule:** All challenges are **permanently optional**. Never gated, never required, never mentioned to users who haven't opted in. The moment a challenge feels mandatory, it becomes a chore. They must feel like Easter eggs, not homework.

Members can **suggest new challenges** via in-app voting. The community curates its own social layer.

#### Birthday, Anniversary & Member's Choice Rewards

The Manconomy recognizes three automatic milestones that trigger credit rewards and special recognition:

**Birthday Reward:**
- Triggered on the user's birthday (from profile, optional)
- Push: *"Happy birthday. Here's 25 credits. Go buy something you don't need."*
- 25 credit drop + temporary birthday frame on avatar (24 hours)
- If the user completes a trade on their birthday: double reward (50 credits)

**Member Anniversary Reward:**
- Triggered on the anniversary of joining The Manconomy
- Year 1: 50 credits + "One Year In" patch
- Year 2: 75 credits + "Two Years Strong" patch
- Year 3+: 100 credits + "OG" patch (permanent, displayed on Sash)
- Push: *"You've been in The Manconomy for [X] year(s). Your garage is measurably better. Here's [X] credits."*

**Member's Choice Award:**
- Monthly community-voted award. Three categories:
  - 🏆 **Best Trade** — most impressive deal of the month
  - 📖 **Best Story** — highest-rated Item Story of the month
  - 🤝 **Best Neighbor** — most vouched/highest-rated trader of the month
- Winners get: 200 credits + permanent monthly winner patch on Sash + featured in the neighborhood Market feed
- Voting open to members Trader rank and above (prevents gaming by new accounts)
- Copy: *"The chapter has spoken. Here's your award and the quiet respect of your neighbors."*

#### Invite-Only Membership

The Manconomy is **invite-only**. You cannot sign up without a code.

**Why invite-only:**
- Trust is the core product. A marketplace where you meet neighbors IRL requires a higher trust floor than one where you ship anonymous packages.
- Exclusivity drives desirability. People want what they can't freely have.
- Quality control. No bots, no scammers, no bad actors in the first chapters.
- Neighborhood density. Better to have 80 engaged members in one neighborhood than 800 scattered.

**The Neighborhood Captain Model:**
- Every new neighborhood is seeded by a **Neighborhood Captain** — one founding member (Charter Member) who receives **10 founding invites** and automatic Captain rank.
- Captains are recruited directly (neighbors, community leaders, local Facebook group admins).
- Each Captain invite creates a new member who gets **5 invites** of their own.
- Invites are tracked — if someone you invited turns out to be a bad actor, it affects your reputation score (mild, not punitive).

**Waitlist:**
- Non-invited users can join a neighborhood waitlist.
- When a Captain or high-rank member has invites, the waitlist surfaces: *"3 people in your neighborhood want in. You've got 2 invites. Who gets them?"*
- This makes the invite a social act, not a bureaucratic one.

**Scaling:**
- Invite-only at launch. Opens to verified-address open enrollment once a neighborhood hits 200 active members.
- "Verified address" = confirm you live within the geofence via a postcard code.

**Copy:**
- Waitlist confirmation: *"You're on the list. Someone in your neighborhood will let you in when they're ready. Could be tomorrow. Could be a month. Earn it."*
- Invite notification to sender: *"You've got an invite. Don't waste it on someone who won't trade."*

### 4.7 The Neighborhood-First Model

The Manconomy launches **hyperlocal** — one neighborhood, configurable radius of 0.5 to 3 miles.

**Why hyperlocal solves the cold start problem:**
- Dense inventory is better than sparse inventory across a wide area
- You only need ~50–100 active users per neighborhood for the feed to feel alive
- Trust is higher between neighbors — you can see the person's house
- Pickup is trivially easy — 5-minute drive or a walk
- Word-of-mouth spreads faster in a physical community than online

**No shipping in MVP.** Local-only. This is not negotiable for launch. The complexity of shipping — packaging, carriers, tracking, disputes, lost items — would triple build time and quintuple support tickets. Do one neighborhood brilliantly first.

---

### 4.8 Phase 2 — The Commons

The marketplace is the on-ramp. The community is the product.

Once The Manconomy has a critical mass of users in a neighborhood, the app has a rare asset: a trusted, hyperlocal network of people who already have a reason to engage. The next move is to expand *what* they can do on that network — not by building a "social network" (which men won't join) but by adding **activities** that happen to connect people.

**The core design principle:** Men don't join communities. They join activities that happen to have communities. They bond *shoulder-to-shoulder* — by doing things together, not by talking about feelings. Every Commons feature is framed as a useful tool first and a social connector second.

The same credit system that powers the marketplace extends directly to all community surfaces — contributing earns credits, credits are spent in the marketplace. One economy, multiple surfaces.

#### The Commons Features

| Feature | Tagline | What It Is |
|---|---|---|
| **The Grill** | *"Recipes from dudes who actually cook"* | Post and rate recipes. Filtered by goal (bulk, cut, fast, feed a crowd). Credits for posts, ratings, and photos. No lifestyle content — just: ingredients, steps, result. (Seeded from MVP food section — see Section 4.9.) |
| **Skills Market** | *"Your fence for my floors"* | Trade labor the same way you trade stuff. "I'll fix your fence if you detail my truck." Same credit system, same trade flow — but the item is your time and skill. |
| **Crew Up** | *"Who's in?"* | Post a local activity. "Pickup basketball Saturday 8am." "Anyone want to hike the ridge Sunday?" RSVP + auto-reminder. No event planning overhead — just a one-liner and a time. |
| **The Voucher** | *"My guy does HVAC. He won't rip you off."* | User-vouched directory of local service pros. One paragraph max: who they are, what they do, whether they're reliable. Credits for vouching, earned when your referral books a job. Kills the "finding a trustworthy contractor" problem. |
| **How Do I Look** | *"Brutal honesty. Zero unsolicited advice."* | Post a fit photo. Get crowd-voted feedback framed as data, not opinion: "83% say the hat is working." "That shirt is getting you fired before it gets you laid." Men will seek brutal feedback if it's framed as useful rather than emotional. |
| **The Program** | *"Show your work."* | Share workouts, post lifts, track PRs. Strictly performance-focused — numbers, movements, results. No mirror selfies required. Credits for logging and for PRs that get validated by the crowd. |
| **The Playlist** | *"What you're listening to while you work"* | Share what's on while you're in the shop, grilling, lifting, or on the road. Genre-tagged, no algorithm. Sorted by activity type. Credits for shares that get saves. |

#### Why This Isn't "Just Another Social App"

1. **The credit system ties everything together.** Every contribution earns credits. Credits are spent in the marketplace. The Commons surfaces are not separate — they're credit-generating activities that fund your next trade.

2. **It's all utility, no vulnerability.** "How do I look" is *getting data*, not *seeking validation*. The Grill is about *feeding people*, not *lifestyle curation*. The Program is *tracking performance*, not *posting thirst traps*. The framing is always competence and utility, never feelings and connection — even though connection is what's actually happening.

3. **The marketplace gives it a trust foundation no social app has.** These users have already met IRL to hand off a drill press. That's a higher trust floor than any "social network" can manufacture.

4. **It becomes the default men's community infrastructure for a neighborhood.** Not because it was marketed as a social platform, but because it organically became where the men in a neighborhood already were.

---

### 4.9 The Provision Code — Food as First-Class Economy

> *"The rack of ribs is not optional. It's the punctuation on a 500-credit trade."*

Food is not a category in The Manconomy. It is culture. It is the oldest economic language on earth — long before currency, men exchanged trust and obligation through the act of feeding one another. The Provision Code is the set of norms, mechanics, and design principles that govern food's role in The Manconomy.

#### Why Food

Three things are true simultaneously:
1. Men hoard food-related gear (smokers, cast iron, fermentation vessels, brew equipment, garden tools) with the same enthusiasm as power tools.
2. Men produce food surplus (garden harvests, homebrew batches, smoked meats, preserved sauces) that they can't consume alone.
3. Men express respect and close transactions through feeding people.

No marketplace has ever treated food as the economic glue it actually is. The Manconomy does.

#### Allowed Food Categories

| Category | Examples | Special Handling |
|---|---|---|
| **Cooking gear & appliances** | Smokers, cast iron, fermentation vessels, brew kettles, sous vide | Standard listing flow |
| **Garden surplus** | Produce, eggs, herbs, seedlings, starter cultures | Perishable UX (see below) |
| **Homemade & preserved food** | Smoked meats, jam, hot sauce, sourdough starter, jerky, pickles | Perishable UX + food safety note |
| **Homebrewed alcohol** | Beer, wine, mead, cider | Special handling — see Homebrew section below |
| **Commercial packaged food** | Unopened surplus pantry items, bulk overstock | Standard listing flow |
| **Tradework / cooking labor** | "I'll smoke a brisket for you"; catering a small event | Service listing flow (Phase 2 Skills Market) |

#### Perishable Listing UX

Perishable and homemade food items require a different listing flow than durable goods:

- **`is_perishable` flag**: toggled at listing creation; triggers the perishable UI path
- **`pickup_by_date` field**: required for perishable items; displayed prominently on the listing card as a countdown
- **`food_category` field**: subcategorizes the listing for feed filtering (Garden, Homebrew, Preserved, Packaged, etc.)
- **Pickup urgency nudge**: when pickup_by_date is within 48 hours, listing gets a "PICK UP TODAY" badge and is surfaced in the feed with elevated priority
- **Food safety note**: auto-appended to all homemade food listings — *"This is homemade food from a neighbor. Use your judgment, ask questions, know who you're dealing with."*
- **No returns on perishables**: explicitly noted in trade confirmation screen for food items

**Listing card copy for garden surplus:**
> *"6 lbs of cherry tomatoes, picked yesterday. Yours for 15 credits. Pickup by Sunday or they're compost."*

#### The Food Add-On Mechanic

Any trade can include an optional food add-on — a small accompanying gift of food that signals good faith, closes the deal with character, and earns the Provisioner patch.

**How it works:**
- At the trade confirmation screen, the seller sees: *"Want to throw something in? A bag of garden tomatoes. A six-pack. Your killer hot sauce. Optional, but noted."*
- Seller selects from a list of their active food listings OR types a freeform note ("bringing cookies")
- Buyer sees the add-on in the trade summary
- Post-trade, the food add-on is noted in the rating prompt: *"Did [seller] bring anything?"* — earns the seller 3 bonus credits and a "Provisioner" notation on the trade record

**This is never mandatory.** It is a cultural expectation framed by the app's voice, not a hard requirement. The Provision norm is social pressure, not enforcement.

#### The Provision Norm for Large Trades

When a trade exceeds 300 credits, the app surfaces a soft Provision prompt:

> *"This is a 400-credit trade. The move is to throw in a rack of ribs. Just saying."*

At 500+ credits:
> *"500 credits is serious business. A man of your standing would not let this trade close without contributing something from the smoker. Allegedly."*

This is never a hard block. It is the app performing the role of the gruff neighborhood elder who has opinions about how a trade should close. Men respond to this framing because it's funny, and because they recognize the truth in it.

#### Homebrew — Special Handling

Homebrewed alcohol (beer, wine, mead, cider) is **allowed** on The Manconomy with the following rules:

- **State-law disclaimer**: displayed before listing and at trade confirmation — *"The legality of selling/trading homebrewed alcohol varies by state. By listing this item, you confirm you understand your local laws and that this transaction is between private individuals."*
- **No commercial intent**: listings must not imply commercial production or sale for profit
- **Label required**: listings must include approximate ABV and ingredients
- **Brewmaster patch**: earned for listing your first homebrewed batch — the app celebrates this, not discourages it

> *Note: Section 10.3 (Content Moderation) has been updated to reflect this policy. Previous versions of this document incorrectly prohibited alcohol; homebrewed alcohol with the above disclaimer is now allowed.*

The rationale: homebrewing is a deeply masculine hobby, deeply tied to provision and hospitality. Banning it would be inconsistent with the Provision Code and would alienate a significant user segment. The state-law disclaimer creates informed consent without prohibition.

#### The Grill — Phase 2 Seed

The Grill (Phase 2, The Commons) is the full food community surface — recipes, ratings, technique discussions. Its seeds are planted in MVP:

- The food listing categories above build the food-focused user base
- The Provisioner and The Gardener patches identify the community's food culture carriers
- The Brewmaster patch identifies the homebrewers who will become The Grill's most active contributors
- Food trades with Item Stories generate the first recipe-adjacent content ("What did you actually cook with that cast iron?")

When The Grill launches in Phase 2, it is not a cold start — it already has a community of self-identified food practitioners who've been transacting in food for months.

---

### 4.10 Public Listing Conversations

Every listing in The Manconomy has a **public conversation thread** — visible to all neighborhood members, not just the buyer and seller.

#### What It Is

The public thread is attached to a listing card. Any member (Tenderfoot and above) can:
- Ask questions about condition, history, or intended use
- Make a public offer or express interest
- Comment on the Item Story
- Give opinions about the price (enforced in the same spirit as the Tinder for Blenders mechanic)

**The thread is not a direct message.** It is a public record — visible to everyone browsing the listing. The seller can respond to any comment. Other members can respond to each other. It is a barbershop, not a negotiation room.

#### Why Public

Private negotiation produces worse outcomes for everyone:
- Buyers lowball in private because there's no social cost
- Sellers overprice in private because nobody's watching
- Public conversation creates social accountability — your offer and your reasoning are on record

More importantly: **public listing conversations are entertaining**. The best ones will be screenshots shared in group chats. "This guy listed his 1994 treadmill for 200 credits and six people wrote essays about it" is organic content that builds the brand.

#### Mechanic Details

- **Thread is default-open**: no opt-in required; seller can close the thread on any listing
- **Moderation**: same pipeline as listing descriptions (OpenAI Moderation API)
- **Credit earn for sellers**: responding to 5+ comments on a listing earns 5 credits (one-time per listing)
- **Credit earn for commenters**: if your comment is marked "Helpful" by the seller, earn 3 credits
- **The "I'm interested" signal**: a soft expression of intent, different from a formal trade request; lets the seller gauge demand before accepting any offer
- **Top comment surfaced**: the highest-engagement comment is pinned to the top of the thread and visible on the listing card in the feed

#### Sample Thread Copy

*[Listing: DeWalt circular saw, 250 credits]*

> **TradePro22**: Does this cut through treated lumber without binding?
>
> **OP**: Yeah, I've cut through a full deck's worth. Blade's a little worn but it runs clean.
>
> **GarageKing_Phil**: I have this exact saw. The blade that comes with it is garbage. Replace it first thing and it's excellent.
>
> **TradePro22**: Done. Sending a trade request.
>
> *[3 others expressed interest]*

That's a transaction enabled by public conversation that would never have happened in a private DM flow.

---

### 4.11 The Pitch — Make Your Case

> *"The item goes to whoever wants it most — not whoever has the most credits."*

The Pitch is an optional listing mode where the seller decides: instead of accepting the first trade request that arrives, they want to **hear from buyers first**. Who are you? What are you going to do with this?

#### What It Is

A seller enables Pitch Mode on a listing. Buyers submit a short pitch — one paragraph, no minimum length required — explaining why they should get the item. The seller reads the pitches and picks the winner. Credits are still exchanged at the agreed amount.

The pitches are **public** — visible to all neighborhood members. They can be voted on (👍 or 💀), which adds a social dimension but doesn't override the seller's decision.

#### Why It Works

1. **It matches items to people who will actually use them.** A man who explains why he needs the band saw is more likely to make good use of it than a stranger who just sent the fastest trade request.

2. **It creates the app's best content.** Pitches — like Item Stories — are the most honest, funny, and human-readable writing in the feed. A guy explaining why he needs a 1994 juicer to make homemade hot sauce for his neighborhood block party is compelling reading.

3. **It solves the first-come-first-served problem.** In standard listing flow, the fastest tap wins. Pitch Mode rewards best fit over speed.

4. **It's earned, not gamed.** A new member with 5 credits and a great pitch can beat a Quartermaster with 2,000 credits if the seller likes the story better.

#### Mechanic Details

- **Pitch Mode toggle**: visible at listing creation and editable after listing goes live
- **Pitch submission**: buyer taps "Make Your Case" — opens a text field, character limit 500, no minimum; single submission per user per listing
- **Voting**: any neighborhood member (Scout rank or above) can vote on a pitch — 👍 "Give it to them" / 💀 "Pass"
- **Seller decision**: seller picks winner from the pitch list; can see vote tallies but is not bound by them
- **Winner notification**: *"[Seller] read your pitch and picked you. Your case was compelling. Trade incoming."*
- **Loser notification** (if opted in): *"[Seller] picked someone else. Better luck on the next one. Your pitch was [public/private] — your call."*
- **Credit earn for pitches**: seller earns 5 credits for running a Pitch Mode listing that results in a completed trade (rewards the social contribution)
- **The Pitch patch**: earned by sellers who complete 5 Pitch Mode trades

#### Sample Pitches

*[Listing: Weber kettle grill, 180 credits — Pitch Mode enabled]*

> **BackyardChef_Dan**: *"I just moved into the neighborhood three weeks ago and I haven't grilled once since getting here. My wife thinks I've retired from cooking. I have not. 180 credits and I will grill every Sunday in October. You'll smell it from here."*
>
> 👍 47 | 💀 2
>
> **FireProof_Marcus**: *"I need to learn to smoke brisket. This is my semester one."*
>
> 👍 61 | 💀 0
>
> **GrillSkeptic9**: *"I'll give you 200 credits."*
>
> 👍 3 | 💀 84

---

### 4.12 Leaderboards

The Manconomy keeps score. Not in a LinkedIn way. In a barbershop scoreboard way — the kind that gets stared at, argued about, and referenced for months.

#### What It Is

Neighborhood-scoped leaderboards that rank members across multiple dimensions. Reset monthly. Top 3 are featured in the neighborhood Market feed. No global leaderboards in MVP — the neighborhood is the unit of competition.

#### Leaderboard Categories

| Board | Metric | Tone |
|---|---|---|
| **Most Traded** | Completed trades this month | *"The man who keeps the neighborhood liquid"* |
| **Best Deal** | Highest-rated trade by community vote | *"The man who found value where others saw junk"* |
| **Best Story** | Highest-reacted Item Story | *"The man who made us all read a listing description"* |
| **Best Pitch** | Highest-voted buyer pitch | *"The man who earned it"* |
| **Most Generous** | Most food add-ons sent in a month | *"The man who feeds the chapter"* |
| **Top Recruiter** | Most successful referrals this month | *"The man who grew the chapter"* |
| **The Gardener** | Most garden surplus listed | *"The man with too many tomatoes"* |
| **Rookie of the Month** | Newest member with most trades | *"Tenderfoot? Not anymore."* |

#### Design Rules

- **No financial leaderboard.** Credit totals are private. The boards measure activity, quality, and generosity — not wealth.
- **Monthly reset.** A Quartermaster can get beaten by a Scout in any given month. The past is permanent (Merit Rank, Sash) but the present is always contested.
- **Top 3 featured in the feed.** Monthly winners get a callout card in The Market: *"This month's Most Traded: TradePro22. 14 trades. The chapter respects it."*
- **Member's Choice Award** is separate from leaderboards (see Section 4.6) — it's voted, not metric-driven.
- **No shame board.** There is no "worst trader" category. The tone is celebratory, not punitive.

#### Credit Incentives

- 1st place in any category: 100 credits
- 2nd place: 50 credits
- 3rd place: 25 credits
- Winners credited on the 1st of the following month

---

### 4.13 The Climb

> *"One red paperclip became a house. What does yours become?"*

The Climb is The Manconomy's chain-trade competition — inspired by Kyle MacDonald's "One Red Paperclip" project, in which a man traded a single red paperclip through 14 consecutive trades until he owned a house. In The Manconomy, the goal is not a house. The goal is to see how far a chain goes and what it becomes.

#### What It Is

A member starts a Climb by listing a low-value item with Climb Mode enabled. They trade it for something of slightly higher value. Then they list that item. Trade up again. Each link in the chain is publicly tracked — the community watches the trajectory.

A completed Climb is one where the member reaches a pre-declared endpoint (an item they actually want) or achieves a meaningful valuation milestone (10x, 50x, 100x starting value).

#### How It Works

1. **Start the Climb**: member lists an item with Climb Mode toggled; declares a starting point (e.g., "Starting at: 10-credit item. Goal: a working kayak.") or leaves the goal open
2. **Trade it up**: uses standard trade flow, but the item's Climb history is attached to the listing ("This item is Link 3 in TradePro22's Climb")
3. **Next listing automatically inherits**: the new item lists with the Climb chain attached; buyer of the next item can see the full chain history
4. **The chain is public**: visible in a "Climbs in Progress" tab in The Market; neighborhood members can follow a Climb, react to each trade, and post encouragement
5. **Completion**: member declares their Climb complete when they reach their goal; chain is archived and displayed on their profile permanently

#### The Chain Record

Each link in a Climb is recorded as:

```
climb_chains table:
  chain_id        UUID
  member_id       UUID
  link_number     INTEGER
  item_name       TEXT
  credit_value    INTEGER
  trade_id        UUID
  traded_at       TIMESTAMP
  declared_goal   TEXT (nullable)
```

#### Recognition

- **The Climb patch**: earned by completing any Climb with 5+ links
- **Climb featured in feed**: each new link gets a small callout card in The Market ("TradePro22's Climb just hit Link 6: a working chainsaw. Started with a garden trowel.")
- **Completed Climb becomes permanent Sash entry**: the chain summary (start item → end item, # of links, total value multiplier) is displayed on the member's Sash forever
- **The Legend event**: when a Legend-tier member completes a 10+ link Climb, it becomes a neighborhood event — a dedicated feed post, a 30-day callout, and the permanent "The Climb" legend notation on their profile

#### Sample Climb

> **Start**: Garden trowel — 8 credits *(Link 1)*
> **Link 2**: Fishing rod — 45 credits
> **Link 3**: Portable speaker — 90 credits
> **Link 4**: Air compressor — 220 credits
> **Link 5**: Working kayak — 475 credits ← *Goal reached*

Total value multiplier: **59x**. Starting item: a trowel. Ending item: a kayak. This is the app working exactly as intended, and the whole neighborhood watched it happen.

---

 ## 5. Brand & Tone

### The Three Pillars

The Manconomy is not a men's app. It is an app built on **masculine principles** — honest value, earned trust, relationships built through doing, provision as love, earned beats given, waste is disrespectful. These principles are universally respected and attractive. They just happen to be distinctly masculine.

Three pillars underpin everything:

#### Pillar 1: Food = Provision
Feeding people is how men say they respect you. It is the oldest economic language on earth — older than money, older than markets. When a neighbor shows up with ribs at a big trade, he's not being weird. He's being right. The Provision Code is The Manconomy's cultural center of gravity: food as goodwill, food as ceremony, food as proof of character.

#### Pillar 2: AI = Honest Counsel
The AI is the honest friend who tells you the car is worth $4,000, not $6,500. Honesty is a masculine virtue — and we've encoded it in the product. The AI Seal of Approval isn't just a trust badge. It's a promise that someone finally told you the truth about what your stuff is worth. No flattery. No haggling. Just the number.

#### Pillar 3: Community = The Chapter
Men don't join communities. They belong to one. There's a difference. The Manconomy is structured like a chapter: a neighborhood, a roster, a rank system, a code of conduct. Structure enables real connection — not open feelings, but shared doing. Every trade is a handshake. Every patch is proof of work. The Chapter is the reason men come back.

---

### The Voice

The Manconomy speaks like **Dollar Shave Club**: irreverent, self-aware, stereotype-forward, and always at the expense of the guy and his hoarding habits. Never mean-spirited toward women — they are the heroes (they were right all along about that bread maker).

The humor is **self-deprecating, not offensive**. It works because it's true. Every guy reading these notifications has the item being described in his garage.

**The test for every line of copy:** Would a guy show this notification to his wife and she'd laugh? Would he show it to his buddy and they'd both recognize themselves? If yes, it's good copy.

**The "without feeling gay" design principle:** All community and social features are framed as utility and competence — never vulnerability and connection. Men don't want to "connect." They want to trade, rank up, and maybe eat good food while doing it. The emotional outcome is real; the framing is never sentimental.

### Tone Principles

1. **Address the user directly and informally.** "Your drill" not "The item you listed."
2. **Acknowledge the absurdity without being preachy.** We know you have three blenders. We're not judging. Much.
3. **Celebrate the trade.** Completing a trade is an accomplishment. Treat it like one.
4. **The app has opinions.** About hoarding, about bad listing photos, about prices that are clearly delusional.
5. **Women are right.** The Insider feature, The Nudge, and partner-related copy should always position the woman as the sensible one who was patient enough to wait for the app to exist.
6. **Food is serious.** The Provision Code is never a joke. Food add-ons, garden surplus, homebrew — these are celebrated as acts of character, not quirky features.

### Sample Copy Reference

| Context | Copy |
|---|---|
| Empty garage feed | "It's a ghost town in here. Be the first to list something and your neighbors will follow. Probably." |
| Trade accepted | "Your drill found a new home, king. 85 credits just hit your wallet." |
| New trade request | "Someone wants your blender. They've got credits and they're not afraid to use them." |
| Inactive nudge | "Your garage isn't getting any cleaner. List something. Earn credits. Feel alive." |
| Price too high | "The crowd thinks your NutriBullet is worth 38 credits. You listed at 45. Adjust?" |
| AI can't identify item | "We're stumped. What is this thing?" |
| Photo too blurry | "This looks like it was taken during an earthquake. Try again?" |
| Patch earned: First Fire | "Achievement unlocked: First Fire. You traded something. The garage door to freedom is open." |
| Empty watchlist | "Your watchlist is empty. Go find something you definitely don't need but absolutely want." |
| Post-listing prompt | "Your [item] is live. May the trades be ever in your favor." |
| The Nudge | "Someone who loves you thinks it's time to let go of the bread maker." |
| Onboarding screen 1 | "You've got stuff you don't use. Your neighbor's got stuff you want. We do the math." |
| Onboarding screen 2 | "No shipping. No strangers across town. Just neighbors trading like civilized humans." |
| Loading AI listing | "Our AI is squinting at your stuff..." |
| Referral invite | "Your neighbor joined The Manconomy. Time to clean out your garage in solidarity." |
| Food add-on prompt | "This is a 500-credit trade. The move is to throw in a rack of ribs. Just saying." |
| Perishable listing live | "Your sourdough starter is live. Pickup by [date]. Don't let it die in a stranger's fridge." |
| Food trade completed | "Trade complete. Someone just ate better because of you. Patch incoming." |
| Provision norm (big trade) | "Big trade energy. The Provision Code says this is a good time for something from the garden." |
| Homebrew listed | "Homemade IPA listed. State laws vary; you're a grown man. Handle accordingly." |
| Rank up to Trader | "You're a Trader now. Five trades, 4.0 stars. The Chapter is noticing." |
| Rank up to Legend | "Legend. One per neighborhood. That's you." |
| New patch earned | "New patch on your Sash: The Gardener. You listed garden surplus. The neighborhood thanks you." |
| New member joined chapter | "A new Scout just joined your Chapter. They don't know what they're doing yet. Neither did you." |
| Climb started | "The Climb is on. You started with [item]. Let's see how far you can trade up." |

### Visual Identity

#### Logo
Merit badge / patch shape containing crossed wrenches or handshake icon. Embroidered aesthetic, clean enough for app icon. The badge is the mark — everything else hangs from it.

#### Wordmark
**THE MANCONOMY** in wide, heavy slab serif — stamped on equipment. All caps. Not elegant. Earned.

#### Color Palette

| Color | Role | Use |
|---|---|---|
| Deep Forest Green | Primary | Nav bars, headers, rank badges, key UI chrome |
| Aged Khaki / Canvas | Background | Cards, screens, listing tiles — the canvas everything lives on |
| Amber / Ember | Accent / CTAs | Buttons, highlights, earned states, achievement glow |
| Charcoal Black | Text | Body copy, prices, labels |
| Worn Red | Achievement / Legend | Legend rank only, Eagle patch, top-tier recognition |

Not a pastel, gradient, or frosted glass effect in sight.

#### Typography
- **Headlines:** Heavy slab serif — Rockwell Extra Bold, Sentinel Heavy, or equivalent. Tight tracking. Stamped, not printed.
- **Badge text:** Tight arched lettering — curved to follow badge shape, all caps, small point size.
- **Body:** Clean humanist sans-serif — Lato, Source Sans Pro. Readable, no-nonsense.

#### Texture Language
Canvas. Woven fabric. Embroidered patch edges. Worn leather. Stamped metal. Wood grain. Nothing shiny. Nothing gradient. The app should feel like it was issued, not downloaded.

#### Photography Style
- Real garages, real people, real stuff on concrete, wood, canvas
- **Never** white backgrounds, studio lighting, or stock perfection
- Food: cast iron, ribs on grill grates, garden hauls on picnic tables, mason jars on rough wood
- Tools: dusty, used, honest — a slightly worn drill is more credible than a mint one

#### Humor in the UI
Error states, empty states, loading screens, and confirmation dialogs — all written in brand voice. The whole app talks, not just marketing. The Handbook is written as if by a gruff but fair veteran of the neighborhood. AI errors are self-deprecating. Achievement notifications feel like a ceremony, not a popup.

---

## 6. Business Model

### 6.1 Revenue Streams

The Manconomy has four revenue streams. Credits are the flywheel that powers all of them.

#### Stream 1: Credit Packages (In-App Purchase)

| Package | Price | Credits | Effective Rate |
|---|---|---|---|
| Starter | $4.99 | 100 | $0.050/cr |
| Builder | $9.99 | 250 | $0.040/cr |
| Baller | $17.99 | 500 | $0.036/cr |
| Neighborhood Legend | $29.99 | 1,000 | $0.030/cr |

Credits are **never cashable**. Buy in, never cash out. This is a legal and economic necessity.

#### Stream 2: Subscription Tiers

| Tier | Price | Key Benefits |
|---|---|---|
| **Free (Scout)** | $0 | 5 active listings, 10 AI listings/month, 3 photos/listing |
| **Manconomy Pro** | $4.99/mo or $47.99/yr | 15 listings, 30 AI/month, 6 photos, 2 free boosts/month, 8% cash fee |
| **Manconomy Legend** | $9.99/mo or $95.99/yr | Unlimited listings, unlimited AI, 10 photos, 5 free boosts/month, 5% cash fee, 75 credits/month |

#### Stream 3: Cash Transaction Fee (12%)

Users can pay cash instead of credits. A 12% platform fee is charged and displayed clearly at checkout. This fee is:
- Never hidden
- Framed as the cost of convenience ("Want to skip earning credits? We'll charge you 12% for the privilege.")
- Reduced for Pro (8%) and Legend (5%) subscribers
The fee incentivizes credit use (free) over cash use (taxed), which keeps the credit economy healthy.

#### Stream 4: Listing Boosts (Future)

Users can pay credits to boost their listing to the top of the feed:
- 15 credits = 24-hour boost
- This is a credit sink, which is healthy for the economy
- Future: charged in cash for non-subscribers

### 6.2 Unit Economics

**Per 1,000 Active Monthly Users:**

| Source | Conservative | Optimistic |
|---|---|---|
| Credit IAP (10% of users, avg $8/mo) | $800/mo | $1,600/mo |
| Pro subscriptions (8% conversion) | $400/mo | $600/mo |
| Legend subscriptions (2% conversion) | $200/mo | $400/mo |
| Cash transaction fees (5% of trades at $15 avg) | $90/mo | $225/mo |
| **Total MRR per 1,000 active users** | **$1,490** | **$2,825** |

**Path to break-even:** ~$500/mo in operating costs at 1,000 users (Firebase/Supabase, GPT API, push notifications, Expo). Break-even at roughly 350–500 active users.

### 6.3 Credit Economy Design

**The core principle:** Credits must be worth earning, cheap enough to earn, scarce enough to have value, and abundant enough that the marketplace stays liquid.

**Earning Credits:**

| Source | Credits | Daily Cap |
|---|---|---|
| New user signup bonus | 50 | One-time |
| First listing bonus | 10 | One-time |
| Completing a trade (seller) | Listed price | — |
| "Tinder for Blenders" rating | 1/rating | 25/day |
| Rating with comment | 5/comment | 10 comments/day |
| Consensus bonus | 2 | Per match |
| Insider review | 3 (to linked account) | 10/day |
| **Item Story prompt answered** | **5–8/prompt** | **5 prompts/listing** |
| **Item Story reaction (reader)** | **1/reaction** | **30/day** |
| Referral (inviter) | 50 | — |
| Referral (invitee) | 50 | One-time |
| 5-star trade rating received | 2 | Per trade |
| Purchased with cash | Variable | No cap |

**Maximum passive daily earn (no trading):** ~115 credits  
*(25 ratings + 10 comments + 2 consensus + 10 insider + 30 story reactions + 8 story prompts on one new listing = ~115 credits on an active day)*

**Credit Sinks (destroy credits, prevent inflation):**
- Item acquisitions (credits transfer between users)
- Listing boosts (15 credits destroyed)
- Expired item relist fee (5 credits destroyed)
- Inactive account decay (10%/month after 90 days inactive)

**Balancing levers:** All earning rates are configurable server-side via feature flags. No app update required to adjust the economy. Monitor weekly:
- Average credits per active user: healthy range 50–200 (>500 = inflation risk)
- Daily credits created vs. destroyed: ratio 1.0–1.3 (>2.0 = inflation alert)
- Trade completion rate: healthy >70% (<50% = friction problem)

### 6.4 Non-Revenue: What The Manconomy Does NOT Do

- **No ads.** Ever. Ads in a trust-based local marketplace destroy credibility and create privacy concerns.
- **No selling user data.** The credit economy is the business.
- **No convertibility.** Credits can never be cashed out. This is both legally necessary and economically correct.
- **No shipping (in MVP).** Adding national shipping in Phase 2 is possible — but only after the local model is proven.

---

## 7. MVP Feature Specification

> Full detailed specification with user flows, ASCII wireframes, and copy is in **`reports/dbd-mvp-spec.md`**.

### 7.1 Must Have (Launch Blockers) — Summary

| # | Feature | 60-Second Description |
|---|---|---|
| M1 | Photo-to-Listing AI | Snap → AI writes listing → live in <60 seconds |
| M2 | AI Seal of Approval | Trust badge for AI-priced listings; boosts visibility |
| M3 | Credit Wallet | Balance visible everywhere; earn, spend, buy |
| M4 | Item Feed (Neighborhood) | Location-gated grid of items within configurable radius |
| M5 | Search & Filter | Keyword + category/price/distance/Seal filters |
| M6 | Trade Request Flow | Buyer requests, seller accepts/counters/declines |
| M7 | Meetup Coordination | Location + time agreement + quick chat |
| M8 | Dual Confirmation | Both parties confirm; credits transfer; 48hr auto-confirm |
| M9 | User Profiles | Display name, neighborhood, trade count, ratings, Merit Rank badge |
| M10 | Ratings & Reviews | 1–5 stars + one-liner after each trade |
| M11 | User Authentication | Email/Google/Apple + phone verification |
| M12 | Push Notifications | All in The Manconomy brand voice |
| M13 | Onboarding Flow | 4 screens → neighborhood → seed credits → first listing |
| M14 | Cash Transaction Support | Optional; 12% fee displayed prominently |
| M15 | Neighborhood Geofence | 0.5–3 mile configurable radius |
| M16 | Report / Block | Report listings; block users |
| M17 | Invite-Only Auth + Neighborhood Captain Model | New neighborhoods launch invite-only. Neighborhood Captain holds 10 founding invites; each member who joins receives 5 more. Opens to verified-address enrollment at 200 active members. Charter Member badge for founding 10 per neighborhood. |

### 7.2 Should Have (First Sprint Post-Launch)

| # | Feature |
|---|---|
| S1 | "Tinder for Blenders" Swipe Valuation |
| S2 | Wife/Partner Insider Account + The Nudge |
| S3 | Watchlist / Saved Items |
| S4 | Category Browse |
| S5 | Referral System |
| S6 | Trade History |
| S7 | In-App Messaging |
| S8 | Credit Purchase (IAP) |
| S9 | **Item Stories** — Optional micro-prompts on listings. Sellers answer questions ("What did you love about this?" / "What will the next guy build with it?") and earn 5–8 credits per prompt. Readers swipe through stories and earn 1 credit per reaction (30/day cap). Extends the Tinder mechanic from price-rating into content engagement. Generates shareable, organic content outside the app. |
| S10 | **Food Add-On to Trade** — At trade confirmation, both parties are prompted to optionally add a food item (garden surplus, beer, baked goods). Recorded in `food_addons` on the trades table. Earns Provisioner patch on first use. See Section 4.9. |
| S11 | **Perishable / Food Listing Category** — Food listings get a separate UX: `is_perishable` flag, `pickup_by_date` field, `food_category` field, urgency display, food safety note. See Section 4.9. |
| S12 | **Patches & The Sash** — Earned achievement patches displayed on user profile in earn-order. Unearned patches shown as greyed silhouettes. Visible in trade feed under Merit Rank badge. See Section 4.6. |
| S13 | **Public Listing Conversations** — Every listing has a public thread. Anyone can comment, ask questions, make offers, give opinions. Public and visible. See Section 4.10. |
| S14 | **The Pitch / Make Your Case** — Buyer writes a pitch explaining what they'll do with the item. Seller picks winner based on pitch, not just credits. Public, votable, entertaining. See Section 4.11. |
| S15 | **Leaderboards** — Neighborhood-scoped scoreboards across 8 categories (most trades, best deals, best stories, etc.). Barbershop scoreboard tone, not LinkedIn. See Section 4.12. |
| S16 | **The Climb** — Chain-trade competition. User trades up from a low-value starting item. Chain is publicly tracked. Completed chain is a Legend-tier neighborhood event. See Section 4.13. |

### 7.3 Nice to Have (Phase 1.5, Weeks 4–8)

| # | Feature |
|---|---|
| N1 | Achievement Badges |
| N2 | "Hot Items" Trending Feed |
| N3 | Seasonal Prompts |
| N4 | QR Code Handoff |
| N5 | Dark Mode |
| N6 | Bulk Listing ("Garage Cleanout Mode") |
| N7 | Counter-Offer with Items (direct swap) |

---

## 8. Tech Stack & Build Plan

### 8.1 Recommended Stack

#### Mobile (Frontend)

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **React Native + Expo** | Single codebase iOS + Android. Expo OTA updates. Largest community. |
| Alternative | Flutter | Better performance, less ecosystem. Dart is less hireable. |
| UI Library | React Native Paper or Tamagui | Pre-built components, faster development |
| Navigation | Expo Router | File-based, Next.js-style |
| State Management | Zustand | Simple, no Redux boilerplate |

#### Backend & Database

| Layer | Choice | Rationale |
|---|---|---|
| Database | **Supabase** (Postgres) | SQL = better for relational data (users, trades, credits). Real-time subscriptions. Free tier generous. Open-source (no vendor lock-in). |
| Auth | Supabase Auth | Phone/email/Google/Apple SSO built in |
| Push Notifications | **Expo Notifications** | Free; handles both iOS and Android |
| File Storage | Supabase Storage or Cloudflare R2 | Images; Cloudflare R2 has zero egress fees |
| Geolocation | Supabase Postgres + PostGIS | `ST_DWithin()` for radius queries; free |

#### AI Services

| Service | Purpose | Cost |
|---|---|---|
| **GPT-4o Vision** (OpenAI) | Image → item identification, description, condition estimate | ~$0.01–0.03 per listing |
| **eBay Browse API** | Validate AI credit estimate against real market prices | Free |
| **OpenAI Moderation API** | Moderate listing text | Free for text |
| **Google Cloud Vision SafeSearch** | Flag inappropriate images | 1,000/month free |

#### Credit Ledger Architecture

The credit system requires **double-entry bookkeeping** — every credit has a source and a destination, and the total supply is always known.

```
credits_ledger table:
  id          UUID
  from_user   UUID (NULL = system/platform)
  to_user     UUID
  amount      INTEGER
  type        ENUM (trade, signup_bonus, rating_reward, purchase, boost_fee, ...)
  trade_id    UUID (nullable)
  created_at  TIMESTAMP
  idempotency_key UUID (prevent double-spend)
```

Key rules:
- Credits are **never stored as a column on the user row** — balance is always calculated from the ledger
- All credit mutations go through a **server-side RPC** (never trusted from the client)
- Credits held in active trades are in **escrow** (a separate ledger entry type) until both parties confirm

### 8.2 Build Options & Costs

#### Option A: FlutterFlow (No-Code)

- **Best for:** Fastest MVP, minimal development experience required
- **Build time:** 6–8 weeks solo
- **Cost:** ~$3,000–5,000 (FlutterFlow Pro + Firebase + some developer help for edge cases)
- **Limitation:** Custom credit ledger and AI integration will require Firebase Cloud Functions (not purely no-code)

#### Option B: React Native + Expo (Custom Build)

- **Best for:** Full control, better long-term scalability, easier hiring
- **Build time:** 3–4 months (solo developer or small team)
- **Cost:** $11,000–27,000 (freelancer) or $0 if building yourself + time
- **Recommended** if you have or can hire a React Native developer

#### Option C: Hybrid (FlutterFlow + Developer)

- Build UI in FlutterFlow, hire a developer for backend logic (credit ledger, AI pipeline, geofencing)
- **Build time:** 10–14 weeks
- **Cost:** ~$8,000–15,000

### 8.3 Monthly Operating Costs

| Scale | Cost |
|---|---|
| 100 active users | ~$40/month |
| 1,000 active users | ~$195/month |
| 10,000 active users | ~$950/month |

Costs are dominated by: Supabase (database), OpenAI API (listing AI), Expo push (negligible), Cloudflare R2 (images).

### 8.4 Development Phases

**Phase 0 — Foundation (Weeks 1–4)**
- Auth, user profiles, neighborhood geofence
- Credit wallet and ledger architecture
- Basic listing CRUD (no AI yet)
- Basic feed (no AI Seal yet)

**Phase 1 — Core Loop (Weeks 5–10)**
- AI listing pipeline (GPT-4o Vision + eBay API)
- AI Seal of Approval
- Trade request flow
- Meetup coordination
- Dual confirmation
- Credit transfers
- Push notifications (brand voice)

**Phase 2 — Trust & Social (Weeks 11–14)**
- Ratings & reviews
- Insider accounts + The Nudge
- "Tinder for Blenders" evaluation
- Watchlist
- Referral system

**Phase 3 — Polish & Launch (Weeks 15–16)**
- Onboarding flow (full 7-screen)
- Achievements/badges
- Abuse detection (speed caps, device fingerprinting)
- App store submission (iOS + Android)
- Beta test with 10–20 real users in target neighborhood

---

## 9. Launch Playbook

### 9.1 Target: One Neighborhood First

**The criteria for the launch neighborhood:**
- 500–2,000 homes within a ~1-mile radius
- Suburban, homeowner-heavy (more garage stuff than apartments)
- Male demographic skew (not required, but helpful)
- Ideally known to the founder — makes seeding easier
- One with existing community infrastructure (HOA, neighborhood Facebook group, Nextdoor presence)

### 9.2 Seed Inventory Strategy

The cold start problem is real: nobody lists if nobody's browsing, nobody browses if nothing's listed. Solve it before launch day.

**Step 1: Recruit 20–30 Charter Members**
- Personally recruit 20–30 people in the launch neighborhood
- Offer them founding benefits: Manconomy Legend tier free for 6 months, 500 seed credits, "Charter Member" badge, Founding Member patch
- Get them to list 3–5 items BEFORE the app launches to the neighborhood
- Target: 75–150 items in inventory on Day 1

**Step 2: Seed the First Trades**
- Arrange the first 5–10 trades personally with founding members
- This populates the ratings system and makes the feed feel active
- Creates testimonials and story content for the launch

**Step 3: Pre-Load the Nudge**
- Ask founding members if their partners want to participate as Insiders
- Partner onboarding generates word-of-mouth among women, who are often the better marketing channel

### 9.3 Launch Day

**The Launch Event:** A neighborhood "Garage Sale on Steroids" event — but instead of cash, everything's in The Manconomy. Invite the neighborhood to a public space (park, cul-de-sac, someone's driveway). Items are displayed, priced in credits, traded on the spot using the app. First 50 sign-ups get 100 bonus credits.

**Goal of the event:**
- 50+ new users signed up
- 20+ completed trades
- Content and photos for social media
- Word-of-mouth in the neighborhood

**Press angle:** "Neighborhood trades $3,000 worth of stuff without a dollar changing hands." Local news loves this story.

### 9.4 Growth Loop (Post-Launch)

The Manconomy growth loop is neighborhood-adjacent expansion:

1. Launch in Neighborhood A
2. A user invites a friend in **adjacent** Neighborhood B
3. Friend downloads, can see items from Neighborhood A at the boundary
4. Friend recruits 5 people in Neighborhood B
5. The Manconomy expands the geofence slightly to connect the neighborhoods
6. Repeat

This is **concentric ring growth** — geographically organic, word-of-mouth driven, and produces dense inventory at every step.

**Never launch a new neighborhood without at least 20 active users ready.** Sparse neighborhoods feel dead and will never recover.

### 9.5 Success Metrics (First 90 Days)

| Metric | Target |
|---|---|
| Active users (1 trade or 5 ratings in past 30 days) | 150+ |
| Listings live at any given time | 100+ |
| Trade completion rate | >65% |
| Average time to first trade (new user) | <72 hours |
| D7 retention | >40% |
| D30 retention | >20% |
| Average rating per trader | >4.2 stars |
| NPS | >50 |

### 9.6 Marketing Channels

**Priority 1: Nextdoor and neighborhood Facebook groups**
- Organic posts from founding members ("Check out what I just traded — zero dollars involved")
- Post the Nudge notifications as jokes ("My wife sent me this through an app and now my bread maker is gone")
**Priority 2: Reddit**
- r/malelivingspace, r/frugal, r/declutter, r/mead (the barter angle)
- Authentic posts, not promotions: "I built an app for trading stuff with neighbors, here's what I learned"

**Priority 3: TikTok/Instagram Reels**
- Short videos: "I traded my old drill for a kayak paddle using an app. No cash. Here's how."
- The Nudge content writes itself: partner-sent nudge notifications as comedy posts

**Priority 4: Press**
- Local newspaper angle: "Neighborhood economy"
- Tech press angle: "The only barter app that survived"
- Human interest angle: "The friendship recession and the man who built an app for it"

---

## 10. Legal & Compliance

### 10.1 IRS / Tax Compliance (Build Day One)

**The law:** Barter income is taxable in the United States. If you trade a drill for a blender, the FMV of what you received is income. The IRS has always required barter income to be reported; they simply couldn't enforce it at scale until now.

**The reporting obligation:** Platforms that facilitate barter transactions involving non-cash consideration (credits) may be required to file **Form 1099-B** for users with total barter income exceeding $600/year. This is treated similarly to how eBay files 1099-K forms.

**What The Manconomy must build (from day one):**
- **Transaction log with FMV.** Every completed trade must record the credit value, the implied dollar value ($0.03–0.05 per credit), and both parties.
- **User profile with taxpayer info.** Any user who earns >$500 in annual trade value must provide their SSN or EIN before completing a trade that would push them over $600. Prompt is in-app, before the threshold is hit.
- **Annual 1099-B generation.** Platform generates and files 1099-B for all users who crossed the $600 threshold in a calendar year.
- **User-facing tax dashboard.** Users should see their total barter income YTD, so they're not surprised.

**The copy for this:** "The IRS has always taxed barter. We just make it easy to report." Position it as a feature, not a burden. Most users will be under $600 anyway.

### 10.2 Credit System Regulations

**Money Transmitter Licensing:** A closed-loop credit system where credits are **never convertible back to cash** is generally not considered money transmission under FinCEN guidance and most state laws. This is the same legal structure as airline miles, store gift cards, and arcade tokens.

**Key rules to maintain this status:**
1. Credits cannot be redeemed for cash under any circumstances
2. Credits cannot be transferred between accounts (only earned/spent through the platform)
3. The platform cannot hold "money" on behalf of users — cash transactions go directly through Stripe, not through any platform-held balance

**Stripe is the payment processor.** The Manconomy never touches cash. Stripe handles all card processing, compliance, and 1099-K for cash transaction volume.

### 10.3 Content Moderation

**Prohibited items (ban on listing):**
- Weapons, firearms, ammunition
- Controlled substances or drug paraphernalia
- **Homebrewed alcohol is ALLOWED** — see Section 4.9 (The Provision Code) for the full policy. Commercial sealed alcohol is listed under the Food category. A state-law disclaimer is displayed at listing creation for any homebrew listing; the platform does not police legal activity that varies by jurisdiction.
- Items with recalled status (CPSC recalls)
- Counterfeit goods
- Stolen goods (obviously, but flagged by community reports)

**Moderation pipeline:**
- **Text:** OpenAI Moderation API (free) — runs on every listing description
- **Images:** Google Cloud Vision SafeSearch (1,000/month free) — flags adult content, violence
- **Community reporting:** Report button on every listing; human review queue for flagged items
- **Auto-action:** Items flagged by AI are auto-hidden pending review (not deleted — allow appeal)

### 10.4 Safety

**For in-person meetups:**
- App suggests public locations: parking lots, coffee shops, library entrances
- Users are encouraged to share their meetup plan with someone (copy/paste meetup details)
- Both users' trade count and ratings are visible before any meetup
- DBD never collects or displays home addresses — map pins are approximate (within ~200 meters)

**Phone number privacy:**
- Users never exchange phone numbers through DBD
- In-app messaging only for trade coordination
- If a user requests phone exchange, remind them they don't need to

### 10.5 Terms of Service & Privacy Policy

**Must include before launch:**
- Clear definition of what credits are (not currency, not redeemable)
- Barter income tax notice (user acknowledges they're responsible for their own taxes; DBD will provide 1099-B if applicable)
- Community standards and prohibited items list
- Data collection and use policy (location data, photo uploads)
- Account termination policy (for abuse)

**Recommended:** Have a lawyer review the ToS and Privacy Policy before public launch. Ballpark cost: $500–1,500 for a startup-focused attorney. Non-negotiable.

---

## 11. Risk Assessment

### 11.1 The Risks That Kill Most Apps

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Cold start (no inventory)** | High | Fatal | Recruit 20–30 founding members before launch; manually seed first trades |
| **Credit inflation (too many credits, items overpriced)** | Medium | High | Weekly monitoring of economy health metrics; server-side levers to adjust earn rates |
| **Fraud / fake accounts** | Medium | High | Phone verification; device fingerprinting; rating weight decay for new accounts |
| **Self-trading (wash trades for credits)** | Low-Medium | Medium | Same-address detection; mutual trade frequency flagging; ledger audit |
| **Regulatory surprise (credits = money)** | Low | Fatal | Strict non-convertibility rule; Stripe as payment processor; legal review of ToS |
| **AI listing quality is bad** | Medium | Medium | User can always edit; fallback to manual entry; continuous model improvement |
| **Meetup safety incident** | Low | Very High | Suggest public locations; in-app safety reminders; community ratings create accountability |
| **Apple/Google App Store rejection** | Low-Medium | High | Review guidelines early; App Store review has become more startup-friendly |
| **Tax compliance enforcement** | Low (now) / High (later) | Medium | Build it in from day one; be ahead of it |
| **Competitor copies the model** | Medium | Medium | Network effects and brand loyalty are the moat; first-mover matters |

### 11.2 The Risks That Don't Kill You

| Risk | Why It's Manageable |
|---|---|
| **Not enough users in one neighborhood** | Just expand the radius slightly; the model works at smaller scale than you think |
| **Users don't understand credits** | The onboarding flow is explicit; most IAP users understand this model |
| **Press doesn't cover it** | Organic neighborhood growth doesn't require press |
| **Items don't match (double coincidence)** | This is why credits exist — the whole point |
| **Users want to convert credits to cash** | They can't; it's in the ToS; they'll adapt or churn (most adapt) |

### 11.3 The Existential Risk

**The one thing that could actually kill The Manconomy:** A safety incident involving an in-person meetup.

If a user is robbed, assaulted, or worse during a Manconomy-facilitated trade, the platform faces:
- Press coverage that destroys the brand
- Legal liability
- App Store removal

**Mitigation:**
- Strongly recommend public meetup locations (this needs to be a real UI suggestion, not just ToS text)
- Consider a "Safe Meetup Verified" badge for users who always meet in public
- Build safety check-in: 30-minute after meetup start, send "Did the trade happen safely?" — creates a welfare check
- Partners through the Insider account know when trades are happening (soft safety net)

This risk is manageable, but it must be planned for and built around from day one.

---

## 12. Research Bibliography

The following research, frameworks, and case studies informed The Manconomy model:

### On Barter & Credit Economies
- Jevons, W.S. (1875). *Money and the Mechanism of Exchange.* — Original "double coincidence of wants" framing
- Graeber, David (2011). *Debt: The First 5,000 Years.* — Trade as social relationship, not just transaction
- Malinowski, Bronisław (1922). *Argonauts of the Western Pacific.* — The Kula Ring: exchange as community-maintenance mechanism

### On Male Social Behavior & The Friendship Recession
- American Survey Center (2021). *The State of American Friendship: Change, Challenges, and Loss.* — The 33% → 13% close friendship data
- Oldenburg, Ray (1989). *The Great Good Place.* — Third Place Theory: the importance of informal social gathering places
- Tiger, Lionel (1969). *Men in Groups.* — Male bonding patterns and shoulder-to-shoulder activity

### On Marketplace Design
- Parker, Van Alstyne, Choudary (2016). *Platform Revolution.* — Network effects and cold start problem
- Andreessen Horowitz (2019). *"16 Ways to Measure Network Effects."* — Marketplace health metrics
- a16z (various). Blog posts on marketplace liquidity and the cold start problem

### On Gamification & Social Commerce
- Pokémon GO case study (Niantic, 2016–present) — Digital incentives driving real-world behavior ($6B revenue)
- Strava case study — Activity tracking as social layer (80M users)
- Untappd case study — Niche social gamification (check-ins as commerce)
- Geocaching case study — Physical-world scavenger hunt as community-builder

### On Male-Focused Brand Voice
- Dollar Shave Club (2012–2017). *Launch video, brand guidelines, product copy.* — The canonical reference for irreverent male marketing
- Duluth Trading Company brand voice — Workwear brand with self-deprecating male humor
- Cards Against Humanity copywriting — Humor-forward, trust-building through irreverence

### On Failed Barter Apps (Competitor Analysis)
- Crunchbase profiles: Swap.com, Listia, TradeAway, BarterOnly
- TechCrunch obituaries for the 2011–2014 barter app wave
- Bunz (Canada) — the only survivor; studied for what they got right

### On Credit Economy Regulation
- FinCEN Guidance (FIN-2019-G001): *Application of FinCEN's Regulations to Certain Business Models.* — Closed-loop prepaid accounts
- IRS Publication 525: *Taxable and Nontaxable Income.* — Barter income reporting requirements
- IRS Rev. Proc. 2004-51: 1099-B requirements for barter exchanges

### Tech Stack Research
- Expo documentation (expo.dev) — React Native + Expo build system
- Supabase documentation — PostgreSQL + PostGIS for geolocation
- OpenAI API documentation — GPT-4o Vision pricing and capabilities
- eBay Browse API documentation — Free market price validation

---

## Appendix A: The Business Model Appraisal Framework

*A standalone scoring rubric for evaluating any marketplace business model.*

### Dimension 1: Problem Clarity (0–10)
- Is the problem real, specific, and well-understood?
- Can you describe the problem in one sentence that makes someone say "yes, that's annoying"?
- Does quantitative evidence support the problem's scale?

### Dimension 2: Solution Fit (0–10)
- Does the solution directly address the root cause of the problem (not just a symptom)?
- Is the solution 10x better than the status quo on at least one dimension?
- Would a user describe it as "obvious in retrospect"?

### Dimension 3: Market Size (0–10)
- TAM: Is the total addressable market large enough to justify a venture-scale business?
- SAM: Is the serviceable addressable market reachable with the initial GTM strategy?
- SOM: Is the 3-year target market share achievable given competition and resources?

### Dimension 4: Revenue Model Viability (0–10)
- Are there at least two independent revenue streams?
- Is the unit economics path to profitability clear?
- Can the business survive without venture capital?

### Dimension 5: Competitive Moat (0–10)
- Network effects: does value increase with more users?
- Switching costs: how hard is it to leave once you're in?
- Brand/trust: is the brand a defensible asset?
- Data: does usage generate proprietary data that improves the product?

### Dimension 6: Cold Start Viability (0–10)
- Can the product deliver value to the first 100 users before network effects kick in?
- Is there a clear seeding strategy?
- What is the minimum viable community size?

### Dimension 7: Regulatory Risk (0–10)
- Are there regulatory landmines (financial, legal, compliance) that could kill the business?
- Has legal review been done on the core model?
- Is the model designed around the regulations, not against them?

### Dimension 8: Execution Risk (0–10)
- Is the MVP buildable with the available team and budget?
- What is the minimum lovable product?
- Are there hard technical dependencies (AI, real-time, geolocation) that could block launch?

### Dimension 9: Brand & Distribution (0–10)
- Is there a natural distribution channel (word-of-mouth, viral mechanic, existing community)?
- Is the brand voice differentiated and ownable?
- Can you describe the brand in one sentence?

### Dimension 10: Timing (0–10)
- Is this the right time for this product?
- What has changed recently (tech, culture, regulation) that makes this possible now?
- Is there a risk of being too early or too late?

### The Manconomy Score

| Dimension | Score | Notes |
|---|---|---|
| Problem Clarity | 9/10 | The garage problem is real, universal, and relatable |
| Solution Fit | 8/10 | Credits + AI solve the core friction points; proven by adjacent success |
| Market Size | 7/10 | Tens of millions of target users in the US; hyperlocal limits initial TAM |
| Revenue Model Viability | 8/10 | Four streams, clear unit economics, break-even achievable at low scale |
| Competitive Moat | 7/10 | First-mover + network effects + brand voice; moat strengthens over time |
| Cold Start Viability | 8/10 | Clear seeding strategy; credits allow unilateral value delivery |
| Regulatory Risk | 7/10 | Closed-loop credits solve the biggest risk; 1099-B built in |
| Execution Risk | 7/10 | Buildable with React Native + Supabase + GPT-4o in 3–4 months |
| Brand & Distribution | 9/10 | Voice is extremely differentiated; neighborhood viral loop is natural |
| Timing | 9/10 | LLM vision APIs just became economical; friendship recession is peaking |
| **TOTAL** | **79/100** | Strong fundamentals; execution is the variable |

**Interpretation:**
- 85–100: Exceptional. Build immediately.
- 70–84: Strong. Build with discipline around weak dimensions.
- 55–69: Viable. Requires significant work on weak dimensions before launch.
- <55: Risky. Reconsider the model.

---

*Document last updated: April 11, 2026*  
*Related: `reports/dbd-mvp-spec.md`*
