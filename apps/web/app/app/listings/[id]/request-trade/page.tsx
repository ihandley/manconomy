import Link from "next/link";
import { redirect } from "next/navigation";
import { createTradeRequestFromPayload } from "../../../../../lib/trades/createTradeRequest";
import { createClient } from "../../../../../lib/supabase/server";

export default async function RequestTradePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ submitted?: string; error?: string }>;
}) {
  const { id } = await params;
  const { submitted, error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen justify-center p-6">
      <main className="flex w-full max-w-2xl flex-col gap-4">
        <Link href={`/app/listings/${id}`} className="text-sm underline">
          Back to listing
        </Link>
        <h1 className="text-2xl font-semibold">Request trade</h1>
        {submitted === "1" ? (
          <section className="rounded border p-4 text-sm">
            Trade request submitted.
          </section>
        ) : (
          <form action={requestTrade} className="grid gap-4 rounded border p-4">
            <input type="hidden" name="listing_id" value={id} />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <p className="text-sm text-foreground/70">
              Send this seller a request for their listing.
            </p>
            <button
              type="submit"
              className="rounded bg-foreground px-4 py-3 text-sm font-medium text-background"
            >
              Request trade
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

async function requestTrade(formData: FormData) {
  "use server";

  const listingId = formData.get("listing_id");
  const supabase = await createClient();
  const result = await createTradeRequestFromPayload(supabase, {
    listing_id: listingId,
  });

  if (!result.ok) {
    const href =
      typeof listingId === "string"
        ? `/app/listings/${listingId}/request-trade?error=${encodeURIComponent(result.message)}`
        : "/app";
    redirect(href);
  }

  redirect(`/app/listings/${listingId}/request-trade?submitted=1`);
}
