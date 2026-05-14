import { NextResponse } from 'next/server'
import { uploadListingPhotosFromFormData } from '@/lib/listings/photoUpload'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const result = await uploadListingPhotosFromFormData(
    supabase,
    await request.formData()
  )

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status }
    )
  }

  return NextResponse.json({ photos: result.photos }, { status: 201 })
}
