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
  title: string;
  listing_type: string;
  status: string;
  category: string | null;
  condition: string | null;
  asking_credits: number | null;
  photos: unknown;
  published_at: string | null;
  created_at: string;
  users: ListingSeller | ListingSeller[] | null;
  neighborhoods: ListingNeighborhood | ListingNeighborhood[] | null;
};

export type FeedListing = {
  id: string;
  title: string;
  listingType: string;
  status: string;
  category: string | null;
  condition: string | null;
  askingCredits: number | null;
  listedAt: string;
  thumbnailUrl: string | null;
  sellerDisplayName: string | null;
  neighborhoodName: string | null;
};

export type FeedListingsResult =
  | {
      ok: true;
      listings: FeedListing[];
    }
  | {
      ok: false;
      message: string;
    };

export async function getNeighborhoodFeedListings(
  supabase: SupabaseClient,
  neighborhoodId: string,
): Promise<FeedListingsResult> {
  const { data, error } = await supabase
    .from("listings")
    .select(
      "id,title,listing_type,status,category,condition,asking_credits,photos,published_at,created_at,users!listings_seller_id_fkey(display_name),neighborhoods!listings_neighborhood_id_fkey(name)",
    )
    .eq("neighborhood_id", neighborhoodId)
    .eq("status", "active")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(50);

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  const listings = await Promise.all(
    ((data ?? []) as ListingRow[]).map((listing) =>
      toFeedListing(supabase, listing),
    ),
  );

  return {
    ok: true,
    listings,
  };
}

async function toFeedListing(
  supabase: SupabaseClient,
  listing: ListingRow,
): Promise<FeedListing> {
  return {
    id: listing.id,
    title: listing.title,
    listingType: listing.listing_type,
    status: listing.status,
    category: listing.category,
    condition: listing.condition,
    askingCredits: listing.asking_credits,
    listedAt: listing.published_at ?? listing.created_at,
    thumbnailUrl: await getListingThumbnailUrl(supabase, listing.photos),
    sellerDisplayName: getSellerDisplayName(listing.users),
    neighborhoodName: getNeighborhoodName(listing.neighborhoods),
  };
}

async function getListingThumbnailUrl(
  supabase: SupabaseClient,
  photos: unknown,
) {
  const firstPhoto = getFirstListingPhoto(photos);

  if (!firstPhoto) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(LISTING_PHOTO_BUCKET)
    .createSignedUrl(firstPhoto.path, 60 * 10);

  if (error) {
    return null;
  }

  return data.signedUrl;
}

function getFirstListingPhoto(photos: unknown): ListingPhotoReference | null {
  if (!Array.isArray(photos)) {
    return null;
  }

  const [firstPhoto] = photos;

  if (
    !firstPhoto ||
    typeof firstPhoto !== "object" ||
    !("bucket" in firstPhoto) ||
    !("path" in firstPhoto) ||
    firstPhoto.bucket !== LISTING_PHOTO_BUCKET ||
    typeof firstPhoto.path !== "string"
  ) {
    return null;
  }

  return firstPhoto as ListingPhotoReference;
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
