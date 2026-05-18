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
  ListingDetailView,
} from "../../../../lib/listings/detailView";
import { createClient } from "../../../../lib/supabase/server";

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

  const listing = await getListingDetail(supabase, id);

  if (!listing.ok) {
    return (
      <ListingDetailShell
        content={
          listing.kind === "not-found" ? (
            <ListingDetailNotFound />
          ) : (
            <ListingDetailError message={listing.message} />
          )
        }
      />
    );
  }

  return (
    <ListingDetailShell
      content={
        <ListingDetailView currentUserId={user.id} listing={listing.listing} />
      }
    />
  );
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
