import type { User } from '@supabase/supabase-js'
import type { createClient } from '../supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export const LISTING_PHOTO_BUCKET = 'listing-photos'
export const MAX_LISTING_PHOTOS = 3
export const MAX_LISTING_PHOTO_BYTES = 10 * 1024 * 1024

const ALLOWED_LISTING_PHOTO_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])

export type ListingPhotoReference = {
  bucket: typeof LISTING_PHOTO_BUCKET
  path: string
  contentType: string
  size: number
}

export type ListingPhotoUploadResult =
  | {
      ok: true
      photos: ListingPhotoReference[]
    }
  | {
      ok: false
      message: string
      status: 400 | 401
    }

export async function uploadListingPhotosFromFormData(
  supabase: SupabaseClient,
  formData: FormData
): Promise<ListingPhotoUploadResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      ok: false,
      message: 'Sign in to upload listing photos.',
      status: 401,
    }
  }

  return uploadListingPhotos(supabase, user, getListingPhotoFiles(formData))
}

export async function uploadListingPhotos(
  supabase: SupabaseClient,
  user: User,
  photos: File[]
): Promise<ListingPhotoUploadResult> {
  const validation = validateListingPhotos(photos)

  if (!validation.ok) {
    return validation
  }

  const uploadedPhotos: ListingPhotoReference[] = []

  for (const photo of photos) {
    const path = createListingPhotoPath(user.id, photo)
    const { error } = await supabase.storage
      .from(LISTING_PHOTO_BUCKET)
      .upload(path, photo, {
        contentType: photo.type,
        upsert: false,
      })

    if (error) {
      await removeUploadedPhotos(supabase, uploadedPhotos)

      return {
        ok: false,
        message: `Could not upload ${photo.name || 'photo'}: ${error.message}`,
        status: 400,
      }
    }

    uploadedPhotos.push({
      bucket: LISTING_PHOTO_BUCKET,
      path,
      contentType: photo.type,
      size: photo.size,
    })
  }

  return {
    ok: true,
    photos: uploadedPhotos,
  }
}

export function validateListingPhotos(
  photos: File[]
): ListingPhotoUploadResult {
  if (photos.length === 0) {
    return {
      ok: false,
      message: 'Add at least one listing photo.',
      status: 400,
    }
  }

  if (photos.length > MAX_LISTING_PHOTOS) {
    return {
      ok: false,
      message: `Upload up to ${MAX_LISTING_PHOTOS} listing photos.`,
      status: 400,
    }
  }

  const invalidType = photos.find(
    (photo) => !ALLOWED_LISTING_PHOTO_TYPES.has(photo.type)
  )

  if (invalidType) {
    return {
      ok: false,
      message: 'Listing photos must be JPEG, PNG, or WebP images.',
      status: 400,
    }
  }

  const oversized = photos.find((photo) => photo.size > MAX_LISTING_PHOTO_BYTES)

  if (oversized) {
    return {
      ok: false,
      message: 'Listing photos must be 10 MB or smaller.',
      status: 400,
    }
  }

  return { ok: true, photos: [] }
}

function getListingPhotoFiles(formData: FormData) {
  return formData
    .getAll('photos')
    .filter((value): value is File => value instanceof File && value.size > 0)
}

function createListingPhotoPath(userId: string, photo: File) {
  const extension = ALLOWED_LISTING_PHOTO_TYPES.get(photo.type) ?? 'jpg'

  return `${userId}/listing-photos/${crypto.randomUUID()}.${extension}`
}

async function removeUploadedPhotos(
  supabase: SupabaseClient,
  photos: ListingPhotoReference[]
) {
  if (photos.length === 0) {
    return
  }

  await supabase.storage
    .from(LISTING_PHOTO_BUCKET)
    .remove(photos.map((photo) => photo.path))
}
