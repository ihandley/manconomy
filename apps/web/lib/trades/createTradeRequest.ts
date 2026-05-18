import type { User } from "@supabase/supabase-js";
import { hasCompletedOnboarding } from "../auth/appAccess";
import type { createClient } from "../supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

type BuyerProfile = {
  display_name: string | null;
  neighborhood_id: string | null;
  onboarding_completed_at: string | null;
  phone_verified_at: string | null;
};

type ListingRow = {
  id: string;
  seller_id: string;
  status: string;
  asking_credits: number | null;
};

export type CreateTradeRequestResult =
  | {
      ok: true;
      trade: unknown;
    }
  | {
      ok: false;
      message: string;
      status: 400 | 401 | 403 | 404 | 409 | 500;
    };

export async function createTradeRequestFromPayload(
  supabase: SupabaseClient,
  payload: unknown,
): Promise<CreateTradeRequestResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message: "Sign in to request a trade.",
      status: 401,
    };
  }

  const listingId = getListingId(payload);

  if (!listingId) {
    return {
      ok: false,
      message: "Use a valid listing.",
      status: 400,
    };
  }

  const profileResult = await getBuyerProfile(supabase, user);

  if (!profileResult.ok) {
    return profileResult;
  }

  const buyerResult = await ensureBuyerUser(
    supabase,
    user,
    profileResult.profile,
  );

  if (!buyerResult.ok) {
    return buyerResult;
  }

  const listingResult = await getRequestableListing(supabase, listingId);

  if (!listingResult.ok) {
    return listingResult;
  }

  const listing = listingResult.listing;

  if (listing.seller_id === user.id) {
    return {
      ok: false,
      message: "You cannot request your own listing.",
      status: 403,
    };
  }

  if (listing.status !== "active") {
    return {
      ok: false,
      message: "This listing is unavailable.",
      status: 409,
    };
  }

  const duplicateResult = await hasExistingBuyerRequest(
    supabase,
    listing.id,
    user.id,
  );

  if (!duplicateResult.ok) {
    return duplicateResult;
  }

  if (duplicateResult.exists) {
    return {
      ok: false,
      message: "You have already requested this listing.",
      status: 409,
    };
  }

  const lockedResult = await isListingLocked(supabase, listing.id);

  if (!lockedResult.ok) {
    return lockedResult;
  }

  if (lockedResult.locked) {
    return {
      ok: false,
      message: "This listing is unavailable.",
      status: 409,
    };
  }

  const { data, error } = await supabase
    .from("trades")
    .insert({
      listing_id: listing.id,
      buyer_id: user.id,
      seller_id: listing.seller_id,
      status: "requested",
      offered_credits: listing.asking_credits ?? 0,
    })
    .select(
      "id,listing_id,buyer_id,seller_id,status,offered_credits,created_at,updated_at",
    )
    .single();

  if (error) {
    if ("code" in error && error.code === "23505") {
      return {
        ok: false,
        message: "You have already requested this listing.",
        status: 409,
      };
    }

    if (
      "code" in error &&
      error.code === "23514" &&
      error.message === "This listing is unavailable."
    ) {
      return {
        ok: false,
        message: "This listing is unavailable.",
        status: 409,
      };
    }

    return {
      ok: false,
      message: error.message,
      status: 500,
    };
  }

  return {
    ok: true,
    trade: data,
  };
}

function getListingId(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("listing_id" in payload)) {
    return null;
  }

  const listingId = payload.listing_id;

  if (typeof listingId !== "string" || !isUuid(listingId)) {
    return null;
  }

  return listingId;
}

async function getBuyerProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<
  | { ok: true; profile: BuyerProfile }
  | { ok: false; message: string; status: 403 | 500 }
> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "display_name,neighborhood_id,onboarding_completed_at,phone_verified_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      message: error.message,
      status: 500,
    };
  }

  if (!data || !hasCompletedOnboarding(data)) {
    return {
      ok: false,
      message: "Complete onboarding before requesting a trade.",
      status: 403,
    };
  }

  return {
    ok: true,
    profile: data,
  };
}

async function ensureBuyerUser(
  supabase: SupabaseClient,
  user: User,
  profile: BuyerProfile,
): Promise<{ ok: true } | { ok: false; message: string; status: 500 }> {
  const { error } = await supabase.from("users").upsert(
    {
      id: user.id,
      display_name: profile.display_name,
      neighborhood_id: profile.neighborhood_id,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    },
  );

  if (error) {
    return {
      ok: false,
      message: error.message,
      status: 500,
    };
  }

  return { ok: true };
}

async function getRequestableListing(
  supabase: SupabaseClient,
  listingId: string,
): Promise<
  | { ok: true; listing: ListingRow }
  | { ok: false; message: string; status: 404 | 500 }
> {
  const { data, error } = await supabase
    .from("listings")
    .select("id,seller_id,status,asking_credits")
    .eq("id", listingId)
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
      message: "Listing not found.",
      status: 404,
    };
  }

  return {
    ok: true,
    listing: data as ListingRow,
  };
}

async function hasExistingBuyerRequest(
  supabase: SupabaseClient,
  listingId: string,
  buyerId: string,
): Promise<
  { ok: true; exists: boolean } | { ok: false; message: string; status: 500 }
> {
  const { data, error } = await supabase
    .from("trades")
    .select("id")
    .eq("listing_id", listingId)
    .eq("buyer_id", buyerId)
    .in("status", ["requested", "accepted"])
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      message: error.message,
      status: 500,
    };
  }

  return {
    ok: true,
    exists: Boolean(data),
  };
}

async function isListingLocked(
  supabase: SupabaseClient,
  listingId: string,
): Promise<
  { ok: true; locked: boolean } | { ok: false; message: string; status: 500 }
> {
  const { data, error } = await supabase
    .from("trades")
    .select("id")
    .eq("listing_id", listingId)
    .in("status", ["accepted", "completed"])
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      message: error.message,
      status: 500,
    };
  }

  return {
    ok: true,
    locked: Boolean(data),
  };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
