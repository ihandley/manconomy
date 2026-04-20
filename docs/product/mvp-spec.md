# The Manconomy — MVP Feature Specification

> *"Trade like a man. Live like a neighbor."*
>
> A hyperlocal, credit-based barter marketplace built on masculine economic principles:
> honest value, earned trust, community through doing, and the radical idea that
> feeding your neighbor is good economics.

**Version:** 2.0 — Phase 1 (Neighborhood Launch)
**Date:** April 11, 2026

---

## Table of Contents

1. [MVP Feature List](#1-mvp-feature-list)
2. [User Flows](#2-user-flows)
3. [Credit Economy Design](#3-credit-economy-design)
4. [Subscription Tiers](#4-subscription-tiers)
5. [Sample Copy & Notifications](#5-sample-copy--notifications)
6. [Tech Stack Recommendation](#6-tech-stack-recommendation)
7. [Launch Playbook](#7-launch-playbook)

---

## 1. MVP Feature List

### Must Have (Launch Blockers)

| # | Feature | Description | User Story |
|---|---------|-------------|------------|
| M1 | **Photo-to-Listing AI** | User takes 1-3 photos; AI identifies the item, generates a title, description, condition estimate, and suggested credit value. | As a user, I want to snap a photo and have the app do the rest so that listing takes under 60 seconds. |
| M2 | **AI Seal of Approval** | If the user accepts the AI-suggested price, the listing gets a trust badge and boosted visibility in the feed. Users can override the price but lose the seal. | As a buyer, I want to see which listings are objectively priced so that I don't waste time on overpriced junk. |
| M3 | **Credit Wallet** | Every user has a credit balance. Credits are earned, spent, and optionally purchased. Displayed prominently on the profile and nav bar. | As a user, I want to see my credit balance at all times so that I know what I can afford to trade for. |
| M4 | **Item Feed (Neighborhood)** | Location-gated feed showing items within the user's neighborhood (configurable radius: 0.5–3 miles). Sort by newest, ending soon, highest value, and "AI Sealed." | As a user, I want to browse items near me so that I can pick things up without driving across town. |
| M5 | **Search & Filter** | Keyword search with filters for category, credit range, condition, distance, and AI Seal status. | As a user, I want to search for a specific item so that I don't have to scroll through 200 listings of old lawnmowers. |
| M6 | **Trade Request Flow** | Buyer sends a trade request (offering credits or a counter-item). Seller accepts, counters, or declines. Both parties confirm completion after handoff. | As a buyer, I want to request a trade and coordinate a pickup so that the whole thing is handled in-app. |
| M7 | **Meetup Coordination** | After a trade is accepted, a simple chat + map pin for agreeing on handoff location and time. Pre-populated suggestions: "Porch drop," "Mailbox," "Driveway," or custom. | As a trader, I want to quickly agree on where to meet so that neither of us is standing around like an idiot. |
| M8 | **Dual Confirmation** | Both parties confirm the trade happened. Credits transfer only after both confirm. 48-hour auto-confirm if one side goes silent. | As a seller, I want confirmation that credits hit my wallet so that I know the trade is actually done. |
| M9 | **User Profiles** | Profile with display name, neighborhood, member-since date, trade count, average rating, active listings, Merit Rank badge, and earned Patches (The Sash). No real names required. | As a user, I want to check someone's profile before trading so that I'm not handing my DeWalt to a ghost account. |
| M10 | **Ratings & Reviews** | After trade completion, both parties rate each other (1-5 stars + optional one-liner). Ratings are public. | As a community member, I want to rate traders so that reliable dudes get recognized. |
| M11 | **User Authentication** | Email/password + phone verification. Single sign-on via Google and Apple. Phone verification required to list or trade (anti-spam). | As a new user, I want to sign up quickly so that I can start listing in under 2 minutes. |
| M12 | **Push Notifications** | Trade requests, acceptances, messages, and trade confirmations. All written in The Manconomy brand voice. | As a user, I want to know when someone wants my stuff so that I don't miss a trade. |
| M13 | **Onboarding Flow** | 5-screen onboarding: value prop, invite code validation, neighborhood selection, seed credits, prompt to list first item. Invite-only at launch. | As a new user, I want to understand how this works so that I don't bounce after 30 seconds. |
| M14 | **Cash Transaction Support (Penalized)** | Users can pay cash for items, but a 12% platform fee applies. Credit transactions are free. Cash fee is displayed prominently at checkout. | As a user, I want the option to pay cash if I'm short on credits, understanding I'll pay a premium. |
| M15 | **Neighborhood Geofence** | Users set their neighborhood during onboarding. All listings and browsing are scoped to that neighborhood by default. | As a user, I want to only see stuff I can actually walk or drive 5 minutes to pick up. |
| M16 | **Report / Block** | Report listings (wrong category, suspicious, prohibited items) and block users. | As a user, I want to report sketchy listings so that the marketplace stays legit. |
| M17 | **Invite-Only Auth + Neighborhood Captain Model** | At launch, new members need an invite code from an existing member. The first 10 members in any neighborhood are Charter Members (Neighborhood Captains) and receive 10 invites each. Every subsequent member receives 5 invites on signup. Opens to verified-address open enrollment at 200 active members per neighborhood. | As a new user, I want to join via an invite from a neighbor so that the community starts with people who already have some reason to trust each other. |

### Should Have (Launch Week / First Sprint Post-Launch)

| # | Feature | Description | User Story |
|---|---------|-------------|------------|
| S1 | **"Tinder for Blenders" Swipe Valuation** | Users swipe through items rating them (even items they don't want) to earn credits. Quick swipe UI: "Fair price" / "Too high" / "Too low" / "Skip." Optional comment. AI aggregates into crowd-validated valuations. | As a user, I want to earn credits by rating other people's stuff so that I can build my balance without listing anything. |
| S2 | **Wife/Partner "Insider" Account** | Linked account where a partner can anonymously review the user's items before they're listed. Partner earns credits for the linked account. Reviews are private to the couple. | As a wife, I want to secretly flag my husband's "mint condition" items as "held together with duct tape" so that listings are honest. |
| S3 | **Watchlist / Saved Items** | Save items to a watchlist. Get notified if the price drops or if the item is about to be traded. | As a buyer, I want to save items I'm interested in so that I can come back when I have enough credits. |
| S4 | **Category Browse** | Browse by category: Tools, Electronics, Outdoor/Camping, Sports Equipment, Home & Garage, Vehicles & Parts, Gaming, Other. | As a user, I want to browse by category so that I can window-shop specific types of gear. |
| S5 | **Referral System** | Invite a friend via link/code. Both get 50 bonus credits when the friend completes their first trade. | As a user, I want to invite my neighbor so that we both get credits and the marketplace grows. |
| S6 | **Trade History** | Full history of past trades with details, ratings given/received, and credit flow. | As a user, I want to see my trade history so that I can track what I've moved and earned. |
| S7 | **In-App Messaging** | Basic chat between matched traders. Text only (no images in chat for MVP). Pre-built quick replies: "Still available?" / "When works for pickup?" / "On my way." | As a trader, I want to message the other person so that we can coordinate without exchanging phone numbers. |
| S8 | **Credit Purchase (IAP)** | Buy credits via in-app purchase. Packages: 100 credits ($4.99), 250 credits ($9.99), 500 credits ($17.99). | As a user, I want to buy credits when I need them so that I can grab a good deal immediately. |
| S9 | **Item Stories** | Optional micro-prompts attached to listings. Sellers answer 1–5 prompts ("What did you love about this?" / "What were you going to build with it?" / "Be honest about the condition.") and earn 5–8 credits per prompt answered. Readers swipe through Stories in a dedicated tab or as expandable cards on item detail pages. Readers earn 1 credit per reaction (cap: 30/day). Stories are algorithmically sorted by reaction rate. Best stories are shareable outside the app. | As a seller, I want to tell the story behind my stuff so that it actually sells. As a reader, I want to swipe through stories because it's more fun than scrolling a boring feed. |
| S10 | **Food Add-On Prompt** | At trade confirmation, prompt: "Want to throw something in?" Optional food add-on (garden surplus, baked good, cold beer, etc.). Earns the Provisioner patch and a norm-nudge for large trades: "This is a 500-credit trade. The move is to bring something." | As a buyer, I want to add a food item to seal the deal so that the trade feels like a real neighborhood exchange, not a transaction. |
| S11 | **Perishable / Food Listing Type** | Distinct listing type for perishable and homemade food items. Includes `pickup_by_date`, `food_category` (produce, baked goods, preserved/smoked, homebrewed, packaged), freshness note, food safety disclaimer, and pickup urgency UI. | As a gardener, I want to list my tomato surplus before it rots so that my neighbors get fresh produce and I get credits. |
| S12 | **Patches & The Sash** | Achievement system. Patches are earned (never purchased) for milestones: First Fire (first trade), The Handshake (5-star first 3 trades), Provisioner (food add-on), The Gardener (garden surplus), Brewmaster (homebrewed alcohol listing), Founding Member, etc. All patches visible on profile Sash. Unearned patches shown as greyed silhouettes (completionist bait). | As a trader, I want to show off my patches so that people can see at a glance that I'm the real deal. |
| S13 | **Merit Ranks** | Neighborhood-scoped rank system earned through trading activity. Ranks: Tenderfoot → Scout → Trader → Dealer → Outfitter → Trailblazer → Quartermaster → Captain → Legend. Never purchasable. Rank badge displayed on avatar throughout the app. | As a member, I want a rank that reflects my actual contribution so that reputation means something around here. |
| S14 | **Public Listing Conversations** | Every listing has a public thread. Anyone can comment, ask questions, make offers, or weigh in on the item. Increases social surface area of each listing and surfaces community knowledge. | As a buyer, I want to see what other people are saying about a listing so that I can make a better decision. |
| S15 | **The Pitch / Make Your Case** | Buyers submit a short pitch explaining what they plan to do with the item. Seller picks the winner based on pitch quality, not just credits. Pitches are public and votable. Creates entertainment and drives engagement beyond pure price competition. | As a seller, I want to know my drill is going to someone who'll actually use it so that I feel good about the trade. |
| S16 | **Leaderboards** | Neighborhood-scoped boards for: most trades, best deal, best item story, longest Climb chain. Tone is barbershop scoreboard, not LinkedIn achievement wall. Updated weekly. | As a member, I want to see who's running the neighborhood market so that I know who to learn from and who to beat. |

### Nice to Have (Phase 1.5 — Weeks 4-8)

| # | Feature | Description | User Story |
|---|---------|-------------|------------|
| N1 | **Achievement Badges** | Unlock badges for milestones: first trade, 10 trades, 5-star average, "Neighborhood Legend" (most trades in area). Displayed on profile. | As a user, I want to show off my trading cred so that people know I'm a reliable dude. |
| N2 | **"Hot Items" Trending Feed** | AI-curated feed of items getting the most swipe engagement, watchlists, and trade requests. | As a user, I want to see what's hot so that I don't miss the good stuff. |
| N3 | **Seasonal Prompts** | AI-generated prompts: "Spring cleaning? List your snow blower before it collects dust all summer." Pushed contextually. | As the platform, I want to nudge users to list seasonally relevant items so that supply stays fresh. |
| N4 | **QR Code Handoff** | Generate a QR code for trades. Both parties scan at meetup to auto-confirm the trade. | As a trader, I want to confirm the handoff instantly so that I don't forget to hit "confirm" later. |
| N5 | **Dark Mode** | Because of course. | As a user browsing at 11pm, I want dark mode so that my wife doesn't ask what I'm doing on my phone again. |
| N6 | **Bulk Listing** | Take multiple photos of multiple items in one session. AI identifies and creates separate listings for each. "Garage cleanout mode." | As a user cleaning out my garage, I want to list 10 things at once so that I don't spend my entire Saturday on this. |
| N7 | **Counter-Offer with Items** | Instead of just offering credits, offer to swap one of your listed items directly. | As a user, I want to offer a straight swap so that we can trade without credits changing hands at all. |

---

## 2. User Flows

### 2.1 Listing an Item

```
┌─────────────────────────────────────────────────────────────────┐
│                     LISTING FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [1] TAP "+" BUTTON                                             │
│   │  Bottom nav, prominent, always visible                      │
│   │  Copy: "Got something collecting dust?"                     │
│   ▼                                                             │
│  [2] CAMERA / PHOTO PICKER                                      │
│   │  Take 1-3 photos (minimum 1)                                │
│   │  Tips overlay: "Get the whole thing in frame, king"          │
│   │  Option: Camera or Gallery                                  │
│   ▼                                                             │
│  [3] AI PROCESSING (2-4 seconds)                                │
│   │  Loading screen: "Our AI is squinting at your stuff..."     │
│   │  AI returns:                                                │
│   │   • Item title (editable)                                   │
│   │   • Category (editable dropdown)                            │
│   │   • Description (editable, 2-3 sentences)                   │
│   │   • Condition estimate (New / Like New / Good / Fair / Rough)│
│   │   • Suggested credit value (with confidence %)              │
│   ▼                                                             │
│  [4] REVIEW & EDIT                                              │
│   │  User sees AI-generated listing                             │
│   │  Can edit any field                                         │
│   │  KEY DECISION POINT:                                        │
│   │                                                             │
│   │  ┌──────────────────────────────────────────┐               │
│   │  │  AI suggests: 85 credits                 │               │
│   │  │                                          │               │
│   │  │  [✓ Accept AI Price]  [Set My Own Price] │               │
│   │  │                                          │               │
│   │  │  Accept = AI Seal of Approval badge      │               │
│   │  │        + Boosted feed visibility          │               │
│   │  │        + Higher trust signal              │               │
│   │  │                                          │               │
│   │  │  Own Price = No seal, no boost            │               │
│   │  │           = Full pricing freedom          │               │
│   │  └──────────────────────────────────────────┘               │
│   ▼                                                             │
│  [5] PUBLISH                                                    │
│   │  Tap "List It"                                              │
│   │  Confirmation: "Your [item] is live. May the trades         │
│   │                 be ever in your favor."                      │
│   │  Listing appears in neighborhood feed immediately           │
│   ▼                                                             │
│  [6] POST-LIST PROMPT                                           │
│      "Got more stuff? Your garage isn't going to clean itself." │
│      [List Another] [Done for Now]                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Edge Cases:**
- AI can't identify item → Fallback: "We're stumped. What is this thing?" Manual entry form.
- Photo too blurry → "This looks like it was taken during an earthquake. Try again?"
- No photos → Cannot proceed. "We need at least one photo. We're visual creatures."

### 2.2 Browsing & Discovering Items

```
┌─────────────────────────────────────────────────────────────────┐
│                   BROWSE / DISCOVER FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HOME SCREEN (Default: Neighborhood Feed)                       │
│  ┌─────────────────────────────────────────────────┐            │
│  │  [Search Bar: "Find stuff..."]                  │            │
│  │  [Filters: Category | Price | Distance | Seal]  │            │
│  │                                                 │            │
│  │  Sort: [Newest] [Nearby] [AI Sealed] [Hot]      │            │
│  │                                                 │            │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐         │            │
│  │  │  Photo  │  │  Photo  │  │  Photo  │         │            │
│  │  │  Title  │  │  Title  │  │  Title  │         │            │
│  │  │  85 cr  │  │  120 cr │  │  45 cr  │         │            │
│  │  │  ✓ Seal │  │         │  │  ✓ Seal │         │            │
│  │  │  0.3 mi │  │  1.1 mi │  │  0.5 mi │         │            │
│  │  └─────────┘  └─────────┘  └─────────┘         │            │
│  │                                                 │            │
│  │  [Load More]                                    │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
│  TAP ITEM → ITEM DETAIL                                         │
│  ┌─────────────────────────────────────────────────┐            │
│  │  [Photo Gallery — swipe through 1-3 photos]     │            │
│  │                                                 │            │
│  │  DeWalt 20V Drill Kit                           │            │
│  │  ✓ AI Seal of Approval                          │            │
│  │  85 credits (~$17 value)                        │            │
│  │                                                 │            │
│  │  Condition: Like New                            │            │
│  │  "Barely used DeWalt 20V drill with 2           │            │
│  │   batteries and charger. Works perfectly."      │            │
│  │                                                 │            │
│  │  Listed by: GarageDude_Mike ★★★★☆ (12 trades)  │            │
│  │  Distance: 0.3 miles                            │            │
│  │                                                 │            │
│  │  Crowd Valuation: 82 credits (14 ratings)       │            │
│  │                                                 │            │
│  │  [♡ Save]  [💬 Message]  [🔄 Request Trade]     │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
│  TAP "Request Trade" →                                          │
│  ┌─────────────────────────────────────────────────┐            │
│  │  How do you want to pay?                        │            │
│  │                                                 │            │
│  │  [Credits: 85 cr]     ← Free, instant           │            │
│  │  [Cash: $19.04]       ← Includes 12% fee        │            │
│  │  [Offer a Swap]       ← Pick from your items    │            │
│  │                                                 │            │
│  │  Add a message: "Hey, is the battery still      │            │
│  │  holding a full charge?"                        │            │
│  │                                                 │            │
│  │  [Send Request]                                 │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 "Tinder for Blenders" Evaluation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               TINDER FOR BLENDERS — SWIPE VALUATION             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ENTRY POINT: "Rate Stuff" tab in bottom nav                    │
│  Copy: "Judge other people's stuff. Get paid for it."           │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐            │
│  │                                                 │            │
│  │           ┌───────────────────┐                 │            │
│  │           │                   │                 │            │
│  │           │   [Item Photo]    │   ← Swipeable   │            │
│  │           │                   │      card        │            │
│  │           │   NutriBullet Pro │                 │            │
│  │           │   Condition: Good │                 │            │
│  │           │                   │                 │            │
│  │           │   Listed at:      │                 │            │
│  │           │   45 credits      │                 │            │
│  │           │                   │                 │            │
│  │           └───────────────────┘                 │            │
│  │                                                 │            │
│  │    [👎 Too High]  [🤷 Skip]  [👍 Fair]  [🔥 Steal] │         │
│  │                                                 │            │
│  │    Optional: [Add Comment]                      │            │
│  │    "Missing one of the blade attachments"       │            │
│  │                                                 │            │
│  │    Progress: ████████░░ 8/10 today              │            │
│  │    Credits earned this session: 8 cr            │            │
│  │                                                 │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
│  SWIPE MECHANICS:                                               │
│  • Swipe left = "Too High" (price is above fair value)          │
│  • Swipe right = "Fair Price" (price is reasonable)             │
│  • Swipe up = "Steal" (this is a great deal)                    │
│  • Swipe down = "Skip" (don't know / no opinion)               │
│  • Tap to flip card and see full description                    │
│                                                                 │
│  REWARDS:                                                       │
│  • 1 credit per rating (daily cap: 25 ratings = 25 credits)    │
│  • Bonus: 5 credits for every comment left                      │
│  • Bonus: 2 credits if your rating matches the final consensus  │
│  • Daily cap: 25 ratings + 10 comments = 85 credits/day (price swipe only)  │
│    Add Item Stories reactions for up to 30 more credits/day    │
│                                                                 │
│  AI AGGREGATION:                                                │
│  After 5+ ratings on an item, AI calculates:                    │
│  • Crowd consensus value (weighted average)                     │
│  • Confidence score (how much raters agreed)                    │
│  • Flag if listed price deviates >30% from crowd value          │
│  • Seller is notified: "The crowd thinks your item is           │
│    worth 38 credits. You listed at 45. Adjust?"                 │
│                                                                 │
│  ANTI-GAMING:                                                   │
│  • Ratings from accounts <3 days old are weighted 50%           │
│  • If a user always swipes the same direction, weight drops     │
│  • Suspicious patterns (too fast, always "steal") → CAPTCHA     │
│  • Comments are lightly moderated by AI for spam/gibberish      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 Item Stories Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  ITEM STORIES — BACKSTORY SWIPE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SURFACE 1: SELLER SIDE — Answering Prompts                     │
│  ─────────────────────────────────────────────────────────────  │
│  Appears after publishing a listing.                            │
│  Copy: "Want to earn more credits? Tell the story."             │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐            │
│  │  ITEM STORY PROMPTS                             │            │
│  │  (Each prompt = optional. Each answer = credits) │            │
│  │                                                 │            │
│  │  📝 "What were you going to do with this?"      │            │
│  │     [Answer here...]                            │  +6 cr     │
│  │                                                 │            │
│  │  🔧 "What did you love about it?"               │            │
│  │     [Answer here...]                            │  +5 cr     │
│  │                                                 │            │
│  │  💀 "Be honest. What's wrong with it?"          │            │
│  │     [Answer here...]                            │  +8 cr     │
│  │                                                 │            │
│  │  🏗️ "What could someone build with this?"       │            │
│  │     [Answer here...]                            │  +6 cr     │
│  │                                                 │            │
│  │  📖 "One thing that happened with this item."   │            │
│  │     [Answer here...]                            │  +8 cr     │
│  │                                                 │            │
│  │  [Skip All]              [Earn 33 Credits] →    │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
│  SURFACE 2: READER SIDE — The Stories Tab                       │
│  ─────────────────────────────────────────────────────────────  │
│  Entry point: "Stories" tab in bottom nav (or card              │
│  expand on item detail page)                                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐            │
│  │                                                 │            │
│  │  ┌─────────────────────────────────────────┐   │            │
│  │  │  [Item Photo: Breadmaker]               │   │            │
│  │  │                                         │   │            │
│  │  │  "What were you going to do with this?" │   │            │
│  │  │                                         │   │            │
│  │  │  "I bought this for my wife in 2019.    │   │            │
│  │  │  She made exactly one loaf of bread.    │   │            │
│  │  │  It was good bread. We still talk about │   │            │
│  │  │  that bread. The machine has not been   │   │            │
│  │  │  touched since."                        │   │            │
│  │  │                                         │   │            │
│  │  │  — Dave M., 0.4 miles away              │   │            │
│  │  │                                         │   │            │
│  │  │  [😂 Same]  [💀 RIP]  [🤌 Sold]  [➡️ Pass] │  │            │
│  │  └─────────────────────────────────────────┘   │            │
│  │                                                 │            │
│  │  Credits earned: 12 reactions today             │            │
│  │  Daily cap: 30 reactions = 30 credits           │            │
│  │                                                 │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
│  FEED LOGIC:                                                    │
│  • Sorted by reaction rate (most engaging stories first)        │
│  • Items with stories get +15% feed visibility boost            │
  │  • Shareable as screenshot cards (auto-branded with The Manconomy logo)   │
│  • Best stories surfaced in weekly "Stories of the Week" push   │
│                                                                 │
│  REWARDS SUMMARY:                                               │
│  Seller: 5–8 credits per prompt (up to 5 prompts/listing)       │
│  Reader: 1 credit per reaction (daily cap: 30)                  │
│                                                                 │
│  ANTI-ABUSE:                                                    │
│  • Minimum 15 words per story prompt to earn credits            │
│  • AI checks for gibberish/copy-paste patterns                  │
│  • Reaction fraud same anti-gaming rules as Tinder for Blenders │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.5 Making a Trade

```
┌─────────────────────────────────────────────────────────────────┐
│                      TRADE FLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [1] BUYER SENDS REQUEST                                        │
│   │  Chooses: Credits / Cash / Swap                             │
│   │  Adds optional message                                     │
│   │  Push to seller: "Someone wants your drill. Don't leave     │
│   │  them hanging."                                             │
│   ▼                                                             │
│  [2] SELLER RESPONDS                                            │
│   │  Three options:                                             │
│   │                                                             │
│   │  [Accept] → Move to meetup coordination                    │
│   │  [Counter] → Suggest different credit amount or swap item   │
│   │  [Decline] → "No thanks" (optional reason)                 │
│   │                                                             │
│   │  Counter-offer limit: 3 rounds max, then auto-expire       │
│   │  Push to buyer: "GarageDude_Mike accepted your offer.       │
│   │  Time to coordinate the handoff."                           │
│   ▼                                                             │
│  [3] MEETUP COORDINATION                                        │
│   │  Both parties see a trade card:                             │
│   │                                                             │
│   │  ┌──────────────────────────────────────────┐               │
│   │  │  TRADE #00142                            │               │
│   │  │  Item: DeWalt 20V Drill Kit              │               │
│   │  │  Amount: 85 credits                      │               │
│   │  │                                          │               │
│   │  │  Meetup:                                 │               │
│   │  │  [📍 Porch Drop] [📍 Mailbox]            │               │
│   │  │  [📍 Driveway]   [📍 Custom Location]    │               │
│   │  │                                          │               │
│   │  │  When:                                   │               │
│   │  │  [Today] [Tomorrow] [Pick a Time]        │               │
│   │  │                                          │               │
│   │  │  [💬 Chat with Trader]                   │               │
│   │  └──────────────────────────────────────────┘               │
│   │                                                             │
│   │  Chat opens with pre-built quick replies:                   │
│   │  "Still good for today?" / "On my way" / "Running late"    │
│   ▼                                                             │
│  [4] HANDOFF                                                    │
│   │  Both parties meet. Exchange happens IRL.                   │
│   │  After handoff, both see:                                  │
│   │                                                             │
│   │  "Did the trade happen?"                                   │
│   │  [✓ Confirm — Got it!]  [✗ Something went wrong]           │
│   ▼                                                             │
│  [5] DUAL CONFIRMATION                                          │
│   │  Scenario A: Both confirm → Credits transfer immediately    │
│   │  Scenario B: One confirms, one doesn't →                   │
│   │              48-hour grace period, then auto-confirm        │
│   │  Scenario C: Dispute → Flag for manual review               │
│   ▼                                                             │
│  [6] POST-TRADE                                                 │
│      Rate the other trader (1-5 stars + comment)                │
│      Push: "Trade complete! You earned 85 credits.              │
│      That drill is in better hands now."                        │
│                                                                 │
│      Cross-sell: "With 85 credits, you could grab              │
│      that fishing rod you've been eyeing 👀"                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Trade Expiration Rules:**
- Trade requests expire after 48 hours if not responded to
- Accepted trades must coordinate meetup within 7 days
- After 7 days without meetup confirmation, trade auto-cancels
- Credits are held in escrow during active trades

### 2.6 Wife/Partner "Insider" Account Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  INSIDER ACCOUNT FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [1] DUDE INITIATES LINK                                        │
│   │  Settings → "Add an Insider"                                │
│   │  Copy: "Got someone who keeps you honest?                   │
│   │  Link their account. They earn you credits."                │
│   │                                                             │
│   │  Enter partner's email or phone →                           │
│   │  Invite sent                                                │
│   ▼                                                             │
│  [2] PARTNER RECEIVES INVITE                                    │
│   │  Push/SMS: "Your partner invited you to be their            │
│   │  BS detector on The Manconomy. Accept and earn credits     │
│   │  for their account."                                        │
│   │                                                             │
│   │  Partner downloads app → Creates Insider account            │
│   │  Simplified profile (no listings, no trading)               │
│   ▼                                                             │
│  [3] INSIDER DASHBOARD                                          │
│   │  Partner sees:                                              │
│   │  • Draft listings from linked account                       │
│   │  • Published listings from linked account                   │
│   │  • Option to review any listing                             │
│   │                                                             │
│   │  ┌──────────────────────────────────────────┐               │
│   │  │  Mike listed: "Vintage Record Player"    │               │
│   │  │  Condition: "Like New"                   │               │
│   │  │  Price: 200 credits                      │               │
│   │  │                                          │               │
│   │  │  Your take:                              │               │
│   │  │  Condition accurate? [Yes] [Ehh...] [No] │               │
│   │  │  Price fair?  [Yes] [Too High] [Too Low] │               │
│   │  │  Notes: "The needle skips on side B.     │               │
│   │  │  You KNOW this, Michael."                │               │
│   │  │                                          │               │
│   │  │  [Submit Review]                         │               │
│   │  └──────────────────────────────────────────┘               │
│   ▼                                                             │
│  [4] REVIEW IMPACT                                              │
│   │  • Insider reviews are PRIVATE — only the linked user       │
│   │    and the Insider see them                                 │
│   │  • Reviews do NOT appear on the public listing              │
│   │  • If the Insider flags condition as inaccurate:            │
│   │    → Dude gets a private nudge: "Your Insider thinks        │
│   │       the condition might be a stretch. Update?"            │
│   │  • If the Insider flags price as too high:                  │
│   │    → Dude gets a nudge: "Your Insider thinks 200            │
│   │       credits is ambitious. The AI suggested 140."          │
│   │  • Dude can accept or ignore (no enforcement)               │
│   ▼                                                             │
│  [5] CREDIT REWARDS                                             │
│      • Insider earns 3 credits per review (for linked account)  │
│      • Max 10 reviews per day = 30 credits/day                  │
│      • Credits go to the DUDE's wallet, not the Insider's       │
│      • Insider has no wallet of their own — this is a           │
│        service-to-household model                               │
│                                                                 │
│  PRIVACY GUARANTEES:                                            │
│  • Insider identity is never revealed to buyers                 │
│  • Insider cannot see trade conversations or buyer identities   │
│  • Insider can unlink at any time                               │
│  • Dude can remove Insider at any time                          │
│  • Max 1 Insider per account                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.7 Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ONBOARDING FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [1] SPLASH / SIGN UP                                           │
│   │  "THE MANCONOMY"                                            │
│   │  "Trade like a man. Live like a neighbor."                  │
│   │                                                             │
│   │  [Sign Up with Google]                                      │
│   │  [Sign Up with Apple]                                       │
│   │  [Sign Up with Email]                                       │
│   │  Already have an account? [Log In]                          │
│   ▼                                                             │
│  [2] INVITE CODE                                                │
│   │  "Got an invite? Enter your code."                          │
│   │  [Enter Invite Code: ____________]                          │
│   │                                                             │
│   │  "The Manconomy is invite-only right now — we're            │
│   │   building one neighborhood at a time. If you don't         │
│   │   have a code, get on the waitlist."                        │
│   │  [Join Waitlist]                                            │
│   │                                                             │
│   │  (Invite code validates neighborhood assignment             │
│   │   automatically — no separate neighborhood step needed      │
│   │   if invite code is from a specific chapter.)               │
│   ▼                                                             │
│  [3] PHONE VERIFICATION                                         │
│   │  "Verify your phone so we know you're a real                │
│   │   person and not a bot trying to trade imaginary tools."    │
│   │  [Enter Phone] → [Enter Code]                               │
│   ▼                                                             │
│  [4] SET YOUR NEIGHBORHOOD (if not auto-assigned by invite)     │
│   │  "Where's home base?"                                       │
│   │  [📍 Use Current Location]                                  │
│   │  [Enter Address / ZIP]                                      │
│   │                                                             │
│   │  Map shows neighborhood boundary (1-mile radius default)    │
│   │  "You'll see items from your Chapter in this area.          │
│   │   You can adjust the radius later."                         │
│   ▼                                                             │
│  [5] CREATE PROFILE                                             │
│   │  Display name (not real name): ____________                 │
│   │  "Something your neighbor would recognize.                  │
│   │   Or don't. We're not your mom."                            │
│   │  Optional: Profile photo                                    │
│   │  Rank: 🏕️ Tenderfoot (you'll earn your way up)             │
│   ▼                                                             │
│  [6] SEED CREDITS                                               │
│   │  "Here's 50 credits on us. That's enough to grab            │
│   │   a decent blender or a slightly-used yoga mat              │
│   │   your wife made you buy."                                  │
│   │                                                             │
│   │  ┌──────────────────────────────┐                           │
│   │  │  🎉 +50 credits              │                           │
│   │  │  Your starting balance       │                           │
│   │  └──────────────────────────────┘                           │
│   ▼                                                             │
│  [7] EARN-MORE PROMPT                                           │
│   │  "Want more credits right now? Here's how:"                 │
│   │                                                             │
│   │  [📸 List Your First Item]    → +10 bonus credits           │
│   │  [⭐ Rate 5 Items]            → 5 credits (1 each)         │
│   │  [👥 Invite a Neighbor]       → 50 credits when they trade │
│   │  [Skip for Now]                                             │
│   ▼                                                             │
│  [8] HOME FEED                                                  │
│      User lands on neighborhood feed (The Market).             │
│      If <5 items in neighborhood:                               │
│      "It's quiet around here. Be the first to list             │
│       something and set the tone for the Chapter."              │
│                                                                 │
│      If items exist:                                            │
│      "Here's what your Chapter is trading.                      │
│       One man's junk, you know the rest."                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.8 Food Add-On Trade Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               FOOD ADD-ON — THE PROVISION PROMPT                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TRIGGER: Trade confirmed (buyer and seller have agreed).       │
│  Appears between "Trade Accepted" and "Meetup Coordination."    │
│                                                                 │
│  [1] PROVISION PROMPT (shown to BUYER)                          │
│   │                                                             │
│   │  ┌──────────────────────────────────────────┐               │
│   │  │  🥩  Want to throw something in?         │               │
│   │  │                                          │               │
│   │  │  "A good trade is more than a            │               │
│   │  │   transaction. Got anything to bring?"   │               │
│   │  │                                          │               │
│   │  │  [🍺 Cold beer]   [🥕 Garden stuff]      │               │
│   │  │  [🍪 Baked good]  [🌶️ Hot sauce/preserves]│              │
│   │  │  [🌱 Other food]  [Nah, I'm good]        │               │
│   │  │                                          │               │
│   │  │  Or type it: _________________________   │               │
│   │  └──────────────────────────────────────────┘               │
│   ▼                                                             │
│  [2] LARGE-TRADE PROVISION NORM (≥ 300 credits)                 │
│   │                                                             │
│   │  If trade value is 300+ credits, the norm nudge             │
│   │  activates BEFORE the standard add-on prompt:               │
│   │                                                             │
│   │  ┌──────────────────────────────────────────┐               │
│   │  │  📖  The Provision Code                  │               │
│   │  │                                          │               │
│   │  │  "This is a 400-credit trade.            │               │
│   │  │   The move is to bring something.        │               │
│   │  │   Ribs, beer, a jar of something you     │               │
│   │  │   made — doesn't matter. The point       │               │
│   │  │   is that you showed up right."          │               │
│   │  │                                          │               │
│   │  │  [I'll bring something ↓]                │               │
│   │  │  [Skip — I understand the vibe]          │               │
│   │  └──────────────────────────────────────────┘               │
│   ▼                                                             │
│  [3] FOOD ADD-ON CONFIRMATION                                   │
│   │  If buyer selects a food add-on:                            │
│   │                                                             │
│   │  Seller is notified:                                        │
│   │  "GarageDude_Mike is bringing a six-pack.                   │
│   │   This is why the neighborhood works."                      │
│   │                                                             │
│   │  Both parties see add-on noted on trade card:               │
│   │  ┌──────────────────────────────────────────┐               │
│   │  │  TRADE #00142                            │               │
│   │  │  Item: DeWalt 20V Drill Kit              │               │
│   │  │  Amount: 85 credits                      │               │
│   │  │  🥩 Food add-on: Cold beer               │               │
│   │  └──────────────────────────────────────────┘               │
│   ▼                                                             │
│  [4] PATCH TRIGGER                                              │
│      First food add-on sent → 🥩 Provisioner patch unlocked.   │
│      "Provisioner — you brought something to the table.         │
│       Literally."                                               │
│                                                                 │
│  RULES & NOTES:                                                 │
│  • Food add-on is always optional — zero pressure enforcement   │
│  • Add-on is logged but NOT verified (honor system)             │
│  • The norm nudge appears only once per user until they've      │
│    done a large trade with a food add-on (then it disappears)   │
│  • Food add-on noted in trade history (both profiles)           │
│  • No credit exchange for the food — it's a gift                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.9 Perishable / Homemade Food Listing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              FOOD LISTING — PERISHABLE & HOMEMADE               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ENTRY: Standard "+" listing flow. After photo step, AI or      │
│  user identifies item as food/perishable. Flow branches.        │
│                                                                 │
│  [1] FOOD CATEGORY SELECT                                       │
│   │                                                             │
│   │  "What kind of food is this?"                               │
│   │                                                             │
│   │  [🌽 Garden Produce]      [🥚 Eggs / Dairy]                 │
│   │  [🍞 Baked Goods]         [🥩 Smoked / Preserved]          │
│   │  [🌶️ Hot Sauce / Jam]    [🍺 Homebrewed Alcohol]           │
│   │  [📦 Commercial Packaged] [🔧 Food-Related Gear]           │
│   ▼                                                             │
│  [2] PERISHABLE DETAILS (if perishable food selected)          │
│   │                                                             │
│   │  Pickup by: [Date picker — max 14 days out]                 │
│   │                                                             │
│   │  Freshness note (optional):                                 │
│   │  "Picked this morning" / "Baked yesterday" / etc.           │
│   │  [Free text, max 80 chars]                                  │
│   │                                                             │
│   │  Quantity: [e.g., "2 dozen eggs", "3 lbs tomatoes"]         │
│   │                                                             │
│   │  ⚠️ Food Safety Note (auto-shown, not dismissible):         │
│   │  ┌──────────────────────────────────────────┐               │
│   │  │  "By listing food, you confirm it is     │               │
│   │  │   safe for consumption and stored         │               │
│   │  │   properly. The Manconomy is a           │               │
│   │  │   community platform — not a grocery     │               │
│   │  │   store. Trade accordingly."             │               │
│   │  └──────────────────────────────────────────┘               │
│   ▼                                                             │
│  [3] HOMEBREW DISCLAIMER (if homebrewed alcohol selected)       │
│   │                                                             │
│   │  ┌──────────────────────────────────────────┐               │
│   │  │  🍺  Homebrew Policy                     │               │
│   │  │                                          │               │
│   │  │  "Homebrewed beer, wine, and cider are   │               │
│   │  │   welcome on The Manconomy. However,     │               │
│   │  │   laws around giving/trading homemade    │               │
│   │  │   alcohol vary by state. Know your       │               │
│   │  │   local rules before you list.           │               │
│   │  │   You're responsible. We're just the     │               │
│   │  │   neighborhood notice board."            │               │
│   │  │                                          │               │
│   │  │  [✓ Got it — List My Brew]               │               │
│   │  └──────────────────────────────────────────┘               │
│   ▼                                                             │
│  [4] REVIEW & PUBLISH                                           │
│   │  AI-generated listing with food-specific fields:            │
│   │                                                             │
│   │  ┌──────────────────────────────────────────┐               │
│   │  │  [Photo: Jar of ghost pepper hot sauce]  │               │
│   │  │                                          │               │
│   │  │  Ghost Pepper Hot Sauce — Homemade       │               │
│   │  │  Category: 🌶️ Hot Sauce / Jam            │               │
│   │  │  Credits: 15                             │               │
│   │  │  Pickup by: April 18                     │               │
│   │  │  "Three years in the making. Not for     │               │
│   │  │   the faint of heart or weak of gut."    │               │
│   │  │                                          │               │
│   │  │  [✓ List It]                             │               │
│   │  └──────────────────────────────────────────┘               │
│   ▼                                                             │
│  [5] PICKUP URGENCY UI                                          │
│      As pickup_by_date approaches, listing UI changes:          │
│                                                                 │
│      >7 days out:   Normal listing appearance                   │
│      3–7 days out:  🕐 "Pick up by [date]" label added          │
│      1–2 days out:  🔴 "Pickup urgent — [date]" (red badge)     │
│      Day of:        🚨 "Today only" (pulsing indicator)         │
│      Expired:       Listing auto-removed from feed              │
│                                                                 │
│  PATCH TRIGGERS:                                                │
│  • First garden/produce listing → 🌱 The Gardener              │
│  • First homebrew listing → 🍺 Brewmaster                      │
│  • 5 completed food trades → 🍖 The Grill (Phase 2 seed)       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.10 The Pitch / Make Your Case Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               THE PITCH — MAKE YOUR CASE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WHEN: Seller enables "Pitch Mode" on a listing before          │
│  publishing. This replaces or augments standard trade requests. │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Listing: 1968 Craftsman Toolbox — Full Set      │           │
│  │  Credits: 350                                    │           │
│  │                                                  │           │
│  │  🎤 PITCH MODE ENABLED                           │           │
│  │  "This toolbox has a story. So should its        │           │
│  │   next owner. Tell me what you'll do with it."   │           │
│  │                                                  │           │
│  │  Pitches close: Sunday at 6pm                    │           │
│  │  Current pitches: 4                              │           │
│  │                                                  │           │
│  │  [📣 Make Your Case]   [📖 Read the Pitches]     │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                 │
│  [1] BUYER SUBMITS A PITCH                                      │
│   │                                                             │
│   │  ┌──────────────────────────────────────────┐               │
│   │  │  Make Your Case                          │               │
│   │  │                                          │               │
│   │  │  "What are you going to do with this?"   │               │
│   │  │  [Free text — min 30 words]              │               │
│   │  │  ________________________________        │               │
│   │  │  ________________________________        │               │
│   │  │                                          │               │
│   │  │  "Why do you deserve this over           │               │
│   │  │   everyone else?" (optional)             │               │
│   │  │  ________________________________        │               │
│   │  │                                          │               │
│   │  │  Credits offered: [  350  ] (editable)   │               │
│   │  │                                          │               │
│   │  │  [Submit Pitch — Make It Count]          │               │
│   │  └──────────────────────────────────────────┘               │
│   │                                                             │
│   │  Pitch is immediately PUBLIC on the listing.                │
│   │  Buyer notified: "Your pitch is live. The neighborhood      │
│   │  is reading it. No pressure."                               │
│   ▼                                                             │
│  [2] PUBLIC PITCH BOARD (anyone can read)                       │
│   │                                                             │
│   │  ┌──────────────────────────────────────────┐               │
│   │  │  THE PITCHES — 1968 Craftsman Toolbox    │               │
│   │  │                                          │               │
│   │  │  🏆 Top pitch (by community votes):      │               │
│   │  │  ─────────────────────────────────────   │               │
│   │  │  HandyDave_Eastside  •  350 cr  •  41 👍 │               │
│   │  │  "My dad had the exact same set. He      │               │
│   │  │   taught me to fix things on a Friday    │               │
│   │  │   night after dinner. These are going    │               │
│   │  │   in my garage and they're never moving  │               │
│   │  │   again. My son is 8."                   │               │
│   │  │                                          │               │
│   │  │  WrenMike  •  350 cr  •  18 👍           │               │
│   │  │  "Opening a small engine repair shop     │               │
│   │  │   next spring. These would be my         │               │
│   │  │   opening-day tools."                    │               │
│   │  │                                          │               │
│   │  │  ToolHoarder99  •  400 cr  •  3 👍       │               │
│   │  │  "I'll use them."  ← (crowd is judging)  │               │
│   │  │                                          │               │
│   │  │  [👍 Vote]  available to all members     │               │
│   │  └──────────────────────────────────────────┘               │
│   ▼                                                             │
│  [3] SELLER PICKS THE WINNER                                    │
│   │                                                             │
│   │  Seller is NOT bound by vote count.                         │
│   │  Seller can pick any pitch — including a lower credit offer │
│   │  if the story is better. That's the whole point.            │
│   │                                                             │
│   │  Seller sees: all pitches + vote counts + credit offers     │
│   │  Seller taps [Pick This One] on winning pitch.              │
│   │                                                             │
│   │  Notification to winner:                                    │
│   │  "You got it. Your pitch won the toolbox.                   │
│   │   Coordinate pickup — don't let him down."                  │
│   │                                                             │
│   │  Notification to non-winners:                               │
│   │  "You didn't get the toolbox. But HandyDave_Eastside's      │
│   │   pitch was a masterpiece. No shame in losing to that."     │
│   ▼                                                             │
│  [4] POST-PITCH ENGAGEMENT                                      │
│      Pitches stay public after trade completes (with winner     │
│      marked). Best pitches surface in Leaderboards:             │
│      "Best Pitch of the Week" category.                         │
│                                                                 │
│  SELLER CONFIGURATION (when enabling Pitch Mode):               │
│  • Pitch window: 24h / 48h / 72h / Custom                       │
│  • Minimum pitch length: 30 words (default, adjustable)         │
│  • Allow credit offers above asking: Yes / No                   │
│  • Close early if right pitch appears: Yes / No                 │
│                                                                 │
│  RULES:                                                         │
│  • Pitches are public and cannot be deleted after submission    │
│  • Seller cannot see vote counts until pitch window closes      │
│    (prevents bandwagon effect — seller sees raw pitches first)  │
│  • Credits are NOT held in escrow during pitching window        │
│  • Pitch Mode is optional — standard trade flow always works    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Credit Economy Design

### 3.1 How Credits Are Earned

| Source | Credits | Cap | Notes |
|--------|---------|-----|-------|
| **New user signup** | 50 | One-time | Enough to make first small trade |
| **First listing bonus** | 10 | One-time | Incentivize immediate listing |
| **Completing a trade (seller)** | Listed price | Per trade | Seller receives what they listed |
| **Completing a trade (buyer)** | 0 | — | Buyer spends credits |
| **"Tinder for Blenders" rating** | 1 per rating | 25/day | Quick swipe, low effort |
| **Rating with comment** | 5 per comment | 10 comments/day | Higher effort = higher reward |
| **Consensus bonus** | 2 per match | — | If your rating matches final consensus |
| **Insider review** | 3 per review (to linked account) | 10/day | Encourages honest listings |
| **Item Story prompt answered** | 5–8 per prompt | 5 prompts/listing | Scales with prompt depth; minimum 15 words |
| **Item Story reaction (reader)** | 1 per reaction | 30/day | Swipe through Stories tab |
| **Referral (inviter)** | 50 | — | After referee completes first trade |
| **Referral (invitee)** | 50 | One-time | On top of signup bonus |
| **5-star trade rating received** | 2 | Per trade | Reward good traders |
| **Food add-on sent** | 5 | Per trade | Provisioner behavior rewarded |
| **Food add-on received** | 3 | Per trade | Encourages the norm on both sides |
| **Listing garden/produce surplus** | 8 | Per listing | First perishable listing bonus |
| **Completing a food trade** | +5 bonus | Per trade | On top of standard credit transfer |
| **Purchased with cash** | Variable | No cap | See IAP packages below |

**Maximum Passive Daily Earn (no trading):** ~115 credits
- 25 ratings × 1 credit = 25
- 10 comments × 5 credits = 50
- ~3 consensus matches × 2 credits (est.) = 6
- 10 Insider reviews × 3 credits = 30 (if Insider-linked)
- 30 Story reactions × 1 credit = 30
- 5 Story prompts × ~8 credits (avg) = 40 (on a new listing day)

*Note: Not all sources are simultaneously achievable every day. Realistic active user daily earn without trading: ~60–90 credits.*

### 3.2 How Credits Are Spent

| Sink | Cost | Notes |
|------|------|-------|
| **Acquiring items** | Listed price | Core spend mechanism |
| **Boost listing visibility** | 15 credits/24hr | Appear at top of feed for one day |
| **Relist expired item** | 5 credits | Items expire after 30 days |
| **Premium features (future)** | Variable | See subscription tiers |

### 3.3 Cash-to-Credit Conversion (IAP Packages)

| Package | Price | Credits | Per-Credit Cost | Bonus |
|---------|-------|---------|-----------------|-------|
| Starter | $4.99 | 100 | $0.050 | — |
| Builder | $9.99 | 250 | $0.040 | 25% more value |
| Baller | $17.99 | 500 | $0.036 | 39% more value |
| Neighborhood Legend | $29.99 | 1,000 | $0.030 | 67% more value |

**Implied credit value:** ~$0.03–0.05 per credit, meaning 100 credits ≈ $3–5 in real-world value.

Cash item purchases carry a 12% platform fee. This fee is displayed at checkout:
```
Item: DeWalt Drill — 85 credits
Cash equivalent: $4.25
Platform fee (12%): $0.51
Total: $4.76

— OR —

Pay with credits: 85 cr (no fee)
```

### 3.4 Anti-Gaming Measures

| Threat | Countermeasure |
|--------|----------------|
| **Rating spam** (mass-swipe for credits) | Daily cap of 25 ratings. Speed detection: if average swipe time < 1.5 seconds over 10 consecutive items, show CAPTCHA and warn. Repeat offenders get eval privileges suspended for 24 hours. |
| **Fake accounts for signup bonus** | Phone verification required. One phone number per account. Device fingerprinting detects multi-account from same device. |
| **Insider credit farming** | 10-review daily cap. Insider can only review listings from linked account (not others). Reviews must be at least 15 seconds apart. |
| **Self-trading (wash trades)** | Cannot trade with yourself. Accounts at the same address cannot trade with each other (flagged for manual review). Repeated trades between the same two accounts are flagged after the 3rd in 30 days. |
| **Referral abuse** | Referral credit only awarded after referee completes their FIRST trade with a DIFFERENT user (not the referrer). |
| **Comment spam for credits** | AI moderation: comments must be >10 characters, relevant to the item, and not duplicates. Gibberish detection. |
| **Price manipulation** | AI Seal is only awarded for prices within 20% of AI's model-estimated value. Crowd valuations require 5+ independent ratings before being surfaced. |

### 3.5 Anti-Inflation Measures (Sinks & Faucets)

The credit economy must avoid hyperinflation (too many credits chasing too few items) and deflation (users hoarding, nothing listed).

**Credit Sinks (Remove Credits from Economy):**
- Item acquisitions (credits transfer, not created)
- Listing boosts (15 credits destroyed per boost)
- Expired item relist fee (5 credits destroyed)
- Cash transaction fees (12% fee revenue, not redistributed as credits)
- Inactive account decay: accounts inactive >90 days lose 10% of balance per month (notified first)

**Faucets (Inject Credits into Economy):**
- New user signup bonus (50 credits)
- First listing bonus (10 credits)
- Evaluation rewards (capped at 85/day)
- Referral bonuses (100 total per referral pair)
- IAP purchases (uncapped)

**Balancing Levers (Adjustable Server-Side):**
- All earning rates are configurable via feature flags — no app update needed
- If inflation detected (average listing price increasing >5%/week):
  → Reduce eval credit rewards
  → Increase boost costs
  → Introduce "Weekend Flash Sales" where items are discounted 20%
- If deflation detected (listing volume dropping >10%/week):
  → Increase first-listing bonus
  → Run "List 3, Get 30" promotions
  → Send push: "Your garage called. It wants its stuff back."

### 3.6 Credit Economy Health Metrics (Monitor Weekly)

| Metric | Healthy Range | Alert |
|--------|--------------|-------|
| Average credits per active user | 50–200 | >500 = inflation risk |
| Median listing price | 30–150 credits | >250 = pricing creep |
| Daily credits created vs. destroyed | Ratio 1.0–1.3 | >2.0 = inflation |
| % of listings with AI Seal | 40–70% | <20% = trust issue |
| Trade completion rate | >70% | <50% = friction problem |
| Average time to first trade (new user) | <72 hours | >7 days = activation failure |

---

## 4. Subscription Tiers

### Tier Overview

| | **Free (Scout)** | **Manconomy Pro ($4.99/mo)** | **Manconomy Legend ($9.99/mo)** |
|---|---|---|---|
| **Tagline** | "You're here. That's enough." | "For the dude who trades seriously." | "Neighborhood royalty." |
| Active listings | 5 | 15 | Unlimited |
| Photo limit per listing | 3 | 6 | 10 |
| AI listings per month | 10 | 30 | Unlimited |
| Eval credits daily cap | 25 ratings | 40 ratings | 60 ratings |
| Listing boosts | Pay per boost (15 cr) | 2 free boosts/month | 5 free boosts/month |
| AI Seal re-evaluation | — | 1 free re-eval/month | Unlimited re-evals |
| Cash transaction fee | 12% | 8% | 5% |
| Trade history | 30 days | 90 days | Unlimited |
| Profile badge | — | "Pro" badge | "Legend" badge |
| Priority in feed | Standard | Slight priority | Top of feed |
| Insider accounts | 1 | 1 | 2 |
| Monthly credit bonus | — | 25 credits/month | 75 credits/month |
| Early access to new features | No | Yes | Yes |
 | Price | Free | $4.99/month | $9.99/month |
 | | | $47.99/year (save 20%) | $95.99/year (save 20%) |

### Revenue Projections (Per 1,000 Active Users)

| Source | Conservative | Optimistic |
|--------|-------------|-----------|
| IAP credit purchases (10% of users, avg $8/mo) | $800/mo | $1,600/mo |
| Pro subscriptions (8% conversion) | $400/mo | $600/mo |
| Legend subscriptions (2% conversion) | $200/mo | $400/mo |
| Cash transaction fees (5% of trades at $15 avg) | $90/mo | $225/mo |
| **Total MRR per 1,000 users** | **$1,490/mo** | **$2,825/mo** |

---

## 5. Sample Copy & Notifications

### Push Notifications

1. **Trade accepted:**
   "Your drill found a new home, king. 85 credits just hit your wallet."

2. **New trade request:**
   "Someone wants your blender. They've got credits and they're not afraid to use them."

3. **Item watchlisted:**
   "3 dudes are eyeing your fishing rod. The pressure is on."

4. **Trade reminder:**
   "You and Jake agreed to meet yesterday. Did the handoff happen, or are we pretending it didn't?"

5. **Inactive nudge (7 days):**
   "Your garage isn't getting any cleaner. List something. Earn credits. Feel alive."

6. **Price drop suggestion:**
   "Your leaf blower's been sitting for 2 weeks. The crowd says drop it 15 credits. Your call, chief."

### Empty States

7. **No listings in neighborhood:**
   "It's a ghost town in here. Be the first to list something and your neighbors will follow. Probably."

8. **No search results:**
   "Nothing matching '1987 Toyota MR2 engine.' But honestly, we respect the search."

9. **Empty watchlist:**
   "Your watchlist is empty. Go find something you definitely don't need but absolutely want."

### Error Messages

10. **Photo upload failed:**
    "That photo didn't make it. Try again — we promise our servers aren't judging your camera skills."

11. **Trade request failed (insufficient credits):**
    "You're 23 credits short. Rate some stuff, list something, or just buy credits like a normal person."

### Food & Provision Notifications

12. **Food add-on sent (buyer):**
    "🥩 Noted. GarageDude_Mike knows you're coming correct. See you at the handoff."

13. **Food add-on received (seller):**
    "GarageDude_Mike is bringing a six-pack to the trade. This is why the neighborhood works."

14. **Large-trade provision norm triggered (≥300 credits):**
    "This is a 400-credit trade. The move is to bring something. Just saying."

15. **Perishable listing pickup urgency (2 days out):**
    "🔴 Your ghost pepper hot sauce pickup window closes in 2 days. Three neighbors are interested. Nudge them."

16. **Perishable listing expired:**
    "Your tomato listing expired. The tomatoes did not. List a new batch — your neighbors are hungry."

### Patch Unlocks

17. **🔥 First Fire — First trade completed:**
    "First Fire unlocked. You made your first trade. The garage door to freedom is officially open."

18. **🤝 The Handshake — 5-star rating on first 3 trades:**
    "The Handshake unlocked. Three trades, three five-star ratings. The neighborhood already knows your name."

19. **🥩 Provisioner — First food add-on sent:**
    "Provisioner unlocked. You brought something to the table. Literally. That's the whole thing."

20. **🌱 The Gardener — First garden/produce listing:**
    "The Gardener unlocked. Your surplus is someone's dinner. That's old-fashioned and good."

21. **🍺 Brewmaster — First homebrewed alcohol listing:**
    "Brewmaster unlocked. You made something drinkable. That's either impressive or dangerous. Post the recipe."

22. **🔗 The Connector — 3 recruits complete a trade:**
    "The Connector unlocked. Three people you brought in just made their first trades. You built something."

23. **🏔️ Founding Member — First 10 in the neighborhood:**
    "Founding Member unlocked. You were here before this neighborhood knew what it was. That matters."

24. **📈 The Climb — Chain trade completed:**
    "The Climb unlocked. You started with something small and traded your way up. The neighborhood is watching."

### Merit Rank Promotions

25. **Promoted to Scout (1 completed trade):**
    "You're a Scout now. One trade done. The Tenderfoot days are behind you."

26. **Promoted to Trader (5 trades + 4.0★):**
    "Trader rank earned. Five trades and a solid reputation. Your neighbors trust you. Don't blow it."

27. **Promoted to Outfitter (30 trades + 4.5★ + 1 referral):**
    "Outfitter. Thirty trades. You've supplied the neighborhood more than once. People come to you first."

28. **Promoted to Quartermaster (100 trades + 4.7★):**
    "Quartermaster. You're responsible for this neighborhood's supply. That's not a badge. That's a job."

29. **Promoted to Legend (top 1% + community votes + 1 year):**
    "Legend. The neighborhood voted. A year of showing up. There's nothing left to prove around here."

### Onboarding Screens

30. **Onboarding screen 1:**
    "You've got stuff you don't use. Your neighbor's got stuff you want. We do the math."

31. **Onboarding screen 2:**
    "No shipping. No strangers across town. Just your neighbors, trading like civilized humans."

32. **Onboarding screen 3:**
    "Our AI prices everything. Accept the AI price, get a trust badge. Override it, and may the market decide."

---

## 6. Tech Stack Recommendation

### 6.1 Recommended Stack (Cross-Platform, Solo Dev Friendly)

#### Frontend (Mobile App)

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | **React Native + Expo** | Single codebase for iOS + Android. Expo simplifies builds, OTA updates, and eliminates most native config. Largest community and job market for hiring later. |
| **Alternative** | Flutter | Excellent performance and beautiful UI out of the box. Smaller ecosystem but growing. Dart is less marketable than JS/TS if hiring. |
| **UI Library** | React Native Paper or Tamagui | Pre-built components that speed up development significantly. |
| **Navigation** | Expo Router (file-based) | Simple, Next.js-style routing. |
| **State Management** | Zustand | Simple, minimal boilerplate. Not Redux. |
| **Maps** | react-native-maps | For neighborhood boundaries and meetup locations. |

**Recommendation for a first-time builder:** React Native + Expo. The ecosystem, docs, community support, and ability to hire JS/TS developers later make it the most practical choice.

#### Backend

| Layer | Technology | Why |
|-------|-----------|-----|
| **Runtime** | **Node.js + TypeScript** | Same language as frontend. One language to learn. |
| **Framework** | **Express.js** or **Fastify** | Lightweight, well-documented. |
| **Alternative (faster MVP)** | **Supabase** | Hosted Postgres + Auth + Realtime + Storage. Dramatically reduces backend work. Built-in row-level security. Free tier is generous. |
| **API Style** | REST (v1) | Simpler to debug and understand than GraphQL for a solo dev. |
| **Auth** | Supabase Auth or Firebase Auth | Handles Google/Apple SSO, phone verification, JWT tokens. |

**Recommendation for speed:** Use **Supabase** as your backend-as-a-service. It handles auth, database, file storage, and realtime subscriptions. You can add custom API endpoints with Supabase Edge Functions (Deno). This eliminates 60%+ of backend work.

#### Database

| Need | Solution |
|------|----------|
| **Primary database** | **PostgreSQL** (via Supabase) — relational, handles credits, trades, users, listings |
| **Search** | Supabase full-text search (built on Postgres) — sufficient for MVP. Upgrade to Algolia/Typesense if needed later. |
| **Realtime** | Supabase Realtime — websocket subscriptions for chat and trade updates |
| **File storage** | Supabase Storage or Cloudflare R2 — listing photos |

#### AI/ML Services

| Capability | Service | Cost |
|------------|---------|------|
| **Item identification from photos** | **Google Cloud Vision API** or **OpenAI GPT-4o (vision)** | Vision API: first 1,000 images/mo free, then $1.50/1,000. GPT-4o: ~$0.01-0.03 per image. |
| **Description generation** | **OpenAI GPT-4o-mini** | ~$0.15 per 1M input tokens. Extremely cheap. |
| **Value estimation** | Custom logic: query eBay sold listings API + GPT reasoning | eBay API is free. GPT cost is negligible. |
| **AI Seal calculation** | Server-side logic (weighted average of AI estimate + crowd ratings) | No external cost. |
| **Comment moderation** | OpenAI Moderation API | Free. |

**AI Listing Pipeline:**
```
Photo → Google Vision (identify object, brand, model)
     → GPT-4o-mini (generate title, description, condition)
     → eBay API (lookup recent sold prices for reference)
     → Custom algorithm (suggest credit value based on eBay data + condition)
     → Return to user in <4 seconds
```

#### Infrastructure & DevOps

| Need | Solution | Cost |
|------|----------|------|
| **Hosting** | Supabase (managed) + Vercel (if web admin needed) | Free tier → $25/mo Pro |
| **Push notifications** | Expo Push Notifications (free) or OneSignal (free tier) | Free for MVP scale |
| **Analytics** | PostHog (self-hostable, generous free tier) or Mixpanel | Free |
| **Error tracking** | Sentry (free tier: 5K events/mo) | Free |
| **CI/CD** | GitHub Actions + Expo EAS Build | EAS Build: free tier (limited), $15/mo for faster builds |
| **App Store deployment** | Expo EAS Submit | Apple Developer: $99/yr. Google Play: $25 one-time. |

### 6.2 Build vs. No-Code Options

| Approach | Pros | Cons | Time to MVP | Cost |
|----------|------|------|-------------|------|
| **React Native + Supabase (recommended)** | Full control, scalable, hireable stack | Requires learning to code (JS/TS) | 3-5 months (solo, part-time) | $500–1,500 (services + app store fees) |
| **FlutterFlow + Supabase** | Visual builder, generates Flutter code, exportable | Learning curve for complex logic, AI integration requires custom code | 2-3 months | $70/mo (Pro plan) + services |
| **Bubble.io** | Fastest to prototype, no code needed | Not native mobile (PWA wrapper), performance issues, vendor lock-in, very hard to scale | 1-2 months | $32-134/mo |
| **Hire a dev shop** | Professional quality, fastest for non-coders | Expensive, risk of misaligned incentives | 2-4 months | $25,000–75,000 |
| **Hire a freelancer** | Cheaper than agency, flexible | Quality varies wildly, project management overhead | 2-4 months | $8,000–25,000 |

**Recommendation:** If you're willing to learn, go React Native + Expo + Supabase. It's the best long-term investment. If you want speed without coding, FlutterFlow is the best no-code option that still produces real, exportable native code.

### 6.3 Estimated MVP Cost Breakdown (Self-Build with Supabase)

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| Supabase Pro | $25 | Database, auth, storage, realtime |
| OpenAI API (GPT-4o-mini) | $5–15 | Description generation, moderation |
| Google Vision API | $0–10 | First 1K images free, then $1.50/1K |
| Expo EAS Build | $0–15 | Free tier may suffice for MVP |
| Sentry (error tracking) | $0 | Free tier |
| PostHog (analytics) | $0 | Free tier |
| Domain + SSL | $12/yr | For any web presence / API |
| Apple Developer Account | $99/yr | Required for iOS |
| Google Play Account | $25 one-time | Required for Android |
| **Monthly total** | **$30–65/mo** | |
| **First-year total** | **$500–920** | Including one-time fees |

---

## 7. Launch Playbook

### Phase 0: Pre-Build (Weeks 1-2)

**Goal:** Validate demand before writing a single line of code.

1. **Pick your neighborhood.** Choose the one you live in. You need to be physically present, known, and trusted.
2. **Create a landing page** (Carrd.co, $19/yr). Headline: "Trade your stuff with your neighbors. No BS." Email capture.
3. **Talk to 10 neighbors in person.** Ask: "If you could trade that [thing in their garage] for something you actually want, without listing it on Facebook Marketplace and dealing with flakes, would you?" Gauge reaction.
4. **Create a simple interest survey** (Google Forms). Share in:
   - Nextdoor (your neighborhood)
   - Local Facebook groups
   - HOA email lists (ask the HOA president)
   - Neighborhood WhatsApp/GroupMe chats
5. **Success gate:** 30+ email signups from your neighborhood before building. If you can't get 30, the concept needs refinement.

### Phase 1: Build MVP (Weeks 3-14, ~3 months)

**Build only the Must Have features (M1–M16).** Nothing else.

**Sprint plan (2-week sprints):**

| Sprint | Focus |
|--------|-------|
| 1-2 | Auth, onboarding, user profiles, credit wallet |
| 3-4 | AI listing flow (photo → identification → pricing) |
| 5 | Neighborhood feed, search, filters |
| 6 | Trade request flow, messaging, meetup coordination |
| 7 | Dual confirmation, ratings, trade completion |
| 8 | Cash transactions, credit purchases (IAP) |
| 9 | Polish, bug fixes, push notifications, App Store prep |

### Phase 2: Seed the Marketplace (Weeks 13-14, overlaps with Sprint 9)

The biggest risk is the **cold start problem** — nobody lists because there's nothing to browse, and nobody browses because there's nothing listed. Here's how to solve it:

**Seed Initial Inventory (Target: 50 listings before public launch):**

1. **You list 10-15 items.** Raid your garage, closets, storage. Be the example.
2. **Recruit 5 "founding dudes."** These are neighbors you know personally. Ask each to list 5-8 items. In exchange:
   - 200 bonus credits each (founder bonus)
   - "Founding Member" badge on their profile (permanent)
   - Input on features ("You helped build this")
3. **The "Garage Cleanout Party."** Host a casual BBQ/hangout. Tell 10 neighbors: "Bring something from your garage you don't use. We'll list it on the app together. Beer's on me." This gets 20+ items listed in one afternoon AND creates social proof.
4. **Personally help with listings.** For the first 20 users, offer to come over and help them photograph and list items. Reduces friction to zero.

### Phase 3: Launch in One Neighborhood (Week 15)

**Recruit First 20 Users:**

| Channel | Action | Target |
|---------|--------|--------|
| **In-person** | Knock on doors. Seriously. "Hey, I built this app for our neighborhood. Here's what it does." | 5 users |
| **Nextdoor** | Post: "I built a free app for [Neighborhood Name] to trade stuff with each other. No shipping, no strangers, just us." | 5 users |
| **Founding dudes' referrals** | Each founding dude invites 2 friends | 10 users |
| **Flyers** | Simple flyer at community mailbox, coffee shop, gym bulletin board. QR code to download. | Bonus signups |
| **HOA/Community meeting** | 2-minute pitch at next meeting. "Free app, built by a neighbor, for neighbors." | Bonus signups |

**Launch Week Tactics:**
- Send all email signups the download link with a personal note
- Be hyper-responsive to every message, every bug report, every trade request
- Complete at least 3 trades yourself in the first week (be a buyer AND seller)
- Post daily in the app: "New listing!" / "Just completed my 3rd trade. This works."
- Fix critical bugs within 24 hours

### Phase 4: Validate (Weeks 15-22)

**Success Metrics for Neighborhood Validation:**

| Metric | Target | Measurement |
|--------|--------|-------------|
| Active users (traded or listed in last 14 days) | 20+ | Analytics |
| Total listings | 100+ | Database query |
| Trades completed (total) | 30+ | Database query |
| Trades completed per user (avg) | 1.5+ | Calculated |
| Day-7 retention | >30% | Analytics |
| Day-30 retention | >15% | Analytics |
| NPS score | >40 | In-app survey after 3rd trade |
| Organic referrals (non-incentivized) | 5+ | Track source |
| Time from signup to first trade | <72 hours (median) | Analytics |
| Average session length | >3 minutes | Analytics |
| "Tinder for Blenders" engagement | >40% of users try it | Analytics |

**Red Flags (Pivot or Kill Signals):**
- Can't get 20 active users after 4 weeks of effort → Market may not want this
- Trades completed < 10 after 4 weeks → Friction too high or value prop unclear
- Day-7 retention < 15% → App isn't sticky; onboarding or UX problem
- Users list but don't trade → Discovery or trust problem
- Users trade but only via cash → Credit economy not compelling

**What to Do Weekly:**
1. Review all metrics above
2. Talk to 3 users (phone call or in person): "What's working? What's broken? What would make you list more?"
3. Read every rating/review comment
4. Fix the #1 complaint each week
5. Send a weekly digest push: "This week in [Neighborhood]: 12 trades completed, 8 new items listed. [Neighborhood Name] is trading."

### Phase 5: Expand (After Validation — Week 23+)

**When to expand to the next neighborhood:**
- All Phase 4 success metrics are green for 4+ consecutive weeks
- At least 3 users have organically invited someone from an adjacent neighborhood
- You have bandwidth to support another neighborhood (or you've automated support)

**How to expand:**
1. **Adjacent neighborhoods first.** Expand the radius, don't jump to a new city.
2. **Clone the playbook.** Find a "founding dude" in the new neighborhood. Give them 500 credits and the Founding Member badge. Ask them to recruit 5 friends and host a garage cleanout.
3. **Merge feeds gradually.** Start with separate neighborhood feeds, then offer "Expanded radius" as an option (2-mile, 5-mile, citywide).
4. **City-level launch** when you have 3+ validated neighborhoods with combined 100+ active users.

**Expansion Milestones:**

| Milestone | Trigger | Action |
|-----------|---------|--------|
| **Neighborhood 2** | N1 metrics green for 4 weeks | Clone playbook to adjacent neighborhood |
| **Neighborhood 3-5** | N1+N2 combined 50+ active users | Recruit founding dude in each; begin city identity |
| **City launch** | 3+ neighborhoods, 100+ active users | Merge feeds with radius controls; local press/media push |
| **City 2** | City 1 at 500+ active users, unit economics positive | Clone entire city playbook; recruit city ambassador |
| **Regional** | 3+ cities validated | Consider funding; hire first employee |

---

## Appendix A: Data Model (Core Tables)

```
users
  id, email, phone, display_name, avatar_url, neighborhood_id,
  credit_balance, subscription_tier, member_since, is_verified,
  trade_count, avg_rating, merit_rank (0–8), status

listings
  id, user_id, title, description, category, condition,
  credit_price, photos[], ai_seal (bool), ai_suggested_price,
  crowd_valuation, crowd_rating_count, status (active/traded/expired),
  created_at, expires_at, boost_until,
  -- Food fields (populated for food/perishable listings) --
  is_perishable (bool),
  food_category (enum: produce/baked_goods/preserved_smoked/
    homebrewed/packaged/cooking_gear/tradework),
  pickup_by_date (date, nullable)

trades
  id, listing_id, buyer_id, seller_id, offer_type (credit/cash/swap),
  credit_amount, cash_amount, status (requested/accepted/countered/
  completed/cancelled/disputed), meetup_location, meetup_time,
  buyer_confirmed, seller_confirmed, created_at, completed_at,
  -- Food add-on fields --
  food_addons (jsonb, nullable — e.g. [{"description":"6-pack","type":"homebrewed"}])

ratings
  id, trade_id, rater_id, rated_id, stars (1-5), comment, created_at

evaluations (Tinder for Blenders)
  id, listing_id, user_id, verdict (fair/too_high/too_low/steal/skip),
  comment, created_at

credit_transactions
  id, user_id, amount (+/-), type (trade/evaluation/bonus/purchase/
  boost/fee/story_reaction), reference_id, created_at

insider_accounts
  id, insider_user_id, linked_user_id, status (active/unlinked),
  created_at

insider_reviews
  id, insider_id, listing_id, condition_accurate (bool),
  price_fair (enum), notes, credits_awarded, created_at

messages
  id, trade_id, sender_id, body, created_at, read_at

-- Achievement / Gamification --

patches
  id, user_id, patch_key (enum: first_fire/the_handshake/provisioner/
    the_gardener/brewmaster/storyteller/the_connector/the_climb/
    quartermasters_choice/the_nudge/clean_sweep/founding_member/
    the_grill/eagle), earned_at, display_order

merit_ranks
  id, rank_level (0–8), title (Tenderfoot/Scout/Trader/Dealer/
    Outfitter/Trailblazer/Quartermaster/Captain/Legend),
  min_trades, min_avg_rating, min_tenure_days, min_referrals

-- The Pitch / Public Listing Conversations --

listing_comments
  id, listing_id, user_id, body, parent_comment_id (nullable),
  created_at, upvotes

pitches
  id, listing_id, buyer_id, pitch_body, status (pending/selected/
    rejected), created_at, vote_count

-- The Climb (chain trades) --

climb_chains
  id, initiator_user_id, current_item_description, chain_length,
  status (active/completed/abandoned), started_at, completed_at

climb_steps
  id, chain_id, step_number, from_user_id, to_user_id, trade_id,
  item_description, created_at

-- Leaderboards --

leaderboard_snapshots
  id, neighborhood_id, category (most_trades/best_deals/
    best_stories/top_provisioner), period (weekly/monthly/alltime),
  user_id, rank, score, snapshot_at

-- Invite / Membership --

invite_codes
  id, code (unique), issued_by_user_id, used_by_user_id (nullable),
  issued_at, used_at, is_charter_member_invite (bool)
```

## Appendix B: Prohibited Items (MVP)

The following cannot be listed on The Manconomy. Enforce via AI content moderation + manual reporting.

- Firearms and ammunition
- Drugs, drug paraphernalia, controlled substances
- Stolen property
- Counterfeit goods
- Hazardous materials
- Live animals
- Recalled products
- Anything illegal under local, state, or federal law

**Note on homebrewed alcohol:** Homebrewed beer, wine, cider, and spirits are **explicitly allowed** under the Food / Provision Code. Listings must select the `homebrewed` food category, which triggers a state-law disclaimer at listing creation: *"Laws on sharing homebrewed alcohol vary by state. Know your local rules before listing. The Manconomy is a platform, not a liquor board."* The AI moderation flag for "alcohol" is tuned to pass homebrewed listings and flag only commercial resale of alcohol (which is prohibited without a license).

Detection: AI scans listing photos and descriptions at creation time. Flagged items go to a review queue. Obvious violations are auto-rejected with: "Nice try, but we can't list that. You know why."

---

## Appendix C: Key Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| **Cold start** (no items, no users) | Fatal | High | Seed inventory strategy (Phase 2). You must personally list 15+ items and recruit 5 founding dudes. |
| **Credit inflation** | High | Medium | Server-side earning rates. Monitor weekly. Built-in sinks (boosts, relist fees, decay). |
| **Scams / no-shows** | High | Medium | Phone verification, dual confirmation, rating system, trade expiration timers. |
| **AI misidentification** | Medium | Medium | Always allow manual override. Low-confidence items show "We're not sure — help us out" and default to manual entry. |
| **Partner/Insider drama** | Low | Low | Reviews are private. Insider cannot see trade conversations. Either party can unlink. Keep it light and humorous. |
| **App store rejection** | Medium | Low | No prohibited content in screenshots. Clear content policy. Age rating 17+ (marketplace with user-generated content). |
| **Legal / liability** | High | Low | Terms of service: The Manconomy is a platform, not a party to trades. Users trade at their own risk. No warranties. Consult a lawyer before launch ($500-1,000 for a basic TOS review). |

---

*Built with the energy of a guy who has way too much stuff in his garage and not enough excuses to get rid of it. Welcome to The Manconomy.*
