import Link from 'next/link'
import type { FeedListing } from './feed'

export function ListingFeed({ listings }: { listings: FeedListing[] }) {
  if (listings.length === 0) {
    return (
      <section className="rounded border border-dashed p-6 text-sm">
        No active listings in your neighborhood yet.
      </section>
    )
  }

  return (
    <section aria-label="Neighborhood listings" className="grid gap-4">
      {listings.map((listing) => (
        <Link
          key={listing.id}
          href={`/app/listings/${listing.id}`}
          className="grid grid-cols-[96px_1fr] gap-4 rounded border p-3 transition hover:border-foreground/60"
        >
          {listing.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.thumbnailUrl}
              alt=""
              className="h-24 w-24 rounded object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded bg-foreground/10 text-xs">
              No photo
            </div>
          )}

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold">
              {listing.title}
            </h2>
            <p className="mt-1 text-sm">
              {listing.askingCredits ?? 0} credits
            </p>
            <p className="mt-2 text-xs text-foreground/70">
              {[listing.condition, listing.category].filter(Boolean).join(' · ')}
            </p>
            {listing.sellerDisplayName ? (
              <p className="mt-2 text-xs text-foreground/70">
                Listed by {listing.sellerDisplayName}
              </p>
            ) : null}
          </div>
        </Link>
      ))}
    </section>
  )
}

export function ListingFeedError({ message }: { message: string }) {
  return (
    <section className="rounded border p-6 text-sm">
      Listings could not be loaded: {message}
    </section>
  )
}

export function ListingFeedLoading() {
  return (
    <div className="flex min-h-screen justify-center p-6">
      <main className="flex w-full max-w-2xl flex-col gap-4">
        <div className="h-8 w-40 rounded bg-foreground/10" />
        <div className="h-28 rounded border bg-foreground/5" />
        <div className="h-28 rounded border bg-foreground/5" />
        <div className="h-28 rounded border bg-foreground/5" />
      </main>
    </div>
  )
}
