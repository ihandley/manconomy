import type { createClient } from "../supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

type TradeResponseAction = "accept" | "decline";

export type RespondToTradeRequestResult =
  | {
      ok: true;
      trade: unknown;
    }
  | {
      ok: false;
      message: string;
      status: 400 | 401 | 403 | 404 | 409 | 500;
    };

export async function respondToTradeRequestFromPayload(
  supabase: SupabaseClient,
  payload: unknown,
): Promise<RespondToTradeRequestResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message: "Sign in to respond to this trade request.",
      status: 401,
    };
  }

  const tradeId = getTradeId(payload);
  const action = getAction(payload);

  if (!tradeId) {
    return {
      ok: false,
      message: "Use a valid trade request.",
      status: 400,
    };
  }

  if (!action) {
    return {
      ok: false,
      message: "Use a valid trade response.",
      status: 400,
    };
  }

  const responseStatus = action === "accept" ? "accepted" : "declined";
  const { data, error } = await supabase.rpc("respond_to_trade_request", {
    trade_id: tradeId,
    response_status: responseStatus,
  });

  if (error) {
    return mapResponseError(error);
  }

  if (!data) {
    return {
      ok: false,
      message: "Trade request not found.",
      status: 404,
    };
  }

  return {
    ok: true,
    trade: data,
  };
}

function getTradeId(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("trade_id" in payload)) {
    return null;
  }

  const tradeId = payload.trade_id;

  if (typeof tradeId !== "string" || !isUuid(tradeId)) {
    return null;
  }

  return tradeId;
}

function getAction(payload: unknown): TradeResponseAction | null {
  if (!payload || typeof payload !== "object" || !("action" in payload)) {
    return null;
  }

  const action = payload.action;

  if (action !== "accept" && action !== "decline") {
    return null;
  }

  return action;
}

function mapResponseError(error: { code?: string; message: string }) {
  if (error.message === "Trade request not found.") {
    return {
      ok: false,
      message: error.message,
      status: 404,
    } as const;
  }

  if (error.code === "42501") {
    return {
      ok: false,
      message: error.message,
      status: 403,
    } as const;
  }

  if (error.code === "23505" || error.code === "23514") {
    return {
      ok: false,
      message: error.message,
      status: 409,
    } as const;
  }

  if (error.code === "22023") {
    return {
      ok: false,
      message: error.message,
      status: 400,
    } as const;
  }

  return {
    ok: false,
    message: error.message,
    status: 500,
  } as const;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
