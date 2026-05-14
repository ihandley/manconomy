import type { User } from "@supabase/supabase-js";
import { hasCompletedOnboarding } from "../auth/appAccess";
import type { createClient } from "../supabase/server";
import {
  LISTING_PHOTO_BUCKET,
  MAX_LISTING_PHOTOS,
  type ListingPhotoReference,
} from "./photoUpload";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export const LISTING_CATEGORIES = [
  "tools",
  "electronics",
  "outdoor_camping",
  "sports_equipment",
  "home_garage",
  "vehicles_parts",
  "gaming",
  "food_provision",
  "other",
] as const;

export const LISTING_CONDITIONS = [
  "new",
  "like_new",
  "good",
  "fair",
  "poor",
  "for_parts",
] as const;

type ListingCategory = (typeof LISTING_CATEGORIES)[number];
type ListingCondition = (typeof LISTING_CONDITIONS)[number];

type UserProfile = {
  display_name: string | null;
  neighborhood_id: string | null;
  onboarding_completed_at: string | null;
  phone_verified_at: string | null;
};

type ListingCreateFields = {
  title: string;
  description: string | null;
  category: ListingCategory;
  condition: ListingCondition;
  credit_price: number;
  photos: ListingPhotoReference[];
  ai_suggested_price: number | null;
  ai_confidence: number | null;
  ai_seal: boolean;
};

type ListingValidationResult =
  | {
      ok: true;
      fields: ListingCreateFields;
    }
  | {
      ok: false;
      message: string;
      status: 400;
    };

export type CreateListingResult =
  | {
      ok: true;
      listing: unknown;
    }
  | {
      ok: false;
      message: string;
      status: 400 | 401 | 403 | 500;
    };

export async function createListingFromPayload(
  supabase: SupabaseClient,
  payload: unknown,
): Promise<CreateListingResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message: "Sign in to create a listing.",
      status: 401,
    };
  }

  const profileResult = await getListingProfile(supabase, user);

  if (!profileResult.ok) {
    return profileResult;
  }

  const validation = validateListingPayload(user, payload);

  if (!validation.ok) {
    return validation;
  }

  const ownerResult = await ensureListingOwner(
    supabase,
    user,
    profileResult.profile,
  );

  if (!ownerResult.ok) {
    return ownerResult;
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("listings")
    .insert({
      seller_id: user.id,
      neighborhood_id: profileResult.profile.neighborhood_id,
      title: validation.fields.title,
      description: validation.fields.description,
      category: validation.fields.category,
      condition: validation.fields.condition,
      asking_credits: validation.fields.credit_price,
      photos: validation.fields.photos,
      ai_suggested_price: validation.fields.ai_suggested_price,
      ai_confidence: validation.fields.ai_confidence,
      ai_seal: validation.fields.ai_seal,
      status: "active",
      published_at: now,
    })
    .select(
      "id,seller_id,neighborhood_id,title,description,category,condition,asking_credits,photos,ai_suggested_price,ai_confidence,ai_seal,status,published_at,created_at,updated_at",
    )
    .single();

  if (error) {
    return {
      ok: false,
      message: error.message,
      status: 500,
    };
  }

  return {
    ok: true,
    listing: data,
  };
}

async function ensureListingOwner(
  supabase: SupabaseClient,
  user: User,
  profile: UserProfile,
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

async function getListingProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<
  | { ok: true; profile: UserProfile }
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
      message: "Complete onboarding before creating a listing.",
      status: 403,
    };
  }

  return {
    ok: true,
    profile: data,
  };
}

function validateListingPayload(
  user: User,
  payload: unknown,
): ListingValidationResult {
  if (!payload || typeof payload !== "object") {
    return invalid("Submit listing details as JSON.");
  }

  const candidate = payload as Record<string, unknown>;
  const title = sanitizeText(candidate.title, 80);
  const description = sanitizeText(candidate.description, 1000);
  const category = candidate.category;
  const condition = candidate.condition;
  const creditPrice = candidate.credit_price;
  const photos = validateListingPhotoReferences(user, candidate.photos);

  if (!title) {
    return invalid("Enter a listing title.");
  }

  if (!isListingCategory(category)) {
    return invalid("Choose a supported listing category.");
  }

  if (!isListingCondition(condition)) {
    return invalid("Choose a supported listing condition.");
  }

  if (!isValidCreditPrice(creditPrice)) {
    return invalid("Enter a non-negative whole-number credit price.");
  }

  if (!photos.ok) {
    return invalid(photos.message);
  }

  const aiSuggestedPrice = normalizeOptionalCreditPrice(
    candidate.ai_suggested_price,
  );

  if (aiSuggestedPrice === false) {
    return invalid("Use a valid AI suggested price.");
  }

  const aiConfidence = normalizeOptionalConfidence(candidate.ai_confidence);

  if (aiConfidence === false) {
    return invalid("Use a valid AI confidence value.");
  }

  return {
    ok: true,
    fields: {
      title,
      description,
      category,
      condition,
      credit_price: creditPrice,
      photos: photos.photos,
      ai_suggested_price: aiSuggestedPrice,
      ai_confidence: aiConfidence,
      ai_seal:
        aiSuggestedPrice !== null &&
        aiConfidence !== null &&
        creditPrice === aiSuggestedPrice,
    },
  };
}

function sanitizeText(value: unknown, maxLength: number) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().replace(/\s+/g, " ");

  if (!trimmed || trimmed.length > maxLength) {
    return null;
  }

  return trimmed;
}

function isListingCategory(value: unknown): value is ListingCategory {
  return (
    typeof value === "string" &&
    LISTING_CATEGORIES.includes(value as ListingCategory)
  );
}

function isListingCondition(value: unknown): value is ListingCondition {
  return (
    typeof value === "string" &&
    LISTING_CONDITIONS.includes(value as ListingCondition)
  );
}

function isValidCreditPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function normalizeOptionalCreditPrice(value: unknown) {
  if (value === undefined || value === null) {
    return null;
  }

  return isValidCreditPrice(value) ? value : false;
}

function normalizeOptionalConfidence(value: unknown) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "number" || value < 0 || value > 1) {
    return false;
  }

  return value;
}

function validateListingPhotoReferences(
  user: User,
  photos: unknown,
):
  | { ok: true; photos: ListingPhotoReference[] }
  | { ok: false; message: string } {
  if (!Array.isArray(photos) || photos.length === 0) {
    return {
      ok: false,
      message: "Add at least one listing photo.",
    };
  }

  if (photos.length > MAX_LISTING_PHOTOS) {
    return {
      ok: false,
      message: `Add up to ${MAX_LISTING_PHOTOS} listing photos.`,
    };
  }

  const validPhotos: ListingPhotoReference[] = [];

  for (const photo of photos) {
    if (!isListingPhotoReference(photo)) {
      return invalidPhotoReference();
    }

    if (
      photo.bucket !== LISTING_PHOTO_BUCKET ||
      !photo.path.startsWith(`${user.id}/listing-photos/`)
    ) {
      return invalidPhotoReference();
    }

    validPhotos.push({
      bucket: LISTING_PHOTO_BUCKET,
      path: photo.path,
      contentType: photo.contentType,
      size: photo.size,
    });
  }

  return { ok: true, photos: validPhotos };
}

function isListingPhotoReference(
  photo: unknown,
): photo is ListingPhotoReference {
  if (!photo || typeof photo !== "object") {
    return false;
  }

  const candidate = photo as Record<string, unknown>;

  return (
    typeof candidate.bucket === "string" &&
    typeof candidate.path === "string" &&
    typeof candidate.contentType === "string" &&
    typeof candidate.size === "number" &&
    Number.isInteger(candidate.size) &&
    candidate.size > 0
  );
}

function invalidPhotoReference() {
  return {
    ok: false,
    message: "Use valid uploaded listing photo references.",
  } as const;
}

function invalid(message: string): ListingValidationResult {
  return {
    ok: false,
    message,
    status: 400,
  };
}
