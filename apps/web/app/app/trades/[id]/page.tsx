import Link from "next/link";
import { redirect } from "next/navigation";
import { respondToTradeRequestFromPayload } from "../../../../lib/trades/respondToTradeRequest";
import { createClient } from "../../../../lib/supabase/server";

type TradeRow = {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  status: string;
  offered_credits: number;
  created_at: string;
  listings:
    | {
        title: string | null;
      }
    | {
        title: string | null;
      }[]
    | null;
};

export default async function TradePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; responded?: string }>;
}) {
  const { id } = await params;
  const { error, responded } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error: tradeError } = await supabase
    .from("trades")
    .select(
      "id,listing_id,buyer_id,seller_id,status,offered_credits,created_at,listings!trades_listing_id_fkey(title)",
    )
    .eq("id", id)
    .maybeSingle();

  if (tradeError) {
    return (
      <div className="flex min-h-screen justify-center p-6">
        <main className="w-full max-w-2xl">
          <p className="rounded border p-4 text-sm text-red-600">
            {tradeError.message}
          </p>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen justify-center p-6">
        <main className="w-full max-w-2xl">
          <p className="rounded border p-4 text-sm">Trade request not found.</p>
        </main>
      </div>
    );
  }

  const trade = data as TradeRow;
  const canRespond =
    trade.seller_id === user.id && trade.status === "requested";
  const listingTitle = getListingTitle(trade.listings) ?? "Listing";

  return (
    <div className="flex min-h-screen justify-center p-6">
      <main className="flex w-full max-w-2xl flex-col gap-4">
        <Link
          href={`/app/listings/${trade.listing_id}`}
          className="text-sm underline"
        >
          Back to listing
        </Link>
        <h1 className="text-2xl font-semibold">Trade request</h1>
        <section className="grid gap-3 rounded border p-4 text-sm">
          {error ? <p className="text-red-600">{error}</p> : null}
          {responded === "1" ? <p>Trade request updated.</p> : null}
          <dl className="grid gap-2">
            <div className="flex justify-between gap-4">
              <dt className="text-foreground/70">Listing</dt>
              <dd className="text-right font-medium">{listingTitle}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-foreground/70">Offered credits</dt>
              <dd className="text-right font-medium">
                {trade.offered_credits}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-foreground/70">Status</dt>
              <dd className="text-right font-medium">{trade.status}</dd>
            </div>
          </dl>
          {canRespond ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <form action={respondToTrade} className="flex-1">
                <input type="hidden" name="trade_id" value={trade.id} />
                <input type="hidden" name="action" value="accept" />
                <button
                  type="submit"
                  className="w-full rounded bg-foreground px-4 py-3 font-medium text-background"
                >
                  Accept
                </button>
              </form>
              <form action={respondToTrade} className="flex-1">
                <input type="hidden" name="trade_id" value={trade.id} />
                <input type="hidden" name="action" value="decline" />
                <button
                  type="submit"
                  className="w-full rounded border px-4 py-3 font-medium"
                >
                  Decline
                </button>
              </form>
            </div>
          ) : null}
          {trade.status === "accepted" ? (
            <Link
              href={`/app/trades/${trade.id}/messages`}
              className="rounded bg-foreground px-4 py-3 text-center font-medium text-background"
            >
              Open messages
            </Link>
          ) : null}
        </section>
      </main>
    </div>
  );
}

async function respondToTrade(formData: FormData) {
  "use server";

  const tradeId = formData.get("trade_id");
  const action = formData.get("action");
  const supabase = await createClient();
  const result = await respondToTradeRequestFromPayload(supabase, {
    trade_id: tradeId,
    action,
  });

  if (!result.ok) {
    const href =
      typeof tradeId === "string"
        ? `/app/trades/${tradeId}?error=${encodeURIComponent(result.message)}`
        : "/app";
    redirect(href);
  }

  redirect(`/app/trades/${tradeId}?responded=1`);
}

function getListingTitle(listing: TradeRow["listings"]) {
  if (Array.isArray(listing)) {
    return listing[0]?.title ?? null;
  }

  return listing?.title ?? null;
}
