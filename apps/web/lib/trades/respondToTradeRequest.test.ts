import type { User } from "@supabase/supabase-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { respondToTradeRequestFromPayload } from "./respondToTradeRequest";

const SELLER_ID = "22222222-2222-4222-8222-222222222222";
const TRADE_ID = "33333333-3333-4333-8333-333333333333";

function createUser(id = SELLER_ID) {
  return {
    id,
    email: "seller@example.com",
  } as User;
}

function createSupabaseClient({
  user = createUser(),
  rpcData = {
    id: TRADE_ID,
    status: "accepted",
  },
  rpcError = null,
}: {
  user?: User | null;
  rpcData?: Record<string, unknown> | null;
  rpcError?: { message: string; code?: string } | null;
} = {}) {
  const getUser = vi.fn(async () => ({ data: { user } }));
  const rpc = vi.fn(async () => ({
    data: rpcData,
    error: rpcError,
  }));

  return {
    client: {
      auth: { getUser },
      rpc,
    } as unknown as Parameters<typeof respondToTradeRequestFromPayload>[0],
    rpc,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("respondToTradeRequestFromPayload", () => {
  it("accepts a requested trade through the server-authoritative transition", async () => {
    const { client, rpc } = createSupabaseClient();

    await expect(
      respondToTradeRequestFromPayload(client, {
        trade_id: TRADE_ID,
        action: "accept",
        seller_id: "99999999-9999-4999-8999-999999999999",
        status: "declined",
      }),
    ).resolves.toEqual({
      ok: true,
      trade: {
        id: TRADE_ID,
        status: "accepted",
      },
    });

    expect(rpc).toHaveBeenCalledWith("respond_to_trade_request", {
      trade_id: TRADE_ID,
      response_status: "accepted",
    });
  });

  it("declines a requested trade", async () => {
    const { client, rpc } = createSupabaseClient({
      rpcData: {
        id: TRADE_ID,
        status: "declined",
      },
    });

    await expect(
      respondToTradeRequestFromPayload(client, {
        trade_id: TRADE_ID,
        action: "decline",
      }),
    ).resolves.toEqual({
      ok: true,
      trade: {
        id: TRADE_ID,
        status: "declined",
      },
    });

    expect(rpc).toHaveBeenCalledWith("respond_to_trade_request", {
      trade_id: TRADE_ID,
      response_status: "declined",
    });
  });

  it("fails unauthenticated responses before writing data", async () => {
    const { client, rpc } = createSupabaseClient({ user: null });

    await expect(
      respondToTradeRequestFromPayload(client, {
        trade_id: TRADE_ID,
        action: "accept",
      }),
    ).resolves.toEqual({
      ok: false,
      message: "Sign in to respond to this trade request.",
      status: 401,
    });

    expect(rpc).not.toHaveBeenCalled();
  });

  it("fails malformed trade IDs before writing data", async () => {
    const { client, rpc } = createSupabaseClient();

    await expect(
      respondToTradeRequestFromPayload(client, {
        trade_id: "not-a-trade-id",
        action: "accept",
      }),
    ).resolves.toEqual({
      ok: false,
      message: "Use a valid trade request.",
      status: 400,
    });

    expect(rpc).not.toHaveBeenCalled();
  });

  it("fails unsupported responses before writing data", async () => {
    const { client, rpc } = createSupabaseClient();

    await expect(
      respondToTradeRequestFromPayload(client, {
        trade_id: TRADE_ID,
        action: "counter",
      }),
    ).resolves.toEqual({
      ok: false,
      message: "Use a valid trade response.",
      status: 400,
    });

    expect(rpc).not.toHaveBeenCalled();
  });

  it("fails unknown trade IDs cleanly", async () => {
    const { client } = createSupabaseClient({
      rpcError: {
        message: "Trade request not found.",
        code: "P0002",
      },
    });

    await expect(
      respondToTradeRequestFromPayload(client, {
        trade_id: TRADE_ID,
        action: "accept",
      }),
    ).resolves.toEqual({
      ok: false,
      message: "Trade request not found.",
      status: 404,
    });
  });

  it("blocks buyer and non-seller responses", async () => {
    const { client } = createSupabaseClient({
      rpcError: {
        message: "Only the seller can respond to this trade request.",
        code: "42501",
      },
    });

    await expect(
      respondToTradeRequestFromPayload(client, {
        trade_id: TRADE_ID,
        action: "decline",
      }),
    ).resolves.toEqual({
      ok: false,
      message: "Only the seller can respond to this trade request.",
      status: 403,
    });
  });

  it("blocks invalid trade states", async () => {
    const { client } = createSupabaseClient({
      rpcError: {
        message: "Only requested trades can be accepted or declined.",
        code: "23514",
      },
    });

    await expect(
      respondToTradeRequestFromPayload(client, {
        trade_id: TRADE_ID,
        action: "accept",
      }),
    ).resolves.toEqual({
      ok: false,
      message: "Only requested trades can be accepted or declined.",
      status: 409,
    });
  });

  it("blocks accepting requests for unavailable listings", async () => {
    const { client } = createSupabaseClient({
      rpcError: {
        message: "This listing is unavailable.",
        code: "23514",
      },
    });

    await expect(
      respondToTradeRequestFromPayload(client, {
        trade_id: TRADE_ID,
        action: "accept",
      }),
    ).resolves.toEqual({
      ok: false,
      message: "This listing is unavailable.",
      status: 409,
    });
  });

  it("blocks accepting when another trade already locked the listing", async () => {
    const { client } = createSupabaseClient({
      rpcError: {
        message: "This listing already has an active trade.",
        code: "23505",
      },
    });

    await expect(
      respondToTradeRequestFromPayload(client, {
        trade_id: TRADE_ID,
        action: "accept",
      }),
    ).resolves.toEqual({
      ok: false,
      message: "This listing already has an active trade.",
      status: 409,
    });
  });
});
