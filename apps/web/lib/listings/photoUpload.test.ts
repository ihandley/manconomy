import type { User } from '@supabase/supabase-js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  LISTING_PHOTO_BUCKET,
  uploadListingPhotos,
  uploadListingPhotosFromFormData,
  validateListingPhotos,
} from './photoUpload'

type UploadResponse = {
  error: { message: string } | null
}

function createPhoto(name = 'photo.jpg', type = 'image/jpeg', size = 4) {
  return new File(['x'.repeat(size)], name, { type })
}

function createUser(id = 'user-1') {
  return {
    id,
    email: 'test@example.com',
  } as User
}

function createFormData(
  photos: File[],
  extraFields: Record<string, string> = {}
) {
  const formData = new FormData()

  photos.forEach((photo) => formData.append('photos', photo))

  Object.entries(extraFields).forEach(([key, value]) => {
    formData.set(key, value)
  })

  return formData
}

function createSupabaseClient(
  user: User | null,
  uploadResponses: UploadResponse[] = [{ error: null }]
) {
  const upload = vi.fn(async () => uploadResponses.shift() ?? { error: null })
  const remove = vi.fn(async () => ({ error: null }))
  const from = vi.fn(() => ({ upload, remove }))
  const getUser = vi.fn(async () => ({
    data: { user },
  }))

  return {
    client: {
      auth: { getUser },
      storage: { from },
    } as unknown as Parameters<typeof uploadListingPhotosFromFormData>[0],
    from,
    getUser,
    remove,
    upload,
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('validateListingPhotos', () => {
  it('blocks empty uploads', () => {
    expect(validateListingPhotos([])).toEqual({
      ok: false,
      message: 'Add at least one listing photo.',
      status: 400,
    })
  })

  it('blocks more than three photos', () => {
    expect(
      validateListingPhotos([
        createPhoto('1.jpg'),
        createPhoto('2.jpg'),
        createPhoto('3.jpg'),
        createPhoto('4.jpg'),
      ])
    ).toEqual({
      ok: false,
      message: 'Upload up to 3 listing photos.',
      status: 400,
    })
  })

  it('blocks unsupported MIME types', () => {
    expect(validateListingPhotos([createPhoto('photo.gif', 'image/gif')])).toEqual(
      {
        ok: false,
        message: 'Listing photos must be JPEG, PNG, or WebP images.',
        status: 400,
      }
    )
  })

  it('blocks photos larger than 10 MB', () => {
    const photo = createPhoto('big.jpg')
    Object.defineProperty(photo, 'size', { value: 10 * 1024 * 1024 + 1 })

    expect(validateListingPhotos([photo])).toEqual({
      ok: false,
      message: 'Listing photos must be 10 MB or smaller.',
      status: 400,
    })
  })
})

describe('uploadListingPhotosFromFormData', () => {
  beforeEach(() => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('photo-id')
  })

  it('fails when the user is not authenticated', async () => {
    const { client, upload } = createSupabaseClient(null)

    await expect(
      uploadListingPhotosFromFormData(client, createFormData([createPhoto()]))
    ).resolves.toEqual({
      ok: false,
      message: 'Sign in to upload listing photos.',
      status: 401,
    })

    expect(upload).not.toHaveBeenCalled()
  })

  it('uploads valid photos and returns durable storage references', async () => {
    const user = createUser()
    const { client, from, upload } = createSupabaseClient(user)
    const photo = createPhoto()

    await expect(
      uploadListingPhotosFromFormData(
        client,
        createFormData([photo], {
          path: 'another-user/listing-photos/spoof.jpg',
        })
      )
    ).resolves.toEqual({
      ok: true,
      photos: [
        {
          bucket: LISTING_PHOTO_BUCKET,
          path: 'user-1/listing-photos/photo-id.jpg',
          contentType: 'image/jpeg',
          size: photo.size,
        },
      ],
    })

    expect(from).toHaveBeenCalledWith(LISTING_PHOTO_BUCKET)
    expect(upload).toHaveBeenCalledWith(
      'user-1/listing-photos/photo-id.jpg',
      photo,
      {
        contentType: 'image/jpeg',
        upsert: false,
      }
    )
  })
})

describe('uploadListingPhotos', () => {
  beforeEach(() => {
    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('first-photo')
      .mockReturnValueOnce('second-photo')
  })

  it('returns a useful error and cleanup attempt when storage fails', async () => {
    const { client, remove } = createSupabaseClient(createUser(), [
      { error: null },
      { error: { message: 'Storage is unavailable.' } },
    ])

    await expect(
      uploadListingPhotos(client, createUser(), [
        createPhoto('first.jpg'),
        createPhoto('second.png', 'image/png'),
      ])
    ).resolves.toEqual({
      ok: false,
      message: 'Could not upload second.png: Storage is unavailable.',
      status: 400,
    })

    expect(remove).toHaveBeenCalledWith([
      'user-1/listing-photos/first-photo.jpg',
    ])
  })
})
