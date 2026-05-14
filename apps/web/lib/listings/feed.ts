import type { createClient } from '../supabase/server'
import { LISTING_PHOTO_BUCKET, type ListingPhotoReference } from './photoUpload'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

type ListingSeller = {
  display_name: string | null
}

type ListingRow = {
  id: string
  title: string
  category: string | null
  condition: string | null
  asking_credits: number | null
  photos: unknown
  published_at: string | null
  created_at: string
  users: ListingSeller | ListingSeller[] | null
}

export type FeedListing = {
  id: string
  title: string
  category: string | null
  condition: string | null
  askingCredits: number | null
  thumbnailUrl: string | null
  sellerDisplayName: string | null
}

export type FeedListingsResult =
  | {
      ok: true
      listings: FeedListing[]
    }
  | {
      ok: false
      message: string
    }

export async function getNeighborhoodFeedListings(
  supabase: SupabaseClient,
  neighborhoodId: string
): Promise<FeedListingsResult> {
  const { data, error } = await supabase
    .from('listings')
    .select(
      'id,title,category,condition,asking_credits,photos,published_at,created_at,users!listings_seller_id_fkey(display_name)'
    )
    .eq('neighborhood_id', neighborhoodId)
    .eq('status', 'active')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(50)

  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }

  const listings = await Promise.all(
    ((data ?? []) as ListingRow[]).map((listing) =>
      toFeedListing(supabase, listing)
    )
  )

  return {
    ok: true,
    listings,
  }
}

async function toFeedListing(
  supabase: SupabaseClient,
  listing: ListingRow
): Promise<FeedListing> {
  return {
    id: listing.id,
    title: listing.title,
    category: listing.category,
    condition: listing.condition,
    askingCredits: listing.asking_credits,
    thumbnailUrl: await getListingThumbnailUrl(supabase, listing.photos),
    sellerDisplayName: getSellerDisplayName(listing.users),
  }
}

async function getListingThumbnailUrl(
  supabase: SupabaseClient,
  photos: unknown
) {
  const firstPhoto = getFirstListingPhoto(photos)

  if (!firstPhoto) {
    return null
  }

  const { data, error } = await supabase.storage
    .from(LISTING_PHOTO_BUCKET)
    .createSignedUrl(firstPhoto.path, 60 * 10)

  if (error) {
    return null
  }

  return data.signedUrl
}

function getFirstListingPhoto(photos: unknown): ListingPhotoReference | null {
  if (!Array.isArray(photos)) {
    return null
  }

  const [firstPhoto] = photos

  if (
    !firstPhoto ||
    typeof firstPhoto !== 'object' ||
    !('bucket' in firstPhoto) ||
    !('path' in firstPhoto) ||
    firstPhoto.bucket !== LISTING_PHOTO_BUCKET ||
    typeof firstPhoto.path !== 'string'
  ) {
    return null
  }

  return firstPhoto as ListingPhotoReference
}

function getSellerDisplayName(seller: ListingRow['users']) {
  if (Array.isArray(seller)) {
    return seller[0]?.display_name ?? null
  }

  return seller?.display_name ?? null
}
