import type { User } from "@supabase/supabase-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createTradeRequestFromPayload } from "./createTradeRequest";

const BUYER_ID = "11111111-1111-4111-8111-111111111111";
const SELLER_ID = "22222222-2222-4222-8222-222222222222";
const LISTING_ID = "33333333-3333-4333-8333-333333333333";

function createUser(id = BUYER_ID) {
  return {
    id,
    email: "buyer@example.com",
  } as User;
}

function createSupabaseClient({
  user = createUser(),
  profile = {
    display_name: "Buyer",
    neighborhood_id: "44444444-4444-4444-8444-444444444444",
    onboarding_completed_at: "2026-05-13T00:00:00.000Z",
    phone_verified_at: "2026-05-13T00:00:00.000Z",
  },
  listing = {
    id: LISTING_ID,
    seller_id: SELLER_ID,
    status: "active",
    asking_credits: 25,
  },
  duplicateTrade = null,
  lockedTrade = null,
  insertError = null,
}: {
  user?: User | null;
  profile?: Record<string, unknown> | null;
  listing?: Record<string, unknown> | null;
  duplicateTrade?: Record<string, unknown> | null;
  lockedTrade?: Record<string, unknown> | null;
  insertError?: { message: string; code?: string } | null;
} = {}) {
  const getUser = vi.fn(async () => ({ data: { user } }));

  const profileMaybeSingle = vi.fn(async () => ({
    data: profile,
    error: null,
  }));
  const profileEq = vi.fn(() => ({ maybeSingle: profileMaybeSingle }));
  const profileSelect = vi.fn(() => ({ eq: profileEq }));

  const listingMaybeSingle = vi.fn(async () => ({
    data: listing,
    error: null,
  }));
  const listingEq = vi.fn(() => ({ maybeSingle: listingMaybeSingle }));
  const listingSelect = vi.fn(() => ({ eq: listingEq }));

  const duplicateMaybeSingle = vi.fn(async () => ({
    data: duplicateTrade,
    error: null,
  }));
  const duplicateIn = vi.fn(() => ({ maybeSingle: duplicateMaybeSingle }));
  const duplicateBuyerEq = vi.fn(() => ({ in: duplicateIn }));
  const duplicateListingEq = vi.fn(() => ({ eq: duplicateBuyerEq }));

  const lockedMaybeSingle = vi.fn(async () => ({
    data: lockedTrade,
    error: null,
  }));
  const lockedIn = vi.fn(() => ({ maybeSingle: lockedMaybeSingle }));
  const lockedListingEq = vi.fn(() => ({ in: lockedIn }));

  const tradeSelectCalls: string[] = [];
  const tradeSelect = vi.fn((columns: string) => {
    tradeSelectCalls.push(columns);

    if (columns === "id" && tradeSelectCalls.length === 1) {
      return { eq: duplicateListingEq };
    }

    if (columns === "id") {
      return { eq: lockedListingEq };
    }

    return {
      single: vi.fn(async () => ({
        data: {
          id: "trade-1",
          listing_id: LISTING_ID,
          buyer_id: BUYER_ID,
          seller_id: SELLER_ID,
          status: "requested",
          offered_credits: 25,
        },
        error: insertError,
      })),
    };
  });
  const insert = vi.fn(() => ({ select: tradeSelect }));

  const upsert = vi.fn(async () => ({ error: null }));

  const from = vi.fn((table: string) => {
    if (table === "profiles") {
      return { select: profileSelect };
    }

    if (table === "users") {
      return { upsert };
    }

    if (table === "listings") {
      return { select: listingSelect };
    }

    return { select: tradeSelect, insert };
  });

  return {
    client: {
      auth: { getUser },
      from,
    } as unknown as Parameters<typeof createTradeRequestFromPayload>[0],
    from,
    insert,
    upsert,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createTradeRequestFromPayload", () => {
  it("creates a requested trade from server-derived buyer identity", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-18T12:00:00.000Z"));
    const { client, insert, upsert } = createSupabaseClient();

    await expect(
      createTradeRequestFromPayload(client, {
        listing_id: LISTING_ID,
        buyer_id: "99999999-9999-4999-8999-999999999999",
        status: "accepted",
      }),
    ).resolves.toEqual({
      ok: true,
      trade: {
        id: "trade-1",
        listing_id: LISTING_ID,
        buyer_id: BUYER_ID,
        seller_id: SELLER_ID,
        status: "requested",
        offered_credits: 25,
      },
    });

    expect(upsert).toHaveBeenCalledWith(
      {
        id: BUYER_ID,
        display_name: "Buyer",
        neighborhood_id: "44444444-4444-4444-8444-444444444444",
        updated_at: "2026-05-18T12:00:00.000Z",
      },
      { onConflict: "id" },
    );
    expect(insert).toHaveBeenCalledWith({
      listing_id: LISTING_ID,
      buyer_id: BUYER_ID,
      seller_id: SELLER_ID,
      status: "requested",
      offered_credits: 25,
    });
    vi.useRealTimers();
  });

  it("fails unauthenticated requests before reading or writing data", async () => {
    const { client, from } = createSupabaseClient({ user: null });

    await expect(
      createTradeRequestFromPayload(client, { listing_id: LISTING_ID }),
    ).resolves.toEqual({
      ok: false,
      message: "Sign in to request a trade.",
      status: 401,
    });

    expect(from).not.toHaveBeenCalled();
  });

  it("fails malformed listing IDs before reading or writing data", async () => {
    const { client, from } = createSupabaseClient();

    await expect(
      createTradeRequestFromPayload(client, { listing_id: "not-a-listing-id" }),
    ).resolves.toEqual({
      ok: false,
      message: "Use a valid listing.",
      status: 400,
    });

    expect(from).not.toHaveBeenCalled();
  });

  it("fails unknown listings", async () => {
    const { client, insert } = createSupabaseClient({ listing: null });

    await expect(
      createTradeRequestFromPayload(client, { listing_id: LISTING_ID }),
    ).resolves.toEqual({
      ok: false,
      message: "Listing not found.",
      status: 404,
    });

    expect(insert).not.toHaveBeenCalled();
  });

  it("blocks self-request attempts", async () => {
    const { client, insert } = createSupabaseClient({
      listing: {
        id: LISTING_ID,
        seller_id: BUYER_ID,
        status: "active",
        asking_credits: 25,
      },
    });

    await expect(
      createTradeRequestFromPayload(client, { listing_id: LISTING_ID }),
    ).resolves.toEqual({
      ok: false,
      message: "You cannot request your own listing.",
      status: 403,
    });

    expect(insert).not.toHaveBeenCalled();
  });

  it("blocks inactive listings", async () => {
    const { client, insert } = createSupabaseClient({
      listing: {
        id: LISTING_ID,
        seller_id: SELLER_ID,
        status: "completed",
        asking_credits: 25,
      },
    });

    await expect(
      createTradeRequestFromPayload(client, { listing_id: LISTING_ID }),
    ).resolves.toEqual({
      ok: false,
      message: "This listing is unavailable.",
      status: 409,
    });

    expect(insert).not.toHaveBeenCalled();
  });

  it("blocks listings already locked by an accepted trade", async () => {
    const { client, insert } = createSupabaseClient({
      lockedTrade: { id: "accepted-trade" },
    });

    await expect(
      createTradeRequestFromPayload(client, { listing_id: LISTING_ID }),
    ).resolves.toEqual({
      ok: false,
      message: "This listing is unavailable.",
      status: 409,
    });

    expect(insert).not.toHaveBeenCalled();
  });

  it("blocks listings locked by another buyer even when RLS hides the trade", async () => {
    const { client, insert } = createSupabaseClient({
      lockedTrade: null,
      insertError: {
        code: "23514",
        message: "This listing is unavailable.",
      },
    });

    await expect(
      createTradeRequestFromPayload(client, { listing_id: LISTING_ID }),
    ).resolves.toEqual({
      ok: false,
      message: "This listing is unavailable.",
      status: 409,
    });

    expect(insert).toHaveBeenCalledWith({
      listing_id: LISTING_ID,
      buyer_id: BUYER_ID,
      seller_id: SELLER_ID,
      status: "requested",
      offered_credits: 25,
    });
  });

  it("handles duplicate active buyer requests predictably", async () => {
    const { client, insert } = createSupabaseClient({
      duplicateTrade: { id: "existing-trade" },
    });

    await expect(
      createTradeRequestFromPayload(client, { listing_id: LISTING_ID }),
    ).resolves.toEqual({
      ok: false,
      message: "You have already requested this listing.",
      status: 409,
    });

    expect(insert).not.toHaveBeenCalled();
  });
});
