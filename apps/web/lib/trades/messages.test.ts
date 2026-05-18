import type { User } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { getTradeThread, sendTradeMessage } from "./messages";

const BUYER_ID = "11111111-1111-4111-8111-111111111111";
const SELLER_ID = "22222222-2222-4222-8222-222222222222";
const OUTSIDER_ID = "33333333-3333-4333-8333-333333333333";
const TRADE_ID = "44444444-4444-4444-8444-444444444444";

function createUser(id = BUYER_ID) {
  return {
    id,
    email: "user@example.com",
  } as User;
}

function createSupabaseClient({
  user = createUser(),
  trade = {
    id: TRADE_ID,
    buyer_id: BUYER_ID,
    seller_id: SELLER_ID,
    status: "accepted",
  },
  messages = [
    {
      id: "55555555-5555-4555-8555-555555555555",
      trade_id: TRADE_ID,
      sender_id: SELLER_ID,
      recipient_id: BUYER_ID,
      body: "Meet at 4?",
      created_at: "2026-05-18T12:00:00.000Z",
    },
  ],
  tradeError = null,
  messagesError = null,
  insertError = null,
}: {
  user?: User | null;
  trade?: Record<string, unknown> | null;
  messages?: Record<string, unknown>[];
  tradeError?: { message: string } | null;
  messagesError?: { message: string } | null;
  insertError?: { message: string } | null;
} = {}) {
  const getUser = vi.fn(async () => ({ data: { user } }));

  const tradeMaybeSingle = vi.fn(async () => ({
    data: trade,
    error: tradeError,
  }));
  const tradeEq = vi.fn(() => ({ maybeSingle: tradeMaybeSingle }));
  const tradeSelect = vi.fn(() => ({ eq: tradeEq }));

  const orderById = vi.fn(async () => ({
    data: messages,
    error: messagesError,
  }));
  const orderByCreatedAt = vi.fn(() => ({ order: orderById }));
  const messagesEq = vi.fn(() => ({ order: orderByCreatedAt }));
  const messagesSelect = vi.fn(() => ({ eq: messagesEq }));

  const insertedMessage = {
    id: "66666666-6666-4666-8666-666666666666",
    trade_id: TRADE_ID,
    sender_id: user?.id ?? BUYER_ID,
    recipient_id: user?.id === SELLER_ID ? BUYER_ID : SELLER_ID,
    body: "Sounds good.",
    created_at: "2026-05-18T12:05:00.000Z",
  };
  const single = vi.fn(async () => ({
    data: insertedMessage,
    error: insertError,
  }));
  const insertSelect = vi.fn(() => ({ single }));
  const insert = vi.fn(() => ({ select: insertSelect }));

  const from = vi.fn((table: string) => {
    if (table === "trades") {
      return { select: tradeSelect };
    }

    return {
      select: messagesSelect,
      insert,
    };
  });

  return {
    client: {
      auth: { getUser },
      from,
    } as unknown as Parameters<typeof getTradeThread>[0],
    from,
    tradeEq,
    messagesEq,
    orderByCreatedAt,
    orderById,
    insert,
  };
}

describe("getTradeThread", () => {
  it("loads accepted trade messages in deterministic order for the buyer", async () => {
    const { client, tradeEq, messagesEq, orderByCreatedAt, orderById } =
      createSupabaseClient();

    await expect(getTradeThread(client, TRADE_ID)).resolves.toEqual({
      ok: true,
      currentUserId: BUYER_ID,
      trade: {
        id: TRADE_ID,
        buyer_id: BUYER_ID,
        seller_id: SELLER_ID,
        status: "accepted",
      },
      messages: [
        {
          id: "55555555-5555-4555-8555-555555555555",
          tradeId: TRADE_ID,
          senderId: SELLER_ID,
          recipientId: BUYER_ID,
          body: "Meet at 4?",
          createdAt: "2026-05-18T12:00:00.000Z",
        },
      ],
    });

    expect(tradeEq).toHaveBeenCalledWith("id", TRADE_ID);
    expect(messagesEq).toHaveBeenCalledWith("trade_id", TRADE_ID);
    expect(orderByCreatedAt).toHaveBeenCalledWith("created_at", {
      ascending: true,
    });
    expect(orderById).toHaveBeenCalledWith("id", { ascending: true });
  });

  it("fails unauthenticated reads before querying trades", async () => {
    const { client, from } = createSupabaseClient({ user: null });

    await expect(getTradeThread(client, TRADE_ID)).resolves.toEqual({
      ok: false,
      message: "Sign in to view this conversation.",
      status: 401,
    });
    expect(from).not.toHaveBeenCalled();
  });

  it("fails invalid trade IDs before querying trades", async () => {
    const { client, from } = createSupabaseClient();

    await expect(getTradeThread(client, "not-a-trade")).resolves.toEqual({
      ok: false,
      message: "Use a valid trade.",
      status: 400,
    });
    expect(from).not.toHaveBeenCalled();
  });

  it("fails missing trades predictably", async () => {
    const { client } = createSupabaseClient({ trade: null });

    await expect(getTradeThread(client, TRADE_ID)).resolves.toEqual({
      ok: false,
      message: "Trade not found.",
      status: 404,
    });
  });

  it("blocks users who are not trade participants", async () => {
    const { client } = createSupabaseClient({ user: createUser(OUTSIDER_ID) });

    await expect(getTradeThread(client, TRADE_ID)).resolves.toEqual({
      ok: false,
      message: "You cannot access this conversation.",
      status: 403,
    });
  });

  it("blocks reads before a trade is accepted", async () => {
    const { client } = createSupabaseClient({
      trade: {
        id: TRADE_ID,
        buyer_id: BUYER_ID,
        seller_id: SELLER_ID,
        status: "requested",
      },
    });

    await expect(getTradeThread(client, TRADE_ID)).resolves.toEqual({
      ok: false,
      message: "Messages are available after a trade is accepted.",
      status: 403,
    });
  });
});

describe("sendTradeMessage", () => {
  it("persists buyer messages with the authenticated sender identity", async () => {
    const { client, insert } = createSupabaseClient();

    await expect(
      sendTradeMessage(client, {
        trade_id: TRADE_ID,
        sender_id: OUTSIDER_ID,
        recipient_id: OUTSIDER_ID,
        body: "  Sounds good.  ",
      }),
    ).resolves.toEqual({
      ok: true,
      message: {
        id: "66666666-6666-4666-8666-666666666666",
        tradeId: TRADE_ID,
        senderId: BUYER_ID,
        recipientId: SELLER_ID,
        body: "Sounds good.",
        createdAt: "2026-05-18T12:05:00.000Z",
      },
    });

    expect(insert).toHaveBeenCalledWith({
      trade_id: TRADE_ID,
      sender_id: BUYER_ID,
      recipient_id: SELLER_ID,
      body: "Sounds good.",
    });
  });

  it("persists seller messages to the buyer", async () => {
    const { client, insert } = createSupabaseClient({
      user: createUser(SELLER_ID),
    });

    await sendTradeMessage(client, {
      trade_id: TRADE_ID,
      body: "See you then.",
    });

    expect(insert).toHaveBeenCalledWith({
      trade_id: TRADE_ID,
      sender_id: SELLER_ID,
      recipient_id: BUYER_ID,
      body: "See you then.",
    });
  });

  it("fails empty messages before querying trades", async () => {
    const { client, from } = createSupabaseClient();

    await expect(
      sendTradeMessage(client, {
        trade_id: TRADE_ID,
        body: "   ",
      }),
    ).resolves.toEqual({
      ok: false,
      message: "Enter a message.",
      status: 400,
    });
    expect(from).not.toHaveBeenCalled();
  });

  it("blocks users who are not trade participants from sending", async () => {
    const { client, insert } = createSupabaseClient({
      user: createUser(OUTSIDER_ID),
    });

    await expect(
      sendTradeMessage(client, {
        trade_id: TRADE_ID,
        body: "Can I join?",
      }),
    ).resolves.toEqual({
      ok: false,
      message: "You cannot access this conversation.",
      status: 403,
    });
    expect(insert).not.toHaveBeenCalled();
  });
});
