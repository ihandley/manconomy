# ADR-001: Supabase over Firebase / AWS / GCP

**Status:** Accepted
**Date:** April 11, 2026

## Context

The Manconomy requires a backend platform that covers authentication, a relational database,
real-time messaging (trade status updates, chat), file storage (listing photos), and
server-side compute (credit RPCs, AI pipeline orchestration). The team is a solo founder with
full-stack JavaScript/TypeScript experience and a hard constraint to keep monthly infrastructure
costs below $50 until the platform reaches 1,000 active users.

Four options were evaluated:

| Option | Auth | DB | Realtime | Storage | BaaS SDK | Cost at MVP |
|---|---|---|---|---|---|---|
| **Supabase** | ✅ built-in | PostgreSQL | ✅ built-in | ✅ built-in | ✅ JS/TS | Free → $25/mo |
| Firebase | ✅ built-in | Firestore (NoSQL) | ✅ built-in | ✅ built-in | ✅ JS/TS | Free → unpredictable |
| AWS (Amplify) | Cognito | RDS / DynamoDB | AppSync | S3 | ✅ JS/TS | $30–80/mo minimum |
| GCP (Firebase alt) | Identity Platform | Cloud SQL | Pub/Sub | Cloud Storage | limited | $40–100/mo |

The core data model is highly relational: users, listings, trades, offers, credit ledger entries,
patches, merit ranks, and neighborhood chapters all have complex foreign-key relationships.
A NoSQL document store (Firestore) would require significant denormalization, duplicated data,
and multi-document transactions to replicate what a relational schema gives for free.

## Decision

Use **Supabase** as the sole backend platform for MVP and early growth phases.

Supabase provides PostgreSQL (fully relational, with PostGIS for geo queries), built-in Auth
(email, Google, Apple, phone/SMS), Realtime subscriptions over WebSockets, Row-Level Security
(RLS) policies enforced at the database layer, Edge Functions (Deno) for server-side logic, and
S3-compatible Storage — all from a single managed service with a generous free tier and a
predictable $25/mo Pro plan.

## Consequences

### Positive
- **Single vendor** for auth, DB, realtime, storage, and serverless functions — no glue code
  between services, one dashboard, one set of credentials.
- **PostgreSQL** is the right data model for the credit ledger (double-entry accounting requires
  ACID transactions and foreign keys), geo queries (`ST_DWithin` via PostGIS), and complex
  joins across the trade/offer/listing graph.
- **Row-Level Security** keeps the credit mutation surface minimal — balances can only be
  modified via server-side RPCs, never by the client directly.
- **Free tier is production-capable** at low user counts (500 MB DB, 1 GB storage, 50K monthly
  active users) — zero infrastructure cost during invite-only beta.
- **Supabase JS SDK** is idiomatic TypeScript and integrates cleanly with React Native + Expo.
- Open-source core — self-hostable if vendor lock-in becomes a concern at scale.

### Negative / Trade-offs
- **Vendor dependency:** Supabase is a managed service; if pricing changes post-Series A, migration
  to self-hosted Postgres would be non-trivial but feasible.
- **Edge Functions** are Deno-based (not Node.js) — small learning curve and some npm packages
  require shims. Not a blocker; critical RPCs are pure TypeScript.
- **Connection pooling:** Supabase uses PgBouncer; at very high concurrency (>200 simultaneous
  connections), a dedicated pooler may be needed. Irrelevant until tens of thousands of users.
- **Realtime at scale:** Supabase Realtime has per-channel limits on the free tier. The Pro plan
  handles the expected trade-chat and market-feed volumes comfortably.

### Neutral
- All database migrations are managed via Supabase CLI and version-controlled in `supabase/migrations/`.
- Local development uses `supabase start` (Docker) to spin up a full stack locally.
- Secrets (Stripe keys, OpenAI keys) are stored in Supabase Edge Function secrets, not in source
  control.
