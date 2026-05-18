import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  getTradeThread,
  sendTradeMessage,
} from "../../../../../lib/trades/messages";
import {
  TradeMessagesError,
  TradeMessagesView,
} from "../../../../../lib/trades/messagesView";
import { createClient } from "../../../../../lib/supabase/server";

export default async function TradeMessagesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const result = await getTradeThread(supabase, id);

  if (!result.ok) {
    if (result.status === 401) {
      redirect("/login");
    }

    return (
      <TradeMessagesShell tradeId={id}>
        <TradeMessagesError message={result.message} />
      </TradeMessagesShell>
    );
  }

  return (
    <TradeMessagesShell tradeId={id}>
      <h1 className="text-2xl font-semibold">Trade messages</h1>
      <TradeMessagesView
        currentUserId={result.currentUserId}
        error={error}
        messages={result.messages}
      />
      <form action={sendMessage} className="grid gap-3 rounded border p-4">
        <input type="hidden" name="trade_id" value={id} />
        <label className="grid gap-2 text-sm">
          Message
          <textarea
            name="body"
            rows={4}
            className="rounded border px-3 py-2"
            required
          />
        </label>
        <button
          type="submit"
          className="rounded bg-foreground px-4 py-3 text-sm font-medium text-background"
        >
          Send message
        </button>
      </form>
    </TradeMessagesShell>
  );
}

function TradeMessagesShell({
  children,
  tradeId,
}: {
  children: ReactNode;
  tradeId: string;
}) {
  return (
    <div className="flex min-h-screen justify-center p-6">
      <main className="flex w-full max-w-2xl flex-col gap-4">
        <Link href="/app" className="text-sm underline">
          Back to feed
        </Link>
        {children}
        <p className="text-xs text-foreground/60">Trade {tradeId}</p>
      </main>
    </div>
  );
}

async function sendMessage(formData: FormData) {
  "use server";

  const tradeId = formData.get("trade_id");
  const body = formData.get("body");
  const supabase = await createClient();
  const result = await sendTradeMessage(supabase, {
    trade_id: tradeId,
    body,
  });

  const href =
    typeof tradeId === "string" ? `/app/trades/${tradeId}/messages` : "/app";

  if (!result.ok) {
    redirect(`${href}?error=${encodeURIComponent(result.message)}`);
  }

  redirect(href);
}
