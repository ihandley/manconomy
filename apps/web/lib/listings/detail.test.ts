import { describe, expect, it, vi } from "vitest";
import { getListingDetail } from "./detail";
import { LISTING_PHOTO_BUCKET } from "./photoUpload";

function createSupabaseClient({
  listing = {
    id: "listing-1",
    seller_id: "seller-1",
    title: "Cordless Drill",
    description: "Works great.",
    listing_type: "item",
    status: "active",
    category: "tools",
    condition: "good",
    asking_credits: 25,
    photos: [
      {
        bucket: LISTING_PHOTO_BUCKET,
        path: "seller-1/listing-photos/drill.jpg",
      },
    ],
    ai_suggested_price: 25,
    ai_confidence: 0.82,
    ai_seal: true,
    published_at: "2026-05-13T00:00:00.000Z",
    created_at: "2026-05-13T00:00:00.000Z",
    users: { display_name: "Ian" },
    neighborhoods: { name: "Old Town" },
  },
  error = null,
  signedUrl = "https://example.test/signed-drill.jpg",
}: {
  listing?: Record<string, unknown> | null;
  error?: { message: string } | null;
  signedUrl?: string;
} = {}) {
  const maybeSingle = vi.fn(async () => ({ data: listing, error }));
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));
  const createSignedUrl = vi.fn(async () => ({
    data: { signedUrl },
    error: null,
  }));
  const storageFrom = vi.fn(() => ({ createSignedUrl }));

  return {
    client: {
      from,
      storage: { from: storageFrom },
    } as unknown as Parameters<typeof getListingDetail>[0],
    from,
    select,
    eq,
    maybeSingle,
    storageFrom,
    createSignedUrl,
  };
}

describe("getListingDetail", () => {
  it("loads a single listing by ID with signed photo URLs", async () => {
    const {
      client,
      from,
      select,
      eq,
      maybeSingle,
      storageFrom,
      createSignedUrl,
    } = createSupabaseClient();

    await expect(getListingDetail(client, "listing-1")).resolves.toEqual({
      ok: true,
      listing: {
        id: "listing-1",
        sellerId: "seller-1",
        title: "Cordless Drill",
        description: "Works great.",
        listingType: "item",
        status: "active",
        category: "tools",
        condition: "good",
        askingCredits: 25,
        photoUrls: ["https://example.test/signed-drill.jpg"],
        aiSuggestedPrice: 25,
        aiConfidence: 0.82,
        aiSeal: true,
        listedAt: "2026-05-13T00:00:00.000Z",
        sellerDisplayName: "Ian",
        neighborhoodName: "Old Town",
      },
    });

    expect(from).toHaveBeenCalledWith("listings");
    expect(select).toHaveBeenCalledWith(
      "id,seller_id,title,description,listing_type,status,category,condition,asking_credits,photos,ai_suggested_price,ai_confidence,ai_seal,published_at,created_at,users!listings_seller_id_fkey(display_name),neighborhoods!listings_neighborhood_id_fkey(name)",
    );
    expect(eq).toHaveBeenCalledWith("id", "listing-1");
    expect(maybeSingle).toHaveBeenCalled();
    expect(storageFrom).toHaveBeenCalledWith(LISTING_PHOTO_BUCKET);
    expect(createSignedUrl).toHaveBeenCalledWith(
      "seller-1/listing-photos/drill.jpg",
      600,
    );
  });

  it("returns not found for an unknown listing ID", async () => {
    const { client, createSignedUrl } = createSupabaseClient({
      listing: null,
    });

    await expect(getListingDetail(client, "missing-listing")).resolves.toEqual({
      ok: false,
      kind: "not-found",
      message: "Listing not found.",
    });
    expect(createSignedUrl).not.toHaveBeenCalled();
  });

  it("returns load errors without signing photos", async () => {
    const { client, createSignedUrl } = createSupabaseClient({
      listing: null,
      error: { message: "permission denied" },
    });

    await expect(getListingDetail(client, "listing-1")).resolves.toEqual({
      ok: false,
      kind: "error",
      message: "permission denied",
    });
    expect(createSignedUrl).not.toHaveBeenCalled();
  });
});
