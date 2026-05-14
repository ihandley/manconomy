import { redirect } from "next/navigation";
import { hasAppAccess, hasCompletedOnboarding } from "../../lib/auth/appAccess";
import { ensureUserProfile } from "../../lib/auth/profile";
import { getNeighborhoodFeedListings } from "../../lib/listings/feed";
import { ListingFeed, ListingFeedError } from "../../lib/listings/feedView";
import { createClient } from "../../lib/supabase/server";

async function signOut() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

async function updateProfile(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName = String(formData.get("display_name") ?? "").trim();

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    redirect(`/app?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/app?message=Profile updated");
}

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
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
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex w-full max-w-md flex-col gap-4">
          <h1 className="text-2xl font-semibold">Signed in</h1>
          <p>{user.email}</p>
          <p className="text-sm">
            Profile could not be created: {profileCreateError.message}
          </p>

          <form action={signOut}>
            <button type="submit" className="rounded border px-3 py-2">
              Sign out
            </button>
          </form>
        </div>
      </div>
    );
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "id, email, display_name, neighborhood_id, onboarding_completed_at, phone_verified_at, created_at, updated_at",
    )
    .eq("id", user.id)
    .single();

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex w-full max-w-md flex-col gap-4">
          <h1 className="text-2xl font-semibold">Signed in</h1>
          <p>{user.email}</p>
          <p className="text-sm">
            Profile could not be loaded: {error.message}
          </p>

          <form action={signOut}>
            <button type="submit" className="rounded border px-3 py-2">
              Sign out
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!hasAppAccess(profile)) {
    redirect("/verify-phone");
  }

  if (!hasCompletedOnboarding(profile)) {
    redirect("/onboarding");
  }

  const neighborhoodId = profile.neighborhood_id;

  if (!neighborhoodId) {
    redirect("/onboarding");
  }

  const params = await searchParams;
  const message = params.message;
  const feed = await getNeighborhoodFeedListings(supabase, neighborhoodId);

  return (
    <div className="flex min-h-screen justify-center p-6">
      <main className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Neighborhood feed</h1>
            <p className="text-sm text-foreground/70">
              Active listings near you.
            </p>
          </div>

          <form action={signOut}>
            <button type="submit" className="rounded border px-3 py-2 text-sm">
              Sign out
            </button>
          </form>
        </div>

        <form action={updateProfile} className="flex items-end gap-3">
          <label className="flex flex-1 flex-col gap-1 text-sm">
            Display name
            <input
              name="display_name"
              defaultValue={profile.display_name ?? ""}
              className="rounded border px-3 py-2"
            />
          </label>

          <button type="submit" className="rounded border px-3 py-2 text-sm">
            Save
          </button>
        </form>

        {message ? <p className="text-sm">{message}</p> : null}

        {feed.ok ? (
          <ListingFeed listings={feed.listings} />
        ) : (
          <ListingFeedError message={feed.message} />
        )}
      </main>
    </div>
  );
}
