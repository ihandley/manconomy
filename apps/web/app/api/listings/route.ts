import { NextResponse } from "next/server";
import { createListingFromPayload } from "@/lib/listings/createListing";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Submit listing details as JSON." },
      { status: 400 },
    );
  }

  const result = await createListingFromPayload(supabase, body);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status },
    );
  }

  return NextResponse.json({ listing: result.listing }, { status: 201 });
}
