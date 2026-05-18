import Link from "next/link";
import type { ListingDetail } from "./detail";
import { formatListingDate } from "./feedView";

export type PendingTradeRequestSummary = {
  id: string;
  offeredCredits: number;
  createdAt: string;
};

export function ListingDetailView({
  currentUserId,
  listing,
  pendingTradeRequests = [],
}: {
  currentUserId: string;
  listing: ListingDetail;
  pendingTradeRequests?: PendingTradeRequestSummary[];
}) {
  const isActive = listing.status === "active";
  const isOwner = listing.sellerId === currentUserId;
  const canRequestTrade = isActive && !isOwner;

  return (
    <article className="flex flex-col gap-5">
      <div className="grid gap-3">
        {listing.photoUrls.length > 0 ? (
          <div className="grid gap-3">
            {listing.photoUrls.map((url, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt={index === 0 ? listing.title : ""}
                className="h-64 w-full rounded object-cover"
              />
            ))}
          </div>
        ) : (
          <div className="flex h-64 w-full items-center justify-center rounded bg-foreground/10 text-sm">
            No photo
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-foreground/70">
          {listing.neighborhoodName ?? "Unknown neighborhood"}
        </p>
        <h1 className="text-2xl font-semibold">{listing.title}</h1>
        <p className="text-lg font-medium">
          {listing.askingCredits ?? 0} credits
        </p>
      </div>

      {!isActive ? (
        <section className="rounded border p-4 text-sm">
          This listing is unavailable.
        </section>
      ) : null}

      <section className="grid gap-3">
        <h2 className="text-lg font-semibold">Details</h2>
        <p className="whitespace-pre-wrap text-sm">
          {listing.description || "No description provided."}
        </p>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <DetailItem label="Category" value={formatValue(listing.category)} />
          <DetailItem
            label="Condition"
            value={formatValue(listing.condition)}
          />
          <DetailItem
            label="Listing type"
            value={formatValue(listing.listingType)}
          />
          <DetailItem label="Status" value={formatValue(listing.status)} />
          <DetailItem
            label="Seller"
            value={listing.sellerDisplayName ?? "Unknown seller"}
          />
          <DetailItem
            label="Listed"
            value={formatListingDate(listing.listedAt)}
          />
        </dl>
      </section>

      {listing.aiSeal ||
      listing.aiSuggestedPrice !== null ||
      listing.aiConfidence !== null ? (
        <section className="grid gap-2 rounded border p-4 text-sm">
          <h2 className="font-semibold">AI listing metadata</h2>
          {listing.aiSeal ? <p>AI price checked</p> : null}
          {listing.aiSuggestedPrice !== null ? (
            <p>Suggested price: {listing.aiSuggestedPrice} credits</p>
          ) : null}
          {listing.aiConfidence !== null ? (
            <p>Confidence: {Math.round(listing.aiConfidence * 100)}%</p>
          ) : null}
        </section>
      ) : null}

      {canRequestTrade ? (
        <Link
          href={`/app/listings/${listing.id}/request-trade`}
          className="rounded bg-foreground px-4 py-3 text-center text-sm font-medium text-background"
        >
          Request trade
        </Link>
      ) : isOwner ? (
        <p className="rounded border p-4 text-sm">
          This is your listing, so buyer trade actions are hidden.
        </p>
      ) : null}

      {isOwner && pendingTradeRequests.length > 0 ? (
        <section className="grid gap-3 rounded border p-4 text-sm">
          <h2 className="font-semibold">Pending trade requests</h2>
          <ul className="grid gap-2">
            {pendingTradeRequests.map((trade) => (
              <li
                key={trade.id}
                className="flex items-center justify-between gap-4"
              >
                <span>
                  {trade.offeredCredits} credits ·{" "}
                  {formatListingDate(trade.createdAt)}
                </span>
                <Link href={`/app/trades/${trade.id}`} className="underline">
                  Review
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

export function ListingDetailNotFound() {
  return (
    <section className="rounded border p-6 text-sm">Listing not found.</section>
  );
}

export function ListingDetailUnavailable() {
  return (
    <section className="rounded border p-6 text-sm">
      This listing is unavailable.
    </section>
  );
}

export function ListingDetailError({ message }: { message: string }) {
  return (
    <section className="rounded border p-6 text-sm">
      Listing could not be loaded: {message}
    </section>
  );
}

export function ListingDetailLoading() {
  return (
    <div className="flex min-h-screen justify-center p-6">
      <main className="flex w-full max-w-2xl flex-col gap-4">
        <div className="h-5 w-24 rounded bg-foreground/10" />
        <div className="h-64 rounded bg-foreground/10" />
        <div className="h-8 w-56 rounded bg-foreground/10" />
        <div className="h-24 rounded border bg-foreground/5" />
      </main>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-foreground/70">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function formatValue(value: string | null) {
  if (!value) {
    return "Unspecified";
  }

  return value.replaceAll("_", " ");
}
