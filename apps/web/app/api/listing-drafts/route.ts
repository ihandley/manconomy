import { NextResponse } from "next/server";
import { generateListingDraftFromPhotos } from "@/lib/listings/aiDraft";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Submit listing photo references as JSON." },
      { status: 400 },
    );
  }

  const photos =
    body && typeof body === "object"
      ? (body as Record<string, unknown>).photos
      : undefined;

  const result = await generateListingDraftFromPhotos(supabase, photos);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status },
    );
  }

  return NextResponse.json({ draft: result.draft });
}
