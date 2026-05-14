import { NextResponse } from 'next/server'
import { uploadListingPhotosFromFormData } from '@/lib/listings/photoUpload'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { error: 'Submit listing photos as multipart form data.' },
      { status: 400 }
    )
  }

  const result = await uploadListingPhotosFromFormData(supabase, formData)

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status }
    )
  }

  return NextResponse.json({ photos: result.photos }, { status: 201 })
}
