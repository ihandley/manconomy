# ADR-005: REST over GraphQL

**Status:** Accepted
**Date:** April 11, 2026

## Context

The Manconomy's mobile client needs to communicate with backend services for listing CRUD,
trade lifecycle management, credit operations, user profiles, patch awards, and real-time
trade chat. A query interface must be chosen for all client–server communication.

Two primary options were evaluated:

| Option | Query style | Type safety | Caching | Learning curve | Supabase support |
|---|---|---|---|---|---|
| **REST (PostgREST + Edge Functions)** | Resource-based URLs | TypeScript types via `supabase-js` | HTTP caching (ETags, Cache-Control) | None | First-class, built-in |
| GraphQL | Query language (client-defined shape) | Schema-first, codegen | Apollo/urql client cache | Moderate | Via `pg_graphql` extension |
| tRPC | TypeScript procedure calls | End-to-end inferred types | React Query | Low–Moderate | Not native to Supabase |

Supabase's built-in REST layer is **PostgREST** — a battle-tested server that auto-generates
a fully RESTful API from the PostgreSQL schema, respecting RLS policies, with zero additional
code. Supabase Edge Functions supplement PostgREST for operations that require server-side
orchestration (credit mutations, AI pipeline calls, Stripe webhooks).

GraphQL via Supabase's `pg_graphql` extension was evaluated but introduces query complexity
and client-side caching overhead that is disproportionate to the app's data-fetching patterns.

## Decision

Use **REST** as the primary client–server communication style:
- **Supabase PostgREST** for all standard CRUD operations on database tables (listings,
  offers, profiles, patches, chapters).
- **Supabase JS SDK** (`supabase-js`) as the client library — it wraps PostgREST in a
  type-safe fluent query builder that reads exactly like ORM code.
- **Supabase Edge Functions** (REST endpoints backed by Deno) for operations requiring
  server-side logic: credit RPCs, trade state machine transitions, AI pipeline orchestration,
  Stripe webhook handling.
- **Supabase Realtime** (WebSocket subscriptions) for push-based updates: trade status
  changes, new messages in trade chat, new listings in The Market feed.

GraphQL is explicitly deferred to a future phase if client data-fetching complexity warrants it.

## Consequences

### Positive
- **Zero API layer to write for CRUD.** PostgREST auto-generates REST endpoints for every
  table and view. Adding a column to `listings` automatically exposes it via the API — no
  resolver update required.
- **`supabase-js` is type-safe by default.** Running `supabase gen types typescript` produces
  TypeScript types for every table, column, and RPC from the live schema. The client never
  guesses field names.
- **RLS is the authorization layer.** REST requests through `supabase-js` automatically
  attach the user's JWT; PostgREST evaluates RLS policies at the DB level. No separate
  authorization middleware needed.
- **HTTP caching is straightforward.** GET requests on listings and profiles can be cached
  at the CDN and client level with standard `Cache-Control` headers. GraphQL's POST-only
  convention makes HTTP caching difficult without persisted queries.
- **Supabase Realtime** handles the one case where REST falls short (push updates) with
  built-in WebSocket subscriptions — no polling required for trade chat or market feed.
- **Minimal dependencies.** `supabase-js` covers auth, REST, realtime, and storage. No
  Apollo Client, no GraphQL codegen pipeline, no schema stitching.
- **Debugging is trivial.** Every API call is an inspectable HTTP request in the React Native
  debugger or Supabase Dashboard's API logs.

### Negative / Trade-offs
- **Over-fetching:** REST endpoints return all columns by default. Mitigation: `supabase-js`
  `.select('col1, col2')` allows column projection on every query — functionally equivalent
  to GraphQL field selection, with no extra tooling.
- **Multiple round trips for related data:** Without GraphQL's single-query joins, fetching a
  listing with its seller profile and open offers requires either multiple queries or a
  PostgreSQL view / RPC. Mitigation: Supabase supports PostgREST's resource embedding
  (`?select=*,seller:users(*)`) for simple joins in a single HTTP request.
- **No client-side normalized cache.** Apollo Client's normalized cache avoids redundant
  re-fetching. Mitigation: React Query (used via `@tanstack/react-query`) provides
  request-level deduplication, stale-while-revalidate, and background refresh — sufficient
  for The Manconomy's data patterns.
- **Custom mutations are RPC calls**, not REST resources. Credit transfers, trade state
  transitions, and patch awards are implemented as Postgres RPC functions (`POST /rpc/fn_name`)
  or Edge Functions — slightly less "pure REST" but clean and well-supported.

### Neutral
- All Edge Function endpoints are documented in `docs/architecture/sa-doc.md` under the
  API Design section.
- Realtime subscriptions use Supabase's channel API:
  `supabase.channel('trade:123').on('postgres_changes', ...).subscribe()`.
- If GraphQL is ever adopted, Supabase's `pg_graphql` extension can be enabled without
  changing the data model. The REST and GraphQL layers would coexist.
- API versioning is not required at MVP. If breaking changes are needed, Edge Functions
  support path-based versioning (`/v2/...`).
