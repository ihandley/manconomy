# ADR-003: Credits as Closed-Loop Non-Convertible Currency

**Status:** Accepted
**Date:** April 11, 2026

## Context

The Manconomy's core economic mechanic is a peer-to-peer barter system where users exchange
goods and services for Credits. Credits represent stored barter value and can be earned (by
selling), spent (by buying), or acquired via in-app purchase. The platform must handle credit
flows without triggering state or federal money transmission licensing requirements, which are
expensive ($5,000–$50,000 per state) and operationally complex for an early-stage startup.

Three models were evaluated:

| Model | Description | Regulatory risk | Complexity |
|---|---|---|---|
| **Closed-loop credits (non-convertible)** | Credits cannot be withdrawn as cash; redeemable only within the app | Minimal — same legal category as airline miles, arcade tokens, gift cards | Low |
| Convertible points | Credits can be cashed out to bank account or PayPal | High — triggers money transmitter (MTL) requirements in most US states | Very high |
| Marketplace fee only | No credits; Stripe charges platform fee on each cash transaction | None | Low — but eliminates barter mechanics entirely |

The barter/credit mechanic is the product's defining economic differentiator. Removing it (option 3)
would reduce The Manconomy to a generic local marketplace. Convertible credits (option 2) require
MTL licensing that is financially and operationally out of reach for a solo MVP.

IRS guidance (Rev. Rul. 80-52 and Publication 525) classifies barter income as ordinary income
reportable at fair market value. Form 1099-B is required when barter income exceeds $600/year
per user. This applies regardless of whether credits are convertible.

## Decision

Credits are **closed-loop and non-convertible**:
- Credits can only be earned within the app (by completing trades or via IAP purchase).
- Credits can only be spent within the app (on listings from other users).
- Credits **cannot** be withdrawn, transferred to a bank account, converted to cash, or redeemed
  outside the platform.
- Stripe handles all cash transactions (IAP credit packages, Pro subscriptions, cash-price listings).
  The platform never holds, moves, or stores real money.

IRS 1099-B compliance is built in from day one: the `credit_ledger` table records all barter
transactions with timestamps and credit values; the backend calculates each user's annual barter
income and flags accounts approaching the $600 threshold.

## Consequences

### Positive
- **No money transmitter license required** — closed-loop non-convertible credits are legally
  equivalent to arcade tokens, airline miles, and store gift cards. This position is well-established
  in FinTech case law and CFPB guidance.
- **Stripe handles all real money** — platform liability is limited to the same terms as any
  standard e-commerce site using Stripe. No PCI-DSS scope beyond Stripe's hosted checkout.
- **Credit non-convertibility creates a captive economy** — users are incentivized to keep
  trading within The Chapter rather than cashing out, which increases marketplace liquidity.
- **IAP credit packages** (Starter $4.99, Builder $9.99, Baller $17.99, Legend $29.99) generate
  direct revenue without triggering money transmission. Apple/Google take 15–30% commission; this
  is baked into pricing.
- **Simple credit ledger** — because credits never leave the system, the ledger only needs to
  track internal mutations (earn, spend, escrow_hold, escrow_release, escrow_return, purchase,
  refund). No external settlement layer.

### Negative / Trade-offs
- **User perception:** Some users may perceive closed-loop credits as "less real" than cash.
  Mitigation: framing in The Handbook emphasizes that Credits represent *community standing* and
  *provision capacity*, not a savings account.
- **Cannot offer cash withdrawals** as a growth incentive. Platforms like TaskRabbit and Rover
  attract supply-side participants partly by offering direct payment. The Manconomy must rely on
  community belonging and Credit purchasing power instead.
- **1099-B reporting adds compliance overhead** — but this is a legal requirement regardless of
  credit convertibility (barter income is taxable). The system must track fair-market-value of
  goods exchanged.
- **Apple/Google IAP commission (15–30%)** on credit package purchases is unavoidable for in-app
  purchases on iOS/Android. This compresses margins on the IAP revenue stream.

### Neutral
- Credit balances are calculated from the `credit_ledger` table at query time — never stored as
  a column on the `users` table. This prevents balance drift from partial failures.
- All credit mutations happen inside Supabase RPC functions with `SECURITY DEFINER` — clients
  cannot directly `UPDATE` credit values.
- The escrow pattern (hold → release or return) ensures credits are never double-spent during
  the trade confirmation window.
- IRS 1099-B threshold ($600) is surfaced in the app dashboard so users are never surprised at
  tax time.
