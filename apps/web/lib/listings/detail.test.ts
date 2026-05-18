import { describe, expect, it, vi } from "vitest";
import { getListingDetail } from "./detail";
import { LISTING_PHOTO_BUCKET } from "./photoUpload";

const LISTING_ID = "11111111-1111-4111-8111-111111111111";
const MISSING_LISTING_ID = "22222222-2222-4222-8222-222222222222";

function createSupabaseClient({
  listing = {
    id: LISTING_ID,
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
  const neighborhoodEq = vi.fn(() => ({ maybeSingle }));
  const idEq = vi.fn(() => ({ eq: neighborhoodEq }));
  const select = vi.fn(() => ({ eq: idEq }));
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
    idEq,
    neighborhoodEq,
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
      idEq,
      neighborhoodEq,
      maybeSingle,
      storageFrom,
      createSignedUrl,
    } = createSupabaseClient();

    await expect(
      getListingDetail(client, LISTING_ID, "neighborhood-1"),
    ).resolves.toEqual({
      ok: true,
      listing: {
        id: LISTING_ID,
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
    expect(idEq).toHaveBeenCalledWith("id", LISTING_ID);
    expect(neighborhoodEq).toHaveBeenCalledWith(
      "neighborhood_id",
      "neighborhood-1",
    );
    expect(maybeSingle).toHaveBeenCalled();
    expect(storageFrom).toHaveBeenCalledWith(LISTING_PHOTO_BUCKET);
    expect(createSignedUrl).toHaveBeenCalledWith(
      "seller-1/listing-photos/drill.jpg",
      600,
    );
  });

  it("returns not found for a malformed listing ID without querying", async () => {
    const { client, from, createSignedUrl } = createSupabaseClient();

    await expect(
      getListingDetail(client, "not-real", "neighborhood-1"),
    ).resolves.toEqual({
      ok: false,
      kind: "not-found",
      message: "Listing not found.",
    });
    expect(from).not.toHaveBeenCalled();
    expect(createSignedUrl).not.toHaveBeenCalled();
  });

  it("returns not found for a valid but missing listing ID", async () => {
    const { client, createSignedUrl } = createSupabaseClient({
      listing: null,
    });

    await expect(
      getListingDetail(client, MISSING_LISTING_ID, "neighborhood-1"),
    ).resolves.toEqual({
      ok: false,
      kind: "not-found",
      message: "Listing not found.",
    });
    expect(createSignedUrl).not.toHaveBeenCalled();
  });

  it("returns not found for an active listing outside the user neighborhood", async () => {
    const { client, neighborhoodEq, createSignedUrl } = createSupabaseClient({
      listing: null,
    });

    await expect(
      getListingDetail(client, LISTING_ID, "neighborhood-2"),
    ).resolves.toEqual({
      ok: false,
      kind: "not-found",
      message: "Listing not found.",
    });
    expect(neighborhoodEq).toHaveBeenCalledWith(
      "neighborhood_id",
      "neighborhood-2",
    );
    expect(createSignedUrl).not.toHaveBeenCalled();
  });

  it.each(["completed", "archived", "cancelled"])(
    "returns unavailable for %s listings without signing photos",
    async (status) => {
      const { client, createSignedUrl } = createSupabaseClient({
        listing: {
          id: LISTING_ID,
          seller_id: "seller-1",
          title: "Cordless Drill",
          description: "Works great.",
          listing_type: "item",
          status,
          category: "tools",
          condition: "good",
          asking_credits: 25,
          photos: [
            {
              bucket: LISTING_PHOTO_BUCKET,
              path: "seller-1/listing-photos/drill.jpg",
            },
          ],
          ai_suggested_price: null,
          ai_confidence: null,
          ai_seal: false,
          published_at: "2026-05-13T00:00:00.000Z",
          created_at: "2026-05-13T00:00:00.000Z",
          users: { display_name: "Ian" },
          neighborhoods: { name: "Old Town" },
        },
      });

      await expect(
        getListingDetail(client, LISTING_ID, "neighborhood-1"),
      ).resolves.toEqual({
        ok: false,
        kind: "unavailable",
        message: "This listing is unavailable.",
      });
      expect(createSignedUrl).not.toHaveBeenCalled();
    },
  );

  it("returns load errors without signing photos", async () => {
    const { client, createSignedUrl } = createSupabaseClient({
      listing: null,
      error: { message: "permission denied" },
    });

    await expect(
      getListingDetail(client, LISTING_ID, "neighborhood-1"),
    ).resolves.toEqual({
      ok: false,
      kind: "error",
      message: "permission denied",
    });
    expect(createSignedUrl).not.toHaveBeenCalled();
  });
});
