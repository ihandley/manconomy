# ADR-004: PostgreSQL as Primary Data Store

**Status:** Accepted
**Date:** April 11, 2026

## Context

The Manconomy's data model is inherently relational. Every meaningful entity in the system
has foreign-key relationships to multiple other entities:

- A **listing** belongs to a user, has a category, exists in a neighborhood, and can be
  associated with multiple trade offers.
- A **trade** links two users, two listings, a credit amount, and produces multiple ledger
  entries.
- A **credit ledger entry** must reference a trade (or IAP purchase), a source user, a
  destination user, and an entry type — with ACID guarantees to prevent double-spend.
- A **patch award** links a user, a patch definition, and the triggering event.
- **Geo queries** require radius filtering: "Show listings within 5 miles of my location."

Three database options were evaluated:

| Option | Type | ACID | Geo | Relational joins | Schema | Cost via Supabase |
|---|---|---|---|---|---|---|
| **PostgreSQL** | Relational | ✅ Full | ✅ PostGIS | ✅ Native | Strict | Included |
| Firestore | Document (NoSQL) | ⚠️ Multi-doc transactions only | ❌ None native | ❌ No joins | Flexible | N/A (Firebase) |
| MongoDB Atlas | Document (NoSQL) | ⚠️ Multi-doc transactions | ⚠️ Atlas Search geo | ⚠️ `$lookup` (slow) | Flexible | $57+/mo |

The credit ledger is the single most important reason to choose a relational database.
A double-entry ledger requires atomic multi-row writes (debit one account, credit another,
update escrow — all in one transaction). While NoSQL databases can approximate this with
multi-document transactions, they were designed for and optimized around document retrieval,
not transactional accounting.

## Decision

Use **PostgreSQL** (via Supabase's managed Postgres) as the sole primary data store for all
application data.

Additionally, enable the **PostGIS extension** within Supabase to support geographic point
storage (`geography(Point, 4326)`) and radius queries (`ST_DWithin`). Listing locations are
stored as approximate coordinates (~200m fuzzed from the actual address) to protect user privacy.

All schema changes are managed as versioned migration files via the Supabase CLI
(`supabase/migrations/`), committed to source control.

## Consequences

### Positive
- **ACID transactions** are first-class — the credit ledger's double-entry invariants (balance
  = sum of all ledger entries; no orphaned escrow holds) are enforced at the database level,
  not in application code.
- **Row-Level Security (RLS)** policies on PostgreSQL enforce per-user data isolation at the
  DB layer. A user cannot read another user's private messages, credit balance details, or
  draft listings even if the API is misconfigured.
- **PostGIS `ST_DWithin`** enables efficient radius searches on listing locations with a
  spatial index — no application-layer geo filtering required.
- **Foreign keys + constraints** make the data model self-documenting and catch integrity
  violations at insert time rather than at query time.
- **Full-text search** via `tsvector` and `GIN` indexes covers listing title/description
  search without a separate search service at MVP scale.
- **Supabase includes Postgres** — no additional database service to provision, pay for, or
  operate separately.
- PostgreSQL is the most widely deployed open-source RDBMS. Hiring, documentation, tooling,
  and community support are all excellent.

### Negative / Trade-offs
- **Schema migrations require discipline.** Unlike Firestore, adding a column to a
  production table requires a migration file and a deployment step. Mitigation: Supabase CLI
  makes migration management straightforward.
- **Horizontal write scaling** is harder with Postgres than with sharded NoSQL. This is
  irrelevant until the platform reaches hundreds of thousands of daily active users — a
  problem worth having.
- **Connection limits:** Supabase free tier allows 60 connections; Pro allows 200. PgBouncer
  pooling is enabled by default. At high concurrency, a dedicated connection pool may be
  needed. Planned mitigation: use Supabase's `transaction` pooling mode for Edge Functions.
- **PostGIS** adds ~50 MB to the database binary. A non-issue on managed Supabase infrastructure.

### Neutral
- The `credit_ledger` table uses `BIGSERIAL` primary keys and a `UNIQUE(idempotency_key)`
  constraint to prevent duplicate entries from retry storms.
- All balance reads use `SUM(amount) FILTER (WHERE ...)` over the ledger, not a stored
  `balance` column, to prevent drift.
- Listing locations are stored as `geography(Point, 4326)` with an approximate centroid
  (~200m from the real address). Full addresses are never stored.
- Database backups: Supabase Pro includes daily point-in-time recovery (PITR) with 7-day
  retention.
