import type { createClient } from "../supabase/server";
import {
  LISTING_PHOTO_BUCKET,
  type ListingPhotoReference,
} from "./photoUpload";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

type ListingSeller = {
  display_name: string | null;
};

type ListingNeighborhood = {
  name: string | null;
};

type ListingRow = {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  listing_type: string;
  status: string;
  category: string | null;
  condition: string | null;
  asking_credits: number | null;
  photos: unknown;
  ai_suggested_price: number | null;
  ai_confidence: number | null;
  ai_seal: boolean;
  published_at: string | null;
  created_at: string;
  users: ListingSeller | ListingSeller[] | null;
  neighborhoods: ListingNeighborhood | ListingNeighborhood[] | null;
};

export type ListingDetail = {
  id: string;
  sellerId: string;
  title: string;
  description: string | null;
  listingType: string;
  status: string;
  category: string | null;
  condition: string | null;
  askingCredits: number | null;
  photoUrls: string[];
  aiSuggestedPrice: number | null;
  aiConfidence: number | null;
  aiSeal: boolean;
  listedAt: string;
  sellerDisplayName: string | null;
  neighborhoodName: string | null;
};

export type ListingDetailResult =
  | {
      ok: true;
      listing: ListingDetail;
    }
  | {
      ok: false;
      kind: "not-found" | "unavailable" | "error";
      message: string;
    };

export async function getListingDetail(
  supabase: SupabaseClient,
  listingId: string,
  neighborhoodId: string,
): Promise<ListingDetailResult> {
  if (!isUuid(listingId)) {
    return notFound();
  }

  const { data, error } = await supabase
    .from("listings")
    .select(
      "id,seller_id,title,description,listing_type,status,category,condition,asking_credits,photos,ai_suggested_price,ai_confidence,ai_seal,published_at,created_at,users!listings_seller_id_fkey(display_name),neighborhoods!listings_neighborhood_id_fkey(name)",
    )
    .eq("id", listingId)
    .eq("neighborhood_id", neighborhoodId)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      kind: "error",
      message: error.message,
    };
  }

  if (!data) {
    return notFound();
  }

  const listing = data as ListingRow;

  if (listing.status !== "active") {
    return {
      ok: false,
      kind: "unavailable",
      message: "This listing is unavailable.",
    };
  }

  return {
    ok: true,
    listing: await toListingDetail(supabase, listing),
  };
}

function notFound(): ListingDetailResult {
  return {
    ok: false,
    kind: "not-found",
    message: "Listing not found.",
  };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function toListingDetail(
  supabase: SupabaseClient,
  listing: ListingRow,
): Promise<ListingDetail> {
  return {
    id: listing.id,
    sellerId: listing.seller_id,
    title: listing.title,
    description: listing.description,
    listingType: listing.listing_type,
    status: listing.status,
    category: listing.category,
    condition: listing.condition,
    askingCredits: listing.asking_credits,
    photoUrls: await getListingPhotoUrls(supabase, listing.photos),
    aiSuggestedPrice: listing.ai_suggested_price,
    aiConfidence: listing.ai_confidence,
    aiSeal: listing.ai_seal,
    listedAt: listing.published_at ?? listing.created_at,
    sellerDisplayName: getSellerDisplayName(listing.users),
    neighborhoodName: getNeighborhoodName(listing.neighborhoods),
  };
}

async function getListingPhotoUrls(supabase: SupabaseClient, photos: unknown) {
  const validPhotos = getListingPhotos(photos);
  const urls = await Promise.all(
    validPhotos.map(async (photo) => {
      const { data, error } = await supabase.storage
        .from(LISTING_PHOTO_BUCKET)
        .createSignedUrl(photo.path, 60 * 10);

      if (error) {
        return null;
      }

      return data.signedUrl;
    }),
  );

  return urls.filter((url): url is string => Boolean(url));
}

function getListingPhotos(photos: unknown): ListingPhotoReference[] {
  if (!Array.isArray(photos)) {
    return [];
  }

  return photos.filter(
    (photo): photo is ListingPhotoReference =>
      Boolean(photo) &&
      typeof photo === "object" &&
      "bucket" in photo &&
      "path" in photo &&
      photo.bucket === LISTING_PHOTO_BUCKET &&
      typeof photo.path === "string",
  );
}

function getSellerDisplayName(seller: ListingRow["users"]) {
  if (Array.isArray(seller)) {
    return seller[0]?.display_name ?? null;
  }

  return seller?.display_name ?? null;
}

function getNeighborhoodName(neighborhood: ListingRow["neighborhoods"]) {
  if (Array.isArray(neighborhood)) {
    return neighborhood[0]?.name ?? null;
  }

  return neighborhood?.name ?? null;
}
