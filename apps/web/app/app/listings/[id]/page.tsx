import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  hasAppAccess,
  hasCompletedOnboarding,
} from "../../../../lib/auth/appAccess";
import { ensureUserProfile } from "../../../../lib/auth/profile";
import { getListingDetail } from "../../../../lib/listings/detail";
import {
  ListingDetailError,
  ListingDetailNotFound,
  ListingDetailUnavailable,
  ListingDetailView,
  type PendingTradeRequestSummary,
} from "../../../../lib/listings/detailView";
import { createClient } from "../../../../lib/supabase/server";

type PendingTradeRequestRow = {
  id: string;
  offered_credits: number;
  created_at: string;
};

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error: profileCreateError } = await ensureUserProfile(supabase, user);

  if (profileCreateError) {
    return (
      <ListingDetailShell
        content={<ListingDetailError message={profileCreateError.message} />}
      />
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, email, display_name, neighborhood_id, onboarding_completed_at, phone_verified_at, created_at, updated_at",
    )
    .eq("id", user.id)
    .single();

  if (profileError) {
    return (
      <ListingDetailShell
        content={<ListingDetailError message={profileError.message} />}
      />
    );
  }

  if (!hasAppAccess(profile)) {
    redirect("/verify-phone");
  }

  if (!hasCompletedOnboarding(profile) || !profile.neighborhood_id) {
    redirect("/onboarding");
  }

  const listing = await getListingDetail(supabase, id, profile.neighborhood_id);

  if (!listing.ok) {
    return (
      <ListingDetailShell
        content={
          listing.kind === "not-found" ? (
            <ListingDetailNotFound />
          ) : listing.kind === "unavailable" ? (
            <ListingDetailUnavailable />
          ) : (
            <ListingDetailError message={listing.message} />
          )
        }
      />
    );
  }

  const pendingTradeRequests =
    listing.listing.sellerId === user.id
      ? await getPendingTradeRequests(supabase, listing.listing.id, user.id)
      : [];

  return (
    <ListingDetailShell
      content={
        <ListingDetailView
          currentUserId={user.id}
          listing={listing.listing}
          pendingTradeRequests={pendingTradeRequests}
        />
      }
    />
  );
}

async function getPendingTradeRequests(
  supabase: Awaited<ReturnType<typeof createClient>>,
  listingId: string,
  sellerId: string,
): Promise<PendingTradeRequestSummary[]> {
  const { data, error } = await supabase
    .from("trades")
    .select("id,offered_credits,created_at")
    .eq("listing_id", listingId)
    .eq("seller_id", sellerId)
    .eq("status", "requested")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as PendingTradeRequestRow[]).map((trade) => ({
    id: trade.id,
    offeredCredits: trade.offered_credits,
    createdAt: trade.created_at,
  }));
}

function ListingDetailShell({ content }: { content: ReactNode }) {
  return (
    <div className="flex min-h-screen justify-center p-6">
      <main className="flex w-full max-w-2xl flex-col gap-4">
        <Link href="/app" className="text-sm underline">
          Back to feed
        </Link>
        {content}
      </main>
    </div>
  );
}
