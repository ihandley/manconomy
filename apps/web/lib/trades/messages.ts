import type { createClient } from "../supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

type TradeRow = {
  id: string;
  buyer_id: string;
  seller_id: string;
  status: string;
};

type MessageRow = {
  id: string;
  trade_id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
};

export type TradeMessage = {
  id: string;
  tradeId: string;
  senderId: string;
  recipientId: string;
  body: string;
  createdAt: string;
};

export type TradeThreadResult =
  | {
      ok: true;
      currentUserId: string;
      trade: TradeRow;
      messages: TradeMessage[];
    }
  | {
      ok: false;
      message: string;
      status: 400 | 401 | 403 | 404 | 500;
    };

export type SendTradeMessageResult =
  | {
      ok: true;
      message: TradeMessage;
    }
  | {
      ok: false;
      message: string;
      status: 400 | 401 | 403 | 404 | 500;
    };

export async function getTradeThread(
  supabase: SupabaseClient,
  tradeId: string,
): Promise<TradeThreadResult> {
  const tradeResult = await getAuthorizedAcceptedTrade(supabase, tradeId);

  if (!tradeResult.ok) {
    return tradeResult;
  }

  const { data, error } = await supabase
    .from("messages")
    .select("id,trade_id,sender_id,recipient_id,body,created_at")
    .eq("trade_id", tradeResult.trade.id)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    return {
      ok: false,
      message: error.message,
      status: 500,
    };
  }

  return {
    ok: true,
    currentUserId: tradeResult.userId,
    trade: tradeResult.trade,
    messages: (data ?? []).map(mapMessage),
  };
}

export async function sendTradeMessage(
  supabase: SupabaseClient,
  payload: unknown,
): Promise<SendTradeMessageResult> {
  const tradeId = getStringField(payload, "trade_id");
  const body = getStringField(payload, "body")?.trim();

  if (!tradeId || !isUuid(tradeId)) {
    return {
      ok: false,
      message: "Use a valid trade.",
      status: 400,
    };
  }

  if (!body) {
    return {
      ok: false,
      message: "Enter a message.",
      status: 400,
    };
  }

  const tradeResult = await getAuthorizedAcceptedTrade(supabase, tradeId);

  if (!tradeResult.ok) {
    return tradeResult;
  }

  const recipientId =
    tradeResult.userId === tradeResult.trade.buyer_id
      ? tradeResult.trade.seller_id
      : tradeResult.trade.buyer_id;

  const { data, error } = await supabase
    .from("messages")
    .insert({
      trade_id: tradeResult.trade.id,
      sender_id: tradeResult.userId,
      recipient_id: recipientId,
      body,
    })
    .select("id,trade_id,sender_id,recipient_id,body,created_at")
    .single();

  if (error) {
    return {
      ok: false,
      message: error.message,
      status: 500,
    };
  }

  return {
    ok: true,
    message: mapMessage(data as MessageRow),
  };
}

async function getAuthorizedAcceptedTrade(
  supabase: SupabaseClient,
  tradeId: string,
): Promise<
  | {
      ok: true;
      userId: string;
      trade: TradeRow;
    }
  | {
      ok: false;
      message: string;
      status: 400 | 401 | 403 | 404 | 500;
    }
> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message: "Sign in to view this conversation.",
      status: 401,
    };
  }

  if (!isUuid(tradeId)) {
    return {
      ok: false,
      message: "Use a valid trade.",
      status: 400,
    };
  }

  const { data, error } = await supabase
    .from("trades")
    .select("id,buyer_id,seller_id,status")
    .eq("id", tradeId)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      message: error.message,
      status: 500,
    };
  }

  if (!data) {
    return {
      ok: false,
      message: "Trade not found.",
      status: 404,
    };
  }

  const trade = data as TradeRow;

  if (user.id !== trade.buyer_id && user.id !== trade.seller_id) {
    return {
      ok: false,
      message: "You cannot access this conversation.",
      status: 403,
    };
  }

  if (trade.status !== "accepted") {
    return {
      ok: false,
      message: "Messages are available after a trade is accepted.",
      status: 403,
    };
  }

  return {
    ok: true,
    userId: user.id,
    trade,
  };
}

function getStringField(payload: unknown, field: string) {
  if (!payload || typeof payload !== "object" || !(field in payload)) {
    return null;
  }

  const value = (payload as Record<string, unknown>)[field];

  return typeof value === "string" ? value : null;
}

function mapMessage(row: MessageRow): TradeMessage {
  return {
    id: row.id,
    tradeId: row.trade_id,
    senderId: row.sender_id,
    recipientId: row.recipient_id,
    body: row.body,
    createdAt: row.created_at,
  };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}
