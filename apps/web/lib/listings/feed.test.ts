import { describe, expect, it, vi } from "vitest";
import { getNeighborhoodFeedListings } from "./feed";
import { LISTING_PHOTO_BUCKET } from "./photoUpload";

function createSupabaseClient({
  listings = [
    {
      id: "listing-1",
      title: "Cordless Drill",
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
      published_at: "2026-05-13T00:00:00.000Z",
      created_at: "2026-05-13T00:00:00.000Z",
      users: { display_name: "Ian" },
      neighborhoods: { name: "Old Town" },
    },
  ],
  error = null,
  signedUrl = "https://example.test/signed-drill.jpg",
}: {
  listings?: Record<string, unknown>[] | null;
  error?: { message: string } | null;
  signedUrl?: string;
} = {}) {
  const limit = vi.fn(async () => ({ data: listings, error }));
  const order = vi.fn(() => ({ limit }));
  const statusEq = vi.fn(() => ({ order }));
  const neighborhoodEq = vi.fn(() => ({ eq: statusEq }));
  const select = vi.fn(() => ({ eq: neighborhoodEq }));
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
    } as unknown as Parameters<typeof getNeighborhoodFeedListings>[0],
    from,
    select,
    neighborhoodEq,
    statusEq,
    order,
    limit,
    storageFrom,
    createSignedUrl,
  };
}

describe("getNeighborhoodFeedListings", () => {
  it("loads active listings scoped to the user neighborhood", async () => {
    const {
      client,
      from,
      select,
      neighborhoodEq,
      statusEq,
      order,
      limit,
      storageFrom,
      createSignedUrl,
    } = createSupabaseClient();

    await expect(
      getNeighborhoodFeedListings(client, "neighborhood-1"),
    ).resolves.toEqual({
      ok: true,
      listings: [
        {
          id: "listing-1",
          title: "Cordless Drill",
          listingType: "item",
          status: "active",
          category: "tools",
          condition: "good",
          askingCredits: 25,
          listedAt: "2026-05-13T00:00:00.000Z",
          thumbnailUrl: "https://example.test/signed-drill.jpg",
          sellerDisplayName: "Ian",
          neighborhoodName: "Old Town",
        },
      ],
    });

    expect(from).toHaveBeenCalledWith("listings");
    expect(select).toHaveBeenCalledWith(
      "id,title,listing_type,status,category,condition,asking_credits,photos,published_at,created_at,users!listings_seller_id_fkey(display_name),neighborhoods!listings_neighborhood_id_fkey(name)",
    );
    expect(neighborhoodEq).toHaveBeenCalledWith(
      "neighborhood_id",
      "neighborhood-1",
    );
    expect(statusEq).toHaveBeenCalledWith("status", "active");
    expect(order).toHaveBeenCalledWith("published_at", {
      ascending: false,
      nullsFirst: false,
    });
    expect(limit).toHaveBeenCalledWith(50);
    expect(storageFrom).toHaveBeenCalledWith(LISTING_PHOTO_BUCKET);
    expect(createSignedUrl).toHaveBeenCalledWith(
      "seller-1/listing-photos/drill.jpg",
      600,
    );
  });

  it("returns a load error without signing thumbnails", async () => {
    const { client, createSignedUrl } = createSupabaseClient({
      listings: null,
      error: { message: "permission denied" },
    });

    await expect(
      getNeighborhoodFeedListings(client, "neighborhood-1"),
    ).resolves.toEqual({
      ok: false,
      message: "permission denied",
    });
    expect(createSignedUrl).not.toHaveBeenCalled();
  });
});
